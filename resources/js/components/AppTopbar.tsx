import { Heart } from "lucide-react";

interface AppTopbarProps {
  title: string;
  subtitle: string;
}

export const AppTopbar = ({ title, subtitle }: AppTopbarProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground font-body">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-semibold text-muted-foreground">U</span>
        </div>
      </div>
    </header>
  );
};
