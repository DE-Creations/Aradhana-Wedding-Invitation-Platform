import { useState, useRef } from "react";
import { Eye, Save, Check, Music, Upload, Trash2, Play, Pause } from "lucide-react";
import {
  invitationTemplates,
  typographyOptions,
  typographyCategories,
  getTypographyOption,
  CINEMATIC_TEMPLATE_KEY,
  CRIMSON_TEMPLATE_KEY,
  SILVER_TEMPLATE_KEY,
  type InvitationTemplate,
  type TypographyCategoryKey,
  type TypographyOption,
} from "@/data/invitationConstants";
import { typographyStyle, useTypographyFonts } from "@/lib/typography";
import { getSolidTheme } from "@/data/invitationThemes";
import { SolidHeroPreview } from "@/components/invitation/SolidInvitation";
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

interface PreviewProps {
  brideName: string;
  groomName: string;
  typography: TypographyOption;
}

/** Compact preview for the cinematic design (matches its envelope-reveal palette). */
function CinematicHeroPreview({ brideName, groomName, typography }: PreviewProps) {
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
function CrimsonHeroPreview({ brideName, groomName, typography }: PreviewProps) {
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

/** Compact preview for Silver Pearl (pearl white, silver-blue frosted card). */
function PearlHeroPreview({ brideName, groomName, typography }: PreviewProps) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center p-3"
      style={{ background: "linear-gradient(160deg, #eef2f8 0%, #dfe7f3 55%, #cdd8ea 100%)" }}
    >
      <div
        className="flex w-full flex-col items-center gap-1 rounded-xl px-2 py-4 text-center"
        style={{ background: "rgba(255,255,255,0.72)", boxShadow: "0 8px 24px rgba(60,80,120,0.18)" }}
      >
        <span className="text-[6px] uppercase tracking-[0.3em]" style={{ color: "#5b7aa6" }}>
          You are invited
        </span>
        <p className="text-lg leading-tight" style={{ color: "#1c2a44", fontFamily: typography.headingFamily }}>
          {brideName}
          <span style={{ color: "#5b7aa6" }}> &amp; </span>
          {groomName}
        </p>
        <span className="mt-1 rounded-full px-2 py-0.5 text-[6px] uppercase tracking-[0.2em] text-white" style={{ background: "#1c2a44" }}>
          Open
        </span>
      </div>
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
  void ceremonyEvents;
  const brideName = weddingData?.bride_name ?? "Bride";
  const groomName = weddingData?.groom_name ?? "Groom";

  const selectedTypographyConfig = getTypographyOption(selectedTypography);
  useTypographyFonts(typographyOptions);
  const [activeCategory, setActiveCategory] = useState<TypographyCategoryKey>(selectedTypographyConfig.category);
  const categoryOptions = typographyOptions.filter((t) => t.category === activeCategory);
  const activeCategoryInfo = typographyCategories.find((c) => c.key === activeCategory);

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

  const renderCardThumb = (template: InvitationTemplate) => {
    const preview = { brideName, groomName, typography: selectedTypographyConfig };
    if (template.key === CINEMATIC_TEMPLATE_KEY) return <CinematicHeroPreview {...preview} />;
    if (template.key === CRIMSON_TEMPLATE_KEY) return <CrimsonHeroPreview {...preview} />;
    if (template.key === SILVER_TEMPLATE_KEY) return <PearlHeroPreview {...preview} />;
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

  return (
    <div className="animate-fade-in space-y-6" style={typographyStyle(selectedTypographyConfig)}>
      {/* Sticky header: Save and Preview stay in reach while choosing */}
      <div className="sticky top-0 z-20 -mx-4 -mt-4 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:-mx-6 md:-mt-6 md:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-bold text-foreground md:text-2xl">Invitation Design</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">Choose your invitation style and typography</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => onNavigate("invitation")}
            className="flex items-center gap-1.5 rounded-lg border border-primary/40 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Eye className="h-4 w-4" />
            <span className="sm:hidden">Preview</span>
            <span className="hidden sm:inline">Full Preview</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Template selection: one swipeable row on phones, a grid on larger screens */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Design</h2>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {invitationTemplates.map((template) => {
            const isSelected = selectedTemplate === template.key;
            return (
              <button
                key={template.id}
                type="button"
                title={template.description}
                onClick={() => onTemplateChange(template.key)}
                className={`w-[9.25rem] shrink-0 snap-start overflow-hidden rounded-xl border-2 bg-card text-left transition-all md:w-auto ${isSelected ? "border-primary shadow-elevated ring-2 ring-primary/20" : "border-border shadow-card hover:border-primary/30"}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted/20 p-1.5">
                  <div className="h-full w-full overflow-hidden rounded-lg">{renderCardThumb(template)}</div>
                  {isSelected && (
                    <div className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="px-2.5 pb-2.5 pt-1.5">
                  <h3 className="truncate font-display text-sm font-semibold text-foreground">{template.name}</h3>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-[10px] text-muted-foreground">{template.label}</p>
                    <div className="flex shrink-0 gap-0.5">
                      {template.colors.slice(0, 3).map((c, ci) => (
                        <span key={ci} className="h-2.5 w-2.5 rounded-full border border-border" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Typography: pick a category, then one of its two pairings */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Typography</h2>
        <div role="tablist" aria-label="Typography categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          {typographyCategories.map((category) => {
            const isActive = category.key === activeCategory;
            const holdsSelection = selectedTypographyConfig.category === category.key;
            return (
              <button
                key={category.key}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${isActive ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
              >
                {category.name}
                {holdsSelection && <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="Contains your current choice" />}
              </button>
            );
          })}
        </div>
        {activeCategoryInfo && <p className="mt-2 text-xs text-muted-foreground">{activeCategoryInfo.description}</p>}

        <div className="mt-3 grid grid-cols-2 gap-3">
          {categoryOptions.map((typo) => {
            const isSelected = selectedTypography === typo.key;
            return (
              <button
                key={typo.id}
                type="button"
                style={typographyStyle(typo)}
                onClick={() => onTypographyChange(typo.key)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${isSelected ? "border-primary shadow-elevated ring-2 ring-primary/20" : "border-border shadow-card hover:border-primary/30"}`}
              >
                <div className={`${typo.headingFont} break-words text-2xl leading-tight text-foreground`}>
                  {brideName} &amp; {groomName}
                </div>
                <div className="mt-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold text-foreground">{typo.name}</h4>
                    <p className="truncate text-[11px] text-muted-foreground">{typo.label}</p>
                  </div>
                  {isSelected && <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Background music: one compact row */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Music className="h-4 w-4 text-muted-foreground" /> Background Music
        </h2>
        <div className="rounded-xl border border-border bg-card p-3 shadow-card">
          {backgroundMusicUrl ? (
            <div className="flex items-center gap-3">
              <button
                onClick={togglePreviewAudio}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                aria-label={previewPlaying ? "Pause preview" : "Play preview"}
              >
                {previewPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio ref={previewAudioRef} src={backgroundMusicUrl} onEnded={() => setPreviewPlaying(false)} preload="none" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{backgroundMusicLabel ?? "Background music"}</p>
                <p className="text-xs text-muted-foreground">Plays when guests open your invitation</p>
              </div>
              <label
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                title="Replace track"
                aria-label="Replace track"
              >
                <Upload className="h-4 w-4" />
                <input ref={musicFileRef} type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a" className="hidden" onChange={handleMusicUpload} disabled={musicUploading} />
              </label>
              <button
                onClick={handleMusicDelete}
                disabled={musicDeleting}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                aria-label="Remove music"
                title="Remove music"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-3 transition-colors ${musicUploading ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Music className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{musicUploading ? "Uploading…" : "Upload your song"}</p>
                <p className="text-xs text-muted-foreground">MP3 or M4A · up to 5 MB</p>
              </div>
              <input ref={musicFileRef} type="file" accept="audio/mpeg,audio/mp4,audio/x-m4a" className="hidden" onChange={handleMusicUpload} disabled={musicUploading} />
            </label>
          )}
        </div>
      </section>
    </div>
  );
};

export default InvitationDesignPage;
