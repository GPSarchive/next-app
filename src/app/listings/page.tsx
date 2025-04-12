import NavBar from '@/app/components/NavBar';
import ListingsContent from '@/app/components/ListingsContent';
import SessionAuthGuard from '@/app/components/SessionAuthGuard';
import styles from '@/app/components/HousesMapPage.module.css';

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