// Single source of truth for the SOLID invitation designs.
// Consumed by both the public renderer (SolidInvitation) and the design picker
// (InvitationDesignPage) so styling lives in exactly one place.

export interface SolidTheme {
  key: string;
  name: string;
  /** True when section text sits on a dark canvas (light text). */
  isDark: boolean;
  /** Page canvas behind the stacked sections (below the hero). */
  pageClassName: string;
  /** Gradient scrim laid over the hero photo (text always sits at the bottom). */
  heroScrim: string;
  /** Main body text tone. */
  textToneClassName: string;
  /** Muted / secondary text tone. */
  subTextToneClassName: string;
  /** Accent (gold / rose / etc.) text tone. */
  accentToneClassName: string;
  /** Card surface. */
  surfaceClassName: string;
  /** Softer / translucent surface. */
  softSurfaceClassName: string;
  /** Primary button. */
  buttonClassName: string;
  /** Small pill / chip / label. */
  chipClassName: string;
  /** RSVP modal container. */
  modalClassName: string;
  /** Hairline divider colour. */
  dividerClassName: string;
  /** Raw accent hex (SVG strokes, petal tint). */
  accentHex: string;
  /** Floating-petal palette. */
  petalColors: string[];
  /** Four-colour swatch shown in the picker. */
  swatches: string[];
}

export const SOLID_THEMES: Record<string, SolidTheme> = {
  "faded-picture-overlay": {
    key: "faded-picture-overlay",
    name: "Photo Story",
    isDark: true,
    pageClassName: "bg-[#0D0D0D]",
    heroScrim:
      "linear-gradient(180deg, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0.55) 55%, rgba(13,13,13,0.96) 100%)",
    textToneClassName: "text-[#FAF7F2]",
    subTextToneClassName: "text-[#FAF7F2]/60",
    accentToneClassName: "text-[#C9A96E]",
    surfaceClassName: "bg-white/[0.04] border border-white/10",
    softSurfaceClassName: "bg-white/[0.02] border border-white/[0.06]",
    buttonClassName: "bg-[#C9A96E] text-[#0D0D0D]",
    chipClassName: "bg-white/10 text-[#E8D5A3] border border-white/15",
    modalClassName: "bg-[#141414] border-white/10",
    dividerClassName: "bg-[#C9A96E]/40",
    accentHex: "#C9A96E",
    petalColors: ["#C9A96E", "#8B3A4A", "#E8D5A3"],
    swatches: ["#0D0D0D", "#C9A96E", "#FAF7F2", "#8B3A4A"],
  },
  "noir-aurelle": {
    key: "noir-aurelle",
    name: "Noir Aurelle",
    isDark: true,
    pageClassName: "bg-[#101014]",
    heroScrim:
      "linear-gradient(180deg, rgba(16,16,20,0.30) 0%, rgba(16,16,20,0.60) 55%, rgba(16,16,20,0.97) 100%)",
    textToneClassName: "text-[#F5F1E8]",
    subTextToneClassName: "text-[#F5F1E8]/55",
    accentToneClassName: "text-[#C9A96E]",
    surfaceClassName: "bg-[#17171d] border border-[#C9A96E]/15",
    softSurfaceClassName: "bg-white/[0.03] border border-[#C9A96E]/10",
    buttonClassName: "bg-[#C9A96E] text-[#101014]",
    chipClassName: "bg-transparent text-[#E8D5A3] border border-[#C9A96E]/40",
    modalClassName: "bg-[#17171d] border-[#C9A96E]/20",
    dividerClassName: "bg-[#C9A96E]/50",
    accentHex: "#C9A96E",
    petalColors: ["#C9A96E", "#E8D5A3", "#8a7a52"],
    swatches: ["#101014", "#C9A96E", "#E8D5A3", "#F5F1E8"],
  },
  "blush-atelier": {
    key: "blush-atelier",
    name: "Blush Atelier",
    isDark: false,
    pageClassName: "bg-[#FBF6F2]",
    heroScrim:
      "linear-gradient(180deg, rgba(70,40,44,0.10) 0%, rgba(70,40,44,0.35) 55%, rgba(70,40,44,0.85) 100%)",
    textToneClassName: "text-[#5E3138]",
    subTextToneClassName: "text-[#5E3138]/65",
    accentToneClassName: "text-[#B0707A]",
    surfaceClassName: "bg-white border border-[#E9C7C0]",
    softSurfaceClassName: "bg-[#F6E7E2]/60 border border-[#E9C7C0]/60",
    buttonClassName: "bg-[#C98A93] text-white",
    chipClassName: "bg-white/70 text-[#B0707A] border border-[#E9C7C0]",
    modalClassName: "bg-white border-[#E9C7C0]",
    dividerClassName: "bg-[#C98A93]/45",
    accentHex: "#C98A93",
    petalColors: ["#C98A93", "#E9C7C0", "#F3DDD8"],
    swatches: ["#FBF6F2", "#C98A93", "#E9C7C0", "#5E3138"],
  },
  "sage-botanica": {
    key: "sage-botanica",
    name: "Sage Botanica",
    isDark: false,
    pageClassName: "bg-[#F6F4EC]",
    heroScrim:
      "linear-gradient(180deg, rgba(30,40,28,0.10) 0%, rgba(30,40,28,0.35) 55%, rgba(30,40,28,0.85) 100%)",
    textToneClassName: "text-[#2E3A2A]",
    subTextToneClassName: "text-[#2E3A2A]/60",
    accentToneClassName: "text-[#6E8B6A]",
    surfaceClassName: "bg-white border border-[#D6DEC9]",
    softSurfaceClassName: "bg-[#E9EEDD]/60 border border-[#D6DEC9]/70",
    buttonClassName: "bg-[#6E8B6A] text-white",
    chipClassName: "bg-white/70 text-[#5B7457] border border-[#D6DEC9]",
    modalClassName: "bg-white border-[#D6DEC9]",
    dividerClassName: "bg-[#C67B5C]/50",
    accentHex: "#C67B5C",
    petalColors: ["#6E8B6A", "#C67B5C", "#B8C7A6"],
    swatches: ["#F6F4EC", "#6E8B6A", "#C67B5C", "#2E3A2A"],
  },
  "azure-lumiere": {
    key: "azure-lumiere",
    name: "Azure Lumiere",
    isDark: false,
    pageClassName: "bg-[#F5F8FB]",
    heroScrim:
      "linear-gradient(180deg, rgba(20,30,45,0.10) 0%, rgba(20,30,45,0.35) 55%, rgba(20,30,45,0.85) 100%)",
    textToneClassName: "text-[#23324A]",
    subTextToneClassName: "text-[#23324A]/60",
    accentToneClassName: "text-[#5E7EA0]",
    surfaceClassName: "bg-white border border-[#DCE4EE]",
    softSurfaceClassName: "bg-[#E8EFF7]/70 border border-[#DCE4EE]",
    buttonClassName: "bg-[#6E8FB0] text-white",
    chipClassName: "bg-white/70 text-[#5E7EA0] border border-[#DCE4EE]",
    modalClassName: "bg-white border-[#DCE4EE]",
    dividerClassName: "bg-[#6E8FB0]/45",
    accentHex: "#6E8FB0",
    petalColors: ["#6E8FB0", "#AEB8C4", "#D3E0EC"],
    swatches: ["#F5F8FB", "#6E8FB0", "#AEB8C4", "#23324A"],
  },
  "plum-velvet": {
    key: "plum-velvet",
    name: "Plum Velvet",
    isDark: true,
    pageClassName: "bg-[#241426]",
    heroScrim:
      "linear-gradient(180deg, rgba(36,20,38,0.25) 0%, rgba(36,20,38,0.55) 55%, rgba(36,20,38,0.97) 100%)",
    textToneClassName: "text-[#F3E8F6]",
    subTextToneClassName: "text-[#F3E8F6]/60",
    accentToneClassName: "text-[#D8B26A]",
    surfaceClassName: "bg-white/[0.05] border border-[#D8B26A]/18",
    softSurfaceClassName: "bg-white/[0.03] border border-[#C9A0D4]/15",
    buttonClassName: "bg-[#D8B26A] text-[#241426]",
    chipClassName: "bg-transparent text-[#E7CE90] border border-[#D8B26A]/40",
    modalClassName: "bg-[#2E1A30] border-[#D8B26A]/20",
    dividerClassName: "bg-[#D8B26A]/45",
    accentHex: "#D8B26A",
    petalColors: ["#D8B26A", "#C9A0D4", "#E7CE90"],
    swatches: ["#241426", "#D8B26A", "#C9A0D4", "#F3E8F6"],
  },
};

export const SOLID_THEME_KEYS = Object.keys(SOLID_THEMES);

export const DEFAULT_SOLID_KEY = "faded-picture-overlay";

/** Resolve a template key to a solid theme, falling back to Photo Story. */
export function getSolidTheme(key: string | null | undefined): SolidTheme {
  return (key && SOLID_THEMES[key]) || SOLID_THEMES[DEFAULT_SOLID_KEY];
}
