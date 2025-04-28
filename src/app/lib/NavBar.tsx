'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/firebase/firebaseClient';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const NavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await auth.signOut();
      const res = await fetch('/api/session', { method: 'DELETE' });
      if (res.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed', await res.text());
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getUsername = (user: User): string => {
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <nav
      className={`${poppins.className} fixed inset-x-0 top-0 h-[65px] bg-white bg-gradient-to-b from-white/95 to-white/90 shadow-md flex items-center justify-center px-8 text-gray-800 text-lg font-medium z-[9999]`}
    >
      {/* Email link on the top-left */}
      <div className="absolute top-2 left-4">
        <a
          href="mailto:support@property-hall.com"
          className="text-xs underline text-inherit"
        >
          support@property-hall.com
        </a>
      </div>

      {/* Centered Navigation */}
      <ul className="list-none flex items-center gap-6 text-base tracking-wide">
        <li>
          <Link href="/" className="relative pb-1 text-gray-800 font-medium hover:text-blue-500 hover:drop-shadow-md transition-all">
            Home
          </Link>
        </li>
        <li>
          <Link href="/listings" className="relative pb-1 text-gray-800 font-medium hover:text-blue-500 hover:drop-shadow-md transition-all">
            Listings
          </Link>
        </li>
        <li>
          <Link href="/contact" className="relative pb-1 text-gray-800 font-medium hover:text-blue-500 hover:drop-shadow-md transition-all">
            Contact
          </Link>
        </li>
        <li>
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">🧑</span>
              <span className="relative pb-1 text-gray-800 font-medium hover:text-blue-500 hover:drop-shadow-md transition-all">
                {getUsername(user)}
              </span>
              <button
                onClick={handleLogout}
                className="relative pb-1 text-gray-800 font-medium hover:text-blue-500 hover:drop-shadow-md transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="relative pb-1 text-gray-800 font-medium hover:text-blue-500 hover:drop-shadow-md transition-all">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
