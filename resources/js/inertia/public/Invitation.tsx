import { usePage } from '@inertiajs/react';
import { PublicInvitationPage } from '@/pages/public/PublicInvitationPage';
import { DEFAULT_TYPOGRAPHY_KEY } from '@/data/invitationConstants';
import type { TableInfo } from '@/components/invitation/animated/types';

export default function Invitation() {
  const { wedding, guest, coupleMainImage, coupleGalleryImages, eventToken, ceremonyEvents, tableInfo } = usePage<{
    wedding: any;
    guest: any;
    coupleMainImage: string | null;
    coupleGalleryImages: string[];
    eventToken: string;
    ceremonyEvents: any[];
    tableInfo?: TableInfo | null;
  }>().props;

  const params = new URLSearchParams(window.location.search);
  const templateKey = params.get('template') ?? wedding?.template_key ?? 'noir-aurelle';
  const typographyKey = params.get('typography') ?? wedding?.typography_key ?? DEFAULT_TYPOGRAPHY_KEY;

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
      tableInfo={tableInfo ?? null}
    />
  );
}
