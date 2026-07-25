// Static configuration — these are design options, not DB data.

export type TemplateCategoryKey = "solid" | "animated";
export type AnimationKey = "ink-and-gold" | "celestial-nocturne" | "petal-waltz" | "liquid-bloom" | "golden-filigree";

export interface InvitationTemplate {
  id: string;
  key: string;
  name: string;
  label: string;
  description: string;
  colors: string[];
  bgStyle: string;
  categoryKey: TemplateCategoryKey;
  animation?: AnimationKey;
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
  { key: "solid" as const,    name: "Solid Designs",    description: "Timeless static layouts" },
  { key: "animated" as const, name: "Animated Designs", description: "Living invitations with motion" },
];

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: "tmpl-1",
    key: "faded-picture-overlay",
    name: "Photo Story",
    label: "Cinematic Keepsake",
    description: "A cinematic full-bleed couple photo with layered dark scrims and gold accents — names and details stay crisp over any image. Borderless, scroll-animated, timeless.",
    colors: ["#0D0D0D", "#C9A96E", "#FAF7F2", "#8B3A4A"],
    bgStyle: "bg-[#0D0D0D]",
    categoryKey: "solid",
  },
  {
    id: "tmpl-2",
    key: "noir-aurelle",
    name: "Noir Aurelle",
    label: "Charcoal & Antique Gold",
    description: "Near-black charcoal with fine antique-gold hairlines and ivory serif type. Understated, editorial, and quietly luxurious — a modern black-tie invitation.",
    colors: ["#101014", "#C9A96E", "#E8D5A3", "#F5F1E8"],
    bgStyle: "bg-[#101014]",
    categoryKey: "solid",
  },
  {
    id: "tmpl-3",
    key: "blush-atelier",
    name: "Blush Atelier",
    label: "Ivory & Rose Gold",
    description: "Warm ivory, soft blush and rose-gold accents for a tender, editorial romance. Airy whitespace, gentle reveals, and elegant contrast.",
    colors: ["#FBF6F2", "#C98A93", "#E9C7C0", "#5E3138"],
    bgStyle: "bg-[#FBF6F2]",
    categoryKey: "solid",
  },
  {
    id: "tmpl-4",
    key: "sage-botanica",
    name: "Sage Botanica",
    label: "Linen & Sage Green",
    description: "Natural linen with sage green and terracotta — organic, fresh, and grounded. Perfect for garden and outdoor celebrations.",
    colors: ["#F6F4EC", "#6E8B6A", "#C67B5C", "#2E3A2A"],
    bgStyle: "bg-[#F6F4EC]",
    categoryKey: "solid",
  },
  {
    id: "tmpl-5",
    key: "azure-lumiere",
    name: "Azure Lumiere",
    label: "Soft White & Dusty Blue",
    description: "Airy soft white with dusty blue and silver — modern, serene and light. Clean lines and gentle motion for a contemporary celebration.",
    colors: ["#F5F8FB", "#6E8FB0", "#AEB8C4", "#23324A"],
    bgStyle: "bg-[#F5F8FB]",
    categoryKey: "solid",
  },
  {
    id: "tmpl-6",
    key: "plum-velvet",
    name: "Plum Velvet",
    label: "Aubergine & Champagne Gold",
    description: "Moody aubergine with champagne gold and lilac accents — romantic, rich and dramatic. A velvet-night mood for an unforgettable evening.",
    colors: ["#241426", "#D8B26A", "#C9A0D4", "#F3E8F6"],
    bgStyle: "bg-[#241426]",
    categoryKey: "solid",
  },

  // ── Animated Designs ──────────────────────────────────────────────────────
  {
    id: "tmpl-7",
    key: "ink-and-gold",
    name: "Ink & Gold",
    label: "Self-Drawing Floral Line Art",
    description: "Delicate gold floral line art draws itself on scroll over a warm cream canvas, with a morphing divider, ambient gold dust, and a beating RSVP heart.",
    colors: ["#FBF7EE", "#A8842E", "#C9A96E", "#2A2620"],
    bgStyle: "bg-[linear-gradient(180deg,#FBF7EE,#F3E9D2)]",
    categoryKey: "animated",
    animation: "ink-and-gold",
  },
  {
    id: "tmpl-8",
    key: "celestial-nocturne",
    name: "Celestial Nocturne",
    label: "Night Sky & Constellations",
    description: "A living night-sky gradient with drifting stars, a morphing crescent moon, and a self-drawing constellation that links your names beneath the heavens.",
    colors: ["#0B1026", "#D4B25E", "#E8ECF7", "#161B3D"],
    bgStyle: "bg-[linear-gradient(180deg,#0B1026,#161B3D)]",
    categoryKey: "animated",
    animation: "celestial-nocturne",
  },
  {
    id: "tmpl-9",
    key: "petal-waltz",
    name: "Petal Waltz",
    label: "Falling Petals & Characters",
    description: "Blush petals waltz down the screen while friendly animated bride & groom characters gesture — playful microinteractions throughout for a joyful celebration.",
    colors: ["#FFF2F5", "#C85F7C", "#E89AAE", "#6B2D3C"],
    bgStyle: "bg-[linear-gradient(180deg,#FFF2F5,#FDE3EB)]",
    categoryKey: "animated",
    animation: "petal-waltz",
  },
  {
    id: "tmpl-10",
    key: "liquid-bloom",
    name: "Liquid Bloom",
    label: "Morphing Gradient Blobs",
    description: "Soft morphing gradient blobs drift behind your content with self-drawing underlines and gooey gradient buttons — fluid, modern, and dreamlike.",
    colors: ["#FBF7FB", "#B06A4A", "#F6A77C", "#B79CE8"],
    bgStyle: "bg-[#FBF7FB]",
    categoryKey: "animated",
    animation: "liquid-bloom",
  },
  {
    id: "tmpl-11",
    key: "golden-filigree",
    name: "Golden Filigree",
    label: "Self-Drawing Gold Frames",
    description: "Ornate gold filigree frames draw themselves around each section over deep black, with an ambient shimmer sweep and rich hover microinteractions — pure luxury.",
    colors: ["#0C0B0A", "#C9A96E", "#F3ECDD", "#1a1611"],
    bgStyle: "bg-[radial-gradient(circle_at_50%_0%,#1a1611,#0C0B0A)]",
    categoryKey: "animated",
    animation: "golden-filigree",
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
