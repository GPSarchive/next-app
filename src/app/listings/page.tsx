import NavBar from '@/app/lib/NavBar';
import ListingsContent from '@/app/components/ListingsPageComponents/ListingsContent';
import SessionAuthGuard from '@/app/lib/SessionAuthGuard';
import styles from '@/app/components/ListingsPageComponents/HousesMapPage.module.css';

export const runtime = 'nodejs';

export default async function SecureListingsPage() {
  return (
    <SessionAuthGuard>
      <div className={styles.container}>
        <NavBar />
        <ListingsContent />
      </div>
    </SessionAuthGuard>
  );
}