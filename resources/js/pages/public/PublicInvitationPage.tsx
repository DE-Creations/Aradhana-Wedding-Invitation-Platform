import { useState } from "react";
import { typographyOptions, CINEMATIC_TEMPLATE_KEY } from "@/data/invitationConstants";
import { getSolidTheme } from "@/data/invitationThemes";
import { MusicControl } from "@/components/invitation/MusicControl";
import { EnvelopeReveal } from "@/components/invitation/EnvelopeReveal";
import { FloatingPetals } from "@/components/invitation/FloatingPetals";
import { SolidInvitation } from "@/components/invitation/SolidInvitation";
import { useSmoothScroll } from "@/components/invitation/hooks/useSmoothScroll";
import type { WeddingData, CeremonyEvent, GuestData } from "@/components/invitation/animated/types";
import WeddingInvitation from "@/components/invitation-v2/WeddingInvitation";

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
}: PublicInvitationPageProps) => {
  const w = wedding;
  const selectedTypography = typographyOptions.find((t) => t.key === typographyKey) || typographyOptions[0];
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
      />
    );
  }

  const envelopeOverlay = !revealed ? (
    <EnvelopeReveal
      brideName={w.bride_name}
      groomName={w.groom_name}
      onReveal={handleReveal}
      accent={solidTheme.accentHex}
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
    revealed && w.background_music_url && w.background_music_enabled ? (
      <MusicControl src={w.background_music_url} label={w.background_music_label} autoPlay />
    ) : null;

  // ── Solid designs: borderless, full-bleed, scroll-animated ──────────────────
  return (
    <>
      {envelopeOverlay}
      {backButton}
      {musicControl}
      <FloatingPetals colors={solidTheme.petalColors} />
      <SolidInvitation
        theme={solidTheme}
        typography={selectedTypography}
        wedding={w}
        guest={guest}
        eventToken={eventToken}
        coupleMainImage={coupleMainImage}
        coupleGalleryImages={coupleGalleryImages}
        ceremonyEvents={ceremonyEvents}
      />
    </>
  );
};

export default PublicInvitationPage;
