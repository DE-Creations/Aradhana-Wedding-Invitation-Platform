// Static configuration — these are design options, not DB data.

export type TemplateCategoryKey = "solid";

export interface InvitationTemplate {
  id: string;
  key: string;
  name: string;
  label: string;
  description: string;
  colors: string[];
  bgStyle: string;
  categoryKey: TemplateCategoryKey;
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

export const templateCategories = [
  { key: "solid" as const, name: "Solid Designs", description: "Timeless static layouts" },
];

/** Template key for the cinematic invitation-v2 design (its own full layout, not a SOLID_THEMES entry). */
export const CINEMATIC_TEMPLATE_KEY = "aradhana-cinematic";

export const invitationTemplates: InvitationTemplate[] = [
  {
    // Key kept as "noir-aurelle" for backwards compatibility with weddings that
    // already saved this template_key; only the display name changed to "Photo Story".
    id: "tmpl-2",
    key: "noir-aurelle",
    name: "Photo Story",
    label: "Charcoal & Antique Gold",
    description: "Near-black charcoal with fine antique-gold hairlines and ivory serif type, rose petals drifting past. Understated, editorial, and quietly luxurious.",
    colors: ["#101014", "#C9A96E", "#E8D5A3", "#F5F1E8"],
    bgStyle: "bg-[#101014]",
    categoryKey: "solid",
  },
  {
    id: "tmpl-7",
    key: CINEMATIC_TEMPLATE_KEY,
    name: "Gilded Rose",
    label: "Envelope Reveal & Live Countdown",
    description: "A wax-seal envelope opening gives way to a parallax hero, live countdown, rose-petal ambiance, and background music — the most immersive design. Uses its own fixed typography.",
    colors: ["#0D0D0D", "#C9A96E", "#FAF7F2", "#8B3A4A"],
    bgStyle: "bg-[#0D0D0D]",
    categoryKey: "solid",
  },
];

export const typographyOptions: TypographyOption[] = [
  {
    id: "typo-1",
    key: "enchanted-script",
    name: "Enchanted Script",
    label: "Calligraphy & Warm Lora",
    description: "Sweeping Great Vibes calligraphy for names with warm Lora serif body. Bold, expressive, and unmistakably romantic — perfect for garden and floral ceremonies.",
    headingFont: "font-script",
    bodyFont: "font-serif",
    sampleClass: "font-script",
  },
  {
    id: "typo-2",
    key: "gilded-garamond",
    name: "Gilded Garamond",
    label: "Italic Cormorant & Cinzel Roman",
    description: "Luxurious Cormorant italic names set against Cinzel's structured Roman body. An opulent contrast of flowing grace and timeless authority.",
    headingFont: "font-display italic",
    bodyFont: "font-classic",
    sampleClass: "font-display italic",
  },
  {
    id: "typo-3",
    key: "imperial-roman",
    name: "Imperial Roman",
    label: "Cinzel Capitals & Garamond Body",
    description: "Stately Cinzel capitals with aristocratic Cormorant Garamond body. Majestic and heritage-rich — ideal for grand traditional ceremonies.",
    headingFont: "font-classic",
    bodyFont: "font-display",
    sampleClass: "font-classic",
  },
  {
    id: "typo-4",
    key: "playfair-prestige",
    name: "Playfair Prestige",
    label: "Playfair Display & Warm Lora",
    description: "Bold Playfair Display names with warm Lora serif body. High-contrast editorial sophistication for modern luxe invitations.",
    headingFont: "font-editorial",
    bodyFont: "font-serif",
    sampleClass: "font-editorial",
  },
  {
    id: "typo-5",
    key: "lora-whisper",
    name: "Lora Whisper",
    label: "Lora Italic & Modern Poppins",
    description: "Intimate Lora italic headings with clean Poppins body. Emotionally expressive yet contemporary — warm, refined, and quietly romantic.",
    headingFont: "font-serif italic",
    bodyFont: "font-sans",
    sampleClass: "font-serif italic",
  },
  {
    id: "typo-6",
    key: "garamond-editorial",
    name: "Garamond Editorial",
    label: "Cormorant Garamond & Playfair",
    description: "Classic upright Cormorant Garamond names with elegant Playfair Display body. Understated luxury with a timeless editorial finish.",
    headingFont: "font-display",
    bodyFont: "font-editorial",
    sampleClass: "font-display",
  },
];
