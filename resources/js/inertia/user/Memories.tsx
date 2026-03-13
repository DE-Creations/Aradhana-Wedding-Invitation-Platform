import { usePage } from '@inertiajs/react';
import UserShell from '@/inertia/layouts/UserShell';
import { MemoriesPage } from '@/pages/user/MemoriesPage';

export default function Memories() {
  const { memories } = usePage<{ memories: any[] }>().props;
  return <UserShell currentPage="memories"><MemoriesPage memories={memories} /></UserShell>;
}
