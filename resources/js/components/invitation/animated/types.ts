export interface CeremonyEvent {
  label: string;
  date: string;
  venue: string;
  start_time: string;
  end_time: string;
  poruwa_time?: string;
  google_maps_link?: string;
}

export interface GuestData {
  id: number;
  guest_name: string;
  guest_token: string;
  max_attendees: number;
  rsvp_status: string;
}

/** What the "Your Table" section shows; computed on the server (App\Support\TableInfoResolver). */
export interface TableInfo {
  /** False when the client does not have Table Management: no Find Table button, no section. */
  enabled: boolean;
  state?: "no_guest" | "before_event" | "unassigned" | "assigned";
  table_name?: string | null;
  event_date?: string | null;
}

export interface WeddingData {
  bride_name: string;
  groom_name: string;
  bride_parents_names: string | null;
  groom_parents_names: string | null;
  wedding_type_id: string;
  contact_number_1: string | null;
  contact_number_2: string | null;
  template_key: string;
  typography_key: string;
  rsvp_deadline?: string | null;
  background_music_url?: string | null;
  background_music_label?: string | null;
}

export interface AnimatedDesignProps {
  wedding: WeddingData;
  guest?: GuestData | null;
  eventToken?: string;
  coupleMainImage?: string | null;
  coupleGalleryImages?: string[];
  ceremonyEvents?: CeremonyEvent[];
  onBack?: () => void;
  typographyKey: string;
}

export const formatTime12 = (t: string | null | undefined): string => {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${mStr} ${ampm}`;
};
