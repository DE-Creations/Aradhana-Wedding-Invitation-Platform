import { Users, Heart, Calendar, TrendingUp, Plus } from "lucide-react";
import { StatsCard, SectionCard, StatusBadge } from "@/components/ui-components";
import { motion } from "framer-motion";

type RecentUser = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "expired";
  last_login: string;
  expire_date: string;
  created_at: string;
};

type Stats = {
  total_users: number;
  active_users: number;
  expired_users: number;
  total_weddings: number;
};

interface AdminDashboardPageProps {
  stats: Stats;
  recentUsers: RecentUser[];
  onNavigate: (page: string) => void;
}

export const AdminDashboardPage = ({ stats, recentUsers, onNavigate }: AdminDashboardPageProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your wedding platform</p>
        </div>
        <button
          onClick={() => onNavigate("admin-users")}
          className="px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Create User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Users className="h-5 w-5" />} label="Total Users" value={stats.total_users} variant="primary" />
        <StatsCard icon={<TrendingUp className="h-5 w-5" />} label="Active Users" value={stats.active_users} variant="success" />
        <StatsCard icon={<Users className="h-5 w-5" />} label="Expired Users" value={stats.expired_users} variant="destructive" />
        <StatsCard icon={<Calendar className="h-5 w-5" />} label="Total Weddings" value={stats.total_weddings} variant="info" />
      </div>

      {/* Recent Users */}
      <SectionCard
        title="Recent Accounts"
        description="Latest registered wedding accounts"
        action={
          <button onClick={() => onNavigate("admin-users")} className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            View All
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground font-body">Name</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground font-body hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground font-body">Status</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground font-body hidden lg:table-cell">Last Login</th>
                <th className="text-left py-3 px-2 font-medium text-muted-foreground font-body hidden lg:table-cell">Expire Date</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-2 font-medium text-foreground">{user.name}</td>
                  <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{user.email}</td>
                  <td className="py-3 px-2"><StatusBadge status={user.status} /></td>
                  <td className="py-3 px-2 text-muted-foreground hidden lg:table-cell">{user.last_login || "Never"}</td>
                  <td className="py-3 px-2 text-muted-foreground hidden lg:table-cell">{user.expire_date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};
