import AdminAuthGuard from '@/app/lib/AdminAuthGuard';
import AdminDashboard from '@/app/components/AdminPageComponents/AdminDashboard';

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  );
}