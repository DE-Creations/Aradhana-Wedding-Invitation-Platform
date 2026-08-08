import { Link } from "@inertiajs/react";
import { Home } from "lucide-react";

interface NotFoundProps {
  status?: number;
}

const COPY: Record<number, { title: string; message: string }> = {
  404: {
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist or may have been moved.",
  },
  403: {
    title: "Access Denied",
    message: "You don't have permission to view this page.",
  },
};

export default function NotFound({ status = 404 }: NotFoundProps) {
  const { title, message } = COPY[status] ?? COPY[404];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(20,15%,12%)] via-[hsl(25,12%,16%)] to-[hsl(30,10%,10%)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, hsl(38 60% 52% / 0.18), transparent 38%), radial-gradient(circle at bottom, hsl(38 45% 42% / 0.12), transparent 34%)",
        }}
      />

      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <p className="font-display text-7xl font-bold text-[hsl(38,45%,55%)] mb-2">{status}</p>
          <h1 className="font-display text-2xl font-bold text-[hsl(40,33%,92%)] mb-2">{title}</h1>
          <p className="text-sm text-[hsl(40,15%,60%)] font-sans mb-8">{message}</p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(38,45%,42%), hsl(38,40%,35%))", color: "hsl(40,33%,95%)" }}
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
