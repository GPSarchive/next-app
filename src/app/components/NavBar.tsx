"use client";

import styles from "@/app/components/NavBar.module.css";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";

// ✅ Load Poppins Font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

// =======================
// Component
// =======================

const NavBar = () => {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <nav className={`${styles.navbar} ${poppins.className}`}>
      <ul className={styles.navLinks}>
        <li><a href="#">Home</a></li>
        <li><a href="#">Listings</a></li>
        <li><a href="#">Contact</a></li>
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
