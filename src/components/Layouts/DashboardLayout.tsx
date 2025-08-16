"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut, Auth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/utils/firebase";
import { LogOut, LayoutDashboard, Users, Menu, X } from "lucide-react";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useState<Auth | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const firebaseAuth = getAuth(app);
    setAuth(firebaseAuth);

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      // Check if user is still active
      const db = getFirestore(app);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (!userData?.isActive) {
        // Sign out if account is deactivated
        await signOut(firebaseAuth);
        router.replace("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.replace("/admin/auth/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      label: "Team",
      icon: Users,
      href: "/admin/team",
    },
  ];

  return (
    <div className="flex h-screen bg-[#7B5CFF]/10">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm lg:hidden z-30">
        <div className="flex items-center justify-between px-4 h-full">
          <img src="/images/labsnew-logo1.png" alt="" className="h-8 w-auto" />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform bg-white shadow-md transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4">
            <img
              src="/images/labsnew-logo1.png"
              alt=""
              className="w-auto h-8"
            />
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 my-2 text-sm font-medium rounded-full transition-colors ${
                    isActive
                      ? "bg-[#7B5CFF]/20 text-[#7B5CFF]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium text-white rounded-full bg-[#7B5CFF]"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto w-full mt-16 lg:mt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
