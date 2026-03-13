import { LayoutDashboard, Users, Settings, Grid3X3, Image, Palette, QrCode, LogOut, Heart, ExternalLink } from "lucide-react";

interface UserSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  eventToken?: string;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "guests", label: "Guests", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "tables", label: "Table Management", icon: Grid3X3 },
  { id: "memories", label: "Memories", icon: Image },
  { id: "design", label: "Invitation Design", icon: Palette },
];

export const UserSidebar = ({ currentPage, onNavigate, onLogout, eventToken }: UserSidebarProps) => {
  return (
    <>
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        {/* Brand */}
        <div className="p-6 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-sidebar-foreground tracking-wide">Aradhana</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans">User Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
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
          <button
            onClick={() => window.open(eventToken ? `/guest-search?token=${eventToken}` : '/guest-search', "_blank")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all"
          >
            <QrCode className="h-4 w-4" />
            QR Guest Search
            <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
          </button>
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
          <button
            onClick={() => window.open(eventToken ? `/guest-search?token=${eventToken}` : '/guest-search', "_blank")}
            className="mx-1 min-w-[76px] rounded-lg px-2 py-2 text-center text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <QrCode className="mx-auto h-4 w-4" />
            <span className="mt-1 block text-[10px] leading-tight">QR Search</span>
          </button>
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
