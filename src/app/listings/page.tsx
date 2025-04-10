// src/app/listings/page.tsx
import NavBar from '@/app/components/NavBar';
import FiltersWrapper from '@/app/components/FiltersWrapper';
import ClientMapWrapper from '@/app/components/ClientMapWrapper';
import SessionAuthGuard from '@/app/components/SessionAuthGuard';
import SecureHouseFetcher from '@/app/components/SecureHouseFetcher';
import styles from '@/app/components/HousesMapPage.module.css';
import { getHousesFromServer } from '@/app/lib/getHousesServer';

export const runtime = 'nodejs';

export default async function SecureListingsPage() {
  const houses = await getHousesFromServer(); // 🔥 data fetched server-side

  return (
    <SessionAuthGuard>
      <div className={styles.container}>
        <NavBar />
        <div className={styles.content}>
          <div className={styles.leftPanel}>
            <FiltersWrapper resultsCount={houses.length} />
            <SecureHouseFetcher houses={houses} />
          </div>
          <div className={styles.rightPanel}>
            <ClientMapWrapper houses={houses} />
          </div>
        </div>
      </div>
    </SessionAuthGuard>
  );
}
