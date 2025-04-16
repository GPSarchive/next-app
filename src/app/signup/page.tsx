'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/app/firebase/firebaseClient";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [polling, setPolling] = useState<boolean>(false);

  // 🔁 Poll for email verification after sign-up
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          await auth.signOut(); // end session to avoid stale state
          router.push("/login?verified=true");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [polling, router]);

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfoMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setInfoMessage("A verification email has been sent. Please check your inbox.");
      setPolling(true); // ✅ start watching for email verification

      const response = await fetch("/api/session/set-default-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      if (!response.ok) {
        throw new Error("Failed to set default role");
      }

    } catch (err) {
      console.error("Signup error:", err);
      setError("❌ Sign up failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfoMessage("");

    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const response = await fetch("/api/set-default-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      if (!response.ok) {
        throw new Error("Failed to set default role for Google sign in");
      }

      router.push("/login");
    } catch (err) {
      console.error("Google sign in error:", err);
      setError("❌ Google sign in failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {infoMessage && <p className="text-green-500 text-center mb-2">{infoMessage}</p>}

        <form onSubmit={handleEmailSignUp}>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4"
          >
            Sign Up with Email
          </button>
        </form>

        <hr className="my-4" />

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up with Google
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
