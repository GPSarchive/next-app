// src/app/listings/page.tsx
import NavBar from "@/app/components/NavBar";
import FiltersWrapper from "@/app/components/FiltersWrapper";
import ClientMapWrapper from "@/app/components/ClientMapWrapper";
import SessionAuthGuard from "@/app/components/SessionAuthGuard"; // server-side guard
import SecureHouseFetcher from "@/app/components/SecureHouseFetcher"; // client-side house fetcher
import styles from "@/app/components/HousesMapPage.module.css";

export const runtime = 'nodejs';

export default async function SecureListingsPage() {
  // SessionAuthGuard runs on the server and ensures a valid session.
  return (
    <SessionAuthGuard>
      <div className={styles.container}>
        <NavBar />
        <div className={styles.content}>
          <div className={styles.leftPanel}>
            {/* Filters, etc. */}
            <FiltersWrapper resultsCount={0} /> {/* Adjust count if needed */}
            {/* SecureHouseFetcher retrieves houses from your protected Cloud Function */}
            <SecureHouseFetcher />
          </div>
          <div className={styles.rightPanel}>
            <ClientMapWrapper houses={[]} /> {/* Optionally use map data */}
          </div>
        </div>
      </div>
    </SessionAuthGuard>
  );
}
