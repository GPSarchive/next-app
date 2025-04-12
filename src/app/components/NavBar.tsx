'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/firebase/firebaseClient';
import { onAuthStateChanged, User } from 'firebase/auth';
import styles from '@/app/components/NavBar.module.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const NavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await auth.signOut(); // Sign out from Firebase
      const res = await fetch('/api/session', { method: 'DELETE' }); // Clear session cookie
      if (res.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed', await res.text());
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Derive username from displayName or email
  const getUsername = (user: User): string => {
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <nav className={`${styles.navbar} ${poppins.className}`}>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/listings">Listings</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <div className={styles.userSection}>
              <span className={styles.userIcon}>🧑</span>
              <span className={styles.username}>{getUsername(user)}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;