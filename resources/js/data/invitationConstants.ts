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
  {
    id: "tmpl-7",
    key: "blossom-glory",
    name: "Blossom Glory",
    label: "Floral Grandeur",
    description: "Opulent crimson roses and lush emerald leaves cascade from every corner across a warm ivory canvas — a bold declaration of romantic grandeur.",
    colors: ["#FFF8EE", "#8B1A3A", "#C9A96E", "#2E6B45"],
    bgStyle: "bg-[linear-gradient(180deg,#FFF8EE,#F7E5CC)]",
  },
  {
    id: "tmpl-8",
    key: "verdant-whisper",
    name: "Verdant Whisper",
    label: "Botanical Linen",
    description: "Delicate sage eucalyptus sprigs and fern fronds frame a warm linen canvas — airy, organic, and quietly beautiful for those who love understated natural elegance.",
    colors: ["#FEFCF5", "#6A8C5E", "#B5C4A5", "#2C3E25"],
    bgStyle: "bg-[linear-gradient(180deg,#FEFCF5,#EBF0E4)]",
  },
  {
    id: "tmpl-9",
    key: "petal-romance",
    name: "Petal Romance",
    label: "Ivory Peony Grandeur",
    description: "Lush blush peony clusters cascade from every corner of a pure ivory canvas — opulent, feminine, and radiantly grandiose for the most romantic of celebrations.",
    colors: ["#FFF5F8", "#C9607A", "#F9C8D4", "#2E5A36"],
    bgStyle: "bg-[linear-gradient(160deg,#FFF5F8,#F9E8ED)]",
  },
  {
    id: "tmpl-10",
    key: "velvet-dusk",
    name: "Velvet Dusk",
    label: "Purple Night Opulence",
    description: "A richly draped plum-violet invitation with gold star flourishes, geometric mandala rings, and a cinematic couple photo framed in ornate velvet luxury.",
    colors: ["#2C1A2E", "#E8C070", "#C9A0D4", "#F5EEF8"],
    bgStyle: "bg-[linear-gradient(170deg,#2C1A2E,#5C2E5A)]",
  },
  {
    id: "tmpl-11",
    key: "minimal-vow",
    name: "Minimal Vow",
    label: "Sketch & Linen",
    description: "Hand-drawn sketch-style botanical line art on warm linen — deeply understated and artful, for couples who believe simplicity is the ultimate sophistication.",
    colors: ["#FEFEFE", "#8C7860", "#C8B89A", "#26201A"],
    bgStyle: "bg-[linear-gradient(180deg,#FEFEFE,#F2EDE6)]",
  },
  {
    id: "tmpl-12",
    key: "garden-arch",
    name: "Garden Arch",
    label: "Floral Canopy",
    description: "A living floral archway of roses and climbing vines frames your names beneath a pastel garden sky — fresh, joyful, and bursting with natural romance.",
    colors: ["#F4FBF0", "#7EAA5C", "#D8EDD0", "#1E3A16"],
    bgStyle: "bg-[linear-gradient(180deg,#F4FBF0,#D8EDD0)]",
  },
  {
    id: "tmpl-13",
    key: "crimson-velvet",
    name: "Crimson Velvet",
    label: "Maroon & Gold Florals",
    description: "Opulent deep crimson roses and ivory blooms with gold-tipped leaves border a warm ivory canvas — bold, aristocratic, and sumptuously elegant.",
    colors: ["#FFFBF5", "#C43040", "#B8922A", "#1E4228"],
    bgStyle: "bg-[linear-gradient(160deg,#FFFBF5,#FAE8E4)]",
  },
  {
    id: "tmpl-14",
    key: "amber-harvest",
    name: "Amber Harvest",
    label: "Warm Gold & Autumn Leaves",
    description: "Rich amber warmth meets hand-pressed autumn foliage — golden maple leaves and russet acorns frame a creamy ivory invitation with harvest-season romance.",
    colors: ["#FFF8EC", "#D4862A", "#C85020", "#2A3A1A"],
    bgStyle: "bg-[linear-gradient(165deg,#FFF8EC,#F3E0A8)]",
  },
  {
    id: "tmpl-15",
    key: "wisteria-dreams",
    name: "Wisteria Dreams",
    label: "Lilac & Cascading Vines",
    description: "Soft lavender mist and cascading wisteria clusters drift over a pale violet canvas — dreamy, delicate, and perfectly evocative of a French countryside wedding.",
    colors: ["#FAF5FF", "#A080C8", "#7A5A8A", "#2E1A3A"],
    bgStyle: "bg-[linear-gradient(175deg,#FAF5FF,#E6D8F5)]",
  },
  {
    id: "tmpl-16",
    key: "pearl-mist",
    name: "Pearl Mist",
    label: "Silver-White Elegance",
    description: "Flowing ribbon curves and delicate pearl bead strands cascade over a misty silver-white canvas — serene, polished, and ethereally timeless.",
    colors: ["#FAFAFA", "#D8DCE4", "#8892A0", "#2A3040"],
    bgStyle: "bg-[linear-gradient(155deg,#FDFEFF,#E8F2FB)]",
  },
  {
    id: "tmpl-17",
    key: "indigo-royale",
    name: "Indigo Royale",
    label: "Deep Navy & Gold Scrollwork",
    description: "Majestic deep indigo panels adorned with burnished gold scroll corners and a regal crest centerpiece — commanding, opulent, and powerfully grand.",
    colors: ["#0E1628", "#1A2650", "#E8ECF4", "#C8A84A"],
    bgStyle: "bg-[linear-gradient(160deg,#0E1A38,#1C2850)]",
  },
  {
    id: "tmpl-18",
    key: "coral-drift",
    name: "Coral Drift",
    label: "Coral & Terracotta Petals",
    description: "Vibrant hibiscus blooms and scattered coral petals drift across a warm blush-peach canvas — joyful, tropical, and radiantly summery.",
    colors: ["#FFF4F0", "#E8705A", "#C45A3A", "#F5C4B0"],
    bgStyle: "bg-[linear-gradient(170deg,#FFF4F0,#FFD4C4)]",
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
