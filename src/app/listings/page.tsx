// app/listings/page.tsx

import NavBar from '@/app/lib/NavBar';
import ListingsClientWrapper from '@/app/components/ListingsPageComponents/ListingsClientWrapper';
import SessionAuthGuard from '@/app/lib/SessionAuthGuard';
import styles from '@/app/components/ListingsPageComponents/HousesMapPage.module.css';

export const runtime = 'nodejs';

export default function SecureListingsPage() {
  return (
    <SessionAuthGuard>
    <div className={styles.container}>
     
      <NavBar />
      <ListingsClientWrapper />
    </div>
    </SessionAuthGuard>
  );
}
