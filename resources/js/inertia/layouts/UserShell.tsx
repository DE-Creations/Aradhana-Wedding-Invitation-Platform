import { ReactNode } from 'react';
import { router } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { UserLayout } from '@/layouts/UserLayout';

const routeMap: Record<string, string> = {
  dashboard: '/dashboard',
  guests: '/guests',
  setup: '/settings',
  tables: '/tables',
  memories: '/memories',
  design: '/design',
};

export default function UserShell({ currentPage, children }: { currentPage: string; children: ReactNode }) {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserLayout currentPage={currentPage} onNavigate={(page) => router.visit(routeMap[page] ?? '/dashboard')} onLogout={() => router.post('/logout')}>
        {children}
      </UserLayout>
    </TooltipProvider>
  );
}
