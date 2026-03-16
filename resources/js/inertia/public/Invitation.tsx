import { usePage } from '@inertiajs/react';
import { PublicInvitationPage } from '@/pages/public/PublicInvitationPage';

export default function Invitation() {
  const { wedding, guest, coupleMainImage, coupleGalleryImages, eventToken, ceremonyEvents, googleMapsLink } = usePage<{
    wedding: any;
    guest: any;
    coupleMainImage: string | null;
    coupleGalleryImages: string[];
    eventToken: string;
    ceremonyEvents: any[];
    googleMapsLink: string | null;
  }>().props;

  const params = new URLSearchParams(window.location.search);
  const templateKey = params.get('template') ?? wedding?.template_key ?? 'faded-picture-overlay';
  const typographyKey = params.get('typography') ?? wedding?.typography_key ?? 'gilded-garamond';

  return (
    <PublicInvitationPage
      templateKey={templateKey}
      typographyKey={typographyKey}
      wedding={wedding}
      guest={guest}
      eventToken={eventToken}
      coupleMainImage={coupleMainImage}
      coupleGalleryImages={coupleGalleryImages ?? []}
      ceremonyEvents={ceremonyEvents ?? []}
      googleMapsLink={googleMapsLink ?? null}
    />
  );
}
