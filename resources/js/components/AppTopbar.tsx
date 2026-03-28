import { Menu } from "lucide-react";

interface AppTopbarProps {
  title: string;
  subtitle: string;
  onOpenMobileMenu: () => void;
}

export const AppTopbar = ({ title, subtitle, onOpenMobileMenu }: AppTopbarProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="md:hidden">
          <img src="/images/logo-text.png" alt="Aradhana" className="h-10 w-auto object-contain" />
        </div>
        <div className="hidden md:block">
          <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground font-body">{subtitle}</p>
        </div>
      </div>
    </header>
  );
};
