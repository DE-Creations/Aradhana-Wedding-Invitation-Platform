import { useState, useRef } from "react";
import { Eye, Check, Smartphone, Monitor, Music, Upload, Trash2, Play, Pause, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { invitationTemplates, typographyOptions, CINEMATIC_TEMPLATE_KEY, type InvitationTemplate } from "@/data/invitationConstants";
import { getSolidTheme, SOLID_THEMES } from "@/data/invitationThemes";
import { SolidHeroPreview } from "@/components/invitation/SolidInvitation";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";

interface WeddingData {
  bride_name?: string;
  groom_name?: string;
  event_date?: string;
  venue_name?: string;
  event_token?: string;
}

type CeremonyEvent = {
  label: string;
  date: string;
  venue: string;
  start_time: string;
  end_time: string;
  google_maps_link?: string;
};

interface InvitationDesignPageProps {
  onNavigate: (page: string) => void;
  selectedTemplate: string;
  selectedTypography: string;
  onTemplateChange: (templateKey: string) => void;
  onTypographyChange: (typographyKey: string) => void;
  weddingData?: WeddingData;
  coupleMainImage?: string;
  coupleGalleryImages?: string[];
  ceremonyEvents?: CeremonyEvent[];
  backgroundMusicUrl?: string | null;
  backgroundMusicLabel?: string | null;
  backgroundMusicEnabled?: boolean;
}

/** Compact preview for the cinematic design (matches its envelope-reveal palette). */
function CinematicHeroPreview({ brideName, groomName }: { brideName: string; groomName: string }) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-1 px-3 text-center"
      style={{ background: "radial-gradient(circle at center, #2a1016 0%, #0d0d0d 75%)" }}
    >
      <span className="text-[7px] uppercase tracking-[0.35em]" style={{ color: "#C9A96E" }}>
        Together Forever
      </span>
      <p className="mt-1 text-lg leading-tight" style={{ color: "#FAF7F2", fontFamily: "'Great Vibes', cursive" }}>
        {brideName}
        <span style={{ color: "#C9A96E" }}> &amp; </span>
        {groomName}
      </p>
    </div>
  );
}

export const InvitationDesignPage = ({
  onNavigate,
  selectedTemplate,
  selectedTypography,
  onTemplateChange,
  onTypographyChange,
  weddingData,
  coupleMainImage = "",
  coupleGalleryImages = [],
  ceremonyEvents = [],
  backgroundMusicUrl,
  backgroundMusicLabel,
  backgroundMusicEnabled = true,
}: InvitationDesignPageProps) => {
  void coupleGalleryImages;
  const brideName = weddingData?.bride_name ?? "Bride";
  const groomName = weddingData?.groom_name ?? "Groom";
  const eventDate = weddingData?.event_date
    ? new Date(weddingData.event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";
  const venueName = weddingData?.venue_name ?? "";
  const eventToken = weddingData?.event_token;
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  const [solidCollapsed, setSolidCollapsed] = useState(false);

  const [musicEnabled, setMusicEnabled] = useState(backgroundMusicEnabled);
  const [musicUploading, setMusicUploading] = useState(false);
  const [musicDeleting, setMusicDeleting] = useState(false);
  const musicFileRef = useRef<HTMLInputElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMusicUploading(true);
    const formData = new FormData();
    formData.append("background_music", file);
    router.post("/settings/music", formData, {
      forceFormData: true,
      onFinish: () => setMusicUploading(false),
    });
  };

  const handleMusicDelete = () => {
    if (!confirm("Remove background music?")) return;
    setMusicDeleting(true);
    router.post("/settings/music/destroy", {}, { onFinish: () => setMusicDeleting(false) });
  };

  const handleMusicEnabledToggle = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    router.post("/settings", { background_music_enabled: next, status: "draft" } as Record<string, unknown>, {
      preserveScroll: true,
    });
  };

  const togglePreviewAudio = () => {
    const audio = previewAudioRef.current;
    if (!audio) return;
    if (previewPlaying) {
      audio.pause();
      setPreviewPlaying(false);
    } else {
      audio.play().then(() => setPreviewPlaying(true)).catch(() => {});
    }
  };

  const selectedTypographyConfig = typographyOptions.find((t) => t.key === selectedTypography) || typographyOptions[0];
  const solidTemplates = invitationTemplates.filter((t) => t.categoryKey === "solid");

  const isCinematic = (key: string) => key === CINEMATIC_TEMPLATE_KEY;
  const isSelectedSolid = !isCinematic(selectedTemplate) && !!SOLID_THEMES[selectedTemplate];
  const selectedSolidTheme = getSolidTheme(selectedTemplate);
  const previewCardWidthClass = previewMode === "mobile" ? "w-[320px]" : "w-full max-w-[560px]";

  const renderCardThumb = (template: InvitationTemplate) => {
    if (isCinematic(template.key)) {
      return <CinematicHeroPreview brideName={brideName} groomName={groomName} />;
    }
    return (
      <SolidHeroPreview
        theme={getSolidTheme(template.key)}
        typography={selectedTypographyConfig}
        coupleMainImage={coupleMainImage}
        brideName={brideName}
        groomName={groomName}
      />
    );
  };

  const renderTemplateCard = (template: InvitationTemplate, i: number) => {
    const isSelected = selectedTemplate === template.key;
    return (
      <motion.div
        key={template.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.03 }}
        className={`overflow-hidden rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? "border-primary shadow-elevated ring-2 ring-primary/20" : "border-border hover:border-primary/30 shadow-card"}`}
        onClick={() => onTemplateChange(template.key)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted/20 p-2">
          <div className="relative h-full w-full overflow-hidden rounded-[1.1rem]">
            {renderCardThumb(template)}
          </div>
          {isSelected && (
            <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-foreground">{template.name}</h3>
            <span className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{template.label}</span>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
          <div className="mt-3 flex gap-1.5">
            {template.colors.map((c, ci) => (
              <div key={ci} className="h-5 w-5 rounded-full border border-border" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Invitation Design</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose your invitation style and typography</p>
      </div>

      {/* Template Selection */}
      <section className="space-y-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Choose Your Design</h2>

        {/* Solid Designs */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <button
            type="button"
            onClick={() => setSolidCollapsed((v) => !v)}
            className="flex w-full items-center justify-between bg-card px-5 py-4 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-display text-base font-semibold text-foreground">Solid Designs</p>
                <p className="text-xs text-muted-foreground">Borderless, full-bleed layouts with smooth scroll</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{solidTemplates.length} designs</span>
              {solidCollapsed ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
            </div>
          </button>
          <AnimatePresence initial={false}>
            {!solidCollapsed && (
              <motion.div
                key="solid-grid"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                  {solidTemplates.map((t, i) => renderTemplateCard(t, i))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Typography Selection — Gilded Rose uses its own fixed typography */}
      {isCinematic(selectedTemplate) ? (
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Typography</h2>
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            Gilded Rose uses its own fixed typography (Great Vibes &amp; Playfair Display) — typography selection doesn't apply to this design.
          </div>
        </section>
      ) : (
      <section>
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Choose Typography</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {typographyOptions.map((typo, i) => {
            const isSelected = selectedTypography === typo.key;
            return (
              <motion.div
                key={typo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${isSelected ? "border-primary shadow-elevated ring-2 ring-primary/20" : "border-border shadow-card hover:border-primary/30"}`}
                onClick={() => onTypographyChange(typo.key)}
              >
                <div className={`${typo.sampleClass} mb-3 text-2xl text-foreground`}>{brideName} &amp; {groomName}</div>
                <div className={`${typo.bodyFont} mb-3 text-sm text-muted-foreground`}>Together with their families</div>
                <div className="ornamental-line mb-3" />
                <h4 className="text-sm font-semibold text-foreground">{typo.name}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{typo.label}</p>
                {isSelected && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                    <Check className="h-3.5 w-3.5" /> Selected
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
      )}

      {/* Background Music */}
      <section>
        <h2 className="mb-1 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
          <Music className="h-5 w-5 text-muted-foreground" /> Background Music
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">Add a song that plays when guests open your invitation.</p>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          {backgroundMusicUrl ? (
            <>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                <button
                  onClick={togglePreviewAudio}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                  aria-label={previewPlaying ? "Pause preview" : "Play preview"}
                >
                  {previewPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio ref={previewAudioRef} src={backgroundMusicUrl} onEnded={() => setPreviewPlaying(false)} preload="none" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{backgroundMusicLabel ?? "Background music"}</p>
                  <p className="text-xs text-muted-foreground">Click play to preview</p>
                </div>
                <button
                  onClick={handleMusicDelete}
                  disabled={musicDeleting}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  aria-label="Remove music"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {musicDeleting ? "Removing…" : "Remove"}
                </button>
              </div>

              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-sm text-foreground">Enable on invitation</span>
                <button
                  role="switch"
                  aria-checked={musicEnabled}
                  onClick={handleMusicEnabledToggle}
                  className={`relative h-6 w-11 rounded-full transition-colors ${musicEnabled ? "bg-primary" : "bg-muted-foreground/30"}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${musicEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Replace track:</span>
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                  <Upload className="h-3.5 w-3.5" />
                  {musicUploading ? "Uploading…" : "Choose file"}
                  <input ref={musicFileRef} type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a" className="hidden" onChange={handleMusicUpload} disabled={musicUploading} />
                </label>
              </div>
            </>
          ) : (
            <label className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${musicUploading ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Music className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{musicUploading ? "Uploading…" : "Upload your song"}</p>
                <p className="mt-1 text-xs text-muted-foreground">MP3 or M4A · up to 5 MB · 2–3 min loop recommended</p>
              </div>
              <input ref={musicFileRef} type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a" className="hidden" onChange={handleMusicUpload} disabled={musicUploading} />
            </label>
          )}
        </div>
      </section>

      {/* Preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Preview</h2>
          <div className="flex gap-2">
            <button onClick={() => setPreviewMode("mobile")} className={`rounded-lg p-2 transition-colors ${previewMode === "mobile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
              <Smartphone className="h-4 w-4" />
            </button>
            <button onClick={() => setPreviewMode("desktop")} className={`rounded-lg p-2 transition-colors ${previewMode === "desktop" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
              <Monitor className="h-4 w-4" />
            </button>
            <button onClick={() => onNavigate("invitation")} className="flex items-center gap-1.5 rounded-lg bg-gradient-gold px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              <Eye className="h-3.5 w-3.5" /> Full Preview
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className={`overflow-hidden rounded-2xl border-2 border-border bg-card shadow-elevated transition-all ${previewMode === "mobile" ? "w-[375px]" : "w-full max-w-3xl"}`}>
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
              <div className="flex gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/30" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/30" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/30" />
              </div>
              <div className="flex-1 text-center text-[10px] text-muted-foreground">
                {eventToken ? `${window.location.origin}/invitation/${eventToken}` : "aradhana.lk/invite/preview"}
              </div>
            </div>
            <div className="bg-muted/20 p-5 md:p-8">
              <div className={`relative mx-auto aspect-[9/16] overflow-hidden rounded-[1.4rem] ${previewCardWidthClass}`}>
                {isCinematic(selectedTemplate) ? (
                  <CinematicHeroPreview brideName={brideName} groomName={groomName} />
                ) : isSelectedSolid ? (
                  <SolidHeroPreview
                    theme={selectedSolidTheme}
                    typography={selectedTypographyConfig}
                    coupleMainImage={coupleMainImage}
                    brideName={brideName}
                    groomName={groomName}
                  />
                ) : null}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-center">
                  <p className="text-[10px] text-white/80">{[eventDate, venueName].filter(Boolean).join(" · ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvitationDesignPage;
