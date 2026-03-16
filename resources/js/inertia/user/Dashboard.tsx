import { router, usePage } from '@inertiajs/react';
import UserShell from '@/inertia/layouts/UserShell';
import { UserDashboardPage } from '@/pages/user/UserDashboardPage';

const routeMap: Record<string, string> = {
  dashboard: '/dashboard',
  guests: '/guests',
  settings: '/settings',
  tables: '/tables',
  memories: '/memories',
  design: '/design',
  invitation: '/invitation',
  'qr-search': '/guest-search',
};

export default function Dashboard() {
  const { wedding, stats, pendingGuests, recentActivity, latestMemories, auth } = usePage<{
    wedding: { bride_name: string; groom_name: string; venue_name: string; event_date: string; event_token: string } | null;
    stats: { totalGuests: number; rsvpClicks: number; confirmed: number; pending: number; declined: number; headCount: number; totalSeats: number; assignedSeats: number } | null;
    pendingGuests: Array<{ id: string; guest_name: string; phone: string; rsvp_status: string }>;
    recentActivity: Array<{ id: string; text: string; time: string; type: string }>;
    latestMemories: Array<{ id: string; image_path: string; file_name: string }>;
    auth: { user: { table_management: boolean; share_memory: boolean } | null };
  }>().props;

  const tableManagement = auth?.user?.table_management ?? true;
  const shareMemory = auth?.user?.share_memory ?? true;

  return (
    <UserShell currentPage="dashboard">
      <UserDashboardPage
        onNavigate={(page) => router.visit(routeMap[page] ?? '/dashboard')}
        wedding={wedding}
        stats={stats}
        pendingGuests={pendingGuests}
        recentActivity={recentActivity}
        latestMemories={latestMemories}
        eventToken={wedding?.event_token}
        tableManagement={tableManagement}
        shareMemory={shareMemory}
      />
    </UserShell>
  );
}
