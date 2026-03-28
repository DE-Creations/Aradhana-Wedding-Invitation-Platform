import { LayoutDashboard, Users, Settings, Grid3X3, Image, Palette, MapPin, Camera, LogOut, ExternalLink, Lock, X } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";

interface UserSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  eventToken?: string;
  tableManagement?: boolean;
  shareMemory?: boolean;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

const allNavItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "setup", label: "Setup", icon: Settings },
  { id: "design", label: "Invitation Design", icon: Palette },
  { id: "guests", label: "Guests", icon: Users },
  { id: "tables", label: "Table Management", icon: Grid3X3, requiresTable: true },
  { id: "memories", label: "Memories", icon: Image, requiresMemory: true },
];

const NavContent = ({
  currentPage,
  onNavigate,
  onLogout,
  eventToken,
  tableManagement,
  shareMemory,
  onItemClick,
}: {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  eventToken?: string;
  tableManagement: boolean;
  shareMemory: boolean;
  onItemClick?: () => void;
}) => {
  const navItems = allNavItems.map((item) => ({
    ...item,
    disabled: (!!item.requiresTable && !tableManagement) || (!!item.requiresMemory && !shareMemory),
  }));

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onItemClick?.();
  };

  return (
    <>
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
              onClick={() => handleNavigate(item.id)}
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

        {/* Find My Table */}
        {tableManagement ? (
          <button
            onClick={() => window.open(eventToken ? `/find-table?token=${eventToken}` : '/find-table', "_blank")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all"
          >
            <MapPin className="h-4 w-4" />
            Find My Table
            <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
          </button>
        ) : (
          <div
            title="This feature is not available in your plan"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/30 cursor-not-allowed select-none"
          >
            <MapPin className="h-4 w-4" />
            Find My Table
            <Lock className="h-3 w-3 ml-auto" />
          </div>
        )}

        {/* Share Memories */}
        {shareMemory ? (
          <button
            onClick={() => window.open(eventToken ? `/share-memories?token=${eventToken}` : '/share-memories', "_blank")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all"
          >
            <Camera className="h-4 w-4" />
            Share Memories
            <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
          </button>
        ) : (
          <div
            title="This feature is not available in your plan"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/30 cursor-not-allowed select-none"
          >
            <Camera className="h-4 w-4" />
            Share Memories
            <Lock className="h-3 w-3 ml-auto" />
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <button
          onClick={() => { onLogout(); onItemClick?.(); }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );
};

export const UserSidebar = ({
  currentPage,
  onNavigate,
  onLogout,
  eventToken,
  tableManagement = true,
  shareMemory = true,
  mobileMenuOpen = false,
  onCloseMobileMenu,
}: UserSidebarProps) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="p-6 border-b border-sidebar-border shrink-0">
          <div className="flex flex-col items-start gap-1.5">
            <img src="/images/logo-text.png" alt="Aradhana" className="h-20 w-full object-contain object-left" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans">User Panel</p>
          </div>
        </div>
        <NavContent
          currentPage={currentPage}
          onNavigate={onNavigate}
          onLogout={onLogout}
          eventToken={eventToken}
          tableManagement={tableManagement}
          shareMemory={shareMemory}
        />
      </aside>

      {/* Mobile drawer (Sheet from top nav hamburger) */}
      <Sheet open={mobileMenuOpen} onOpenChange={(open) => !open && onCloseMobileMenu?.()}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col bg-sidebar border-sidebar-border [&>button]:hidden">
          <div className="p-5 border-b border-sidebar-border shrink-0 flex items-center justify-between">
            <img src="/images/logo-text.png" alt="Aradhana" className="h-14 w-auto object-contain object-left" />
            <SheetClose asChild>
              <button
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </div>
          <NavContent
            currentPage={currentPage}
            onNavigate={onNavigate}
            onLogout={onLogout}
            eventToken={eventToken}
            tableManagement={tableManagement}
            shareMemory={shareMemory}
            onItemClick={onCloseMobileMenu}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
