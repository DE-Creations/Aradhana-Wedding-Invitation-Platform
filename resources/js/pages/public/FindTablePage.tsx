import { useState, useEffect } from "react";
import { WatermarkFooter } from "@/components/WatermarkFooter";
import { Search, Check, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface WeddingInfo {
  bride_name: string;
  groom_name: string;
}

interface GuestEntry {
  id: string;
  guest_name: string;
  table_name: string | null;
}

interface FindTablePageProps {
  wedding?: WeddingInfo | null;
  token?: string;
  tableManagement?: boolean;
}

export const FindTablePage = ({ wedding, token = "", tableManagement = true }: FindTablePageProps) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<GuestEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<GuestEntry | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (search.trim().length < 8) {
      setSearchResults([]);
      setHasSearched(false);
      setSelectedResult(null);
      return;
    }
    setSelectedResult(null);
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/find-table/search?token=${encodeURIComponent(token)}&q=${encodeURIComponent(search.trim())}`
        );
        if (res.ok) setSearchResults(await res.json());
        setHasSearched(true);
      } catch {
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [search, token]);

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

          {!tableManagement ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-1">Feature Not Available</h2>
              <p className="text-sm text-muted-foreground">Table lookup is not enabled for this event.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-2xl font-semibold text-foreground">Find Your Table</h2>
                <p className="text-sm text-muted-foreground mt-1">Enter your mobile number to find your seat</p>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Enter your mobile number (ex: 07xxxxxxxx)"
                  inputMode="tel"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                {isSearching && (
                  <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
              </div>

              {selectedResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border-2 border-primary/30 bg-card p-5 shadow-card"
                >
                  <p className="font-display text-lg font-semibold text-foreground">{selectedResult.guest_name}</p>
                  {selectedResult.table_name ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Check className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Your Table</p>
                        <p className="font-display text-2xl font-bold text-foreground">{selectedResult.table_name}</p>
                        <p className="text-xs text-success mt-0.5">Welcome! Enjoy the celebration 🎉</p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Table assignment pending. Please check with the event team.
                    </p>
                  )}
                </motion.div>
              )}

              {!selectedResult && searchResults.length > 0 && (
                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
                  {searchResults.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => setSelectedResult(guest)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{guest.guest_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {guest.table_name ? `Table: ${guest.table_name}` : "Table pending"}
                        </p>
                      </div>
                      <Search className="h-4 w-4 text-muted-foreground opacity-40 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {hasSearched && !isSearching && searchResults.length === 0 && !selectedResult && (
                <div className="text-center py-8">
                  <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-foreground font-medium">No results found</p>
                  <p className="text-sm text-muted-foreground">Check your mobile number and try again</p>
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
