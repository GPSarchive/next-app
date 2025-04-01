'use client';

import styles from "@/app/components/NavBar.module.css";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const NavBar = () => {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    try {
      const res = await fetch('/api/session', { method: 'DELETE' });
      if (res.ok) {
        router.push("/login");
      } else {
        console.error('Logout failed', await res.text());
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
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
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
