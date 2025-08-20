'use client';

import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8E0EB9]/10">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
              Check your email for password reset instructions.
            </div>
            <Link
              href="/admin/auth/login"
              className="text-[#8E0EB9] hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8E0EB9] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-[#8E0EB9] text-white rounded-full hover:bg-[#8E0EB9]/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>

              <div className="text-center">
                <Link
                  href="/admin/auth/login"
                  className="text-[#8E0EB9] text-sm hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
