

export const runtime = "nodejs";

import { cookies } from "next/headers";
import { getFirebaseAdmin } from "@/app/lib/firebaseAdmin";
import { redirect } from "next/navigation";
import HouseGridWrapper from "@/app/components/HouseGridWrapper";
import MapWrapper from "@/app/components/MapWrapper";
import NavBar from "@/app/components/NavBar";
import FiltersWrapper from "@/app/components/FiltersWrapper";
import styles from "@/app/components/HousesMapPage.module.css";

// Optional type for Firestore docs (can extract to /types later)
type House = {
  id: string;
  title: string;
  price: string;
  images: { src: string }[];
  location?: {
    latitude: number;
    longitude: number;
  };
  [key: string]: any;
};

export default async function SecureListingsPage() {
  console.log("[SecureListingsPage] 🔐 Starting secure rendering");

  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("__session")?.value;

  if (!sessionCookie) {
    console.warn("[SecureListingsPage] ❌ No session cookie found — redirecting to /login");
    redirect("/login");
  }

  try {
    const firebaseAdmin = getFirebaseAdmin();
    if (!firebaseAdmin) {
      console.error("[SecureListingsPage] 🔥 Firebase Admin is not initialized");
      redirect("/login");
    }
    const { auth: adminAuth, db: adminDB } = firebaseAdmin!;

    const user = await adminAuth.verifySessionCookie(sessionCookie, true);
    console.log("[SecureListingsPage] ✅ Session verified — UID:", user.uid);

    const snapshot = await adminDB.collection("houses").get();
    console.log(`[SecureListingsPage] 📦 Retrieved ${snapshot.size} houses from Firestore`);

    const houses: House[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Untitled",
        price: data.price || "0",
        images: data.images || [],
        location: data.location,
        ...data,
      };
    });

    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.content}>
          <div className={styles.leftPanel}>
            <div className={styles.filtersWrapper}>
              <FiltersWrapper resultsCount={houses.length} />
            </div>
            <HouseGridWrapper houses={houses} />
          </div>
          <div className={styles.rightPanel}>
            <MapWrapper houses={houses} />
          </div>
        </div>
      </div>
    );

  } catch (err) {
    console.error("[SecureListingsPage] 🔥 Error verifying session or fetching data:", err);
    redirect("/login");
  }
}
