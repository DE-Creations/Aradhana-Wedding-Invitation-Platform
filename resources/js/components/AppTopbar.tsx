interface AppTopbarProps {
  title: string;
  subtitle: string;
}

export const AppTopbar = ({ title, subtitle }: AppTopbarProps) => {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <img src="/images/logo-text.png" alt="Aradhana" className="h-12 w-auto object-contain" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground font-body">{subtitle}</p>
        </div>
      </div>
    </header>
  );
};
