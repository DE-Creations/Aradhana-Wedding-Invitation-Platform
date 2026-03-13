import { ReactNode } from 'react';
import { router } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AdminLayout } from '@/layouts/AdminLayout';

const routeMap: Record<string, string> = {
  'admin-dashboard': '/admin/dashboard',
  'admin-users': '/admin/users',
};

export default function AdminShell({ currentPage, children }: { currentPage: string; children: ReactNode }) {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminLayout currentPage={currentPage} onNavigate={(page) => router.visit(routeMap[page] ?? '/admin/dashboard')} onLogout={() => router.visit('/admin/login')}>
        {children}
      </AdminLayout>
    </TooltipProvider>
  );
}
