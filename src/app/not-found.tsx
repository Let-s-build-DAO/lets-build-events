'use client'

import Link from "next/link";
import "./globals.css";
import MainLayout from "@/components/Layouts/MainLayout";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <button className="px-6 py-3 text-white rounded-full bg-[#8E0EB9] transition">
            Go Back Home
          </button>
        </Link>
      </div>
    </MainLayout>
  );
}
