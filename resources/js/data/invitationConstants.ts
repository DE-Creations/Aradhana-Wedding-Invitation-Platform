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

export type TypographyCategoryKey = "basic" | "professional" | "fancy" | "modern" | "artistic";

export interface TypographyOption {
  id: string;
  key: string;
  name: string;
  label: string;
  description: string;
  category: TypographyCategoryKey;
  /** Utility classes applied to heading / body text (resolved through the --t-heading / --t-body CSS variables). */
  headingFont: string;
  bodyFont: string;
  /** Raw CSS font-family stacks written to the CSS variables. */
  headingFamily: string;
  bodyFamily: string;
  /** Google Fonts css2 "family" specs this pair needs. */
  googleFonts: string[];
}

export const templateCategories = [
  { key: "solid" as const, name: "Solid Designs", description: "Timeless static layouts" },
];

/** Template key for the cinematic invitation-v2 design (its own full layout, not a SOLID_THEMES entry). */
export const CINEMATIC_TEMPLATE_KEY = "aradhana-cinematic";

/** Template key for the Crimson Unveil design (invitation-v3). */
export const CRIMSON_TEMPLATE_KEY = "crimson-unveil";

/** Template key for the Silver Pearl design (invitation-v4). */
export const SILVER_TEMPLATE_KEY = "silver-pearl";

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
    description: "A wax-seal envelope opening gives way to a parallax hero, live countdown, rose-petal ambiance, and background music — the most immersive design.",
    colors: ["#0D0D0D", "#C9A96E", "#FAF7F2", "#8B3A4A"],
    bgStyle: "bg-[#0D0D0D]",
    categoryKey: "solid",
  },
  {
    id: "tmpl-8",
    key: CRIMSON_TEMPLATE_KEY,
    name: "Crimson Unveil",
    label: "Crimson & Gold",
    description: "A deep crimson cover with glowing gold accents, twinkling stars and an unveil-style opening. Ceremonial, warm and richly ornamented.",
    colors: ["#2A060C", "#681322", "#C9A227", "#F5E6C8"],
    bgStyle: "bg-[#2A060C]",
    categoryKey: "solid",
  },
  {
    id: "tmpl-9",
    key: SILVER_TEMPLATE_KEY,
    name: "Silver Pearl",
    label: "Pearl White & Silver-Blue",
    description: "A light, frosted-glass invitation with a pearl cover card, soft floating orbs, a lineup timeline and a table finder. Calm, modern and mobile-first.",
    colors: ["#F8FAFD", "#C9D3E3", "#5B7AA6", "#1C2A44"],
    bgStyle: "bg-[#EEF2F8]",
    categoryKey: "solid",
  },
];

export const typographyCategories: { key: TypographyCategoryKey; name: string; description: string }[] = [
  { key: "basic", name: "Basic", description: "Simple, friendly and easy to read" },
  { key: "professional", name: "Professional", description: "Formal serif and sans pairings for a polished look" },
  { key: "fancy", name: "Fancy", description: "Flowing calligraphy for names with a refined serif" },
  { key: "modern", name: "Modern", description: "Light, airy signatures and clean sans-serif" },
  { key: "artistic", name: "Artistic", description: "Hand-drawn and delicate, full of personality" },
];

export const DEFAULT_TYPOGRAPHY_KEY = "professional-playfair-montserrat";

const HEADING = "font-t-heading";
const BODY = "font-t-body";

export const typographyOptions: TypographyOption[] = [
  {
    id: "typo-1",
    key: "basic-lora-lato",
    name: "Soft Serif",
    label: "Lora & Lato",
    description: "Warm Lora headings with clean, readable Lato details. Friendly and uncomplicated.",
    category: "basic",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Lora', serif",
    bodyFamily: "'Lato', sans-serif",
    googleFonts: ["Lora:ital,wght@0,400;0,600;1,400", "Lato:wght@300;400;700"],
  },
  {
    id: "typo-2",
    key: "basic-baskerville-raleway",
    name: "Book Classic",
    label: "Libre Baskerville & Raleway",
    description: "A traditional book serif for names with a light, modern Raleway body.",
    category: "basic",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Libre Baskerville', serif",
    bodyFamily: "'Raleway', sans-serif",
    googleFonts: ["Libre Baskerville:ital,wght@0,400;0,700;1,400", "Raleway:wght@300;400;600"],
  },
  {
    id: "typo-3",
    key: "professional-playfair-montserrat",
    name: "Formal Editorial",
    label: "Playfair Display & Montserrat",
    description: "High-contrast Playfair Display with crisp Montserrat for dates, times and venues.",
    category: "professional",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Playfair Display', serif",
    bodyFamily: "'Montserrat', sans-serif",
    googleFonts: ["Playfair Display:wght@400;600;700", "Montserrat:wght@300;400;600"],
  },
  {
    id: "typo-4",
    key: "professional-cinzel-lora",
    name: "Roman Heritage",
    label: "Cinzel & Lora",
    description: "Stately Cinzel capitals paired with a soft Lora body. Traditional and dignified.",
    category: "professional",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Cinzel', serif",
    bodyFamily: "'Lora', serif",
    googleFonts: ["Cinzel:wght@400;600", "Lora:ital,wght@0,400;0,600;1,400"],
  },
  {
    id: "typo-5",
    key: "fancy-great-vibes-playfair",
    name: "Grand Calligraphy",
    label: "Great Vibes & Playfair Display",
    description: "Sweeping Great Vibes names grounded by an elegant Playfair Display body.",
    category: "fancy",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Great Vibes', cursive",
    bodyFamily: "'Playfair Display', serif",
    googleFonts: ["Great Vibes", "Playfair Display:wght@400;600;700"],
  },
  {
    id: "typo-6",
    key: "fancy-allura-lora",
    name: "Romantic Script",
    label: "Allura & Lora",
    description: "Graceful Allura lettering with a gentle Lora body for a romantic feel.",
    category: "fancy",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Allura', cursive",
    bodyFamily: "'Lora', serif",
    googleFonts: ["Allura", "Lora:ital,wght@0,400;0,600;1,400"],
  },
  {
    id: "typo-7",
    key: "modern-sacramento-montserrat",
    name: "Fresh Signature",
    label: "Sacramento & Montserrat",
    description: "A light, casual signature script with clean Montserrat details.",
    category: "modern",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Sacramento', cursive",
    bodyFamily: "'Montserrat', sans-serif",
    googleFonts: ["Sacramento", "Montserrat:wght@300;400;600"],
  },
  {
    id: "typo-8",
    key: "modern-josefin-cormorant",
    name: "Chic Minimal",
    label: "Josefin Sans & Cormorant Garamond",
    description: "Geometric Josefin Sans headings with refined Cormorant Garamond text.",
    category: "modern",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Josefin Sans', sans-serif",
    bodyFamily: "'Cormorant Garamond', serif",
    googleFonts: ["Josefin Sans:wght@300;400;600", "Cormorant Garamond:ital,wght@0,400;0,600;1,400"],
  },
  {
    id: "typo-9",
    key: "artistic-tangerine-cormorant",
    name: "Delicate Ink",
    label: "Tangerine & Cormorant Garamond",
    description: "Fine, pen-drawn Tangerine calligraphy with understated Cormorant Garamond.",
    category: "artistic",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Tangerine', cursive",
    bodyFamily: "'Cormorant Garamond', serif",
    googleFonts: ["Tangerine:wght@400;700", "Cormorant Garamond:ital,wght@0,400;0,600;1,400"],
  },
  {
    id: "typo-10",
    key: "artistic-amatic-lato",
    name: "Hand-Drawn",
    label: "Amatic SC & Lato",
    description: "Playful hand-lettered Amatic SC with friendly Lato. Relaxed and full of character.",
    category: "artistic",
    headingFont: HEADING,
    bodyFont: BODY,
    headingFamily: "'Amatic SC', cursive",
    bodyFamily: "'Lato', sans-serif",
    googleFonts: ["Amatic SC:wght@400;700", "Lato:wght@300;400;700"],
  },
];

/** Resolves a saved typography key, falling back to the default pairing for unknown or empty keys. */
export const getTypographyOption = (key?: string | null): TypographyOption =>
  typographyOptions.find((t) => t.key === key) ??
  typographyOptions.find((t) => t.key === DEFAULT_TYPOGRAPHY_KEY) ??
  typographyOptions[0];
