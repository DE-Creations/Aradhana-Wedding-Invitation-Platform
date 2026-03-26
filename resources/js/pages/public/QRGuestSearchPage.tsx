import { WatermarkFooter } from "@/components/WatermarkFooter";
import { Search, Image, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface WeddingInfo {
  bride_name: string;
  groom_name: string;
}

interface QRGuestSearchPageProps {
  wedding?: WeddingInfo | null;
  token?: string;
  tableManagement?: boolean;
  shareMemory?: boolean;
}

export const QRGuestSearchPage = ({
  wedding,
  token = "",
  tableManagement = true,
  shareMemory = true,
}: QRGuestSearchPageProps) => {
  const bothDisabled = !tableManagement && !shareMemory;
  const encodedToken = encodeURIComponent(token);

  return (
    <>
      <div className="min-h-screen bg-gradient-ivory">
        <div className="max-w-lg mx-auto px-6 py-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <img src="/images/logo-text.png" alt="Aradhana" className="h-[14rem] w-auto mx-auto mb-3 object-contain" />
            {wedding && (
              <h1 className="font-display text-3xl font-bold text-foreground">
                {wedding.bride_name} & {wedding.groom_name}
              </h1>
            )}
          </motion.div>

          {bothDisabled ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-1">Features Unavailable</h2>
              <p className="text-sm text-muted-foreground">
                Table search and memory sharing are not enabled for this event.
              </p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {tableManagement ? (
                <a
                  href={`/find-table?token=${encodedToken}`}
                  className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated hover:border-primary/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Search className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Find My Table</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Look up your assigned table for today's event</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-5 rounded-2xl border border-border bg-card/50 p-6 opacity-50 cursor-not-allowed">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Lock className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Find My Table</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Not available for this event</p>
                  </div>
                </div>
              )}

              {shareMemory ? (
                <a
                  href={`/share-memories?token=${encodedToken}`}
                  className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated hover:border-primary/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Image className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Share Memories</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Upload your favourite photos from today</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-5 rounded-2xl border border-border bg-card/50 p-6 opacity-50 cursor-not-allowed">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Lock className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Share Memories</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Not available for this event</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 left-0 w-full">
        <WatermarkFooter />
      </div>
    </>
  );
};
