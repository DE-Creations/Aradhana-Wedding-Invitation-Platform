import { useForm } from "@inertiajs/react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const UserLoginPage = () => {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Full background — dark warm overlay with visible ornamental pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(20,15%,12%)] via-[hsl(25,12%,16%)] to-[hsl(30,10%,10%)]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, hsl(38 60% 52% / 0.18), transparent 38%), radial-gradient(circle at bottom, hsl(38 45% 42% / 0.12), transparent 34%)",
        }}
      />
      {/* Ornamental lattice pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='96' height='96' viewBox='0 0 96 96' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4AF57' stroke-width='1.2' stroke-opacity='0.42'%3E%3Cpath d='M48 10L86 48L48 86L10 48Z'/%3E%3Cpath d='M48 24L72 48L48 72L24 48Z'/%3E%3Cpath d='M48 0V22M48 74V96M0 48H22M74 48H96'/%3E%3Ccircle cx='48' cy='48' r='8' fill='%23D4AF57' fill-opacity='0.18' stroke='none'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "96px 96px",
          backgroundPosition: "center center",
          opacity: 0.28,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(38 40% 45% / 0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(38 40% 45% / 0.08) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage: "radial-gradient(circle at center, black 45%, transparent 100%)",
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md text-center"
        >
          {/* Brand */}
          <div className="mb-10">
            <img src="/images/logo-text.png" alt="Aradhana" className="h-44 sm:h-56 md:h-72 w-auto mx-auto mb-4 object-contain" />
            <p className="font-serif text-sm italic text-[hsl(40,20%,70%)] mt-2">
              "Where every love story becomes a beautifully crafted invitation"
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-16 bg-primary/30" />
              <span className="text-xs uppercase tracking-[0.3em] text-primary/80 font-sans">Sri Lanka's Premium Wedding Invitation Platform</span>
              <div className="h-px w-16 bg-primary/30" />
            </div>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-[hsl(38,30%,30%)] bg-[hsl(25,12%,14%)] shadow-2xl p-8 text-left backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-[hsl(40,33%,92%)]">Welcome Back</h2>
              <p className="text-sm text-[hsl(40,15%,55%)] font-sans mt-1">Sign in to your wedding dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[hsl(40,20%,80%)] font-sans">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(40,15%,45%)]" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[hsl(38,20%,25%)] bg-[hsl(25,10%,11%)] text-[hsl(40,20%,90%)] text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-[hsl(40,10%,35%)]"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[hsl(40,20%,80%)] font-sans">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(40,15%,45%)]" />
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[hsl(38,20%,25%)] bg-[hsl(25,10%,11%)] text-[hsl(40,20%,90%)] text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-[hsl(40,10%,35%)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-6 shadow-lg disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, hsl(38,45%,42%), hsl(38,40%,35%))', color: 'hsl(40,33%,95%)' }}
              >
                {processing ? "Signing in..." : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/admin/login" className="text-sm text-[hsl(40,15%,50%)] hover:text-primary transition-colors font-sans">
                Admin Login →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
