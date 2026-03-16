import { LayoutDashboard, Users, Settings, Grid3X3, Image, Palette, QrCode, LogOut, ExternalLink, Lock } from "lucide-react";

interface UserSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  eventToken?: string;
  tableManagement?: boolean;
  shareMemory?: boolean;
}

const allNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "setup", label: "Setup", icon: Settings },
  { id: "design", label: "Invitation Design", icon: Palette },
  { id: "guests", label: "Guests", icon: Users },
  { id: "tables", label: "Table Management", icon: Grid3X3, requiresTable: true },
  { id: "memories", label: "Memories", icon: Image, requiresMemory: true },
];

export const UserSidebar = ({ currentPage, onNavigate, onLogout, eventToken, tableManagement = true, shareMemory = true }: UserSidebarProps) => {
  const navItems = allNavItems.map((item) => ({
    ...item,
    disabled: (!!item.requiresTable && !tableManagement) || (!!item.requiresMemory && !shareMemory),
  }));
  const qrDisabled = !tableManagement && !shareMemory;
  return (
    <>
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        {/* Brand */}
        <div className="p-6 border-b border-sidebar-border shrink-0">
          <div className="flex flex-col items-start gap-1.5">
            <img src="/images/logo-text.png" alt="Aradhana" className="h-20 w-full object-contain object-left" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans">User Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            if (item.disabled) {
              return (
                <div
                  key={item.id}
                  title="This feature is not available in your plan"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/30 cursor-not-allowed select-none"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  <Lock className="h-3 w-3 ml-auto" />
                </div>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}

          {/* QR Guest Search - opens in new tab */}
          {qrDisabled ? (
            <div
              title="This feature is not available in your plan"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/30 cursor-not-allowed select-none"
            >
              <QrCode className="h-4 w-4" />
              QR Guest Search
              <Lock className="h-3 w-3 ml-auto" />
            </div>
          ) : (
            <button
              onClick={() => window.open(eventToken ? `/guest-search?token=${eventToken}` : '/guest-search', "_blank")}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all"
            >
              <QrCode className="h-4 w-4" />
              QR Guest Search
              <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
            </button>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-sidebar/95 backdrop-blur md:hidden">
        <nav className="flex items-stretch overflow-x-auto px-2 py-1.5">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            if (item.disabled) {
              return (
                <div
                  key={item.id}
                  title="This feature is not available in your plan"
                  className="mx-1 min-w-[76px] rounded-lg px-2 py-2 text-center text-sidebar-foreground/30 cursor-not-allowed select-none"
                >
                  <item.icon className="mx-auto h-4 w-4" />
                  <span className="mt-1 block text-[10px] leading-tight">{item.label}</span>
                </div>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`mx-1 min-w-[76px] rounded-lg px-2 py-2 text-center transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="mx-auto h-4 w-4" />
                <span className="mt-1 block text-[10px] leading-tight">{item.label}</span>
              </button>
            );
          })}
          {qrDisabled ? (
            <div
              title="This feature is not available in your plan"
              className="mx-1 min-w-[76px] rounded-lg px-2 py-2 text-center text-sidebar-foreground/30 cursor-not-allowed select-none"
            >
              <QrCode className="mx-auto h-4 w-4" />
              <span className="mt-1 block text-[10px] leading-tight">QR Search</span>
            </div>
          ) : (
            <button
              onClick={() => window.open(eventToken ? `/guest-search?token=${eventToken}` : '/guest-search', "_blank")}
              className="mx-1 min-w-[76px] rounded-lg px-2 py-2 text-center text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <QrCode className="mx-auto h-4 w-4" />
              <span className="mt-1 block text-[10px] leading-tight">QR Search</span>
            </button>
          )}
          <button
            onClick={onLogout}
            className="mx-1 min-w-[76px] rounded-lg px-2 py-2 text-center text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="mx-auto h-4 w-4" />
            <span className="mt-1 block text-[10px] leading-tight">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};
