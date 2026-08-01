export interface CeremonyEventInput {
  label: string;
  date: string;
  venue: string;
  start_time: string;
  end_time: string;
  poruwa_time?: string;
  google_maps_link?: string;
}

export interface WeddingInput {
  bride_name: string;
  groom_name: string;
  bride_parents_names: string | null;
  groom_parents_names: string | null;
  contact_number_1: string | null;
  contact_number_2: string | null;
  rsvp_deadline?: string | null;
  background_music_url?: string | null;
  background_music_label?: string | null;
  background_music_enabled?: boolean;
}

export interface GuestInput {
  id: number;
  guest_name: string;
  guest_token: string;
  max_attendees: number;
  rsvp_status: string;
}

export interface InvitationViewModelProps {
  wedding: WeddingInput;
  guest?: GuestInput | null;
  eventToken?: string;
  coupleMainImage?: string | null;
  coupleGalleryImages?: string[];
  ceremonyEvents?: CeremonyEventInput[];
}

export interface GalleryPhoto {
  photo_path: string;
  caption: string;
}

export interface InvitationViewModel {
  groom_name: string;
  bride_name: string;
  groom_parents_names: string;
  bride_parents_names: string;
  contact_number_1: string;
  contact_number_2: string;
  couple_photo: string | null;
  gallery_photos: GalleryPhoto[];
  music_url: string;
  ceremony_events: CeremonyEventInput[];
  rsvp_deadline: string | null;
}

/**
 * Bridges the real Laravel/Inertia props (flexible ceremonyEvents list,
 * combined parents-name strings, no per-person photos) into the flat shape
 * the ported invitation-v2 sections render.
 */
export function buildInvitationViewModel(props: InvitationViewModelProps): InvitationViewModel {
  const w = props.wedding;

  return {
    groom_name: w.groom_name,
    bride_name: w.bride_name,
    groom_parents_names: w.groom_parents_names ?? '',
    bride_parents_names: w.bride_parents_names ?? '',
    contact_number_1: w.contact_number_1 ?? '',
    contact_number_2: w.contact_number_2 ?? '',
    couple_photo: props.coupleMainImage ?? null,
    gallery_photos: (props.coupleGalleryImages ?? []).map((url) => ({ photo_path: url, caption: '' })),
    music_url: w.background_music_enabled ? w.background_music_url ?? '' : '',
    ceremony_events: props.ceremonyEvents ?? [],
    rsvp_deadline: w.rsvp_deadline ?? null,
  };
}
