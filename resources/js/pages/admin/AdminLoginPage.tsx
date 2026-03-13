import { useForm } from "@inertiajs/react";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const AdminLoginPage = () => {
  const { data, setData, post, processing, errors } = useForm({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 texture-dots opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card shadow-elevated p-8">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-primary-foreground fill-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Aradhana</h1>
            <p className="text-sm text-muted-foreground font-body mt-1">Admin Login</p>
          </div>

          {/* Divider */}
          <div className="ornamental-line mb-8" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground font-body">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="admin@aradhana.lk"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground font-body">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 rounded-lg bg-gradient-gold text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-6 disabled:opacity-60"
            >
              {processing ? "Signing in..." : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
              Go to User Login →
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
