import { useState } from "react";
import { Eye, Check, Smartphone, Monitor } from "lucide-react";
import { invitationTemplates, typographyOptions } from "@/data/invitationConstants";
import { motion } from "framer-motion";

interface WeddingData {
  bride_name?: string;
  groom_name?: string;
  event_date?: string;
  venue_name?: string;
}

interface InvitationDesignPageProps {
  onNavigate: (page: string) => void;
  selectedTemplate: string;
  selectedTypography: string;
  onTemplateChange: (templateKey: string) => void;
  onTypographyChange: (typographyKey: string) => void;
  weddingData?: WeddingData;
  coupleMainImage?: string;
  coupleGalleryImages?: string[];
}

interface TemplateTheme {
  previewClassName: string;
  cardClassName: string;
  labelClassName: string;
  overlay?: React.CSSProperties;
  frameStyle?: React.CSSProperties;
  contentPanelClassName?: string;
  layoutVariant?: "default" | "cameo" | "arch" | "split" | "celestial" | "asymmetric";
  textToneClassName: string;
  subTextToneClassName: string;
  accentToneClassName: string;
  ornament: React.ReactNode;
  topAdornment?: React.ReactNode;
}

const templateThemes: Record<string, TemplateTheme> = {
  "rose-reverie": {
    previewClassName: "bg-[linear-gradient(180deg,#FFF7F6_0%,#F7E2E6_52%,#F5D6DA_100%)]",
    cardClassName: "border-[#E2AFBC]/40 shadow-[0_18px_56px_-30px_rgba(199,106,130,0.32)]",
    labelClassName: "text-[#B95B76]/85",
    layoutVariant: "cameo",
    textToneClassName: "text-[#5E2433]",
    subTextToneClassName: "text-[#7A5561]/85",
    accentToneClassName: "text-[#C76A82]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 18% 18%, rgba(255,255,255,0.75) 0, transparent 26%), radial-gradient(circle at 82% 24%, rgba(226,150,169,0.22) 0, transparent 28%), radial-gradient(circle at 28% 78%, rgba(245,201,171,0.3) 0, transparent 24%), url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D98CA3' stroke-opacity='0.11' stroke-width='2'%3E%3Cpath d='M38 82c10-26 48-33 62-10 14 23-6 51-28 54-26 4-50-26-34-52z'/%3E%3Cpath d='M116 40c8 10 16 22 6 34-10 12-28 8-36-4-7-11-2-28 30-30z'/%3E%3Cpath d='M130 122c-16 10-34 12-48 2-12-8-14-24-2-34 14-13 34-3 44 12 7 16 2 26 6 20z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, auto, 180px 180px",
      backgroundPosition: "center, center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(199,106,130,0.24)",
      borderRadius: "1.8rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/35 backdrop-blur-[2px] border border-white/45 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        <div className="absolute inset-x-8 top-6 h-14 border border-[#D98CA3]/22 border-b-0 rounded-t-[999px]" />
        <div className="absolute -left-2 -top-2 h-28 w-28 opacity-80"><svg viewBox="0 0 160 160" fill="none"><path d="M62 48c12-15 31-18 43-7 14 12 12 33-3 46-15 13-36 13-48 0-12-13-6-29 8-39z" fill="#D97B92" fillOpacity="0.35"/><path d="M44 72c1-21 22-38 45-36 18 1 30 13 31 29 1 18-17 38-42 39-18 1-35-13-34-32z" fill="#F3B6C2" fillOpacity="0.42"/></svg></div>
        <div className="absolute -right-2 bottom-0 h-28 w-28 rotate-180 opacity-80"><svg viewBox="0 0 160 160" fill="none"><path d="M62 48c12-15 31-18 43-7 14 12 12 33-3 46-15 13-36 13-48 0-12-13-6-29 8-39z" fill="#D97B92" fillOpacity="0.35"/><path d="M44 72c1-21 22-38 45-36 18 1 30 13 31 29 1 18-17 38-42 39-18 1-35-13-34-32z" fill="#F3B6C2" fillOpacity="0.42"/></svg></div>
      </>
    ),
    topAdornment: <div className="mt-4 text-[10px] uppercase tracking-[0.42em] text-[#B95B76]/90">Rose Reverie</div>,
  },
  "moonstone-bliss": {
    previewClassName: "bg-[linear-gradient(180deg,#FBF8EF_0%,#EEF3EA_50%,#DDE6D6_100%)]",
    cardClassName: "border-[#D7D9C9]/45 shadow-[0_18px_52px_-30px_rgba(122,142,109,0.28)]",
    labelClassName: "text-[#B89243]/82",
    layoutVariant: "arch",
    textToneClassName: "text-[#495545]",
    subTextToneClassName: "text-[#6D7765]/82",
    accentToneClassName: "text-[#C8A85A]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.82) 0, transparent 24%), radial-gradient(circle at 20% 78%, rgba(199,168,94,0.14) 0, transparent 22%), url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D2B56C' stroke-opacity='0.12' stroke-width='2'%3E%3Cpath d='M20 140c24-46 58-70 90-70s66 24 90 70'/%3E%3Cpath d='M36 154c20-34 50-54 74-54s54 20 74 54'/%3E%3Cpath d='M60 166c14-20 32-30 50-30s36 10 50 30'/%3E%3Cpath d='M46 112c8-8 18-12 28-12 10 0 20 4 28 12'/%3E%3C/g%3E%3Cg fill='%23D2B56C' fill-opacity='0.11'%3E%3Cpath d='M110 92c8 12 16 18 30 24-14 6-22 12-30 24-8-12-16-18-30-24 14-6 22-12 30-24z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 220px 220px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(210,181,108,0.25)",
      borderRadius: "1.65rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/28 backdrop-blur-[2px] border border-white/45 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        <div className="absolute left-1/2 top-1 h-16 w-[72%] -translate-x-1/2 opacity-85"><svg viewBox="0 0 320 120" fill="none"><path d="M28 96c38-48 82-72 132-72s94 24 132 72" stroke="#D2B56C" strokeOpacity="0.34" strokeWidth="2.2"/><path d="M56 100c28-30 66-46 104-46s76 16 104 46" stroke="#D2B56C" strokeOpacity="0.28" strokeWidth="1.8"/></svg></div>
        <div className="absolute left-1/2 bottom-1 h-12 w-[58%] -translate-x-1/2 rotate-180 opacity-70"><svg viewBox="0 0 320 120" fill="none"><path d="M28 96c38-48 82-72 132-72s94 24 132 72" stroke="#A2B58D" strokeOpacity="0.28" strokeWidth="2"/></svg></div>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.42em] text-[#B89243]">Moonstone Bliss</div>,
  },
  "lily-lagoon": {
    previewClassName: "bg-[linear-gradient(180deg,#F3FEFF_0%,#E1F5F7_50%,#D4F1F4_100%)]",
    cardClassName: "border-[#BDE1E4]/45 shadow-[0_18px_52px_-30px_rgba(107,167,184,0.28)]",
    labelClassName: "text-[#5C96A8]/84",
    layoutVariant: "split",
    textToneClassName: "text-[#214B57]",
    subTextToneClassName: "text-[#597984]/82",
    accentToneClassName: "text-[#6BA7B8]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 12% 18%, rgba(255,255,255,0.78) 0, transparent 24%), radial-gradient(circle at 82% 82%, rgba(107,167,184,0.18) 0, transparent 22%), url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236BA7B8' stroke-opacity='0.14' stroke-width='2'%3E%3Cpath d='M14 116c24-32 52-48 84-48 20 0 34 4 48 14'/%3E%3Cpath d='M18 130c26-20 54-30 84-30 18 0 32 3 44 10'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 160px 160px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(107,167,184,0.24)",
      borderRadius: "1.65rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/30 backdrop-blur-[2px] border border-white/45 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        <div className="absolute left-0 top-0 h-30 w-28 opacity-82"><svg viewBox="0 0 160 180" fill="none"><path d="M76 42c10 18 12 35 4 52-9 20-28 30-46 28 6-16 18-33 36-50 3-3 4-6 6-30z" fill="#FFFFFF" fillOpacity="0.88"/><path d="M82 46c18 12 28 26 30 42 3 18-6 34-24 44-6-18-8-38-6-60 0-8 0-14 0-26z" fill="#DDF8FA" fillOpacity="0.92"/><path d="M76 62c-16 8-28 20-34 34-7 16-4 31 8 46 10-16 18-35 24-58 2-7 2-12 2-22z" fill="#EAFDFE" fillOpacity="0.86"/></svg></div>
        <div className="absolute right-0 bottom-0 h-30 w-28 rotate-180 opacity-82"><svg viewBox="0 0 160 180" fill="none"><path d="M76 42c10 18 12 35 4 52-9 20-28 30-46 28 6-16 18-33 36-50 3-3 4-6 6-30z" fill="#FFFFFF" fillOpacity="0.88"/><path d="M82 46c18 12 28 26 30 42 3 18-6 34-24 44-6-18-8-38-6-60 0-8 0-14 0-26z" fill="#DDF8FA" fillOpacity="0.92"/><path d="M76 62c-16 8-28 20-34 34-7 16-4 31 8 46 10-16 18-35 24-58 2-7 2-12 2-22z" fill="#EAFDFE" fillOpacity="0.86"/></svg></div>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.42em] text-[#5C96A8]">Lily Lagoon</div>,
  },
  "faded-picture-overlay": {
    previewClassName: "bg-stone-950",
    cardClassName: "border-stone-300/70 shadow-[0_20px_60px_-26px_rgba(28,28,28,0.55)]",
    labelClassName: "text-stone-200/80 drop-shadow-md",
    layoutVariant: "default",
    textToneClassName: "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
    subTextToneClassName: "text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
    accentToneClassName: "text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
    overlay: {
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    contentPanelClassName: "bg-black/30 backdrop-blur-md border border-white/20 shadow-lg rounded-xl",
    ornament: (
      <>
        <div className="absolute inset-4 border border-white/20 rounded-lg pointer-events-none" />
        <div className="absolute inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </>
    ),
    topAdornment: <div className="text-[11px] uppercase tracking-[0.45em] text-white/90 drop-shadow-md">Photo Story</div>,
  },
  "midnight-celestial": {
    previewClassName: "bg-[linear-gradient(135deg,#1B1434_0%,#121933_54%,#0D1022_100%)]",
    cardClassName: "border-[#F4D37B]/24 shadow-[0_20px_60px_-32px_rgba(8,10,24,0.8)]",
    labelClassName: "text-[#F4D37B]/78",
    layoutVariant: "celestial",
    textToneClassName: "text-[#F9F2E2]",
    subTextToneClassName: "text-[#D8D1C6]/82",
    accentToneClassName: "text-[#F4D37B]",
    overlay: {
      backgroundImage: `radial-gradient(circle at center, rgba(244,211,123,0.1) 0, transparent 32%), radial-gradient(circle at center, rgba(103,73,158,0.16) 0, transparent 52%), url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23F4D37B' stroke-opacity='0.12'%3E%3Ccircle cx='110' cy='110' r='28'/%3E%3Ccircle cx='110' cy='110' r='48'/%3E%3Ccircle cx='110' cy='110' r='68'/%3E%3Cpath d='M110 28l10 22 24 6-18 16 4 24-20-12-20 12 4-24-18-16 24-6z'/%3E%3Cpath d='M110 124l10 22 24 6-18 16 4 24-20-12-20 12 4-24-18-16 24-6z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 220px 220px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(244,211,123,0.22)",
      borderRadius: "1.65rem",
      margin: "0.5rem",
    },
    contentPanelClassName: "bg-[#140d24]/26 backdrop-blur-sm border border-white/10 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        <div className="absolute left-1/2 top-2 h-14 w-[78%] -translate-x-1/2 opacity-90"><svg viewBox="0 0 320 120" fill="none"><path d="M20 84c34-18 64-54 140-54s106 36 140 54" stroke="#F4D37B" strokeOpacity="0.24" strokeWidth="2"/><path d="M48 98c28-12 56-34 112-34s84 22 112 34" stroke="#F4D37B" strokeOpacity="0.18" strokeWidth="1.6"/></svg></div>
        <div className="absolute left-1/2 bottom-2 h-10 w-[68%] -translate-x-1/2 opacity-70"><svg viewBox="0 0 320 120" fill="none"><path d="M30 36c42 22 58 50 130 50s88-28 130-50" stroke="#F4D37B" strokeOpacity="0.18" strokeWidth="2"/></svg></div>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.45em] text-[#F4D37B]">Mandala Noir</div>,
  },
  "saffron-bloom": {
    previewClassName: "bg-[linear-gradient(180deg,#FFF0E2_0%,#FBDAB7_50%,#F6C68D_100%)]",
    cardClassName: "border-[#EDB27C]/40 shadow-[0_18px_54px_-30px_rgba(229,139,91,0.28)]",
    labelClassName: "text-[#D16E47]/82",
    layoutVariant: "asymmetric",
    textToneClassName: "text-[#7B3A2E]",
    subTextToneClassName: "text-[#9A6457]/84",
    accentToneClassName: "text-[#E58B5B]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 16% 20%, rgba(255,255,255,0.72) 0, transparent 24%), radial-gradient(circle at 84% 18%, rgba(229,139,91,0.18) 0, transparent 22%), radial-gradient(circle at 68% 84%, rgba(246,198,141,0.28) 0, transparent 24%), url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23E58B5B' stroke-opacity='0.14' stroke-width='2'%3E%3Cpath d='M24 132c18-38 52-64 92-70 18-2 34 0 48 6'/%3E%3Cpath d='M44 146c18-22 40-34 66-38 22-2 40 2 58 12'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, auto, 180px 180px",
      backgroundPosition: "center, center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(229,139,91,0.24)",
      borderRadius: "1.65rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/26 backdrop-blur-[2px] border border-white/45 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        <div className="absolute -left-1 bottom-0 h-28 w-28 opacity-82"><svg viewBox="0 0 180 180" fill="none"><path d="M76 54c16-20 42-24 58-9 18 15 16 42-4 58-20 17-49 17-64 0-16-17-8-37 10-49z" fill="#E58B5B" fillOpacity="0.3"/><path d="M58 82c2-28 28-50 58-48 24 2 38 18 40 38 1 24-21 49-52 51-23 1-47-17-46-41z" fill="#F7B6A0" fillOpacity="0.36"/></svg></div>
        <div className="absolute right-0 top-0 h-28 w-28 rotate-180 opacity-78"><svg viewBox="0 0 180 180" fill="none"><path d="M76 54c16-20 42-24 58-9 18 15 16 42-4 58-20 17-49 17-64 0-16-17-8-37 10-49z" fill="#E58B5B" fillOpacity="0.3"/><path d="M58 82c2-28 28-50 58-48 24 2 38 18 40 38 1 24-21 49-52 51-23 1-47-17-46-41z" fill="#F7B6A0" fillOpacity="0.36"/></svg></div>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.43em] text-[#D16E47]">Saffron Bloom</div>,
  },
};

export const InvitationDesignPage = ({
  onNavigate,
  selectedTemplate,
  selectedTypography,
  onTemplateChange,
  onTypographyChange,
  weddingData,
  coupleMainImage = "",
  coupleGalleryImages = [],
}: InvitationDesignPageProps) => {
  const brideName = weddingData?.bride_name ?? 'Bride';
  const groomName = weddingData?.groom_name ?? 'Groom';
  const eventDate = weddingData?.event_date
    ? new Date(weddingData.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';
  const venueName = weddingData?.venue_name ?? '';
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const selectedTypographyConfig = typographyOptions.find((typo) => typo.key === selectedTypography) || typographyOptions[0];

  const resolveTheme = (key: string): TemplateTheme => {
    const base = templateThemes[key] || templateThemes["faded-picture-overlay"];
    if (key === "faded-picture-overlay") {
      return {
        ...base,
        overlay: {
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%), url(${coupleMainImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
      };
    }
    return base;
  };

  const selectedTheme = resolveTheme(selectedTemplate);
  const previewCardWidthClass = previewMode === "mobile" ? "w-[320px]" : "w-full max-w-[560px]";

  const renderPreviewHero = (theme: TemplateTheme, compact = false) => {
    const namesMarkup = (
      <p className={`mt-3 mx-auto max-w-[8.5ch] text-[clamp(1.95rem,8vw,2.6rem)] font-bold leading-[0.95] tracking-[-0.04em] ${selectedTypographyConfig.headingFont}`}>
        <span className="block">{brideName}</span>
        <span className={`block py-0.5 text-lg italic tracking-normal font-serif ${theme.accentToneClassName}`}>&</span>
        <span className="block">{groomName}</span>
      </p>
    );

    if (theme.layoutVariant === "cameo") {
      return (
        <div className="w-full text-center">
          {theme.topAdornment}
          <div className={`mx-auto mt-4 w-[82%] overflow-hidden rounded-[999px] border-4 border-white/60 p-1 ${compact ? "max-w-[6.25rem]" : "max-w-[7rem]"}`}>
            <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[999px]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          {namesMarkup}
          <div className={`mx-auto my-4 h-px w-20 bg-current/25 ${theme.accentToneClassName}`} />
          <p className={`${selectedTypographyConfig.bodyFont} text-sm italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-3 text-[10px] uppercase tracking-[0.35em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "arch") {
      return (
        <div className={`w-full rounded-[1.35rem_1.35rem_0.9rem_0.9rem] px-4 py-6 text-center ${theme.contentPanelClassName ?? ""}`}>
          <div className="mx-auto mb-4 w-[82%] max-w-[6.5rem] overflow-hidden rounded-[999px_999px_0.9rem_0.9rem] border border-current/15 p-1">
            <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[999px_999px_0.7rem_0.7rem]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          {theme.topAdornment}
          <p className={`${selectedTypographyConfig.bodyFont} mt-3 text-xs uppercase tracking-[0.3em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          {namesMarkup}
          <p className={`${selectedTypographyConfig.bodyFont} mt-3 text-sm italic ${theme.subTextToneClassName}`}>Together with their families</p>
        </div>
      );
    }

    if (theme.layoutVariant === "split") {
      return (
        <div className="grid w-full items-center gap-3 text-center">
          <div className="mx-auto w-[84%] max-w-[10rem] overflow-hidden rounded-[1.2rem] border border-current/15">
            <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
          </div>
          <div className="mx-auto grid w-full max-w-[150px] grid-cols-3 gap-1.5">
            {coupleGalleryImages.slice(0, 3).map((src, index) => (
              <div key={index} className="overflow-hidden rounded-[0.65rem] border border-current/15">
                <div className="aspect-square overflow-hidden">
                  <img src={src} alt="Gallery preview" className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
          <div>
            {theme.topAdornment}
            {namesMarkup}
            <p className={`${selectedTypographyConfig.bodyFont} mt-3 text-sm italic ${theme.subTextToneClassName}`}>Together with their families</p>
          </div>
        </div>
      );
    }

    if (theme.layoutVariant === "celestial") {
      return (
        <div className={`w-full rounded-[1rem] px-4 py-6 text-center ${theme.contentPanelClassName ?? ""}`}>
          <div className="relative mx-auto mb-4 w-[84%] max-w-[13rem]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[112%] w-[112%] rounded-full border border-[#F4D37B]/18" />
              <div className="absolute h-[88%] w-[88%] rounded-full border border-[#F4D37B]/14" />
            </div>
            <div className="relative overflow-hidden rounded-[999px] border border-[#F4D37B]/18 bg-[#140d24]/30 p-1">
              <div className="aspect-square overflow-hidden rounded-[999px]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          {theme.topAdornment}
          <p className={`${selectedTypographyConfig.bodyFont} mt-3 text-xs uppercase tracking-[0.3em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          {namesMarkup}
          <div className="mx-auto mt-3 flex w-fit items-center gap-2">
            <span className="h-px w-8 bg-current/25" />
            <span className={`text-[10px] uppercase tracking-[0.3em] ${theme.accentToneClassName}`}>Mandala</span>
            <span className="h-px w-8 bg-current/25" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-3 text-sm italic ${theme.subTextToneClassName}`}>Together with their families</p>
        </div>
      );
    }

    if (theme.layoutVariant === "asymmetric") {
      return (
        <div className="grid w-full items-center gap-3 text-center">
          <div>
            {theme.topAdornment}
            {namesMarkup}
            <p className={`${selectedTypographyConfig.bodyFont} mt-3 text-sm italic ${theme.subTextToneClassName}`}>Together with their families</p>
          </div>
          <div className="mx-auto w-[84%] max-w-[10rem] overflow-hidden rounded-[1.35rem_0.8rem_1.4rem_0.8rem] border border-current/15 p-1 rotate-[-5deg]">
            <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[1.1rem_0.6rem_1.1rem_0.6rem] rotate-[5deg]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto flex gap-2">
            {coupleGalleryImages.slice(0, 2).map((src, index) => (
              <div key={index} className={`w-12 overflow-hidden rounded-[0.8rem] border border-current/15 ${index === 0 ? "rotate-[5deg]" : "-rotate-[6deg] mt-3"}`}>
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={src} alt="Gallery preview" className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full rounded-[1rem] px-4 py-6 text-center ${theme.contentPanelClassName ?? ""}`}>
        <p className={`${selectedTypographyConfig.bodyFont} text-xs uppercase tracking-[0.3em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
        {namesMarkup}
        <div className={`mx-auto my-4 h-px w-20 bg-current/25 ${theme.accentToneClassName}`} />
        <p className={`${selectedTypographyConfig.bodyFont} text-sm italic ${theme.subTextToneClassName}`}>Together with their families</p>
        <div className="mx-auto mt-5 w-[84%] max-w-[10rem] overflow-hidden rounded-xl border border-current/15">
          <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
        </div>
        <p className={`${selectedTypographyConfig.bodyFont} mt-4 text-sm ${theme.subTextToneClassName}`}>{[eventDate, venueName].filter(Boolean).join(' · ')}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Invitation Design</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose your invitation style and typography</p>
      </div>

      {/* Template Selection */}
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Choose Your Design</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitationTemplates.map((template, i) => {
            const isSelected = selectedTemplate === template.key;
            const theme = resolveTheme(template.key);
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${isSelected ? "border-primary shadow-elevated ring-2 ring-primary/20" : `${theme.cardClassName} hover:border-primary/30`}`}
                onClick={() => onTemplateChange(template.key)}
              >
                {/* Preview Area */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted/20 p-2">
                  <div className={`relative h-full w-full overflow-hidden rounded-[1.1rem] ${theme.previewClassName}`}>
                    <div className="absolute inset-0" style={theme.overlay} />
                    <div className="absolute inset-0">{theme.ornament}</div>
                    <div className="absolute inset-[12px] rounded-[0.95rem]" style={theme.frameStyle} />
                    <div className={`relative z-10 flex h-full flex-col items-center justify-center p-5 text-center ${theme.textToneClassName}`}>
                      {renderPreviewHero(theme, true)}
                      <p className={`mt-2 text-[10px] tracking-[0.25em] ${theme.labelClassName}`}>{template.label}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-base font-semibold text-foreground">{template.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-body">{template.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                  <div className="flex gap-1.5 mt-3">
                    {template.colors.map((c, ci) => (
                      <div key={ci} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Typography Selection */}
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Choose Typography</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {typographyOptions.map((typo, i) => {
            const isSelected = selectedTypography === typo.key;
            return (
              <motion.div
                key={typo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border-2 p-5 cursor-pointer transition-all ${isSelected ? "border-primary shadow-elevated ring-2 ring-primary/20" : "border-border hover:border-primary/30 shadow-card"}`}
                onClick={() => onTypographyChange(typo.key)}
              >
                <div className={`${typo.sampleClass} text-2xl text-foreground mb-3`}>{brideName} & {groomName}</div>
                <div className={`${typo.bodyFont} text-sm text-muted-foreground mb-3`}>Together with their families</div>
                <div className="ornamental-line mb-3" />
                <h4 className="text-sm font-semibold text-foreground">{typo.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{typo.label}</p>
                {isSelected && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                    <Check className="h-3.5 w-3.5" /> Selected
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Preview Frame */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Preview</h2>
          <div className="flex gap-2">
            <button onClick={() => setPreviewMode("mobile")} className={`p-2 rounded-lg transition-colors ${previewMode === "mobile" ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}>
              <Smartphone className="h-4 w-4" />
            </button>
            <button onClick={() => setPreviewMode("desktop")} className={`p-2 rounded-lg transition-colors ${previewMode === "desktop" ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}>
              <Monitor className="h-4 w-4" />
            </button>
            <button onClick={() => onNavigate("invitation")} className="px-3 py-1.5 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90">
              <Eye className="h-3.5 w-3.5" /> Full Preview
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className={`bg-card border-2 border-border rounded-2xl shadow-elevated overflow-hidden transition-all ${previewMode === "mobile" ? "w-[375px]" : "w-full max-w-3xl"}`}>
            <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border">
              <div className="flex gap-1"><div className="w-2.5 h-2.5 rounded-full bg-destructive/30" /><div className="w-2.5 h-2.5 rounded-full bg-warning/30" /><div className="w-2.5 h-2.5 rounded-full bg-success/30" /></div>
              <div className="flex-1 text-center text-[10px] text-muted-foreground">aradhana.lk/invite/amaya-kavinda-2026</div>
            </div>
            <div className="bg-muted/20 p-5 md:p-8">
              <div className={`relative mx-auto aspect-[3/4] overflow-hidden rounded-[1.4rem] ${previewCardWidthClass} ${selectedTheme.previewClassName}`}>
                <div className="absolute inset-0" style={selectedTheme.overlay} />
                <div className="absolute inset-0">{selectedTheme.ornament}</div>
                <div className="absolute inset-[12px] rounded-[1.1rem]" style={selectedTheme.frameStyle} />
                <div className={`relative z-10 flex h-full items-center justify-center p-4 ${selectedTheme.textToneClassName}`}>
                  <div className="w-full">
                    {renderPreviewHero(selectedTheme)}
                    <div className="mt-4 text-center">
                      <button className="px-6 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium">RSVP Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
