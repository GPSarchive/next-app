'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/hooks/useFirebaseLogin';
import { signInWithGoogle } from '@/app/hooks/useGoogleAuth';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      console.log('🟦 Attempting login with:', email);
      await login(email, password);
      console.log('✅ Session stored, redirecting...');
      router.push('/listings');
    } catch (err: any) {
      console.error('❌ Login error:', err);

      let friendlyMessage = 'Unknown error occurred';

      if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No user found with that email.';
      } else if (err.code === 'auth/wrong-password') {
        friendlyMessage = 'Incorrect password.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Invalid email format.';
      } else if (err.message === 'email-not-verified') {
        router.push('/verify-email');
        return;
      } else if (err.message?.includes('Token issue')) {
        friendlyMessage = 'Token issue: server couldn’t verify.';
      }

      setError(`❌ ${friendlyMessage}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push('/listings');
    } catch (err) {
      console.error('Google login error:', err);
      setError('❌ Google sign-in failed or your email is not verified.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-4"
          >
            Login
          </button>
        </form>

          <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded flex items-center justify-center gap-2 hover:shadow-md transition">
          <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="w-5 h-5"/>
          </button>

        <p className="text-center mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
