// Static configuration — these are design options, not DB data.

export interface InvitationTemplate {
  id: string;
  key: string;
  name: string;
  label: string;
  description: string;
  colors: string[];
  bgStyle: string;
}

export interface TypographyOption {
  id: string;
  key: string;
  name: string;
  label: string;
  description: string;
  headingFont: string;
  bodyFont: string;
  sampleClass: string;
}

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: "tmpl-1",
    key: "rose-reverie",
    name: "Rose Reverie",
    label: "Blush Garden",
    description: "Soft blush florals with romantic rose clip art, curved arch lines, and a dreamy garden-card feel.",
    colors: ["#FFF7F6", "#C76A82", "#F5D6DA", "#5E2433"],
    bgStyle: "bg-gradient-to-br from-[#FFF7F6] via-[#F7E2E6] to-[#F5D6DA]",
  },
  {
    id: "tmpl-2",
    key: "faded-picture-overlay",
    name: "Photo Story",
    label: "Modern Keepsake",
    description: "A cinematic photo-led invitation with dark glass layers so names and details stay readable even over bright images.",
    colors: ["#000000", "#FFFFFF", "#D4A853", "#1C1C1C"],
    bgStyle: "bg-stone-900",
  },
  {
    id: "tmpl-3",
    key: "moonstone-bliss",
    name: "Moonstone Bliss",
    label: "Sun & Moon Grace",
    description: "Pearl, sage, and gold with Sri Lankan moonstone-style curved bands, lotus symbolism, and flowing vine work.",
    colors: ["#FBF8EF", "#D2B56C", "#DDE6D6", "#4A5A4A"],
    bgStyle: "bg-gradient-to-tr from-[#FBF8EF] via-[#EEF3EA] to-[#DDE6D6]",
  },
  {
    id: "tmpl-4",
    key: "lily-lagoon",
    name: "Lily Lagoon",
    label: "Aqua Romance",
    description: "Sea-glass aqua, white lilies, and flowing wave lines for a fresh tropical Sri Lankan celebration mood.",
    colors: ["#F3FEFF", "#6BA7B8", "#D4F1F4", "#214B57"],
    bgStyle: "bg-gradient-to-b from-[#F3FEFF] via-[#E1F5F7] to-[#D4F1F4]",
  },
  {
    id: "tmpl-5",
    key: "midnight-celestial",
    name: "Midnight Celestial",
    label: "Mandala Noir",
    description: "A dark ornamental invitation with layered mandala geometry, mehndi-style line art, and a rich jewel-toned night palette.",
    colors: ["#1B1434", "#F4D37B", "#0D1022", "#F9F2E2"],
    bgStyle: "bg-gradient-to-tl from-[#1B1434] via-[#121933] to-[#0D1022]",
  },
  {
    id: "tmpl-6",
    key: "saffron-bloom",
    name: "Saffron Bloom",
    label: "Warm Island Floral",
    description: "Coral, saffron, and apricot tones with curved floral vines, rose-lily clip art, and a festive tropical glow.",
    colors: ["#FFF0E2", "#E58B5B", "#F6C68D", "#7B3A2E"],
    bgStyle: "bg-[linear-gradient(135deg,#FFF0E2,#F6C68D)]",
  },
];

export const typographyOptions: TypographyOption[] = [
  {
    id: "typo-1",
    key: "classic-grace",
    name: "Classic Grace",
    label: "Timeless Serif & Sans",
    description: "A refined serif for couple names paired with elegant sans body text. Perfect for traditional and classic invitations.",
    headingFont: "font-display",
    bodyFont: "font-sans",
    sampleClass: "font-display italic",
  },
  {
    id: "typo-2",
    key: "modern-romantic",
    name: "Modern Romantic",
    label: "Lora Serif & Clean Sans",
    description: "Warm Lora serif for couple names with clean body text. Ideal for floral and contemporary designs.",
    headingFont: "font-serif",
    bodyFont: "font-body",
    sampleClass: "font-serif italic",
  },
  {
    id: "typo-3",
    key: "editorial-premium",
    name: "Editorial Premium",
    label: "High-Contrast Serif",
    description: "Sophisticated modern serif system. Minimal and luxurious, perfect for editorial-style invitations.",
    headingFont: "font-editorial",
    bodyFont: "font-classic",
    sampleClass: "font-editorial",
  },
  {
    id: "typo-4",
    key: "ceremonial-sinhala",
    name: "Ceremonial Classic",
    label: "Culturally Rich",
    description: "Classic serif pairing suitable for bilingual Sinhala and English ceremonial layouts.",
    headingFont: "font-classic",
    bodyFont: "font-body",
    sampleClass: "font-classic",
  },
];
