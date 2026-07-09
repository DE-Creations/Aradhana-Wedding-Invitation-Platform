import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { WatermarkFooter } from "@/components/WatermarkFooter";
import { Search, Upload, Check, X, Loader2, AlertCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface WeddingInfo {
  bride_name: string;
  groom_name: string;
}

interface GuestEntry {
  id: string;
  guest_name: string;
  table_name: string | null;
  image_count?: number;
}

interface ShareMemoriesPageProps {
  wedding?: WeddingInfo | null;
  token?: string;
  shareMemory?: boolean;
  imageCount?: number;
}

const MAX_MB = 15;
const COMPRESS_MAX_PX = 1280;
const COMPRESS_QUALITY = 0.82;
const UPLOAD_TIMEOUT_MS = 60_000;
const UPLOAD_MAX_RETRIES = 2;

/** Compress an image File using Canvas API. Skips compression for GIF. */
async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { naturalWidth: w, naturalHeight: h } = img;
      const scale = Math.min(1, COMPRESS_MAX_PX / Math.max(w, h));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) { resolve(file); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
        },
        "image/jpeg",
        COMPRESS_QUALITY
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

export const ShareMemoriesPage = ({
  wedding,
  token = "",
  shareMemory = true,
  imageCount = 20,
}: ShareMemoriesPageProps) => {
  const MAX_IMAGES = imageCount;

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
  const [guestImageCount, setGuestImageCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (memGuestSearch.trim().length < 8) {
      setMemGuestResults([]);
      setHasMemSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsMemSearching(true);
      try {
        const res = await fetch(
          `/share-memories/search?token=${encodeURIComponent(token)}&q=${encodeURIComponent(memGuestSearch.trim())}`
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

  const clearGuestSelection = () => {
    setSelectedGuest("");
    setSelectedGuestName("");
    setMemGuestSearch("");
    setMemGuestResults([]);
    setHasMemSearched(false);
    setGuestImageCount(0);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    const oversized = list.filter((f) => f.size > MAX_MB * 1024 * 1024);
    const valid = list.filter((f) => f.size <= MAX_MB * 1024 * 1024);

    // Remaining slots = total quota minus already-uploaded minus already-queued
    const remaining = MAX_IMAGES - guestImageCount - pendingFiles.length;
    const toAdd = valid.slice(0, Math.max(0, remaining));

    const msgs: string[] = [];
    if (oversized.length) {
      msgs.push(`${oversized.length} file${oversized.length !== 1 ? "s" : ""} exceed ${MAX_MB} MB and were skipped.`);
    }
    if (valid.length > remaining && remaining > 0) {
      msgs.push(
        `You selected ${valid.length} photo${valid.length !== 1 ? "s" : ""} but only ${remaining} slot${remaining !== 1 ? "s" : ""} remain — ${valid.length - toAdd.length} extra photo${valid.length - toAdd.length !== 1 ? "s" : ""} removed.`
      );
    }
    if (valid.length > 0 && remaining <= 0) {
      msgs.push("You have reached your upload limit for this event.");
    }
    setUploadError(msgs.join(" "));

    if (toAdd.length === 0) return;
    const combined = [...pendingFiles, ...toAdd];
    setPendingFiles(combined);
    setPreviewUrls(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (idx: number) => {
    const next = pendingFiles.filter((_, i) => i !== idx);
    setPendingFiles(next);
    setPreviewUrls(next.map((f) => URL.createObjectURL(f)));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!selectedGuest || pendingFiles.length === 0) return;

    // Guard: enforce remaining capacity before starting (prevents mobile zero-upload)
    const remaining = MAX_IMAGES - guestImageCount;
    if (remaining <= 0) {
      setUploadError("You have already reached your upload limit for this event.");
      return;
    }
    const filesToUpload = pendingFiles.slice(0, remaining);

    setIsUploading(true);
    setUploadError("");
    setUploadProgress(0);
    setUploadCurrent(0);
    setUploadTotal(filesToUpload.length);

    const csrfMeta = document.querySelector<HTMLMetaElement>("meta[name='csrf-token']");
    const headers = csrfMeta ? { "X-CSRF-TOKEN": csrfMeta.content } : {};
    let lastNewCount: number | undefined;
    const errors: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      setUploadCurrent(i + 1);
      setUploadProgress(0);

      // Compress before upload to reduce size and upload time
      const compressed = await compressImage(filesToUpload[i]);

      let attempt = 0;
      let succeeded = false;
      while (attempt <= UPLOAD_MAX_RETRIES && !succeeded) {
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, 1000 * attempt)); // back-off
        }
        const form = new FormData();
        form.append("token", token);
        form.append("guest_id", selectedGuest);
        form.append("images[]", compressed);
        try {
          const res = await axios.post("/share-memories/upload", form, {
            headers,
            timeout: UPLOAD_TIMEOUT_MS,
            onUploadProgress: (e) => {
              if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
            },
          });
          if (res.data.new_count !== undefined) lastNewCount = res.data.new_count;
          succeeded = true;
        } catch (err: any) {
          // Don't retry on 4xx (quota/validation errors — retrying won't help)
          const status = err.response?.status;
          if (status && status >= 400 && status < 500) {
            const msg = err.response?.data?.error || err.message || "Upload failed.";
            errors.push(`Photo ${i + 1}: ${msg}`);
            break;
          }
          attempt++;
          if (attempt > UPLOAD_MAX_RETRIES) {
            const msg = err.response?.data?.error || err.message || "Upload failed after retries.";
            errors.push(`Photo ${i + 1}: ${msg}`);
          }
        }
      }
    }

    if (lastNewCount !== undefined) setGuestImageCount(lastNewCount);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadCurrent(0);
    setUploadTotal(0);

    if (errors.length > 0) setUploadError(errors.join(" · "));
    if (errors.length < filesToUpload.length) {
      setUploadSuccess(true);
      setPendingFiles([]);
      setPreviewUrls([]);
      clearGuestSelection();
    }
  };

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

          {!shareMemory ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-1">Feature Not Available</h2>
              <p className="text-sm text-muted-foreground">Memory sharing is not enabled for this event.</p>
            </div>
          ) : (
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
                      <div className="rounded-xl border border-primary/30 bg-card px-4 py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{selectedGuestName}</span>
                          <button
                            onClick={clearGuestSelection}
                            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                          >
                            <X className="h-3 w-3" /> Change
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {guestImageCount} / {MAX_IMAGES} photos uploaded
                          {guestImageCount >= MAX_IMAGES && (
                            <span className="ml-1 text-destructive font-medium">· Limit reached</span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <input
                          value={memGuestSearch}
                          onChange={(e) => setMemGuestSearch(e.target.value)}
                          placeholder="Type your mobile number (ex: 07xxxxxxxx)"
                          inputMode="tel"
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
                                onClick={() => {
                                  setSelectedGuest(g.id);
                                  setSelectedGuestName(g.guest_name);
                                  setMemGuestSearch("");
                                  setMemGuestResults([]);
                                  setHasMemSearched(false);
                                  setGuestImageCount(g.image_count ?? 0);
                                }}
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
                    <p className="text-xs text-muted-foreground">Enter your mobile number to identify yourself</p>
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
                    onClick={() => guestImageCount < MAX_IMAGES && fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (guestImageCount < MAX_IMAGES) setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      if (guestImageCount >= MAX_IMAGES) {
                        e.preventDefault();
                        return;
                      }
                      handleDrop(e);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
                      guestImageCount >= MAX_IMAGES
                        ? "border-border bg-muted/30 cursor-not-allowed opacity-60"
                        : dragOver
                          ? "border-primary bg-primary/5 cursor-pointer"
                          : "border-border bg-card/50 hover:border-primary/30 cursor-pointer"
                    }`}
                  >
                    {guestImageCount >= MAX_IMAGES ? (
                      <>
                        <Check className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">Upload limit reached</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You've uploaded the maximum {MAX_IMAGES} photos for this event.
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">Drag &amp; drop photos here</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          or click to browse · max {MAX_MB} MB each · up to {MAX_IMAGES - guestImageCount} more photo
                          {MAX_IMAGES - guestImageCount !== 1 ? "s" : ""}
                        </p>
                      </>
                    )}
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
                      <p className="text-xs text-muted-foreground mb-2">{pendingFiles.length} photo(s) selected</p>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {previewUrls.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(i);
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-card/90 flex items-center justify-center"
                            >
                              <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {isUploading ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Loader2 className="h-3 w-3 animate-spin" /> Uploading photo {uploadCurrent} of{" "}
                              {uploadTotal}...
                            </span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-gold transition-all duration-300 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleUpload}
                          disabled={!selectedGuest}
                          className="w-full py-3 rounded-xl bg-gradient-gold text-primary-foreground font-medium text-sm disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          Upload Photos
                        </button>
                      )}
                      {!selectedGuest && !isUploading && (
                        <p className="text-xs text-destructive mt-1.5 text-center">Please select your name first</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <div className="w-full border-t border-border/40 mt-8">
        <WatermarkFooter />
      </div>
    </>
  );
};
