"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/utils/firebase";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const auth = getAuth(app);
      // Sign in with Firebase auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is active in Firestore
      const db = getFirestore(app);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.data();

      if (!userData?.isActive) {
        // Sign out if account is deactivated
        await signOut(auth);
        setError("Your account has been deactivated. Please contact the administrator.");
        return;
      }

      router.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
          {error && (
            <div className="text-red-600 text-center text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-full bg-[#8E0EB9] text-white font-semibold text-base shadow-sm transition-colors duration-200 ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#8E0EB9]/90"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center mt-4">
            <Link 
              href="/admin/auth/forgot-password"
              className="text-[#8E0EB9] hover:underline text-sm"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
