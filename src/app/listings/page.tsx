// app/listings/page.tsx

import NavBar from '@/app/lib/NavBar';
import ListingsClientWrapper from '@/app/components/ListingsPageComponents/ListingsClientWrapper';
import styles from '@/app/components/ListingsPageComponents/HousesMapPage.module.css';

export const runtime = 'nodejs';

export default function SecureListingsPage() {
  return (
    <>
    <div className={styles.container}>
     
      <NavBar />
      <ListingsClientWrapper />
    </div>
    </>
  );
}
