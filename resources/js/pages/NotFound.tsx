import { usePage } from "@inertiajs/react";

interface PageProps {
  status?: number;
}

const ERROR_INFO: Record<number, { title: string; description: string }> = {
  403: {
    title: "Access Denied",
    description: "You don't have permission to view this page.",
  },
  404: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
  },
  500: {
    title: "Server Error",
    description: "Something went wrong on our end. Please try again shortly.",
  },
};

export default function NotFound() {
  const { status } = usePage<PageProps>().props;
  const code = status ?? 404;
  const { title, description } = ERROR_INFO[code] ?? ERROR_INFO[404];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-display font-bold text-primary/30 mb-4">{code}</p>
        <h1 className="text-2xl font-display font-semibold text-foreground mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          ← Go back home
        </a>
      </div>
    </div>
  );
}
