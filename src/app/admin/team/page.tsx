'use client';

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layouts/DashboardLayout";
import Modal from "@/components/ui/Modal";
import { collection, getDocs, query, where, updateDoc, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { app } from "@/utils/firebase";

const db = getFirestore(app);
const auth = getAuth(app);

const Team = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "admin",
  });

  // Generate random password
  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "users"), where("role", "==", "admin"));
      const querySnapshot = await getDocs(q);
      const adminsList: any[] = [];
      querySnapshot.forEach((doc) => {
        adminsList.push({ id: doc.id, ...doc.data() });
      });
      setAdmins(adminsList);
    } catch (error) {
      console.error("Error fetching admins:", error);
      // alert("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Add new admin
  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // Generate random password
      const generatedPassword = generateRandomPassword();

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        generatedPassword
      );

      const user = userCredential.user;

      // Add admin data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        role: "admin",
        id: user.uid,
        createdAt: new Date(),
        isActive: true,
      });

      // Send email with credentials
      try {
        const emailResponse = await fetch('/api/sendAdminCredentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            password: generatedPassword
          }),
        });

        if (!emailResponse.ok) {
          throw new Error('Failed to send credentials email');
        }

        alert('Admin added successfully! Credentials have been sent to their email.');
      } catch (emailError) {
        console.error('Error sending credentials email:', emailError);
        alert('Admin added successfully, but failed to send credentials email. Please contact the admin.');
      }

      setFormData({ username: "", email: "", role: "admin" });
      setShowAddForm(false);
      fetchAdmins();
    } catch (error: any) {
      console.error("Error adding admin:", error);
      alert(error.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  // Toggle admin status
  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    const action = currentStatus ? "deactivate" : "activate";
    
    if (window.confirm("Are you sure you want to " + action + " this admin?")) {
      try {
        setLoading(true);
        const adminRef = doc(db, "users", adminId);
        await updateDoc(adminRef, {
          isActive: !currentStatus
        });
        alert("Admin " + action + "d successfully!");
        fetchAdmins();
      } catch (error) {
        console.error(`Error ${action}ing admin:`, error);
        alert(`Failed to ${action} admin`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="my-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-4xl font-bold">Team Management</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-[#7B5CFF] text-white rounded-full hover:bg-[#7B5CFF]/90 transition-colors"
          >
            Add New Admin
          </button>
        </div>

        {/* Add Admin Modal */}
        <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add New Admin</h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ username: "", email: "", role: "admin" });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={addAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p>
                  A secure random password will be generated automatically when you
                  create the admin account.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#7B5CFF] text-white px-6 py-3 rounded-md hover:bg-[#7B5CFF]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Admin"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ username: "", email: "", role: "admin" });
                  }}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              All Admins ({admins.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : admins.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No admins found. Add your first admin using the button above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-[#7B5CFF] flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {admin.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {admin.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#7B5CFF]/20 text-[#7B5CFF]">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            admin.isActive === false
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {admin.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {admin.isActive === false ? (
                          <button
                            onClick={() =>
                              toggleAdminStatus(admin.id, admin.isActive)
                            }
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              toggleAdminStatus(admin.id, admin.isActive)
                            }
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Team;
