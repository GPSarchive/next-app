import NavBar from '@/app/components/NavBar';
import FiltersWrapper from '@/app/components/FiltersWrapper';
import ClientMapWrapper from '@/app/components/ClientMapWrapper';
import SessionAuthGuard from '@/app/components/SessionAuthGuard';
import SecureHouseFetcher from '@/app/components/SecureHouseFetcher';
import styles from '@/app/components/HousesMapPage.module.css';

export const runtime = 'nodejs';

export default async function SecureListingsPage() {
  return (
    <SessionAuthGuard>
      <div className={styles.container}>
        <NavBar />
        <div className={styles.content}>
          <div className={styles.leftPanel}>
            <FiltersWrapper resultsCount={0} />
            {/* Houses are fetched securely */}
            <SecureHouseFetcher />
          </div>
          <div className={styles.rightPanel}>
            <ClientMapWrapper houses={[]} />
          </div>
        </div>
      </div>
    </SessionAuthGuard>
  );
}
