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
  // Key kept as "noir-aurelle" for backwards compatibility with weddings that
  // already saved this template_key; only the display name changed to "Photo Story".
  "noir-aurelle": {
    key: "noir-aurelle",
    name: "Photo Story",
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
    petalColors: ["#E8749A", "#F4A9C2", "#FBD9E5"],
    swatches: ["#101014", "#C9A96E", "#E8D5A3", "#F5F1E8"],
  },
};

export const SOLID_THEME_KEYS = Object.keys(SOLID_THEMES);

export const DEFAULT_SOLID_KEY = "noir-aurelle";

/** Resolve a template key to a solid theme, falling back to Photo Story. */
export function getSolidTheme(key: string | null | undefined): SolidTheme {
  return (key && SOLID_THEMES[key]) || SOLID_THEMES[DEFAULT_SOLID_KEY];
}
