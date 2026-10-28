import { useState, useRef } from "react";
import { Eye, Save, Check, Music, Upload, Trash2, Play, Pause, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { invitationTemplates, typographyOptions, typographyCategories, getTypographyOption, CINEMATIC_TEMPLATE_KEY, CRIMSON_TEMPLATE_KEY, type InvitationTemplate, type TypographyOption } from "@/data/invitationConstants";
import { typographyStyle, useTypographyFonts } from "@/lib/typography";
import { getSolidTheme } from "@/data/invitationThemes";
import { SolidHeroPreview } from "@/components/invitation/SolidInvitation";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { toast } from "@/components/ui/sonner";

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
  onSaved?: () => void;
}

/** Compact preview for the cinematic design (matches its envelope-reveal palette). */
function CinematicHeroPreview({ brideName, groomName, typography }: { brideName: string; groomName: string; typography: TypographyOption }) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-1 px-3 text-center"
      style={{ background: "radial-gradient(circle at center, #2a1016 0%, #0d0d0d 75%)" }}
    >
      <span className="text-[7px] uppercase tracking-[0.35em]" style={{ color: "#C9A96E" }}>
        Together Forever
      </span>
      <p className="mt-1 text-lg leading-tight" style={{ color: "#FAF7F2", fontFamily: typography.headingFamily }}>
        {brideName}
        <span style={{ color: "#C9A96E" }}> &amp; </span>
        {groomName}
      </p>
    </div>
  );
}

/** Compact preview for Crimson Unveil (crimson gradient, gold star motif). */
function CrimsonHeroPreview({ brideName, groomName, typography }: { brideName: string; groomName: string; typography: TypographyOption }) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-1 px-3 text-center"
      style={{ background: "linear-gradient(135deg, #2a060c 0%, #4a0f18 40%, #681322 70%, #2c0710 100%)" }}
    >
      <span className="text-[7px] uppercase tracking-[0.35em]" style={{ color: "#C9A227" }}>
        A Wedding Invitation
      </span>
      <span className="text-[9px]" style={{ color: "#F8E6A6" }}>&#10022;</span>
      <p className="mt-1 text-lg leading-tight" style={{ color: "#F5E6C8", fontFamily: typography.headingFamily }}>
        {brideName}
        <span style={{ color: "#C9A227" }}> &amp; </span>
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
  onSaved,
}: InvitationDesignPageProps) => {
  void coupleGalleryImages;
  const brideName = weddingData?.bride_name ?? "Bride";
  const groomName = weddingData?.groom_name ?? "Groom";

  const [solidCollapsed, setSolidCollapsed] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = () => {
    setIsSaving(true);
    router.post("/design", {
      template_key: selectedTemplate,
      typography_key: selectedTypography,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        onSaved?.();
        toast.success("Invitation design saved");
      },
      onError: () => toast.error("Could not save the invitation design"),
      onFinish: () => setIsSaving(false),
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

  const selectedTypographyConfig = getTypographyOption(selectedTypography);
  useTypographyFonts(typographyOptions);
  const solidTemplates = invitationTemplates.filter((t) => t.categoryKey === "solid");

  const isCinematic = (key: string) => key === CINEMATIC_TEMPLATE_KEY;

  const renderCardThumb = (template: InvitationTemplate) => {
    if (isCinematic(template.key)) {
      return <CinematicHeroPreview brideName={brideName} groomName={groomName} typography={selectedTypographyConfig} />;
    }
    if (template.key === CRIMSON_TEMPLATE_KEY) {
      return <CrimsonHeroPreview brideName={brideName} groomName={groomName} typography={selectedTypographyConfig} />;
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
    <div className="animate-fade-in space-y-8" style={typographyStyle(selectedTypographyConfig)}>
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

      {/* Typography Selection — applies to every design */}
      <section>
        <h2 className="mb-1 font-display text-xl font-semibold text-foreground">Choose Typography</h2>
        <p className="mb-5 text-sm text-muted-foreground">Pick a font pairing for names, headings and details. It applies to every design.</p>
        <div className="space-y-6">
          {typographyCategories.map((category) => {
            const options = typographyOptions.filter((t) => t.category === category.key);
            if (options.length === 0) return null;
            return (
              <div key={category.key}>
                <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
                  <h3 className="font-display text-base font-semibold text-foreground">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {options.map((typo, i) => {
                    const isSelected = selectedTypography === typo.key;
                    return (
                      <motion.div
                        key={typo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={typographyStyle(typo)}
                        className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${isSelected ? "border-primary shadow-elevated ring-2 ring-primary/20" : "border-border shadow-card hover:border-primary/30"}`}
                        onClick={() => onTypographyChange(typo.key)}
                      >
                        <div className={`${typo.headingFont} mb-3 text-3xl leading-tight text-foreground`}>{brideName} &amp; {groomName}</div>
                        <div className={`${typo.bodyFont} mb-3 text-sm text-muted-foreground`}>Together with their families</div>
                        <div className="mb-3 h-px bg-border" />
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
              </div>
            );
          })}
        </div>
      </section>

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

      {/* Actions */}
      <section className="flex justify-end gap-2">
        <button onClick={() => onNavigate("invitation")} className="flex items-center gap-1.5 rounded-lg bg-gradient-gold px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Eye className="h-3.5 w-3.5" /> Full Preview
        </button>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 rounded-lg bg-gradient-gold px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
          <Save className="h-3.5 w-3.5" /> {isSaving ? "Saving..." : "Save"}
        </button>
      </section>
    </div>
  );
};

export default InvitationDesignPage;
