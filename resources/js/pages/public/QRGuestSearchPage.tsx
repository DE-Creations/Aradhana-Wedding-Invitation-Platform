import { useState, useEffect, useRef } from "react";
import { WatermarkFooter } from "@/components/WatermarkFooter";
import { Search, Upload, Check, Image, ChevronDown, X, Loader2, AlertCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface WeddingInfo {
  bride_name: string;
  groom_name: string;
  venue_name: string;
}

interface GuestEntry {
  id: string;
  guest_name: string;
  table_name: string | null;
}

interface QRGuestSearchPageProps {
  onBack?: () => void;
  wedding?: WeddingInfo | null;
  guests?: GuestEntry[];
  token?: string;
  tableManagement?: boolean;
  shareMemory?: boolean;
  imageCount?: number;
}

const MAX_MB = 15;

export const QRGuestSearchPage = ({ onBack, wedding, guests = [], token = "", tableManagement = true, shareMemory = true, imageCount = 20 }: QRGuestSearchPageProps) => {
  const MAX_IMAGES = imageCount;
  const bothDisabled = !tableManagement && !shareMemory;
  const [tab, setTab] = useState<"table" | "memories">(tableManagement ? "table" : "memories");

  // Table search state
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<GuestEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<GuestEntry | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Memories upload state
  const [selectedGuest, setSelectedGuest] = useState("");
  const [selectedGuestName, setSelectedGuestName] = useState("");
  const [memGuestSearch, setMemGuestSearch] = useState("");
  const [memGuestResults, setMemGuestResults] = useState<GuestEntry[]>([]);
  const [isMemSearching, setIsMemSearching] = useState(false);
  const [hasMemSearched, setHasMemSearched] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const w = wedding;

  // Debounced AJAX guest search (Find My Table tab)
  useEffect(() => {
    if (search.trim().length < 2) {
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
          `/guest-search/search?token=${encodeURIComponent(token)}&q=${encodeURIComponent(search.trim())}`
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

  // Debounced AJAX guest search (Share Memories tab)
  useEffect(() => {
    if (memGuestSearch.trim().length < 2) {
      setMemGuestResults([]);
      setHasMemSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsMemSearching(true);
      try {
        const res = await fetch(
          `/guest-search/search?token=${encodeURIComponent(token)}&q=${encodeURIComponent(memGuestSearch.trim())}`
        );
        if (res.ok) setMemGuestResults(await res.json());
        setHasMemSearched(true);
      } catch {
        setHasMemSearched(true);
      } finally {
        setIsMemSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [memGuestSearch, token]);

  const clearMemGuestSearch = () => {
    setSelectedGuest("");
    setSelectedGuestName("");
    setMemGuestSearch("");
    setMemGuestResults([]);
    setHasMemSearched(false);
  };

  const addFiles = (incoming: FileList | File[]) => {
    setUploadError("");
    const list = Array.from(incoming);
    const oversized = list.filter((f) => f.size > MAX_MB * 1024 * 1024);
    if (oversized.length) {
      setUploadError(`${oversized.length} file(s) exceed ${MAX_MB} MB and were skipped.`);
    }
    const valid = list.filter((f) => f.size <= MAX_MB * 1024 * 1024);
    setPendingFiles((prev) => {
      const combined = [...prev, ...valid].slice(0, MAX_IMAGES);
      setPreviewUrls(combined.map((f) => URL.createObjectURL(f)));
      return combined;
    });
  };

  const removeFile = (idx: number) => {
    setPendingFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setPreviewUrls(next.map((f) => URL.createObjectURL(f)));
      return next;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!selectedGuest || pendingFiles.length === 0) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("token", token);
      form.append("guest_id", selectedGuest);
      pendingFiles.forEach((f) => form.append("images[]", f));

      const csrfMeta = document.querySelector<HTMLMetaElement>("meta[name='csrf-token']");
      const res = await fetch("/guest-search/upload-memory", {
        method: "POST",
        headers: csrfMeta ? { "X-CSRF-TOKEN": csrfMeta.content } : {},
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setUploadSuccess(true);
      setPendingFiles([]);
      setPreviewUrls([]);
      clearMemGuestSearch();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-ivory">
      {onBack && (
        <button onClick={onBack} className="fixed top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm border border-border text-sm shadow-card">← Back</button>
      )}

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <img src="/images/logo-text.png" alt="Aradhana" className="h-[14rem] w-auto mx-auto mb-3 object-contain" />
          <h1 className="font-display text-3xl font-bold text-foreground">{w?.bride_name} & {w?.groom_name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{w?.venue_name}</p>
        </motion.div>

        {/* Tabs */}
        {bothDisabled ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-1">Features Unavailable</h2>
            <p className="text-sm text-muted-foreground">Table search and memory sharing are not enabled for this event.</p>
          </div>
        ) : (
          <>
            <div className="flex rounded-xl bg-muted p-1 mb-8">
              {tableManagement ? (
                <button onClick={() => setTab("table")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${tab === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                  <Search className="h-4 w-4" /> Find My Table
                </button>
              ) : (
                <div className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 text-muted-foreground/40 cursor-not-allowed select-none">
                  <Lock className="h-4 w-4" /> Find My Table
                </div>
              )}
              {shareMemory ? (
                <button onClick={() => setTab("memories")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${tab === "memories" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                  <Image className="h-4 w-4" /> Share Memories
                </button>
              ) : (
                <div className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 text-muted-foreground/40 cursor-not-allowed select-none">
                  <Lock className="h-4 w-4" /> Share Memories
                </div>
              )}
            </div>

        {/* Table Search Tab */}
        {tab === "table" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-semibold text-foreground">Find Your Table</h2>
              <p className="text-sm text-muted-foreground mt-1">Start typing your first or last name</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter your first or last name..."
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              {isSearching && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
              )}
            </div>

            {/* Selected guest — prominent table card */}
            {selectedResult && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border-2 border-primary/30 bg-card p-5 shadow-card">
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
                  <p className="mt-2 text-sm text-muted-foreground">Table assignment pending. Please check with the event team.</p>
                )}
              </motion.div>
            )}

            {/* Search results list */}
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
                <p className="text-sm text-muted-foreground">Try a different name spelling</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Memories Tab */}
        {tab === "memories" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-semibold text-foreground">Share Your Memories</h2>
              <p className="text-sm text-muted-foreground mt-1">Upload photos from today's celebration</p>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-7 w-7 text-success" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">Photos Uploaded!</h3>
                <p className="text-sm text-muted-foreground mt-1">Thank you for sharing your memories.</p>
                <button
                  onClick={() => setUploadSuccess(false)}
                  className="mt-4 px-5 py-2 rounded-xl border border-border text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Upload More
                </button>
              </div>
            ) : (
              <>
                {/* Guest Search */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Who are you?</label>
                  {selectedGuest ? (
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-primary/30 bg-card">
                      <span className="text-sm font-medium text-foreground">{selectedGuestName}</span>
                      <button
                        onClick={clearMemGuestSearch}
                        className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                      >
                        <X className="h-3 w-3" /> Change
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        value={memGuestSearch}
                        onChange={(e) => setMemGuestSearch(e.target.value)}
                        placeholder="Type your name to search..."
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      {isMemSearching && (
                        <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                      )}
                      {memGuestResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-elevated z-20 overflow-hidden">
                          {memGuestResults.map((g) => (
                            <button
                              key={g.id}
                              onClick={() => { setSelectedGuest(g.id); setSelectedGuestName(g.guest_name); setMemGuestSearch(""); setMemGuestResults([]); setHasMemSearched(false); }}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors border-b border-border last:border-b-0"
                            >
                              <span className="text-foreground">{g.guest_name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {hasMemSearched && !isMemSearching && memGuestResults.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-elevated z-20 px-4 py-3">
                          <p className="text-sm text-muted-foreground text-center">No guests found</p>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">So we know who captured these beautiful moments</p>
                </div>

                {/* Upload Area */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer ${
                    dragOver ? "border-primary bg-primary/5" : "border-border bg-card/50 hover:border-primary/30"
                  }`}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">Drag &amp; drop photos here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse · max {MAX_MB} MB each · up to {MAX_IMAGES} photos</p>
                </div>

                {/* Error */}
                {uploadError && (
                  <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{uploadError}</p>
                  </div>
                )}

                {/* Previews */}
                {pendingFiles.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{pendingFiles.length} / {MAX_IMAGES} photo(s) selected</p>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {previewUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-card/90 flex items-center justify-center"
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleUpload}
                      disabled={!selectedGuest || isUploading}
                      className="w-full py-3 rounded-xl bg-gradient-gold text-primary-foreground font-medium text-sm disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : "Upload Photos"}
                    </button>
                    {!selectedGuest && <p className="text-xs text-destructive mt-1.5 text-center">Please select your name first</p>}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
          </>
        )}
      </div>
    </div>
    <div className="sticky bottom-0 left-0 w-full">
      <WatermarkFooter />
    </div>
    </>
  );
};
