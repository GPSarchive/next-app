import NavBar from '@/app/components/NavBar';
import FiltersWrapper from '@/app/components/FiltersWrapper';
import ClientMapWrapper from '@/app/components/ClientMapWrapper';
import SessionAuthGuard from '@/app/components/SessionAuthGuard';
import AppCheckWrapper from '@/app/components/AppCheckWrapper';
import SecureHouseFetcher from '@/app/components/SecureHouseFetcher';
import styles from '@/app/components/HousesMapPage.module.css';

export const runtime = 'nodejs';

export default async function ListingsPage() {
  return (
    <SessionAuthGuard>
      <div className={styles.container}>
        <NavBar />
        <div className={styles.content}>
          <div className={styles.leftPanel}>
            <FiltersWrapper resultsCount={0} />
            {/* 💡 SecureHouseFetcher runs only when AppCheck is ready */}
            <AppCheckWrapper>
              {(token) => <SecureHouseFetcher appCheckToken={token} />}
            </AppCheckWrapper>
          </div>
          <div className={styles.rightPanel}>
            <ClientMapWrapper houses={[]} />
          </div>
        </div>
      </div>
    </SessionAuthGuard>
  );
}
