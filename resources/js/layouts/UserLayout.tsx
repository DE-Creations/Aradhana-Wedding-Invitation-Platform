import { ReactNode, useState } from "react";
import { usePage } from "@inertiajs/react";
import { UserSidebar } from "@/components/UserSidebar";
import { AppTopbar } from "@/components/AppTopbar";

interface UserLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const UserLayout = ({ children, currentPage, onNavigate, onLogout }: UserLayoutProps) => {
  const { auth } = usePage<{ auth: { user: { table_management: boolean; share_memory: boolean } | null; wedding: { bride_name: string; groom_name: string; event_token: string } | null } }>().props;
  const title = auth?.wedding ? `${auth.wedding.bride_name} & ${auth.wedding.groom_name}` : "My Wedding";
  const tableManagement = auth?.user?.table_management ?? true;
  const shareMemory = auth?.user?.share_memory ?? true;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      <UserSidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        eventToken={auth?.wedding?.event_token}
        tableManagement={tableManagement}
        shareMemory={shareMemory}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AppTopbar
          title={title}
          subtitle="Wedding Dashboard"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
