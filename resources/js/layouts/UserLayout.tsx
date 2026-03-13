import { ReactNode } from "react";
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
  const { auth } = usePage<{ auth: { wedding: { bride_name: string; groom_name: string; event_token: string } | null } }>().props;
  const title = auth?.wedding ? `${auth.wedding.bride_name} & ${auth.wedding.groom_name}` : "My Wedding";

  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      <UserSidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} eventToken={auth?.wedding?.event_token} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AppTopbar
          title={title}
          subtitle="Wedding Dashboard"
        />
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
};
