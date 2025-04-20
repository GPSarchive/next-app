'use client';

import { useState, FormEvent } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/firebase/firebaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMessage('✅ Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error('Reset error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('❌ No account found with that email.');
          break;
        case 'auth/invalid-email':
          setError('❌ That email address is invalid.');
          break;
        case 'auth/too-many-requests':
          setError('❌ Too many attempts. Try again later.');
          break;
        default:
          setError('❌ Could not send email. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-2">{error}</p>
        )}
        {infoMessage && (
          <p className="text-green-500 text-center mb-2">
            {infoMessage}
          </p>
        )}

        <label className="block mb-2 font-medium">
          Enter your email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>

        <p className="mt-4 text-center text-sm">
          Remember your password?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
