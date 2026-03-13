import { usePage } from '@inertiajs/react';
import UserShell from '@/inertia/layouts/UserShell';
import { TableManagementPage } from '@/pages/user/TableManagementPage';

export default function Tables() {
  const { tables, guests } = usePage<{ tables: any[]; guests: any[] }>().props;
  return <UserShell currentPage="tables"><TableManagementPage tables={tables} guests={guests} /></UserShell>;
}
