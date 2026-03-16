import { usePage } from '@inertiajs/react';
import UserShell from '@/inertia/layouts/UserShell';
import { MemoriesPage } from '@/pages/user/MemoriesPage';
import { Image } from 'lucide-react';

export default function Memories() {
  const { memories, auth } = usePage<{ memories: any[]; auth: { user: { share_memory: boolean } | null } }>().props;
  const shareMemory = auth?.user?.share_memory ?? true;

  if (!shareMemory) {
    return (
      <UserShell currentPage="memories">
        <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
          <Image className="h-10 w-10 text-muted-foreground opacity-40" />
          <h2 className="font-display text-xl font-semibold text-foreground">Memories Unavailable</h2>
          <p className="text-sm text-muted-foreground">This feature is not enabled for your plan.</p>
        </div>
      </UserShell>
    );
  }

  return <UserShell currentPage="memories"><MemoriesPage memories={memories} /></UserShell>;
}
