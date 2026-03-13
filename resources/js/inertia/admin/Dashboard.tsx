import { router, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import AdminShell from '@/inertia/layouts/AdminShell';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';

type DashboardPageProps = PageProps<{
  stats: {
    total_users: number;
    active_users: number;
    expired_users: number;
    total_weddings: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'expired';
    expire_date: string;
    created_at: string;
  }>;
}>;

export default function Dashboard() {
  const { stats, recentUsers } = usePage<DashboardPageProps>().props;

  return (
    <AdminShell currentPage="admin-dashboard">
      <AdminDashboardPage
        stats={stats}
        recentUsers={recentUsers}
        onNavigate={(page) => router.visit(page === 'admin-users' ? '/admin/users' : '/admin/dashboard')}
      />
    </AdminShell>
  );
}
