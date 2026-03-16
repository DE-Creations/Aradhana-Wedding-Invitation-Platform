import { useState, useEffect } from "react";
import { Calendar, Users, MousePointerClick, UserCheck, Clock, UserX, Hash, Plus, FileSpreadsheet, Settings, Eye, QrCode, Image, Lock } from "lucide-react";
import { StatsCard, SectionCard, StatusBadge } from "@/components/ui-components";
import { WatermarkFooter } from "@/components/WatermarkFooter";
import { motion } from "framer-motion";

interface WeddingInfo {
  bride_name: string;
  groom_name: string;
  venue_name: string;
  event_date: string;
}

interface Stats {
  totalGuests: number;
  rsvpClicks: number;
  confirmed: number;
  pending: number;
  declined: number;
  headCount: number;
  totalSeats: number;
  assignedSeats: number;
}

interface PendingGuest {
  id: string;
  guest_name: string;
  phone: string;
  rsvp_status: string;
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: string;
}

interface LatestMemory {
  id: string;
  image_path: string;
  file_name: string;
}

interface UserDashboardPageProps {
  onNavigate: (page: string) => void;
  wedding: WeddingInfo | null;
  stats: Stats | null;
  pendingGuests: PendingGuest[];
  recentActivity: ActivityItem[];
  latestMemories: LatestMemory[];
  eventToken?: string;
  tableManagement?: boolean;
  shareMemory?: boolean;
}

export const UserDashboardPage = ({ onNavigate, wedding, stats, pendingGuests, recentActivity, latestMemories, eventToken, tableManagement = true, shareMemory = true }: UserDashboardPageProps) => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (!wedding?.event_date) return;
    const eventDate = new Date(wedding.event_date);
    const today = new Date();
    const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diff));
  }, [wedding?.event_date]);

  const assignProgress = stats && stats.totalSeats > 0
    ? Math.round((stats.assignedSeats / stats.totalSeats) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {wedding ? `${wedding.bride_name} & ${wedding.groom_name}'s Wedding` : "Your Wedding"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {wedding ? `${wedding.venue_name} · ${wedding.event_date}` : "Complete your wedding settings to get started"}
          </p>
        </div>
      </div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-gradient-gold p-6 md:p-8 text-center shadow-elevated"
      >
        <p className="text-primary-foreground/80 text-sm font-body uppercase tracking-widest mb-2">Your Big Day In</p>
        <p className="text-6xl md:text-7xl font-display font-bold text-primary-foreground">{daysLeft}</p>
        <p className="text-primary-foreground/70 text-lg font-display mt-1">Days</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Users className="h-5 w-5" />} label="Total Guests" value={stats?.totalGuests ?? 0} variant="primary" />
        <StatsCard icon={<MousePointerClick className="h-5 w-5" />} label="RSVP Clicks" value={stats?.rsvpClicks ?? 0} variant="default" />
        <StatsCard icon={<UserCheck className="h-5 w-5" />} label="Confirmed" value={stats?.confirmed ?? 0} variant="success" />
        <StatsCard icon={<Clock className="h-5 w-5" />} label="Pending" value={stats?.pending ?? 0} variant="warning" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard icon={<UserX className="h-5 w-5" />} label="Declined" value={stats?.declined ?? 0} variant="destructive" />
        <StatsCard icon={<Hash className="h-5 w-5" />} label="Head Count" value={stats?.headCount ?? 0} subtitle="Total attendees" variant="info" />
        <div className="hidden lg:block relative">
          <StatsCard icon={<Calendar className="h-5 w-5" />} label="Table Progress" value={`${assignProgress}%`} subtitle={`${stats?.assignedSeats ?? 0}/${stats?.totalSeats ?? 0} seats assigned`} variant="primary" />
          {!tableManagement && (
            <div className="absolute inset-0 rounded-xl bg-background/70 backdrop-blur-[1px] flex items-center justify-center gap-1.5">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Not available</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Add Guest", icon: Plus, page: "guests", disabled: false },
          { label: "Import Guests", icon: FileSpreadsheet, page: "guests", disabled: false },
          { label: "Edit Settings", icon: Settings, page: "settings", disabled: false },
          { label: "Preview Invite", icon: Eye, page: "preview", disabled: false },
          { label: "QR Search", icon: QrCode, page: "qr-search", disabled: !tableManagement && !shareMemory },
        ].map((action) => (
          <button
            key={action.label}
            disabled={action.disabled}
            onClick={() => {
              if (action.disabled) return;
              if (action.page === "preview") {
                window.open(eventToken ? `/invitation/${eventToken}` : "/invitation", "_blank");
              } else if (action.page === "qr-search") {
                window.open(eventToken ? `/guest-search?token=${eventToken}` : "/guest-search", "_blank");
              } else {
                onNavigate(action.page);
              }
            }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all shadow-card ${
              action.disabled
                ? "border-border bg-card/50 opacity-40 cursor-not-allowed"
                : "border-border bg-card hover:bg-muted/50 hover:border-primary/20 cursor-pointer"
            }`}
          >
            <action.icon className={`h-5 w-5 ${action.disabled ? "text-muted-foreground" : "text-primary"}`} />
            <span className="text-xs font-medium text-foreground font-body">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Guests */}
        <SectionCard title="Pending Guests" description={`${pendingGuests.length} guests haven't responded`}>
          {pendingGuests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">All guests have responded!</p>
          ) : (
            <div className="space-y-2">
              {pendingGuests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{guest.guest_name}</p>
                    <p className="text-xs text-muted-foreground">{guest.phone}</p>
                  </div>
                  <StatusBadge status={guest.rsvp_status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard title="Recent Activity" description="Latest RSVP responses">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.type === "attending" ? "bg-success" : item.type === "declined" ? "bg-destructive" : "bg-info"
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Latest Memories */}
      <SectionCard
        title="Latest Memories"
        description="Recent photo uploads from guests"
        action={shareMemory ? <button onClick={() => onNavigate("memories")} className="text-sm text-primary hover:text-primary/80 font-medium">View All</button> : undefined}
      >
        {!shareMemory ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Lock className="h-6 w-6 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground text-center">This feature is not available in your plan.</p>
          </div>
        ) : latestMemories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No memories yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {latestMemories.map((m) => (
              <div key={m.id} className="rounded-lg overflow-hidden aspect-square border border-border">
                <img src={m.image_path} alt={m.file_name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
      <WatermarkFooter />
    </div>
  );
};
