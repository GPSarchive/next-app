// page.tsx
import NavBar from "@/app/components/NavBar";
import HouseGridWrapper from "@/app/components/HouseGridWrapper";
import FiltersWrapper from "@/app/components/FiltersWrapper";
import ClientMapWrapper from "@/app/components/ClientMapWrapper";
import styles from "@/app/components/HousesMapPage.module.css";
import { getAllHouses } from "@/app/lib/firestore/houses";
import SessionAuthGuard from "@/app/components/SessionAuthGuard"; // Import your auth guard

export const runtime = 'nodejs';

export default async function SecureListingsPage() {
  // Fetch houses AFTER authentication has been handled by the guard.
  const houses = await getAllHouses();

  return (
    // Wrap your sensitive UI within the SessionAuthGuard
    <SessionAuthGuard>
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
            <ClientMapWrapper houses={houses} />
          </div>
        </div>
      </div>
    </SessionAuthGuard>
  );
}
