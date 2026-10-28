import { useState } from "react";
import { getTypographyOption, CINEMATIC_TEMPLATE_KEY, CRIMSON_TEMPLATE_KEY } from "@/data/invitationConstants";
import { typographyStyle, useTypographyFonts } from "@/lib/typography";
import { getSolidTheme } from "@/data/invitationThemes";
import { MusicControl } from "@/components/invitation/MusicControl";
import { EnvelopeReveal } from "@/components/invitation/EnvelopeReveal";
import { FloatingPetals } from "@/components/invitation/FloatingPetals";
import { SolidInvitation } from "@/components/invitation/SolidInvitation";
import { useSmoothScroll } from "@/components/invitation/hooks/useSmoothScroll";
import type { WeddingData, CeremonyEvent, GuestData, TableInfo } from "@/components/invitation/animated/types";
import WeddingInvitation from "@/components/invitation-v2/WeddingInvitation";
import CrimsonInvitation from "@/components/invitation-v3/WeddingInvitation";
import { CRIMSON_ACCENT, CRIMSON_PETAL_COLORS } from "@/components/invitation-v3/theme";

interface PublicInvitationPageProps {
  onBack?: () => void;
  templateKey: string;
  typographyKey: string;
  wedding: WeddingData;
  guest?: GuestData | null;
  eventToken?: string;
  coupleMainImage?: string | null;
  coupleGalleryImages?: string[];
  ceremonyEvents?: CeremonyEvent[];
  tableInfo?: TableInfo | null;
}

export const PublicInvitationPage = ({
  onBack,
  templateKey,
  typographyKey,
  wedding,
  guest = null,
  eventToken,
  coupleMainImage = "",
  coupleGalleryImages = [],
  ceremonyEvents = [],
  tableInfo = null,
}: PublicInvitationPageProps) => {
  const w = wedding;
  const selectedTypography = getTypographyOption(typographyKey);
  useTypographyFonts([selectedTypography]);
  const solidTheme = getSolidTheme(templateKey);

  // ── Envelope reveal (shown once per session, skipped in preview) ────────────
  const isPreview = !!onBack;
  const revealStorageKey = `aradhana-invite-opened:${eventToken ?? templateKey}`;
  const [revealed, setRevealed] = useState<boolean>(() => {
    if (isPreview) return true;
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(revealStorageKey) === "1";
    } catch {
      return false;
    }
  });
  const handleReveal = () => {
    try {
      sessionStorage.setItem(revealStorageKey, "1");
    } catch {
      /* ignore storage errors (private mode) */
    }
    setRevealed(true);
  };

  useSmoothScroll(revealed);

  // ── Cinematic design: fully self-contained (its own envelope, petals, music) ──
  if (templateKey === CINEMATIC_TEMPLATE_KEY) {
    return (
      <WeddingInvitation
        wedding={w}
        guest={guest}
        eventToken={eventToken}
        coupleMainImage={coupleMainImage}
        coupleGalleryImages={coupleGalleryImages}
        ceremonyEvents={ceremonyEvents}
        typography={selectedTypography}
        tableInfo={tableInfo}
      />
    );
  }

  const isCrimson = templateKey === CRIMSON_TEMPLATE_KEY;

  const envelopeOverlay = !revealed ? (
    <EnvelopeReveal
      brideName={w.bride_name}
      groomName={w.groom_name}
      onReveal={handleReveal}
      accent={isCrimson ? CRIMSON_ACCENT : solidTheme.accentHex}
      {...(isCrimson ? { background: "#2A060C", sealColor: "#8C1D2F" } : {})}
    />
  ) : null;

  const backButton = onBack ? (
    <button
      onClick={onBack}
      className="fixed left-4 top-4 z-50 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-sm text-white shadow-lg backdrop-blur-sm"
    >
      &larr; Back
    </button>
  ) : null;

  const musicControl =
    revealed && w.background_music_url ? (
      <MusicControl src={w.background_music_url} label={w.background_music_label} autoPlay />
    ) : null;

  // ── Solid designs: borderless, full-bleed, scroll-animated ──────────────────
  return (
    <div className="contents" style={typographyStyle(selectedTypography)}>
      {envelopeOverlay}
      {backButton}
      {musicControl}
      <FloatingPetals colors={isCrimson ? CRIMSON_PETAL_COLORS : solidTheme.petalColors} />
      {isCrimson ? (
        <CrimsonInvitation
          wedding={w}
          guest={guest}
          eventToken={eventToken}
          coupleMainImage={coupleMainImage}
          coupleGalleryImages={coupleGalleryImages}
          ceremonyEvents={ceremonyEvents}
          tableInfo={tableInfo}
        />
      ) : (
        <SolidInvitation
          theme={solidTheme}
          typography={selectedTypography}
          wedding={w}
          guest={guest}
          eventToken={eventToken}
          coupleMainImage={coupleMainImage}
          coupleGalleryImages={coupleGalleryImages}
          ceremonyEvents={ceremonyEvents}
          tableInfo={tableInfo}
        />
      )}
    </div>
  );
};

export default PublicInvitationPage;
