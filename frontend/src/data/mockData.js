/*
  Sample invitation data — mirrors the Laravel API response shape so the UI
  can be built and previewed without the backend running.
  The hook falls back to this automatically when the API is unreachable.
*/
export const mockInvitation = {
  id: 1,
  slug: 'vimukthi-and-piumi',
  template: 'royal-wedding',
  groom_name: 'Vimukthi Perera',
  bride_name: 'Piumi Fernando',
  groom_father: 'Mr. Kamal Perera',
  groom_mother: 'Mrs. Nilanthi Perera',
  bride_father: 'Mr. Saman Fernando',
  bride_mother: 'Mrs. Kumari Fernando',
  ceremony_date: '2026-08-15T10:00:00',
  ceremony_venue: "St. Mary's Church",
  ceremony_address: '123 Church Road, Colombo 07',
  ceremony_lat: 6.9147,
  ceremony_lng: 79.8624,
  reception_venue: 'Grand Ballroom, Cinnamon Grand',
  reception_address: '77 Galle Road, Colombo 03',
  reception_time: '2026-08-15T18:00:00',
  reception_lat: 6.9167,
  reception_lng: 79.8487,
  groom_phone: '+94771234567',
  bride_phone: '+94779876543',
  groom_photo:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  bride_photo:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  couple_photo:
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  gallery_photos: [
    {
      photo_path:
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&q=80',
      caption: 'Our first date',
    },
    {
      photo_path:
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1000&q=80',
      caption: 'The proposal',
    },
    {
      photo_path:
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&q=80',
      caption: 'Engagement day',
    },
    {
      photo_path:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&q=80',
      caption: 'Together always',
    },
    {
      photo_path:
        'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1000&q=80',
      caption: 'Forever begins',
    },
  ],
  music_url: '',
  message: 'We would be honored by your gracious presence on our special day.',
  particle_type: 'rose_petals',
  colors: {
    primary: '#0D0D0D',
    accent: '#C9A96E',
    rose: '#8B3A4A',
  },
  guest: {
    name: 'Mr. & Mrs. Fernando',
    token: 'demo-token',
    has_rsvped: false,
    rsvp: null,
  },
}
