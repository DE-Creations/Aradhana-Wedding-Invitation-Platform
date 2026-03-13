import { ReactNode } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AppTopbar } from "@/components/AppTopbar";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const AdminLayout = ({ children, currentPage, onNavigate, onLogout }: AdminLayoutProps) => {
  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      <AdminSidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AppTopbar title="Admin Panel" subtitle="System Management" />
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
};
