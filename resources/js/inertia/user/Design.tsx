import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserShell from '@/inertia/layouts/UserShell';
import { InvitationDesignPage } from '@/pages/user/InvitationDesignPage';

interface DesignProps {
  coupleMainImage: string | null;
  coupleGalleryImages: string[];
  ceremonyEvents: CeremonyEvent[];
  backgroundMusicUrl?: string | null;
  backgroundMusicLabel?: string | null;
  backgroundMusicEnabled?: boolean;
}

interface CeremonyEvent {
  label: string;
  date: string;
  venue: string;
  start_time: string;
  end_time: string;
  google_maps_link?: string;
}

interface AuthWedding {
  template_key?: string;
  typography_key?: string;
  event_token?: string;
  bride_name?: string;
  groom_name?: string;
  event_date?: string;
  venue_name?: string;
}

export default function Design({ coupleMainImage, coupleGalleryImages, ceremonyEvents, backgroundMusicUrl, backgroundMusicLabel, backgroundMusicEnabled }: DesignProps) {
  const { auth } = usePage<{ auth: { wedding: AuthWedding | null } }>().props;
  const [preferences, setPreferences] = useState(() => ({
    templateKey: sessionStorage.getItem('invitation.templateKey') ?? auth?.wedding?.template_key ?? 'noir-aurelle',
    typographyKey: sessionStorage.getItem('invitation.typographyKey') ?? auth?.wedding?.typography_key ?? 'gilded-garamond',
  }));

  const weddingData = auth?.wedding ? {
    bride_name: auth.wedding.bride_name,
    groom_name: auth.wedding.groom_name,
    event_date: auth.wedding.event_date,
    venue_name: auth.wedding.venue_name,
    event_token: auth.wedding.event_token,
  } : undefined;

  return (
    <UserShell currentPage="design">
      <InvitationDesignPage
        onNavigate={(page) => {
          if (page === 'invitation') {
            const params = new URLSearchParams({
              template: preferences.templateKey,
              typography: preferences.typographyKey,
            });
            window.open(`/design/preview?${params.toString()}`, '_blank');
          } else {
            router.visit('/design');
          }
        }}
        selectedTemplate={preferences.templateKey}
        selectedTypography={preferences.typographyKey}
        weddingData={weddingData}
        coupleMainImage={coupleMainImage ?? ''}
        coupleGalleryImages={coupleGalleryImages}
        ceremonyEvents={ceremonyEvents}
        backgroundMusicUrl={backgroundMusicUrl}
        backgroundMusicLabel={backgroundMusicLabel}
        backgroundMusicEnabled={backgroundMusicEnabled}
        onTemplateChange={(templateKey) => {
          sessionStorage.setItem('invitation.templateKey', templateKey);
          setPreferences((current) => ({ ...current, templateKey }));
        }}
        onTypographyChange={(typographyKey) => {
          sessionStorage.setItem('invitation.typographyKey', typographyKey);
          setPreferences((current) => ({ ...current, typographyKey }));
        }}
      />
    </UserShell>
  );
}
