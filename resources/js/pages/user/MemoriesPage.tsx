import { useState, useCallback } from "react";
import { router } from "@inertiajs/react";
import { Search, Check, X, Download, Image, CheckSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge, EmptyState } from "@/components/ui-components";
import { motion } from "framer-motion";

interface Memory {
  id: string;
  guest_name: string;
  image_url: string;
  image_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  status: string;
  uploaded_at: string;
}

interface MemoriesPageProps {
  memories: Memory[];
}

export const MemoriesPage = ({ memories }: MemoriesPageProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = memories.filter((m) => {
    const matchSearch = m.guest_name.toLowerCase().includes(search.toLowerCase()) || m.file_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBatchAction = (status: "approved" | "rejected") => {
    router.post("/memories/batch", { ids: [...selectedIds], status }, {
      onSuccess: () => { setSelectedIds(new Set()); setSelectMode(false); },
    });
  };

  const handleSingleAction = (id: string, status: "approved" | "rejected") => {
    router.post(`/memories/${id}/${status === "approved" ? "approve" : "reject"}`);
  };

  const handleDownloadAll = () => {
    window.location.href = '/memories/download-all';
  };

  const openLightbox = useCallback((idx: number) => {
    setLightboxIdx(idx);
  }, []);

  const lightboxPrev = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  };

  const lightboxNext = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  };

  const currentLightboxMemory = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Memories</h1>
          <p className="text-sm text-muted-foreground mt-1">{memories.length} photos uploaded by guests</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSelectMode(!selectMode); setSelectedIds(new Set()); }}
            className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-colors ${selectMode ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}
          >
            <CheckSquare className="h-3.5 w-3.5" /> {selectMode ? "Cancel" : "Select"}
          </button>
          <button onClick={handleDownloadAll} className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download Approved
          </button>
        </div>
      </div>

      {/* Batch Actions */}
      {selectMode && selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between"
        >
          <p className="text-sm font-medium text-foreground">{selectedIds.size} selected</p>
          <div className="flex gap-2">
            <button onClick={() => handleBatchAction("approved")} className="px-3 py-1.5 rounded-lg bg-success text-success-foreground text-sm font-medium hover:opacity-90 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
            <button onClick={() => handleBatchAction("rejected")} className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 flex items-center gap-1">
              <X className="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by uploader or filename..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-card text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Image className="h-8 w-8" />} title="No memories found" description="Adjust your search or filter criteria." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((memory, i) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative rounded-xl overflow-hidden border border-border bg-card shadow-card cursor-pointer"
              onClick={() => selectMode ? toggleSelect(memory.id) : openLightbox(i)}
            >
              {/* Select overlay */}
              {selectMode && (
                <div className="absolute top-2 left-2 z-10">
                  {selectedIds.has(memory.id) ? (
                    <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center"><Check className="h-3.5 w-3.5 text-primary-foreground" /></div>
                  ) : (
                    <div className="w-6 h-6 rounded-md border-2 border-card bg-card/80" />
                  )}
                </div>
              )}

              <div className="aspect-square">
                <img src={memory.image_path} alt={memory.file_name} className="w-full h-full object-cover" />
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-foreground truncate">{memory.guest_name}</p>
                  <StatusBadge status={memory.status} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{memory.file_name}</span>
                  <span>{formatSize(memory.file_size)}</span>
                </div>

                {/* Actions */}
                {!selectMode && memory.status === "pending" && (
                  <div className="flex gap-1.5 mt-2">
                    <button onClick={(e) => { e.stopPropagation(); handleSingleAction(memory.id, "approved"); }} className="flex-1 py-1 rounded-md bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors">Approve</button>
                    <button onClick={(e) => { e.stopPropagation(); handleSingleAction(memory.id, "rejected"); }} className="flex-1 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">Reject</button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Slider */}
      {currentLightboxMemory && lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm">
          <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors">
            <X className="h-5 w-5 text-foreground" />
          </button>

          {/* Prev */}
          <button onClick={lightboxPrev} className="absolute left-4 z-10 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Image */}
          <div className="max-w-3xl max-h-[80vh] mx-16">
            <img
              src={currentLightboxMemory.image_path}
              alt={currentLightboxMemory.file_name}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-card">{currentLightboxMemory.file_name}</p>
              <p className="text-xs text-card/70">{currentLightboxMemory.guest_name} · {formatSize(currentLightboxMemory.file_size)}</p>
              <p className="text-xs text-card/50 mt-1">{lightboxIdx + 1} / {filtered.length}</p>
            </div>
          </div>

          {/* Next */}
          <button onClick={lightboxNext} className="absolute right-4 z-10 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors">
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      )}

    </div>
  );
};
