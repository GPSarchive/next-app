// src/app/verify-email/verify-email.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification, getAuth } from "firebase/auth";
import { auth } from "@/app/firebase/firebaseClient"; // Ensure your Firebase client is properly configured

export default function VerifyEmail() {
  const router = useRouter();
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  // Optional: Automatically check email verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      // Reload the user data to get the latest emailVerified status
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          router.push("/home"); // Redirect once verified
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [router]);

  const handleResendEmail = async () => {
    setError(null);
    setInfoMessage("");

    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setInfoMessage("A new verification email has been sent. Please check your inbox.");
        // Set a cooldown period to prevent immediate subsequent clicks (e.g., 60 seconds)
        setCooldown(60);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err) {
        console.error("Resend error:", err);
        setError("Failed to resend the email. Please try again later.");
      }
    } else {
      setError("No user is currently signed in.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        <p className="mb-4">
          Thank you for signing up. We have sent a verification email to{" "}
          <strong>{auth.currentUser?.email}</strong>. Please check your inbox (and your spam folder).
        </p>
        {infoMessage && <p className="text-green-600 mb-2">{infoMessage}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          onClick={handleResendEmail}
          disabled={cooldown > 0}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {cooldown > 0 ? `Resend Email (${cooldown}s)` : "Resend Email"}
        </button>
        <p className="mt-4 text-center text-sm">
          Once you verify your email, this page will redirect you automatically.
        </p>
      </div>
    </div>
  );
}
