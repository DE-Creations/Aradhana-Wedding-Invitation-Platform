import { usePage } from '@inertiajs/react';
import UserShell from '@/inertia/layouts/UserShell';
import { TableManagementPage } from '@/pages/user/TableManagementPage';
import { Grid3X3 } from 'lucide-react';

export default function Tables() {
  const { tables, guests, auth } = usePage<{ tables: any[]; guests: any[]; auth: { user: { table_management: boolean } | null } }>().props;
  const tableManagement = auth?.user?.table_management ?? true;

  if (!tableManagement) {
    return (
      <UserShell currentPage="tables">
        <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
          <Grid3X3 className="h-10 w-10 text-muted-foreground opacity-40" />
          <h2 className="font-display text-xl font-semibold text-foreground">Table Management Unavailable</h2>
          <p className="text-sm text-muted-foreground">This feature is not enabled for your plan.</p>
        </div>
      </UserShell>
    );
  }

  return <UserShell currentPage="tables"><TableManagementPage tables={tables} guests={guests} /></UserShell>;
}
