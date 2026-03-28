import { useState, useCallback, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Search, Check, X, Download, Image, CheckSquare, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { StatusBadge, EmptyState } from "@/components/ui-components";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";


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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIdx, setLightboxStartIdx] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());


  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = memories.filter((m) => {
    const matchSearch = m.guest_name.toLowerCase().includes(search.toLowerCase()) || m.file_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  // Reset loaded tracking when filter/search changes
  useEffect(() => {
    setLoadedIds(new Set());
  }, [search, filter]);

  const loadedCount = filtered.filter((m) => loadedIds.has(m.id)).length;
  const totalCount = filtered.length;
  const allLoaded = totalCount === 0 || loadedCount === totalCount;
  const loadingPct = totalCount === 0 ? 100 : Math.round((loadedCount / totalCount) * 100);


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
    setLightboxStartIdx(idx);
    setCurrentIdx(idx);
    setLightboxOpen(true);
  }, []);

  // Jump Embla to the clicked slide when the carousel mounts inside the dialog
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(lightboxStartIdx, true);
    setCurrentIdx(lightboxStartIdx);
  }, [emblaApi, lightboxStartIdx]);

  // Keep currentIdx in sync with Embla
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrentIdx(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen || !emblaApi) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  emblaApi.scrollPrev();
      if (e.key === "ArrowRight") emblaApi.scrollNext();
      if (e.key === "Escape")     setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, emblaApi]);

  const currentMemory = filtered[currentIdx] ?? filtered[lightboxStartIdx];

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
            disabled={!allLoaded}
            className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${selectMode ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}`}
          >
            <CheckSquare className="h-3.5 w-3.5" /> {selectMode ? "Cancel" : "Select"}
          </button>
          <button disabled={!allLoaded} onClick={handleDownloadAll} className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
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
          <input disabled={!allLoaded} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by uploader or filename..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-40 disabled:cursor-not-allowed" />
        </div>
        <select disabled={!allLoaded} value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-card text-sm disabled:opacity-40 disabled:cursor-not-allowed">
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
        <div className="relative">
          {/* Blocking overlay */}
          {!allLoaded && (
            <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="bg-card border border-border rounded-2xl px-8 py-6 shadow-xl flex flex-col items-center gap-4 w-64">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Loading photos...</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{loadedCount} of {totalCount}</p>
                </div>
                <div className="w-full">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-gold rounded-full transition-all duration-300" style={{ width: `${loadingPct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-1 tabular-nums">{loadingPct}%</p>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((memory) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="group relative rounded-xl overflow-hidden border border-border bg-card shadow-card cursor-pointer"
                    onClick={() => {
                      const absIdx = filtered.indexOf(memory);
                      selectMode ? toggleSelect(memory.id) : openLightbox(absIdx);
                    }}
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

                    <div className="aspect-square relative bg-muted">
                      {!loadedIds.has(memory.id) && (
                        <div className="absolute inset-0 bg-muted animate-pulse" />
                      )}
                      <img
                        src={memory.image_path}
                        alt={memory.file_name}
                        onLoad={() => setLoadedIds((prev) => { const next = new Set(prev); next.add(memory.id); return next; })}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${loadedIds.has(memory.id) ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-foreground truncate">{memory.guest_name}</p>
                        <StatusBadge status={memory.status} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="truncate">{memory.file_name}</span>
                        <span className="shrink-0 ml-1">{formatSize(memory.file_size)}</span>
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
        </div>
      )}

      {/* Image Slider Dialog */}
      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-xl flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            style={{ height: "min(540px, 90svh)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="min-w-0">
                <Dialog.Title className="text-sm font-semibold text-foreground truncate leading-tight">
                  {currentMemory?.file_name}
                </Dialog.Title>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {currentMemory?.guest_name} · {currentMemory ? formatSize(currentMemory.file_size) : ""}
                </p>
              </div>
              <Dialog.Close className="ml-3 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            {/* Embla Carousel */}
            <div className="relative flex-1 overflow-hidden bg-muted/20">
              <div ref={emblaRef} className="h-full overflow-hidden">
                <div className="flex h-full">
                  {filtered.map((memory) => (
                    <div key={memory.id} className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center p-4">
                      <img
                        src={memory.image_path}
                        alt={memory.file_name}
                        className="max-w-full max-h-full object-contain rounded-md shadow-md select-none"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prev */}
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center hover:bg-card transition-colors shadow-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </button>

              {/* Next */}
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center hover:bg-card transition-colors shadow-sm"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-foreground" />
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 shrink-0">
              <StatusBadge status={currentMemory?.status ?? "pending"} />
              <div className="flex items-center gap-1 overflow-hidden max-w-[160px]">
                {filtered.length <= 20 && filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`rounded-full shrink-0 transition-all duration-200 ${i === currentIdx ? "w-3.5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"}`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-medium tabular-nums">{currentIdx + 1} / {filtered.length}</span>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
};
