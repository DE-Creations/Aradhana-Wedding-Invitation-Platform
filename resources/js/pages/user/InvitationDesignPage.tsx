import { useState } from "react";
import { Eye, Check, Smartphone, Monitor, MapPin } from "lucide-react";
import { invitationTemplates, typographyOptions } from "@/data/invitationConstants";
import { motion } from "framer-motion";

interface WeddingData {
  bride_name?: string;
  groom_name?: string;
  event_date?: string;
  venue_name?: string;
}

type CeremonyEvent = {
  label: string;
  date: string;
  venue: string;
  start_time: string;
  end_time: string;
  google_maps_link?: string;
};

interface InvitationDesignPageProps {
  onNavigate: (page: string) => void;
  selectedTemplate: string;
  selectedTypography: string;
  onTemplateChange: (templateKey: string) => void;
  onTypographyChange: (typographyKey: string) => void;
  weddingData?: WeddingData;
  coupleMainImage?: string;
  coupleGalleryImages?: string[];
  ceremonyEvents?: CeremonyEvent[];
}

interface TemplateTheme {
  previewClassName: string;
  cardClassName: string;
  labelClassName: string;
  overlay?: React.CSSProperties;
  frameStyle?: React.CSSProperties;
  contentPanelClassName?: string;
  layoutVariant?: "default" | "cameo" | "arch" | "split" | "celestial" | "asymmetric" | "blossom" | "botanical" | "petal" | "velvet" | "minimal" | "garden" | "crimson" | "harvest" | "wisteria" | "pearl" | "royale" | "drift";
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
  "blossom-glory": {
    previewClassName: "bg-[linear-gradient(180deg,#FFF8EE_0%,#F9EEDD_55%,#F3E1C0_100%)]",
    cardClassName: "border-[#C9A96E]/42 shadow-[0_18px_52px_-28px_rgba(139,26,58,0.28)]",
    labelClassName: "text-[#8B1A3A]/88",
    layoutVariant: "blossom",
    textToneClassName: "text-[#3D1018]",
    subTextToneClassName: "text-[#6B3040]/82",
    accentToneClassName: "text-[#C9A96E]",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(255,252,240,0.52) 0, transparent 68%)`,
    },
    frameStyle: {
      border: "1px solid rgba(201,169,110,0.38)",
      borderRadius: "1.5rem",
      margin: "0.5rem",
      boxShadow: "inset 0 0 0 5px rgba(255,255,255,0.32)",
    },
    contentPanelClassName: "bg-white/52 backdrop-blur-[2px] border border-[#C9A96E]/28 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 280 420" fill="none" preserveAspectRatio="xMidYMid slice">
          {/* Top-left rose */}
          <g>
            <path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84070" fillOpacity="0.82"/>
            <path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84070" fillOpacity="0.78"/>
            <path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E07090" fillOpacity="0.82"/>
            <path d="M20 48c-2-10 6-22 18-22 12 0 20 10 18 22-2 12-12 18-26 12-6-2-10-8-10-12z" fill="#E07090" fillOpacity="0.78"/>
            <circle cx="44" cy="44" r="13" fill="#9A1840" fillOpacity="0.88"/>
            <circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.9"/>
            <path d="M80 42c-8-2-18 4-18 14s10 16 18 14c9-2 14-10 10-20-2-6-6-8-10-8z" fill="#D05070" fillOpacity="0.7"/>
            <circle cx="78" cy="58" r="9" fill="#AA2050" fillOpacity="0.78"/>
            <circle cx="75" cy="55" r="3.5" fill="#FCC0CC" fillOpacity="0.82"/>
            <path d="M70 6c-4 0-9 4-7 10 1 5 6 8 10 5 5-2 6-8 2-13-1-2-3-2-5-2z" fill="#E07090" fillOpacity="0.76"/>
            <path d="M6 70c0-4 4-9 10-7 5 1 8 6 5 10-2 5-8 6-13 2-2-1-2-3-2-5z" fill="#E07090" fillOpacity="0.76"/>
            <path d="M44 44c5 8 10 20 14 36" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c-8 5-20 10-36 14" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c6-8 16-18 26-26" stroke="#2A6040" strokeWidth="1.3" strokeLinecap="round" opacity="0.55"/>
            <path d="M56 68c4 10 16 18 30 22C78 82 64 74 56 68z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M68 56c10 4 18 16 22 30C82 78 72 64 68 56z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M64 16c2 8 10 14 26 16C80 24 70 18 64 16z" fill="#357050" fillOpacity="0.64"/>
            <path d="M16 64c8 2 14 10 16 26C24 80 18 70 16 64z" fill="#357050" fillOpacity="0.64"/>
            <circle cx="104" cy="32" r="5.5" fill="#F5B0C6" fillOpacity="0.48"/>
            <circle cx="104" cy="32" r="2.2" fill="#D4527C" fillOpacity="0.62"/>
            <circle cx="32" cy="104" r="5.5" fill="#F5B0C6" fillOpacity="0.48"/>
            <circle cx="32" cy="104" r="2.2" fill="#D4527C" fillOpacity="0.62"/>
          </g>
          {/* Top-right rose (mirror X) */}
          <g transform="translate(280,0) scale(-1,1)">
            <path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84070" fillOpacity="0.82"/>
            <path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84070" fillOpacity="0.78"/>
            <path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E07090" fillOpacity="0.82"/>
            <path d="M20 48c-2-10 6-22 18-22 12 0 20 10 18 22-2 12-12 18-26 12-6-2-10-8-10-12z" fill="#E07090" fillOpacity="0.78"/>
            <circle cx="44" cy="44" r="13" fill="#9A1840" fillOpacity="0.88"/>
            <circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.9"/>
            <path d="M80 42c-8-2-18 4-18 14s10 16 18 14c9-2 14-10 10-20-2-6-6-8-10-8z" fill="#D05070" fillOpacity="0.7"/>
            <circle cx="78" cy="58" r="9" fill="#AA2050" fillOpacity="0.78"/>
            <circle cx="75" cy="55" r="3.5" fill="#FCC0CC" fillOpacity="0.82"/>
            <path d="M70 6c-4 0-9 4-7 10 1 5 6 8 10 5 5-2 6-8 2-13-1-2-3-2-5-2z" fill="#E07090" fillOpacity="0.76"/>
            <path d="M6 70c0-4 4-9 10-7 5 1 8 6 5 10-2 5-8 6-13 2-2-1-2-3-2-5z" fill="#E07090" fillOpacity="0.76"/>
            <path d="M44 44c5 8 10 20 14 36" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c-8 5-20 10-36 14" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c6-8 16-18 26-26" stroke="#2A6040" strokeWidth="1.3" strokeLinecap="round" opacity="0.55"/>
            <path d="M56 68c4 10 16 18 30 22C78 82 64 74 56 68z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M68 56c10 4 18 16 22 30C82 78 72 64 68 56z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M64 16c2 8 10 14 26 16C80 24 70 18 64 16z" fill="#357050" fillOpacity="0.64"/>
            <path d="M16 64c8 2 14 10 16 26C24 80 18 70 16 64z" fill="#357050" fillOpacity="0.64"/>
            <circle cx="104" cy="32" r="5.5" fill="#F5B0C6" fillOpacity="0.48"/>
            <circle cx="104" cy="32" r="2.2" fill="#D4527C" fillOpacity="0.62"/>
            <circle cx="32" cy="104" r="5.5" fill="#F5B0C6" fillOpacity="0.48"/>
            <circle cx="32" cy="104" r="2.2" fill="#D4527C" fillOpacity="0.62"/>
          </g>
          {/* Bottom-left rose (mirror Y) */}
          <g transform="translate(0,420) scale(1,-1)">
            <path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84070" fillOpacity="0.82"/>
            <path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84070" fillOpacity="0.78"/>
            <path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E07090" fillOpacity="0.82"/>
            <path d="M20 48c-2-10 6-22 18-22 12 0 20 10 18 22-2 12-12 18-26 12-6-2-10-8-10-12z" fill="#E07090" fillOpacity="0.78"/>
            <circle cx="44" cy="44" r="13" fill="#9A1840" fillOpacity="0.88"/>
            <circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.9"/>
            <path d="M80 42c-8-2-18 4-18 14s10 16 18 14c9-2 14-10 10-20-2-6-6-8-10-8z" fill="#D05070" fillOpacity="0.7"/>
            <circle cx="78" cy="58" r="9" fill="#AA2050" fillOpacity="0.78"/>
            <circle cx="75" cy="55" r="3.5" fill="#FCC0CC" fillOpacity="0.82"/>
            <path d="M70 6c-4 0-9 4-7 10 1 5 6 8 10 5 5-2 6-8 2-13-1-2-3-2-5-2z" fill="#E07090" fillOpacity="0.76"/>
            <path d="M6 70c0-4 4-9 10-7 5 1 8 6 5 10-2 5-8 6-13 2-2-1-2-3-2-5z" fill="#E07090" fillOpacity="0.76"/>
            <path d="M44 44c5 8 10 20 14 36" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c-8 5-20 10-36 14" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c6-8 16-18 26-26" stroke="#2A6040" strokeWidth="1.3" strokeLinecap="round" opacity="0.55"/>
            <path d="M56 68c4 10 16 18 30 22C78 82 64 74 56 68z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M68 56c10 4 18 16 22 30C82 78 72 64 68 56z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M64 16c2 8 10 14 26 16C80 24 70 18 64 16z" fill="#357050" fillOpacity="0.64"/>
            <path d="M16 64c8 2 14 10 16 26C24 80 18 70 16 64z" fill="#357050" fillOpacity="0.64"/>
            <circle cx="104" cy="32" r="5.5" fill="#F5B0C6" fillOpacity="0.48"/>
            <circle cx="104" cy="32" r="2.2" fill="#D4527C" fillOpacity="0.62"/>
            <circle cx="32" cy="104" r="5.5" fill="#F5B0C6" fillOpacity="0.48"/>
            <circle cx="32" cy="104" r="2.2" fill="#D4527C" fillOpacity="0.62"/>
          </g>
          {/* Bottom-right rose (mirror X+Y) */}
          <g transform="translate(280,420) scale(-1,-1)">
            <path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84070" fillOpacity="0.82"/>
            <path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84070" fillOpacity="0.78"/>
            <path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E07090" fillOpacity="0.82"/>
            <path d="M20 48c-2-10 6-22 18-22 12 0 20 10 18 22-2 12-12 18-26 12-6-2-10-8-10-12z" fill="#E07090" fillOpacity="0.78"/>
            <circle cx="44" cy="44" r="13" fill="#9A1840" fillOpacity="0.88"/>
            <circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.9"/>
            <path d="M80 42c-8-2-18 4-18 14s10 16 18 14c9-2 14-10 10-20-2-6-6-8-10-8z" fill="#D05070" fillOpacity="0.7"/>
            <circle cx="78" cy="58" r="9" fill="#AA2050" fillOpacity="0.78"/>
            <circle cx="75" cy="55" r="3.5" fill="#FCC0CC" fillOpacity="0.82"/>
            <path d="M70 6c-4 0-9 4-7 10 1 5 6 8 10 5 5-2 6-8 2-13-1-2-3-2-5-2z" fill="#E07090" fillOpacity="0.76"/>
            <path d="M6 70c0-4 4-9 10-7 5 1 8 6 5 10-2 5-8 6-13 2-2-1-2-3-2-5z" fill="#E07090" fillOpacity="0.76"/>
            <path d="M44 44c5 8 10 20 14 36" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c-8 5-20 10-36 14" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c6-8 16-18 26-26" stroke="#2A6040" strokeWidth="1.3" strokeLinecap="round" opacity="0.55"/>
            <path d="M56 68c4 10 16 18 30 22C78 82 64 74 56 68z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M68 56c10 4 18 16 22 30C82 78 72 64 68 56z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M64 16c2 8 10 14 26 16C80 24 70 18 64 16z" fill="#357050" fillOpacity="0.64"/>
            <path d="M16 64c8 2 14 10 16 26C24 80 18 70 16 64z" fill="#357050" fillOpacity="0.64"/>
            <circle cx="104" cy="32" r="5.5" fill="#F5B0C6" fillOpacity="0.48"/>
            <circle cx="104" cy="32" r="2.2" fill="#D4527C" fillOpacity="0.62"/>
            <circle cx="32" cy="104" r="5.5" fill="#F5B0C6" fillOpacity="0.48"/>
            <circle cx="32" cy="104" r="2.2" fill="#D4527C" fillOpacity="0.62"/>
          </g>
          {/* Inner double-border frame */}
          <rect x="14" y="14" width="252" height="392" rx="22" ry="22" stroke="#C9A96E" strokeOpacity="0.28" strokeWidth="1" fill="none"/>
          <rect x="18" y="18" width="244" height="384" rx="20" ry="20" stroke="#C9A96E" strokeOpacity="0.18" strokeWidth="0.8" fill="none"/>
        </svg>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.42em] text-[#8B1A3A]/88">Blossom Glory</div>,
  },
  "verdant-whisper": {
    previewClassName: "bg-[linear-gradient(180deg,#FEFCF5_0%,#F2F5EC_52%,#E8EDE0_100%)]",
    cardClassName: "border-[#9AB58A]/38 shadow-[0_18px_50px_-28px_rgba(106,140,94,0.26)]",
    labelClassName: "text-[#5A7A4E]/84",
    layoutVariant: "botanical",
    textToneClassName: "text-[#2C3E25]",
    subTextToneClassName: "text-[#4E6244]/82",
    accentToneClassName: "text-[#7A9B6A]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 20%, rgba(255,255,250,0.55) 0, transparent 50%), radial-gradient(circle at 50% 80%, rgba(200,220,185,0.18) 0, transparent 40%)`,
    },
    frameStyle: {
      border: "1px solid rgba(106,140,94,0.22)",
      borderRadius: "1.5rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/38 backdrop-blur-[2px] border border-[#9AB58A]/22 rounded-[0.8rem]",
    ornament: (
      <>
        {/* Top botanical branch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[82%] pointer-events-none" style={{ height: '42px' }}>
          <svg viewBox="0 0 200 56" fill="none" className="h-full w-full">
            <path d="M100 48 Q80 38 58 26 Q38 16 14 8" stroke="#6A8C5E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
            <path d="M100 48 Q120 38 142 26 Q162 16 186 8" stroke="#6A8C5E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
            <ellipse cx="74" cy="30" rx="9" ry="5" transform="rotate(-38 74 30)" fill="#7E9E72" fillOpacity="0.72"/>
            <ellipse cx="70" cy="36" rx="9" ry="5" transform="rotate(-142 70 36)" fill="#6A8C5E" fillOpacity="0.65"/>
            <ellipse cx="54" cy="20" rx="8" ry="4.5" transform="rotate(-35 54 20)" fill="#8FAA7E" fillOpacity="0.68"/>
            <ellipse cx="50" cy="26" rx="8" ry="4.5" transform="rotate(-140 50 26)" fill="#7E9E72" fillOpacity="0.62"/>
            <ellipse cx="32" cy="12" rx="7" ry="4" transform="rotate(-30 32 12)" fill="#6A8C5E" fillOpacity="0.65"/>
            <ellipse cx="28" cy="17" rx="7" ry="4" transform="rotate(-144 28 17)" fill="#95AA82" fillOpacity="0.58"/>
            <ellipse cx="126" cy="30" rx="9" ry="5" transform="rotate(-142 126 30)" fill="#7E9E72" fillOpacity="0.72"/>
            <ellipse cx="130" cy="36" rx="9" ry="5" transform="rotate(-38 130 36)" fill="#6A8C5E" fillOpacity="0.65"/>
            <ellipse cx="146" cy="20" rx="8" ry="4.5" transform="rotate(-145 146 20)" fill="#8FAA7E" fillOpacity="0.68"/>
            <ellipse cx="150" cy="26" rx="8" ry="4.5" transform="rotate(-40 150 26)" fill="#7E9E72" fillOpacity="0.62"/>
            <ellipse cx="168" cy="12" rx="7" ry="4" transform="rotate(-150 168 12)" fill="#6A8C5E" fillOpacity="0.65"/>
            <ellipse cx="172" cy="17" rx="7" ry="4" transform="rotate(-36 172 17)" fill="#95AA82" fillOpacity="0.58"/>
            <circle cx="100" cy="48" r="2.5" fill="#95A870" fillOpacity="0.78"/>
            <circle cx="96" cy="45" r="1.8" fill="#7E9E72" fillOpacity="0.68"/>
            <circle cx="104" cy="45" r="1.8" fill="#7E9E72" fillOpacity="0.68"/>
          </svg>
        </div>
        {/* Bottom botanical branch (mirrored) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[82%] rotate-180 pointer-events-none" style={{ height: '42px' }}>
          <svg viewBox="0 0 200 56" fill="none" className="h-full w-full">
            <path d="M100 48 Q80 38 58 26 Q38 16 14 8" stroke="#6A8C5E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
            <path d="M100 48 Q120 38 142 26 Q162 16 186 8" stroke="#6A8C5E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
            <ellipse cx="74" cy="30" rx="9" ry="5" transform="rotate(-38 74 30)" fill="#7E9E72" fillOpacity="0.72"/>
            <ellipse cx="70" cy="36" rx="9" ry="5" transform="rotate(-142 70 36)" fill="#6A8C5E" fillOpacity="0.65"/>
            <ellipse cx="54" cy="20" rx="8" ry="4.5" transform="rotate(-35 54 20)" fill="#8FAA7E" fillOpacity="0.68"/>
            <ellipse cx="50" cy="26" rx="8" ry="4.5" transform="rotate(-140 50 26)" fill="#7E9E72" fillOpacity="0.62"/>
            <ellipse cx="32" cy="12" rx="7" ry="4" transform="rotate(-30 32 12)" fill="#6A8C5E" fillOpacity="0.65"/>
            <ellipse cx="126" cy="30" rx="9" ry="5" transform="rotate(-142 126 30)" fill="#7E9E72" fillOpacity="0.72"/>
            <ellipse cx="130" cy="36" rx="9" ry="5" transform="rotate(-38 130 36)" fill="#6A8C5E" fillOpacity="0.65"/>
            <ellipse cx="146" cy="20" rx="8" ry="4.5" transform="rotate(-145 146 20)" fill="#8FAA7E" fillOpacity="0.68"/>
            <ellipse cx="150" cy="26" rx="8" ry="4.5" transform="rotate(-40 150 26)" fill="#7E9E72" fillOpacity="0.62"/>
            <ellipse cx="168" cy="12" rx="7" ry="4" transform="rotate(-150 168 12)" fill="#6A8C5E" fillOpacity="0.65"/>
            <circle cx="100" cy="48" r="2.5" fill="#95A870" fillOpacity="0.78"/>
            <circle cx="96" cy="45" r="1.8" fill="#7E9E72" fillOpacity="0.68"/>
            <circle cx="104" cy="45" r="1.8" fill="#7E9E72" fillOpacity="0.68"/>
          </svg>
        </div>
        {/* Left fern frond */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: '90px', width: '22px' }}>
          <svg viewBox="0 0 30 120" fill="none" className="h-full w-full">
            <path d="M15 110 Q14 80 15 50 Q14 20 15 4" stroke="#6A8C5E" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6"/>
            <ellipse cx="10" cy="90" rx="7" ry="3.5" transform="rotate(-130 10 90)" fill="#7E9E72" fillOpacity="0.6"/>
            <ellipse cx="10" cy="72" rx="7" ry="3.5" transform="rotate(-135 10 72)" fill="#6A8C5E" fillOpacity="0.55"/>
            <ellipse cx="10" cy="55" rx="6" ry="3" transform="rotate(-128 10 55)" fill="#8FAA7E" fillOpacity="0.52"/>
            <ellipse cx="11" cy="40" rx="5.5" ry="2.8" transform="rotate(-132 11 40)" fill="#7E9E72" fillOpacity="0.48"/>
            <ellipse cx="12" cy="27" rx="5" ry="2.5" transform="rotate(-130 12 27)" fill="#6A8C5E" fillOpacity="0.44"/>
          </svg>
        </div>
        {/* Right fern frond (mirror) */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 scale-x-[-1] pointer-events-none" style={{ height: '90px', width: '22px' }}>
          <svg viewBox="0 0 30 120" fill="none" className="h-full w-full">
            <path d="M15 110 Q14 80 15 50 Q14 20 15 4" stroke="#6A8C5E" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6"/>
            <ellipse cx="10" cy="90" rx="7" ry="3.5" transform="rotate(-130 10 90)" fill="#7E9E72" fillOpacity="0.6"/>
            <ellipse cx="10" cy="72" rx="7" ry="3.5" transform="rotate(-135 10 72)" fill="#6A8C5E" fillOpacity="0.55"/>
            <ellipse cx="10" cy="55" rx="6" ry="3" transform="rotate(-128 10 55)" fill="#8FAA7E" fillOpacity="0.52"/>
            <ellipse cx="11" cy="40" rx="5.5" ry="2.8" transform="rotate(-132 11 40)" fill="#7E9E72" fillOpacity="0.48"/>
            <ellipse cx="12" cy="27" rx="5" ry="2.5" transform="rotate(-130 12 27)" fill="#6A8C5E" fillOpacity="0.44"/>
          </svg>
        </div>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.44em] text-[#5A7A4E]/86">Verdant Whisper</div>,
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

  // ── NEW TEMPLATES ──────────────────────────────────────────────
  "petal-romance": {
    previewClassName: "bg-[linear-gradient(160deg,#FFF5F8_0%,#FDF0F3_45%,#F9E8ED_100%)]",
    cardClassName: "border-[#E8B4C0]/40 shadow-[0_18px_56px_-28px_rgba(210,100,130,0.28)]",
    labelClassName: "text-[#B5476A]/82",
    layoutVariant: "petal",
    textToneClassName: "text-[#4A1828]",
    subTextToneClassName: "text-[#7E4255]/84",
    accentToneClassName: "text-[#C9607A]",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(255,252,254,0.6) 0, transparent 70%)`,
    },
    frameStyle: {
      border: "1px solid rgba(210,100,130,0.22)",
      borderRadius: "1.5rem",
      margin: "0.45rem",
      boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.38)",
    },
    contentPanelClassName: "bg-white/50 backdrop-blur-[2px] border border-[#E8B4C0]/28 shadow-sm rounded-[0.9rem]",
    ornament: (
      <>
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 280 420" fill="none" preserveAspectRatio="xMidYMid slice">
          {/* Top-left peony cluster */}
          <g>
            <circle cx="16" cy="16" r="26" fill="#F9C8D4" fillOpacity="0.55"/>
            <path d="M44 4C30-2 8 4 4 20s6 30 22 34c16 4 32-6 36-22 4-16-4-28-18-28z" fill="#E8748E" fillOpacity="0.78"/>
            <path d="M4 42C-2 28 4 8 20 4c16-4 30 6 34 22 4 16-6 32-22 36C16 66-2 56 4 42z" fill="#E8748E" fillOpacity="0.72"/>
            <path d="M44 16c-10-2-22 8-20 20 2 14 14 20 26 16 12-4 16-14 8-28-3-5-9-8-14-8z" fill="#F090A8" fillOpacity="0.80"/>
            <path d="M16 44c-2-12 8-24 20-22 14 2 20 14 16 26-4 12-14 16-28 8-5-3-8-9-8-12z" fill="#F090A8" fillOpacity="0.76"/>
            <circle cx="40" cy="40" r="13" fill="#C03060" fillOpacity="0.82"/>
            <circle cx="37" cy="37" r="5" fill="#FFD8E4" fillOpacity="0.88"/>
            {/* Leaves */}
            <path d="M40 40c4 10 8 22 8 40" stroke="#3A6840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M40 40c-10 4-22 8-40 8" stroke="#3A6840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M52 64c2 12 12 22 24 28C66 80 54 70 52 64z" fill="#2E5A36" fillOpacity="0.70"/>
            <path d="M64 52c12 2 22 12 28 24C80 66 70 54 64 52z" fill="#2E5A36" fillOpacity="0.70"/>
            {/* Buds */}
            <circle cx="86" cy="28" r="6" fill="#F5AABE" fillOpacity="0.55"/>
            <circle cx="86" cy="28" r="2.5" fill="#D05070" fillOpacity="0.68"/>
            <circle cx="28" cy="88" r="6" fill="#F5AABE" fillOpacity="0.55"/>
            <circle cx="28" cy="88" r="2.5" fill="#D05070" fillOpacity="0.68"/>
          </g>
          {/* Top-right mirror */}
          <g transform="translate(280,0) scale(-1,1)">
            <circle cx="16" cy="16" r="26" fill="#F9C8D4" fillOpacity="0.55"/>
            <path d="M44 4C30-2 8 4 4 20s6 30 22 34c16 4 32-6 36-22 4-16-4-28-18-28z" fill="#E8748E" fillOpacity="0.78"/>
            <path d="M4 42C-2 28 4 8 20 4c16-4 30 6 34 22 4 16-6 32-22 36C16 66-2 56 4 42z" fill="#E8748E" fillOpacity="0.72"/>
            <path d="M44 16c-10-2-22 8-20 20 2 14 14 20 26 16 12-4 16-14 8-28-3-5-9-8-14-8z" fill="#F090A8" fillOpacity="0.80"/>
            <path d="M16 44c-2-12 8-24 20-22 14 2 20 14 16 26-4 12-14 16-28 8-5-3-8-9-8-12z" fill="#F090A8" fillOpacity="0.76"/>
            <circle cx="40" cy="40" r="13" fill="#C03060" fillOpacity="0.82"/>
            <circle cx="37" cy="37" r="5" fill="#FFD8E4" fillOpacity="0.88"/>
            <path d="M40 40c4 10 8 22 8 40" stroke="#3A6840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M40 40c-10 4-22 8-40 8" stroke="#3A6840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M52 64c2 12 12 22 24 28C66 80 54 70 52 64z" fill="#2E5A36" fillOpacity="0.70"/>
            <path d="M64 52c12 2 22 12 28 24C80 66 70 54 64 52z" fill="#2E5A36" fillOpacity="0.70"/>
            <circle cx="86" cy="28" r="6" fill="#F5AABE" fillOpacity="0.55"/>
            <circle cx="86" cy="28" r="2.5" fill="#D05070" fillOpacity="0.68"/>
            <circle cx="28" cy="88" r="6" fill="#F5AABE" fillOpacity="0.55"/>
            <circle cx="28" cy="88" r="2.5" fill="#D05070" fillOpacity="0.68"/>
          </g>
          {/* Bottom-left mirror */}
          <g transform="translate(0,420) scale(1,-1)">
            <circle cx="16" cy="16" r="26" fill="#F9C8D4" fillOpacity="0.55"/>
            <path d="M44 4C30-2 8 4 4 20s6 30 22 34c16 4 32-6 36-22 4-16-4-28-18-28z" fill="#E8748E" fillOpacity="0.78"/>
            <path d="M4 42C-2 28 4 8 20 4c16-4 30 6 34 22 4 16-6 32-22 36C16 66-2 56 4 42z" fill="#E8748E" fillOpacity="0.72"/>
            <path d="M44 16c-10-2-22 8-20 20 2 14 14 20 26 16 12-4 16-14 8-28-3-5-9-8-14-8z" fill="#F090A8" fillOpacity="0.80"/>
            <path d="M16 44c-2-12 8-24 20-22 14 2 20 14 16 26-4 12-14 16-28 8-5-3-8-9-8-12z" fill="#F090A8" fillOpacity="0.76"/>
            <circle cx="40" cy="40" r="13" fill="#C03060" fillOpacity="0.82"/>
            <circle cx="37" cy="37" r="5" fill="#FFD8E4" fillOpacity="0.88"/>
            <path d="M40 40c4 10 8 22 8 40" stroke="#3A6840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M40 40c-10 4-22 8-40 8" stroke="#3A6840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M52 64c2 12 12 22 24 28C66 80 54 70 52 64z" fill="#2E5A36" fillOpacity="0.70"/>
            <path d="M64 52c12 2 22 12 28 24C80 66 70 54 64 52z" fill="#2E5A36" fillOpacity="0.70"/>
            <circle cx="86" cy="28" r="6" fill="#F5AABE" fillOpacity="0.55"/>
            <circle cx="28" cy="88" r="6" fill="#F5AABE" fillOpacity="0.55"/>
          </g>
          {/* Bottom-right mirror */}
          <g transform="translate(280,420) scale(-1,-1)">
            <circle cx="16" cy="16" r="26" fill="#F9C8D4" fillOpacity="0.55"/>
            <path d="M44 4C30-2 8 4 4 20s6 30 22 34c16 4 32-6 36-22 4-16-4-28-18-28z" fill="#E8748E" fillOpacity="0.78"/>
            <path d="M4 42C-2 28 4 8 20 4c16-4 30 6 34 22 4 16-6 32-22 36C16 66-2 56 4 42z" fill="#E8748E" fillOpacity="0.72"/>
            <path d="M44 16c-10-2-22 8-20 20 2 14 14 20 26 16 12-4 16-14 8-28-3-5-9-8-14-8z" fill="#F090A8" fillOpacity="0.80"/>
            <path d="M16 44c-2-12 8-24 20-22 14 2 20 14 16 26-4 12-14 16-28 8-5-3-8-9-8-12z" fill="#F090A8" fillOpacity="0.76"/>
            <circle cx="40" cy="40" r="13" fill="#C03060" fillOpacity="0.82"/>
            <circle cx="37" cy="37" r="5" fill="#FFD8E4" fillOpacity="0.88"/>
            <path d="M40 40c4 10 8 22 8 40" stroke="#3A6840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M40 40c-10 4-22 8-40 8" stroke="#3A6840" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M52 64c2 12 12 22 24 28C66 80 54 70 52 64z" fill="#2E5A36" fillOpacity="0.70"/>
            <path d="M64 52c12 2 22 12 28 24C80 66 70 54 64 52z" fill="#2E5A36" fillOpacity="0.70"/>
            <circle cx="86" cy="28" r="6" fill="#F5AABE" fillOpacity="0.55"/>
            <circle cx="28" cy="88" r="6" fill="#F5AABE" fillOpacity="0.55"/>
          </g>
          {/* Ornamental gold double-frame */}
          <rect x="14" y="14" width="252" height="392" rx="20" ry="20" stroke="#D4A0B8" strokeOpacity="0.30" strokeWidth="1" fill="none"/>
          <rect x="19" y="19" width="242" height="382" rx="17" ry="17" stroke="#D4A0B8" strokeOpacity="0.18" strokeWidth="0.8" fill="none"/>
          {/* Center top & bottom ornamental dividers */}
          <g transform="translate(90,190)">
            <line x1="0" y1="0" x2="100" y2="0" stroke="#C9607A" strokeOpacity="0.22" strokeWidth="0.8"/>
            <polygon points="50,-4 54,0 50,4 46,0" fill="#C9607A" fillOpacity="0.38"/>
          </g>
        </svg>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.44em] text-[#B5476A]/88">Petal Romance</div>,
  },

  "velvet-dusk": {
    previewClassName: "bg-[linear-gradient(170deg,#2C1A2E_0%,#3D1F3F_40%,#4E2850_75%,#5C2E5A_100%)]",
    cardClassName: "border-[#C9A0D4]/28 shadow-[0_20px_64px_-34px_rgba(80,30,90,0.70)]",
    labelClassName: "text-[#E8CCEE]/80",
    layoutVariant: "velvet",
    textToneClassName: "text-[#F5EEF8]",
    subTextToneClassName: "text-[#D8C8E0]/82",
    accentToneClassName: "text-[#E8C070]",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(200,140,220,0.14) 0, transparent 55%), radial-gradient(ellipse at 50% 85%, rgba(232,192,112,0.10) 0, transparent 40%), url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C9A0D4' stroke-opacity='0.09' stroke-width='1.5'%3E%3Ccircle cx='100' cy='100' r='38'/%3E%3Ccircle cx='100' cy='100' r='58'/%3E%3Ccircle cx='100' cy='100' r='78'/%3E%3Cpath d='M100 22l6 14 16 4-12 10 2 16-12-8-12 8 2-16-12-10 16-4z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 200px 200px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(201,160,212,0.22)",
      borderRadius: "1.6rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-[#2C1A2E]/40 backdrop-blur-sm border border-[#C9A0D4]/18 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        {/* Top flourish */}
        <div className="absolute left-1/2 top-2 h-10 w-[80%] -translate-x-1/2 opacity-90">
          <svg viewBox="0 0 300 60" fill="none" className="h-full w-full">
            <path d="M20 46c28-20 60-36 130-36s102 16 130 36" stroke="#E8C070" strokeOpacity="0.28" strokeWidth="1.8"/>
            <path d="M44 50c24-14 52-26 106-26s82 12 106 26" stroke="#C9A0D4" strokeOpacity="0.22" strokeWidth="1.4"/>
            <path d="M150 12l4 8 9 2-6 6 1 8-8-4-8 4 1-8-6-6 9-2z" fill="#E8C070" fillOpacity="0.32"/>
          </svg>
        </div>
        {/* Bottom flourish */}
        <div className="absolute left-1/2 bottom-2 h-8 w-[70%] -translate-x-1/2 opacity-70">
          <svg viewBox="0 0 300 60" fill="none" className="h-full w-full">
            <path d="M20 14c28 20 60 36 130 36s102-16 130-36" stroke="#C9A0D4" strokeOpacity="0.20" strokeWidth="1.6"/>
            <path d="M150 46l4-8 9-2-6-6 1-8-8 4-8-4 1 8-6 6 9 2z" fill="#E8C070" fillOpacity="0.28"/>
          </svg>
        </div>
        {/* Small corner stars */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 280 420" fill="none">
          <path d="M28 28l3 6 7 1-5 5 1 6-6-4-6 4 1-6-5-5 7-1z" fill="#E8C070" fillOpacity="0.38"/>
          <path d="M252 28l3 6 7 1-5 5 1 6-6-4-6 4 1-6-5-5 7-1z" fill="#E8C070" fillOpacity="0.38"/>
          <path d="M28 392l3 6 7 1-5 5 1 6-6-4-6 4 1-6-5-5 7-1z" fill="#E8C070" fillOpacity="0.38"/>
          <path d="M252 392l3 6 7 1-5 5 1 6-6-4-6 4 1-6-5-5 7-1z" fill="#E8C070" fillOpacity="0.38"/>
          <rect x="14" y="14" width="252" height="392" rx="22" ry="22" stroke="#C9A0D4" strokeOpacity="0.20" strokeWidth="1" fill="none"/>
        </svg>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.45em] text-[#E8CCEE]/86">Velvet Dusk</div>,
  },

  "minimal-vow": {
    previewClassName: "bg-[linear-gradient(180deg,#FEFEFE_0%,#F8F5F0_55%,#F2EDE6_100%)]",
    cardClassName: "border-[#C8B89A]/35 shadow-[0_14px_44px_-24px_rgba(140,120,96,0.22)]",
    labelClassName: "text-[#8C7860]/78",
    layoutVariant: "minimal",
    textToneClassName: "text-[#26201A]",
    subTextToneClassName: "text-[#6A5E52]/82",
    accentToneClassName: "text-[#8C7860]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.45) 0, transparent 70%)`,
    },
    frameStyle: {
      border: "1px solid rgba(140,120,96,0.18)",
      borderRadius: "0.6rem",
      margin: "0.5rem",
    },
    contentPanelClassName: "bg-white/40 backdrop-blur-[1px] border border-[#C8B89A]/20 rounded-[0.5rem]",
    ornament: (
      <>
        {/* Thin sketch-style botanical sprigs – top */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[70%] pointer-events-none" style={{ height: '36px' }}>
          <svg viewBox="0 0 200 48" fill="none" className="h-full w-full">
            <path d="M100 42 Q78 30 52 18 Q30 10 8 6" stroke="#8C7860" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
            <path d="M100 42 Q122 30 148 18 Q170 10 192 6" stroke="#8C7860" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
            <ellipse cx="80" cy="28" rx="8" ry="3.5" transform="rotate(-38 80 28)" fill="none" stroke="#8C7860" strokeWidth="0.9" opacity="0.48"/>
            <ellipse cx="62" cy="18" rx="7" ry="3" transform="rotate(-36 62 18)" fill="none" stroke="#8C7860" strokeWidth="0.9" opacity="0.45"/>
            <ellipse cx="42" cy="11" rx="6" ry="2.8" transform="rotate(-30 42 11)" fill="none" stroke="#8C7860" strokeWidth="0.8" opacity="0.42"/>
            <ellipse cx="120" cy="28" rx="8" ry="3.5" transform="rotate(-142 120 28)" fill="none" stroke="#8C7860" strokeWidth="0.9" opacity="0.48"/>
            <ellipse cx="138" cy="18" rx="7" ry="3" transform="rotate(-144 138 18)" fill="none" stroke="#8C7860" strokeWidth="0.9" opacity="0.45"/>
            <ellipse cx="158" cy="11" rx="6" ry="2.8" transform="rotate(-150 158 11)" fill="none" stroke="#8C7860" strokeWidth="0.8" opacity="0.42"/>
            <circle cx="100" cy="42" r="2" fill="none" stroke="#8C7860" strokeWidth="1" opacity="0.5"/>
          </svg>
        </div>
        {/* Bottom sprig mirrored */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[70%] rotate-180 pointer-events-none" style={{ height: '32px' }}>
          <svg viewBox="0 0 200 48" fill="none" className="h-full w-full">
            <path d="M100 42 Q78 30 52 18 Q30 10 8 6" stroke="#8C7860" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.45"/>
            <path d="M100 42 Q122 30 148 18 Q170 10 192 6" stroke="#8C7860" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.45"/>
            <ellipse cx="80" cy="28" rx="8" ry="3.5" transform="rotate(-38 80 28)" fill="none" stroke="#8C7860" strokeWidth="0.9" opacity="0.42"/>
            <ellipse cx="62" cy="18" rx="7" ry="3" transform="rotate(-36 62 18)" fill="none" stroke="#8C7860" strokeWidth="0.9" opacity="0.38"/>
            <ellipse cx="120" cy="28" rx="8" ry="3.5" transform="rotate(-142 120 28)" fill="none" stroke="#8C7860" strokeWidth="0.9" opacity="0.42"/>
            <ellipse cx="138" cy="18" rx="7" ry="3" transform="rotate(-144 138 18)" fill="none" stroke="#8C7860" strokeWidth="0.9" opacity="0.38"/>
            <circle cx="100" cy="42" r="2" fill="none" stroke="#8C7860" strokeWidth="1" opacity="0.44"/>
          </svg>
        </div>
      </>
    ),
    topAdornment: <div className="text-[9px] uppercase tracking-[0.55em] text-[#8C7860]/78">Minimal Vow</div>,
  },

  "garden-arch": {
    previewClassName: "bg-[linear-gradient(180deg,#F4FBF0_0%,#E8F5E0_48%,#D8EDD0_100%)]",
    cardClassName: "border-[#A8CC8C]/40 shadow-[0_18px_52px_-28px_rgba(88,148,72,0.26)]",
    labelClassName: "text-[#547A44]/82",
    layoutVariant: "garden",
    textToneClassName: "text-[#1E3A16]",
    subTextToneClassName: "text-[#4A6840]/84",
    accentToneClassName: "text-[#7EAA5C]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 18%, rgba(255,255,255,0.80) 0, transparent 30%), radial-gradient(circle at 50% 82%, rgba(160,210,130,0.16) 0, transparent 26%), url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237EAA5C' stroke-opacity='0.12' stroke-width='1.5'%3E%3Cpath d='M30 130c22-44 54-70 94-70'/%3E%3Cpath d='M48 138c18-28 44-46 76-52'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 160px 160px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(126,170,92,0.22)",
      borderRadius: "1.65rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/32 backdrop-blur-[2px] border border-white/48 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        {/* Arch flower garland top */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[90%] pointer-events-none" style={{ height: '100px' }}>
          <svg viewBox="0 0 280 130" fill="none" className="h-full w-full">
            {/* Arch curve line */}
            <path d="M14 110 Q140-18 266 110" stroke="#6AA050" strokeOpacity="0.28" strokeWidth="1.8" fill="none"/>
            {/* Flower clusters on arch */}
            <circle cx="38" cy="80" r="9" fill="#FF8FAA" fillOpacity="0.55"/>
            <circle cx="38" cy="80" r="5" fill="#FF6690" fillOpacity="0.65"/>
            <circle cx="38" cy="80" r="2" fill="#C03060" fillOpacity="0.80"/>
            <circle cx="30" cy="72" r="6" fill="#FFB0C8" fillOpacity="0.50"/>
            <circle cx="46" cy="72" r="6" fill="#FF8FAA" fillOpacity="0.48"/>
            <circle cx="242" cy="80" r="9" fill="#FF8FAA" fillOpacity="0.55"/>
            <circle cx="242" cy="80" r="5" fill="#FF6690" fillOpacity="0.65"/>
            <circle cx="242" cy="80" r="2" fill="#C03060" fillOpacity="0.80"/>
            <circle cx="234" cy="72" r="6" fill="#FFB0C8" fillOpacity="0.50"/>
            <circle cx="250" cy="72" r="6" fill="#FF8FAA" fillOpacity="0.48"/>
            {/* Top center */}
            <circle cx="140" cy="8" r="10" fill="#FF8FAA" fillOpacity="0.55"/>
            <circle cx="140" cy="8" r="6" fill="#FF6690" fillOpacity="0.65"/>
            <circle cx="140" cy="8" r="2.5" fill="#C03060" fillOpacity="0.80"/>
            <circle cx="128" cy="10" r="7" fill="#FFCCD8" fillOpacity="0.48"/>
            <circle cx="152" cy="10" r="7" fill="#FFCCD8" fillOpacity="0.48"/>
            {/* Left roses */}
            <circle cx="76" cy="38" r="8" fill="#FF9BBC" fillOpacity="0.52"/>
            <circle cx="76" cy="38" r="4.5" fill="#FF7095" fillOpacity="0.62"/>
            <circle cx="76" cy="38" r="1.8" fill="#B82C58" fillOpacity="0.78"/>
            <circle cx="204" cy="38" r="8" fill="#FF9BBC" fillOpacity="0.52"/>
            <circle cx="204" cy="38" r="4.5" fill="#FF7095" fillOpacity="0.62"/>
            <circle cx="204" cy="38" r="1.8" fill="#B82C58" fillOpacity="0.78"/>
            {/* Leaves */}
            <ellipse cx="58" cy="54" rx="10" ry="4" transform="rotate(-44 58 54)" fill="#5A9040" fillOpacity="0.60"/>
            <ellipse cx="66" cy="48" rx="9" ry="3.5" transform="rotate(-30 66 48)" fill="#4A7830" fillOpacity="0.55"/>
            <ellipse cx="222" cy="54" rx="10" ry="4" transform="rotate(44 222 54)" fill="#5A9040" fillOpacity="0.60"/>
            <ellipse cx="214" cy="48" rx="9" ry="3.5" transform="rotate(30 214 48)" fill="#4A7830" fillOpacity="0.55"/>
          </svg>
        </div>
        {/* Corner leaf elements */}
        <div className="absolute bottom-4 left-3 w-14 h-20 opacity-72 pointer-events-none">
          <svg viewBox="0 0 60 90" fill="none" className="h-full w-full">
            <path d="M30 85 Q28 55 30 20 Q28 5 30 0" stroke="#5A9040" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.55"/>
            <ellipse cx="22" cy="66" rx="10" ry="4.2" transform="rotate(-138 22 66)" fill="#6AA050" fillOpacity="0.58"/>
            <ellipse cx="20" cy="50" rx="9" ry="3.8" transform="rotate(-135 20 50)" fill="#5A9040" fillOpacity="0.52"/>
            <ellipse cx="22" cy="36" rx="8" ry="3.4" transform="rotate(-140 22 36)" fill="#7BB562" fillOpacity="0.50"/>
            <ellipse cx="24" cy="23" rx="7" ry="3" transform="rotate(-136 24 23)" fill="#6AA050" fillOpacity="0.46"/>
          </svg>
        </div>
        <div className="absolute bottom-4 right-3 w-14 h-20 opacity-72 scale-x-[-1] pointer-events-none">
          <svg viewBox="0 0 60 90" fill="none" className="h-full w-full">
            <path d="M30 85 Q28 55 30 20 Q28 5 30 0" stroke="#5A9040" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.55"/>
            <ellipse cx="22" cy="66" rx="10" ry="4.2" transform="rotate(-138 22 66)" fill="#6AA050" fillOpacity="0.58"/>
            <ellipse cx="20" cy="50" rx="9" ry="3.8" transform="rotate(-135 20 50)" fill="#5A9040" fillOpacity="0.52"/>
            <ellipse cx="22" cy="36" rx="8" ry="3.4" transform="rotate(-140 22 36)" fill="#7BB562" fillOpacity="0.50"/>
            <ellipse cx="24" cy="23" rx="7" ry="3" transform="rotate(-136 24 23)" fill="#6AA050" fillOpacity="0.46"/>
          </svg>
        </div>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.44em] text-[#547A44]/88">Garden Arch</div>,
  },

  "crimson-velvet": {
    previewClassName: "bg-[linear-gradient(160deg,#FFFBF5_0%,#FDF3F0_42%,#FAE8E4_100%)]",
    cardClassName: "border-[#D4606A]/38 shadow-[0_20px_58px_-30px_rgba(180,40,56,0.32)]",
    labelClassName: "text-[#9E2030]/82",
    layoutVariant: "crimson",
    textToneClassName: "text-[#2E0808]",
    subTextToneClassName: "text-[#6E2428]/84",
    accentToneClassName: "text-[#B8922A]",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 48%, rgba(255,250,248,0.58) 0, transparent 65%), url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23B8922A' stroke-opacity='0.10' stroke-width='1.4'%3E%3Crect x='12' y='12' width='176' height='176' rx='8'/%3E%3Crect x='22' y='22' width='156' height='156' rx='5'/%3E%3Cpath d='M100 22l5 12 13 2-10 9 2 13-10-6-10 6 2-13-10-9 13-2z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, 200px 200px",
      backgroundPosition: "center, center",
    },
    frameStyle: {
      border: "1px solid rgba(184,146,42,0.32)",
      borderRadius: "1.5rem",
      margin: "0.45rem",
      boxShadow: "inset 0 0 0 5px rgba(255,255,255,0.28)",
    },
    contentPanelClassName: "bg-white/48 backdrop-blur-[2px] border border-[#D4606A]/22 shadow-sm rounded-[0.9rem]",
    ornament: (
      <>
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 280 420" fill="none" preserveAspectRatio="xMidYMid slice">
          {/* Top-left maroon floral */}
          <g>
            {/* Large rose */}
            <path d="M50 6C34 0 10 8 6 26c-4 18 8 34 24 38 18 4 36-8 40-26 4-18-6-32-20-32z" fill="#C43040" fillOpacity="0.80"/>
            <path d="M6 50C0 34 8 10 26 6c18-4 34 8 38 24 4 18-8 36-26 40C20 74 0 66 6 50z" fill="#C43040" fillOpacity="0.76"/>
            <path d="M50 18c-12-2-26 8-24 22 2 16 16 24 30 18 14-6 18-18 8-32-3-5-9-10-14-8z" fill="#E05060" fillOpacity="0.80"/>
            <path d="M18 50c-2-14 8-28 22-26 16 2 24 16 18 30-6 14-18 18-32 8-5-3-8-9-8-12z" fill="#E05060" fillOpacity="0.76"/>
            <circle cx="44" cy="44" r="15" fill="#8A1828" fillOpacity="0.86"/>
            <circle cx="40" cy="40" r="6" fill="#FFDDE2" fillOpacity="0.88"/>
            {/* Small bud */}
            <path d="M84 44c-8-2-18 6-16 16 2 12 12 18 22 14 10-4 12-14 4-24-2-4-7-6-10-6z" fill="#D45060" fillOpacity="0.68"/>
            <circle cx="84" cy="60" r="10" fill="#9A1D2D" fillOpacity="0.74"/>
            <circle cx="81" cy="57" r="4" fill="#FFCCD4" fillOpacity="0.82"/>
            {/* Ivory roses */}
            <circle cx="110" cy="28" r="9" fill="#FFE8D4" fillOpacity="0.72"/>
            <circle cx="110" cy="28" r="5" fill="#FFDEC4" fillOpacity="0.82"/>
            <circle cx="110" cy="28" r="2" fill="#D49060" fillOpacity="0.60"/>
            <circle cx="30" cy="108" r="9" fill="#FFE8D4" fillOpacity="0.72"/>
            <circle cx="30" cy="108" r="5" fill="#FFDEC4" fillOpacity="0.82"/>
            <circle cx="30" cy="108" r="2" fill="#D49060" fillOpacity="0.60"/>
            {/* Gold-tipped leaves */}
            <path d="M44 44c6 10 10 24 12 44" stroke="#2A5030" strokeWidth="2" strokeLinecap="round" opacity="0.62"/>
            <path d="M44 44c-10 6-24 10-44 12" stroke="#2A5030" strokeWidth="2" strokeLinecap="round" opacity="0.62"/>
            <path d="M58 72c4 12 18 22 34 28C80 88 64 78 58 72z" fill="#1E4228" fillOpacity="0.72"/>
            <path d="M72 58c12 4 22 18 28 34C88 80 78 64 72 58z" fill="#1E4228" fillOpacity="0.72"/>
            <path d="M66 16c2 10 12 18 30 20C82 26 72 18 66 16z" fill="#284C30" fillOpacity="0.62"/>
            <path d="M16 66c10 2 18 12 20 30C26 82 18 72 16 66z" fill="#284C30" fillOpacity="0.62"/>
          </g>
          {/* Top-right mirror */}
          <g transform="translate(280,0) scale(-1,1)">
            <path d="M50 6C34 0 10 8 6 26c-4 18 8 34 24 38 18 4 36-8 40-26 4-18-6-32-20-32z" fill="#C43040" fillOpacity="0.80"/>
            <path d="M6 50C0 34 8 10 26 6c18-4 34 8 38 24 4 18-8 36-26 40C20 74 0 66 6 50z" fill="#C43040" fillOpacity="0.76"/>
            <path d="M50 18c-12-2-26 8-24 22 2 16 16 24 30 18 14-6 18-18 8-32-3-5-9-10-14-8z" fill="#E05060" fillOpacity="0.80"/>
            <path d="M18 50c-2-14 8-28 22-26 16 2 24 16 18 30-6 14-18 18-32 8-5-3-8-9-8-12z" fill="#E05060" fillOpacity="0.76"/>
            <circle cx="44" cy="44" r="15" fill="#8A1828" fillOpacity="0.86"/>
            <circle cx="40" cy="40" r="6" fill="#FFDDE2" fillOpacity="0.88"/>
            <path d="M84 44c-8-2-18 6-16 16 2 12 12 18 22 14 10-4 12-14 4-24-2-4-7-6-10-6z" fill="#D45060" fillOpacity="0.68"/>
            <circle cx="84" cy="60" r="10" fill="#9A1D2D" fillOpacity="0.74"/>
            <circle cx="81" cy="57" r="4" fill="#FFCCD4" fillOpacity="0.82"/>
            <circle cx="110" cy="28" r="9" fill="#FFE8D4" fillOpacity="0.72"/>
            <circle cx="110" cy="28" r="5" fill="#FFDEC4" fillOpacity="0.82"/>
            <circle cx="30" cy="108" r="9" fill="#FFE8D4" fillOpacity="0.72"/>
            <circle cx="30" cy="108" r="5" fill="#FFDEC4" fillOpacity="0.82"/>
            <path d="M44 44c6 10 10 24 12 44" stroke="#2A5030" strokeWidth="2" strokeLinecap="round" opacity="0.62"/>
            <path d="M44 44c-10 6-24 10-44 12" stroke="#2A5030" strokeWidth="2" strokeLinecap="round" opacity="0.62"/>
            <path d="M58 72c4 12 18 22 34 28C80 88 64 78 58 72z" fill="#1E4228" fillOpacity="0.72"/>
            <path d="M72 58c12 4 22 18 28 34C88 80 78 64 72 58z" fill="#1E4228" fillOpacity="0.72"/>
            <path d="M66 16c2 10 12 18 30 20C82 26 72 18 66 16z" fill="#284C30" fillOpacity="0.62"/>
            <path d="M16 66c10 2 18 12 20 30C26 82 18 72 16 66z" fill="#284C30" fillOpacity="0.62"/>
          </g>
          {/* Bottom-left mirror */}
          <g transform="translate(0,420) scale(1,-1)">
            <path d="M50 6C34 0 10 8 6 26c-4 18 8 34 24 38 18 4 36-8 40-26 4-18-6-32-20-32z" fill="#C43040" fillOpacity="0.80"/>
            <path d="M6 50C0 34 8 10 26 6c18-4 34 8 38 24 4 18-8 36-26 40C20 74 0 66 6 50z" fill="#C43040" fillOpacity="0.76"/>
            <path d="M50 18c-12-2-26 8-24 22 2 16 16 24 30 18 14-6 18-18 8-32-3-5-9-10-14-8z" fill="#E05060" fillOpacity="0.80"/>
            <path d="M18 50c-2-14 8-28 22-26 16 2 24 16 18 30-6 14-18 18-32 8-5-3-8-9-8-12z" fill="#E05060" fillOpacity="0.76"/>
            <circle cx="44" cy="44" r="15" fill="#8A1828" fillOpacity="0.86"/>
            <circle cx="40" cy="40" r="6" fill="#FFDDE2" fillOpacity="0.88"/>
            <path d="M84 44c-8-2-18 6-16 16 2 12 12 18 22 14 10-4 12-14 4-24-2-4-7-6-10-6z" fill="#D45060" fillOpacity="0.68"/>
            <circle cx="84" cy="60" r="10" fill="#9A1D2D" fillOpacity="0.74"/>
            <path d="M44 44c6 10 10 24 12 44" stroke="#2A5030" strokeWidth="2" strokeLinecap="round" opacity="0.62"/>
            <path d="M44 44c-10 6-24 10-44 12" stroke="#2A5030" strokeWidth="2" strokeLinecap="round" opacity="0.62"/>
            <path d="M58 72c4 12 18 22 34 28C80 88 64 78 58 72z" fill="#1E4228" fillOpacity="0.72"/>
            <path d="M72 58c12 4 22 18 28 34C88 80 78 64 72 58z" fill="#1E4228" fillOpacity="0.72"/>
          </g>
          {/* Bottom-right mirror */}
          <g transform="translate(280,420) scale(-1,-1)">
            <path d="M50 6C34 0 10 8 6 26c-4 18 8 34 24 38 18 4 36-8 40-26 4-18-6-32-20-32z" fill="#C43040" fillOpacity="0.80"/>
            <path d="M6 50C0 34 8 10 26 6c18-4 34 8 38 24 4 18-8 36-26 40C20 74 0 66 6 50z" fill="#C43040" fillOpacity="0.76"/>
            <path d="M50 18c-12-2-26 8-24 22 2 16 16 24 30 18 14-6 18-18 8-32-3-5-9-10-14-8z" fill="#E05060" fillOpacity="0.80"/>
            <path d="M18 50c-2-14 8-28 22-26 16 2 24 16 18 30-6 14-18 18-32 8-5-3-8-9-8-12z" fill="#E05060" fillOpacity="0.76"/>
            <circle cx="44" cy="44" r="15" fill="#8A1828" fillOpacity="0.86"/>
            <circle cx="40" cy="40" r="6" fill="#FFDDE2" fillOpacity="0.88"/>
            <path d="M84 44c-8-2-18 6-16 16 2 12 12 18 22 14 10-4 12-14 4-24-2-4-7-6-10-6z" fill="#D45060" fillOpacity="0.68"/>
            <circle cx="84" cy="60" r="10" fill="#9A1D2D" fillOpacity="0.74"/>
            <path d="M44 44c6 10 10 24 12 44" stroke="#2A5030" strokeWidth="2" strokeLinecap="round" opacity="0.62"/>
            <path d="M44 44c-10 6-24 10-44 12" stroke="#2A5030" strokeWidth="2" strokeLinecap="round" opacity="0.62"/>
            <path d="M58 72c4 12 18 22 34 28C80 88 64 78 58 72z" fill="#1E4228" fillOpacity="0.72"/>
            <path d="M72 58c12 4 22 18 28 34C88 80 78 64 72 58z" fill="#1E4228" fillOpacity="0.72"/>
          </g>
          {/* Gold double-frame border */}
          <rect x="14" y="14" width="252" height="392" rx="20" ry="20" stroke="#B8922A" strokeOpacity="0.30" strokeWidth="1.2" fill="none"/>
          <rect x="20" y="20" width="240" height="380" rx="17" ry="17" stroke="#B8922A" strokeOpacity="0.18" strokeWidth="0.8" fill="none"/>
          {/* Center diamond divider */}
          <g transform="translate(100,208)">
            <line x1="0" y1="0" x2="80" y2="0" stroke="#B8922A" strokeOpacity="0.28" strokeWidth="0.8"/>
            <polygon points="40,-4 45,0 40,4 35,0" fill="#B8922A" fillOpacity="0.42"/>
          </g>
        </svg>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.44em] text-[#9E2030]/88">Crimson Velvet</div>,
  },

  "amber-harvest": {
    previewClassName: "bg-[linear-gradient(165deg,#FFF8EC_0%,#F9EDCD_48%,#F3E0A8_100%)]",
    cardClassName: "border-[#D4A84A]/42 shadow-[0_18px_54px_-28px_rgba(180,130,40,0.28)]",
    labelClassName: "text-[#9A6820]/84",
    layoutVariant: "harvest",
    textToneClassName: "text-[#3A2008]",
    subTextToneClassName: "text-[#7A5020]/84",
    accentToneClassName: "text-[#C88A2A]",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 44%, rgba(255,252,240,0.55) 0, transparent 68%), url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C88A2A' stroke-opacity='0.11' stroke-width='1.5'%3E%3Cpath d='M20 150c28-52 66-80 110-80'/%3E%3Cpath d='M40 158c22-34 54-52 100-58'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, 180px 180px",
      backgroundPosition: "center, center",
    },
    frameStyle: {
      border: "1px solid rgba(200,138,42,0.28)",
      borderRadius: "1.5rem",
      margin: "0.45rem",
      boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.34)",
    },
    contentPanelClassName: "bg-white/46 backdrop-blur-[2px] border border-[#D4A84A]/26 shadow-sm rounded-[0.9rem]",
    ornament: (
      <>
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 280 420" fill="none" preserveAspectRatio="xMidYMid slice">
          {/* Top-left autumn leaf cluster */}
          <g opacity="0.88">
            {/* Large maple leaf */}
            <path d="M44 6c0 8-6 14-16 18 4 4 6 10 4 16 6-4 12-4 16 0 4-6 4-12 8-16-8-2-12-10-12-18z" fill="#D4601A" fillOpacity="0.78"/>
            <path d="M28 24c-6 2-14 0-20-6 2 8 0 16-6 22 8-2 16 0 20 6 2-8 4-16 6-22z" fill="#E8A030" fillOpacity="0.72"/>
            <path d="M60 22c6 2 14 0 20-6-2 8 0 16 6 22-8-2-16 0-20 6-2-8-4-16-6-22z" fill="#C85020" fillOpacity="0.68"/>
            {/* Stem */}
            <path d="M44 6c0 8 0 20-2 36" stroke="#8A4010" strokeWidth="1.4" strokeLinecap="round" opacity="0.60"/>
            {/* Small leaf 1 */}
            <path d="M20 52c0 6-4 10-10 12 2 4 4 8 2 12 4-2 8-2 10 0 2-4 2-8 4-12-6-2-8-6-6-12z" fill="#E8A030" fillOpacity="0.64"/>
            <path d="M68 44c0 6 4 10 10 12-2 4-4 8-2 12-4-2-8-2-10 0-2-4-2-8-4-12 6-2 8-6 6-12z" fill="#D4601A" fillOpacity="0.60"/>
            {/* Acorn */}
            <ellipse cx="44" cy="80" rx="7" ry="5" fill="#8A6030" fillOpacity="0.68"/>
            <ellipse cx="44" cy="77" rx="7.5" ry="4" fill="#C8A050" fillOpacity="0.72"/>
            <path d="M44 72 Q46 68 44 65 Q42 68 44 72z" stroke="#6A4020" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.65"/>
            <circle cx="20" cy="98" r="5" fill="#F5C060" fillOpacity="0.50"/>
            <circle cx="68" cy="88" r="5" fill="#D4601A" fillOpacity="0.46"/>
          </g>
          {/* Top-right mirror */}
          <g transform="translate(280,0) scale(-1,1)" opacity="0.88">
            <path d="M44 6c0 8-6 14-16 18 4 4 6 10 4 16 6-4 12-4 16 0 4-6 4-12 8-16-8-2-12-10-12-18z" fill="#D4601A" fillOpacity="0.78"/>
            <path d="M28 24c-6 2-14 0-20-6 2 8 0 16-6 22 8-2 16 0 20 6 2-8 4-16 6-22z" fill="#E8A030" fillOpacity="0.72"/>
            <path d="M60 22c6 2 14 0 20-6-2 8 0 16 6 22-8-2-16 0-20 6-2-8-4-16-6-22z" fill="#C85020" fillOpacity="0.68"/>
            <path d="M44 6c0 8 0 20-2 36" stroke="#8A4010" strokeWidth="1.4" strokeLinecap="round" opacity="0.60"/>
            <path d="M20 52c0 6-4 10-10 12 2 4 4 8 2 12 4-2 8-2 10 0 2-4 2-8 4-12-6-2-8-6-6-12z" fill="#E8A030" fillOpacity="0.64"/>
            <path d="M68 44c0 6 4 10 10 12-2 4-4 8-2 12-4-2-8-2-10 0-2-4-2-8-4-12 6-2 8-6 6-12z" fill="#D4601A" fillOpacity="0.60"/>
            <ellipse cx="44" cy="80" rx="7" ry="5" fill="#8A6030" fillOpacity="0.68"/>
            <ellipse cx="44" cy="77" rx="7.5" ry="4" fill="#C8A050" fillOpacity="0.72"/>
            <path d="M44 72 Q46 68 44 65 Q42 68 44 72z" stroke="#6A4020" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.65"/>
            <circle cx="20" cy="98" r="5" fill="#F5C060" fillOpacity="0.50"/>
            <circle cx="68" cy="88" r="5" fill="#D4601A" fillOpacity="0.46"/>
          </g>
          {/* Bottom-left mirror */}
          <g transform="translate(0,420) scale(1,-1)" opacity="0.88">
            <path d="M44 6c0 8-6 14-16 18 4 4 6 10 4 16 6-4 12-4 16 0 4-6 4-12 8-16-8-2-12-10-12-18z" fill="#D4601A" fillOpacity="0.78"/>
            <path d="M28 24c-6 2-14 0-20-6 2 8 0 16-6 22 8-2 16 0 20 6 2-8 4-16 6-22z" fill="#E8A030" fillOpacity="0.72"/>
            <path d="M60 22c6 2 14 0 20-6-2 8 0 16 6 22-8-2-16 0-20 6-2-8-4-16-6-22z" fill="#C85020" fillOpacity="0.68"/>
            <path d="M44 6c0 8 0 20-2 36" stroke="#8A4010" strokeWidth="1.4" strokeLinecap="round" opacity="0.60"/>
            <path d="M20 52c0 6-4 10-10 12 2 4 4 8 2 12 4-2 8-2 10 0 2-4 2-8 4-12-6-2-8-6-6-12z" fill="#E8A030" fillOpacity="0.64"/>
            <ellipse cx="44" cy="80" rx="7" ry="5" fill="#8A6030" fillOpacity="0.68"/>
            <ellipse cx="44" cy="77" rx="7.5" ry="4" fill="#C8A050" fillOpacity="0.72"/>
          </g>
          {/* Bottom-right mirror */}
          <g transform="translate(280,420) scale(-1,-1)" opacity="0.88">
            <path d="M44 6c0 8-6 14-16 18 4 4 6 10 4 16 6-4 12-4 16 0 4-6 4-12 8-16-8-2-12-10-12-18z" fill="#D4601A" fillOpacity="0.78"/>
            <path d="M28 24c-6 2-14 0-20-6 2 8 0 16-6 22 8-2 16 0 20 6 2-8 4-16 6-22z" fill="#E8A030" fillOpacity="0.72"/>
            <path d="M60 22c6 2 14 0 20-6-2 8 0 16 6 22-8-2-16 0-20 6-2-8-4-16-6-22z" fill="#C85020" fillOpacity="0.68"/>
            <path d="M44 6c0 8 0 20-2 36" stroke="#8A4010" strokeWidth="1.4" strokeLinecap="round" opacity="0.60"/>
            <ellipse cx="44" cy="80" rx="7" ry="5" fill="#8A6030" fillOpacity="0.68"/>
            <ellipse cx="44" cy="77" rx="7.5" ry="4" fill="#C8A050" fillOpacity="0.72"/>
            <circle cx="20" cy="98" r="5" fill="#F5C060" fillOpacity="0.50"/>
          </g>
          {/* Warm gold double frame */}
          <rect x="14" y="14" width="252" height="392" rx="20" ry="20" stroke="#C88A2A" strokeOpacity="0.26" strokeWidth="1" fill="none"/>
          <rect x="19" y="19" width="242" height="382" rx="17" ry="17" stroke="#C88A2A" strokeOpacity="0.16" strokeWidth="0.8" fill="none"/>
          {/* Center wheat-stalk ornament */}
          <g transform="translate(88,208)">
            <line x1="0" y1="0" x2="104" y2="0" stroke="#C88A2A" strokeOpacity="0.24" strokeWidth="0.9"/>
            <ellipse cx="52" cy="0" rx="3" ry="5" fill="#C88A2A" fillOpacity="0.36"/>
            <line x1="44" y1="0" x2="44" y2="-6" stroke="#C88A2A" strokeOpacity="0.28" strokeWidth="0.8"/>
            <line x1="60" y1="0" x2="60" y2="-6" stroke="#C88A2A" strokeOpacity="0.28" strokeWidth="0.8"/>
          </g>
        </svg>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.44em] text-[#9A6820]/86">Amber Harvest</div>,
  },

  "wisteria-dreams": {
    previewClassName: "bg-[linear-gradient(175deg,#FAF5FF_0%,#F0E8FA_48%,#E6D8F5_100%)]",
    cardClassName: "border-[#C8A0DC]/42 shadow-[0_18px_54px_-28px_rgba(160,100,210,0.26)]",
    labelClassName: "text-[#7A4A9E]/82",
    layoutVariant: "wisteria",
    textToneClassName: "text-[#28103C]",
    subTextToneClassName: "text-[#604878]/84",
    accentToneClassName: "text-[#9A60BE]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 10%, rgba(255,255,255,0.78) 0, transparent 28%), radial-gradient(circle at 50% 90%, rgba(168,120,220,0.12) 0, transparent 30%), url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%239A60BE' stroke-opacity='0.10' stroke-width='1.5'%3E%3Ccircle cx='100' cy='100' r='35'/%3E%3Ccircle cx='100' cy='100' r='55'/%3E%3Ccircle cx='100' cy='100' r='75'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 200px 200px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(154,96,190,0.22)",
      borderRadius: "1.6rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/38 backdrop-blur-[2px] border border-[#C8A0DC]/28 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        {/* Cascading wisteria top */}
        <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: '120px' }}>
          <svg viewBox="0 0 280 120" fill="none" className="h-full w-full">
            {/* Main vine */}
            <path d="M0 0 Q30 10 40 30 Q50 50 30 70 Q14 88 24 106" stroke="#7A60A0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55"/>
            <path d="M280 0 Q250 10 240 30 Q230 50 250 70 Q266 88 256 106" stroke="#7A60A0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55"/>
            <path d="M60 0 Q70 16 60 34 Q52 50 62 66" stroke="#9A78BC" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
            <path d="M220 0 Q210 16 220 34 Q228 50 218 66" stroke="#9A78BC" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
            {/* Wisteria flower clusters — left */}
            <ellipse cx="30" cy="74" rx="5" ry="7" fill="#B070D8" fillOpacity="0.58"/>
            <ellipse cx="22" cy="82" rx="4" ry="6" fill="#9A55C0" fillOpacity="0.55"/>
            <ellipse cx="36" cy="84" rx="4" ry="7" fill="#CC90E8" fillOpacity="0.52"/>
            <ellipse cx="26" cy="92" rx="3.5" ry="5.5" fill="#B070D8" fillOpacity="0.50"/>
            <ellipse cx="34" cy="96" rx="3" ry="5" fill="#9A55C0" fillOpacity="0.46"/>
            <ellipse cx="24" cy="100" rx="3" ry="4.5" fill="#CC90E8" fillOpacity="0.44"/>
            {/* Wisteria — left upper */}
            <ellipse cx="60" cy="38" rx="4" ry="6" fill="#B070D8" fillOpacity="0.52"/>
            <ellipse cx="54" cy="46" rx="3.5" ry="5.5" fill="#9A55C0" fillOpacity="0.48"/>
            <ellipse cx="64" cy="48" rx="3.5" ry="6" fill="#CC90E8" fillOpacity="0.46"/>
            <ellipse cx="58" cy="56" rx="3" ry="5" fill="#B070D8" fillOpacity="0.44"/>
            <ellipse cx="66" cy="58" rx="3" ry="4.5" fill="#9A55C0" fillOpacity="0.42"/>
            {/* Wisteria — right mirror */}
            <ellipse cx="250" cy="74" rx="5" ry="7" fill="#B070D8" fillOpacity="0.58"/>
            <ellipse cx="258" cy="82" rx="4" ry="6" fill="#9A55C0" fillOpacity="0.55"/>
            <ellipse cx="244" cy="84" rx="4" ry="7" fill="#CC90E8" fillOpacity="0.52"/>
            <ellipse cx="254" cy="92" rx="3.5" ry="5.5" fill="#B070D8" fillOpacity="0.50"/>
            <ellipse cx="246" cy="96" rx="3" ry="5" fill="#9A55C0" fillOpacity="0.46"/>
            <ellipse cx="256" cy="100" rx="3" ry="4.5" fill="#CC90E8" fillOpacity="0.44"/>
            <ellipse cx="220" cy="38" rx="4" ry="6" fill="#B070D8" fillOpacity="0.52"/>
            <ellipse cx="226" cy="46" rx="3.5" ry="5.5" fill="#9A55C0" fillOpacity="0.48"/>
            <ellipse cx="216" cy="48" rx="3.5" ry="6" fill="#CC90E8" fillOpacity="0.46"/>
            <ellipse cx="222" cy="56" rx="3" ry="5" fill="#B070D8" fillOpacity="0.44"/>
            <ellipse cx="214" cy="58" rx="3" ry="4.5" fill="#9A55C0" fillOpacity="0.42"/>
            {/* Leaves */}
            <ellipse cx="46" cy="22" rx="8" ry="3.5" transform="rotate(-30 46 22)" fill="#6A8C50" fillOpacity="0.52"/>
            <ellipse cx="36" cy="14" rx="7" ry="3" transform="rotate(-25 36 14)" fill="#5A7C42" fillOpacity="0.48"/>
            <ellipse cx="234" cy="22" rx="8" ry="3.5" transform="rotate(30 234 22)" fill="#6A8C50" fillOpacity="0.52"/>
            <ellipse cx="244" cy="14" rx="7" ry="3" transform="rotate(25 244 14)" fill="#5A7C42" fillOpacity="0.48"/>
          </svg>
        </div>
        {/* Bottom wisteria (smaller, mirrored) */}
        <div className="absolute bottom-0 right-0 w-full rotate-180 pointer-events-none" style={{ height: '80px' }}>
          <svg viewBox="0 0 280 80" fill="none" className="h-full w-full">
            <path d="M0 0 Q30 8 38 24 Q46 40 30 54" stroke="#7A60A0" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.42"/>
            <path d="M280 0 Q250 8 242 24 Q234 40 250 54" stroke="#7A60A0" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.42"/>
            <ellipse cx="30" cy="56" rx="4" ry="6" fill="#CC90E8" fillOpacity="0.42"/>
            <ellipse cx="22" cy="64" rx="3.5" ry="5" fill="#B070D8" fillOpacity="0.38"/>
            <ellipse cx="250" cy="56" rx="4" ry="6" fill="#CC90E8" fillOpacity="0.42"/>
            <ellipse cx="258" cy="64" rx="3.5" ry="5" fill="#B070D8" fillOpacity="0.38"/>
          </svg>
        </div>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.44em] text-[#7A4A9E]/88">Wisteria Dreams</div>,
  },

  "pearl-mist": {
    previewClassName: "bg-[linear-gradient(155deg,#FDFEFF_0%,#F2F8FD_48%,#E8F2FB_100%)]",
    cardClassName: "border-[#B8D0E4]/42 shadow-[0_18px_52px_-28px_rgba(100,150,200,0.22)]",
    labelClassName: "text-[#5878A0]/80",
    layoutVariant: "pearl",
    textToneClassName: "text-[#162436]",
    subTextToneClassName: "text-[#486080]/84",
    accentToneClassName: "text-[#6890B8]",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 30% 26%, rgba(255,255,255,0.85) 0, transparent 34%), radial-gradient(ellipse at 70% 74%, rgba(180,220,240,0.18) 0, transparent 30%), url("data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236890B8' stroke-opacity='0.10' stroke-width='1.5'%3E%3Ccircle cx='120' cy='120' r='40'/%3E%3Ccircle cx='120' cy='120' r='65'/%3E%3Ccircle cx='120' cy='120' r='90'/%3E%3Cpath d='M120 30l8 18 20 4-14 14 4 20-18-10-18 10 4-20-14-14 20-4z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 240px 240px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(104,144,184,0.22)",
      borderRadius: "1.65rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/36 backdrop-blur-[2px] border border-[#B8D0E4]/30 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        {/* Flowing ribbon curves top */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full pointer-events-none" style={{ height: '72px' }}>
          <svg viewBox="0 0 280 72" fill="none" className="h-full w-full">
            <path d="M0 60 Q70 20 140 36 Q210 52 280 12" stroke="#B8D0E4" strokeOpacity="0.55" strokeWidth="1.8" fill="none"/>
            <path d="M0 68 Q70 28 140 44 Q210 60 280 20" stroke="#96B8D4" strokeOpacity="0.38" strokeWidth="1.4" fill="none"/>
            {/* Pearl beads along curve */}
            <circle cx="42" cy="46" r="3.5" fill="#E8F2FB" stroke="#B8D0E4" strokeWidth="1" strokeOpacity="0.70"/>
            <circle cx="90" cy="34" r="4" fill="#F5FAFF" stroke="#A8C4DC" strokeWidth="1" strokeOpacity="0.72"/>
            <circle cx="140" cy="36" r="4.5" fill="#FFFFFF" stroke="#B8D0E4" strokeWidth="1.2" strokeOpacity="0.75"/>
            <circle cx="140" cy="36" r="1.8" fill="#C8DCF0" fillOpacity="0.65"/>
            <circle cx="190" cy="38" r="4" fill="#F5FAFF" stroke="#A8C4DC" strokeWidth="1" strokeOpacity="0.72"/>
            <circle cx="238" cy="22" r="3.5" fill="#E8F2FB" stroke="#B8D0E4" strokeWidth="1" strokeOpacity="0.70"/>
          </svg>
        </div>
        {/* Bottom ribbon curves */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full rotate-180 pointer-events-none" style={{ height: '64px' }}>
          <svg viewBox="0 0 280 64" fill="none" className="h-full w-full">
            <path d="M0 52 Q70 14 140 30 Q210 46 280 6" stroke="#B8D0E4" strokeOpacity="0.45" strokeWidth="1.6" fill="none"/>
            <circle cx="90" cy="28" r="3.5" fill="#F0F8FF" stroke="#A8C4DC" strokeWidth="1" strokeOpacity="0.65"/>
            <circle cx="140" cy="30" r="4" fill="#FFFFFF" stroke="#B8D0E4" strokeWidth="1.1" strokeOpacity="0.68"/>
            <circle cx="190" cy="32" r="3.5" fill="#F0F8FF" stroke="#A8C4DC" strokeWidth="1" strokeOpacity="0.65"/>
          </svg>
        </div>
        {/* Side pearl strand */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: '120px', width: '18px' }}>
          <svg viewBox="0 0 18 120" fill="none" className="h-full w-full">
            <path d="M9 6 Q8 30 9 60 Q10 90 9 114" stroke="#B8D0E4" strokeWidth="0.9" strokeOpacity="0.55" strokeLinecap="round" fill="none"/>
            <circle cx="9" cy="20" r="3.5" fill="#EEF6FF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.65"/>
            <circle cx="9" cy="36" r="3" fill="#F5FAFF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.62"/>
            <circle cx="9" cy="60" r="4" fill="#FFFFFF" stroke="#B8D0E4" strokeWidth="1.1" strokeOpacity="0.70"/>
            <circle cx="9" cy="60" r="1.5" fill="#C0D8F0" fillOpacity="0.60"/>
            <circle cx="9" cy="84" r="3" fill="#F5FAFF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.62"/>
            <circle cx="9" cy="100" r="3.5" fill="#EEF6FF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.65"/>
          </svg>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 scale-x-[-1] pointer-events-none" style={{ height: '120px', width: '18px' }}>
          <svg viewBox="0 0 18 120" fill="none" className="h-full w-full">
            <path d="M9 6 Q8 30 9 60 Q10 90 9 114" stroke="#B8D0E4" strokeWidth="0.9" strokeOpacity="0.55" strokeLinecap="round" fill="none"/>
            <circle cx="9" cy="20" r="3.5" fill="#EEF6FF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.65"/>
            <circle cx="9" cy="36" r="3" fill="#F5FAFF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.62"/>
            <circle cx="9" cy="60" r="4" fill="#FFFFFF" stroke="#B8D0E4" strokeWidth="1.1" strokeOpacity="0.70"/>
            <circle cx="9" cy="60" r="1.5" fill="#C0D8F0" fillOpacity="0.60"/>
            <circle cx="9" cy="84" r="3" fill="#F5FAFF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.62"/>
            <circle cx="9" cy="100" r="3.5" fill="#EEF6FF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.65"/>
          </svg>
        </div>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.46em] text-[#5878A0]/86">Pearl Mist</div>,
  },

  "indigo-royale": {
    previewClassName: "bg-[linear-gradient(160deg,#0E1A38_0%,#162040_48%,#1C2850_100%)]",
    cardClassName: "border-[#BECCE8]/26 shadow-[0_20px_64px_-32px_rgba(8,14,40,0.75)]",
    labelClassName: "text-[#D8E4F8]/76",
    layoutVariant: "royale",
    textToneClassName: "text-[#EEF2FF]",
    subTextToneClassName: "text-[#BCC8E4]/84",
    accentToneClassName: "text-[#E8C868]",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(190,204,232,0.10) 0, transparent 45%), radial-gradient(ellipse at 50% 80%, rgba(232,200,104,0.08) 0, transparent 35%), url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23E8C868' stroke-opacity='0.09'%3E%3Crect x='20' y='20' width='180' height='180' rx='4'/%3E%3Crect x='32' y='32' width='156' height='156' rx='3'/%3E%3Cpath d='M110 20v180M20 110h180' stroke-width='0.8'/%3E%3Ccircle cx='110' cy='110' r='28'/%3E%3Ccircle cx='110' cy='110' r='50'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 220px 220px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(232,200,104,0.24)",
      borderRadius: "1.55rem",
      margin: "0.5rem",
    },
    contentPanelClassName: "bg-[#0E1A38]/42 backdrop-blur-sm border border-[#BECCE8]/16 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 280 420" fill="none">
          {/* Outer royal frame */}
          <rect x="10" y="10" width="260" height="400" rx="22" ry="22" stroke="#E8C868" strokeOpacity="0.22" strokeWidth="1.2" fill="none"/>
          <rect x="16" y="16" width="248" height="388" rx="19" ry="19" stroke="#E8C868" strokeOpacity="0.14" strokeWidth="0.8" fill="none"/>
          {/* Corner scroll ornaments */}
          <g opacity="0.55">
            {/* Top-left scroll */}
            <path d="M24 24 Q36 18 42 28 Q48 38 38 42 Q28 46 26 38 Q24 30 34 30" stroke="#E8C868" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <path d="M24 24 Q18 36 28 42 Q38 48 42 38 Q46 28 38 26 Q30 24 30 34" stroke="#E8C868" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="24" cy="24" r="2.5" fill="#E8C868" fillOpacity="0.60"/>
            {/* Top-right scroll */}
            <path d="M256 24 Q244 18 238 28 Q232 38 242 42 Q252 46 254 38 Q256 30 246 30" stroke="#E8C868" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <path d="M256 24 Q262 36 252 42 Q242 48 238 38 Q234 28 242 26 Q250 24 250 34" stroke="#E8C868" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="256" cy="24" r="2.5" fill="#E8C868" fillOpacity="0.60"/>
            {/* Bottom-left scroll */}
            <path d="M24 396 Q36 402 42 392 Q48 382 38 378 Q28 374 26 382 Q24 390 34 390" stroke="#E8C868" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <path d="M24 396 Q18 384 28 378 Q38 372 42 382 Q46 392 38 394 Q30 396 30 386" stroke="#E8C868" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="24" cy="396" r="2.5" fill="#E8C868" fillOpacity="0.60"/>
            {/* Bottom-right scroll */}
            <path d="M256 396 Q244 402 238 392 Q232 382 242 378 Q252 374 254 382 Q256 390 246 390" stroke="#E8C868" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <path d="M256 396 Q262 384 252 378 Q242 372 238 382 Q234 392 242 394 Q250 396 250 386" stroke="#E8C868" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="256" cy="396" r="2.5" fill="#E8C868" fillOpacity="0.60"/>
          </g>
          {/* Top center royal crest */}
          <g transform="translate(118,22)" opacity="0.60">
            <path d="M22 0l4 10 12 2-8 8 2 12-10-6-10 6 2-12-8-8 12-2z" fill="#E8C868" fillOpacity="0.45" stroke="#E8C868" strokeWidth="0.6" strokeOpacity="0.60"/>
            <circle cx="22" cy="18" r="3" fill="#E8C868" fillOpacity="0.50"/>
          </g>
          {/* Side vertical chain lines */}
          <line x1="26" y1="68" x2="26" y2="352" stroke="#E8C868" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="4 6"/>
          <line x1="254" y1="68" x2="254" y2="352" stroke="#E8C868" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="4 6"/>
        </svg>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.46em] text-[#E8C868]/88">Indigo Royale</div>,
  },

  "coral-drift": {
    previewClassName: "bg-[linear-gradient(170deg,#FFF4F0_0%,#FFE6DC_48%,#FFD4C4_100%)]",
    cardClassName: "border-[#F0A090]/40 shadow-[0_18px_54px_-28px_rgba(220,120,100,0.28)]",
    labelClassName: "text-[#C05840]/82",
    layoutVariant: "drift",
    textToneClassName: "text-[#3C1410]",
    subTextToneClassName: "text-[#7A4030]/84",
    accentToneClassName: "text-[#E07060]",
    overlay: {
      backgroundImage: `radial-gradient(circle at 20% 22%, rgba(255,255,255,0.72) 0, transparent 26%), radial-gradient(circle at 80% 18%, rgba(240,160,144,0.18) 0, transparent 22%), radial-gradient(circle at 60% 82%, rgba(255,200,180,0.26) 0, transparent 24%)`,
      backgroundSize: "auto",
      backgroundPosition: "center",
    },
    frameStyle: {
      border: "1px solid rgba(224,112,96,0.22)",
      borderRadius: "1.6rem",
      margin: "0.45rem",
    },
    contentPanelClassName: "bg-white/32 backdrop-blur-[2px] border border-white/48 shadow-sm rounded-[1rem]",
    ornament: (
      <>
        {/* Drifting petal confetti */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 280 420" fill="none">
          {/* Scattered petals - various sizes and rotations */}
          <ellipse cx="28" cy="36" rx="7" ry="4" transform="rotate(-28 28 36)" fill="#F08070" fillOpacity="0.48"/>
          <ellipse cx="52" cy="18" rx="5" ry="3" transform="rotate(15 52 18)" fill="#F5A090" fillOpacity="0.42"/>
          <ellipse cx="18" cy="68" rx="6" ry="3.5" transform="rotate(-45 18 68)" fill="#E86858" fillOpacity="0.44"/>
          <ellipse cx="244" cy="28" rx="7" ry="4" transform="rotate(32 244 28)" fill="#F08070" fillOpacity="0.48"/>
          <ellipse cx="260" cy="56" rx="5" ry="3" transform="rotate(-20 260 56)" fill="#F5A090" fillOpacity="0.42"/>
          <ellipse cx="228" cy="14" rx="6" ry="3.5" transform="rotate(50 228 14)" fill="#E86858" fillOpacity="0.44"/>
          <ellipse cx="8" cy="160" rx="8" ry="4.5" transform="rotate(-35 8 160)" fill="#F0A080" fillOpacity="0.38"/>
          <ellipse cx="272" cy="148" rx="8" ry="4.5" transform="rotate(38 272 148)" fill="#F0A080" fillOpacity="0.38"/>
          <ellipse cx="14" cy="300" rx="6" ry="3.5" transform="rotate(-22 14 300)" fill="#F5A090" fillOpacity="0.36"/>
          <ellipse cx="266" cy="290" rx="6" ry="3.5" transform="rotate(25 266 290)" fill="#F5A090" fillOpacity="0.36"/>
          <ellipse cx="22" cy="380" rx="7" ry="4" transform="rotate(-30 22 380)" fill="#E86858" fillOpacity="0.40"/>
          <ellipse cx="258" cy="370" rx="7" ry="4" transform="rotate(35 258 370)" fill="#E86858" fillOpacity="0.40"/>
          <ellipse cx="60" cy="400" rx="5" ry="3" transform="rotate(18 60 400)" fill="#F08070" fillOpacity="0.38"/>
          <ellipse cx="220" cy="408" rx="5" ry="3" transform="rotate(-18 220 408)" fill="#F08070" fillOpacity="0.38"/>
          {/* Hibiscus flowers top-left */}
          <g>
            <circle cx="38" cy="50" r="10" fill="#F06050" fillOpacity="0.18"/>
            <path d="M38 40c4 4 8 8 6 14-2 6-8 8-14 6 0-6 2-12 8-20z" fill="#E86858" fillOpacity="0.55"/>
            <path d="M48 50c-4 4-8 8-14 6-6-2-8-8-6-14 6 0 14 2 20 8z" fill="#F08070" fillOpacity="0.52"/>
            <path d="M38 60c-4-4-8-8-6-14 2-6 8-8 14-6 0 6-2 12-8 20z" fill="#E86858" fillOpacity="0.55"/>
            <path d="M28 50c4-4 8-8 14-6 6 2 8 8 6 14-6 0-14-2-20-8z" fill="#F08070" fillOpacity="0.52"/>
            <circle cx="38" cy="50" r="4" fill="#FFD0C0" fillOpacity="0.75"/>
            <circle cx="38" cy="50" r="1.5" fill="#C03820" fillOpacity="0.70"/>
          </g>
          {/* Hibiscus flowers top-right */}
          <g transform="translate(280,0) scale(-1,1)">
            <circle cx="38" cy="50" r="10" fill="#F06050" fillOpacity="0.18"/>
            <path d="M38 40c4 4 8 8 6 14-2 6-8 8-14 6 0-6 2-12 8-20z" fill="#E86858" fillOpacity="0.55"/>
            <path d="M48 50c-4 4-8 8-14 6-6-2-8-8-6-14 6 0 14 2 20 8z" fill="#F08070" fillOpacity="0.52"/>
            <path d="M38 60c-4-4-8-8-6-14 2-6 8-8 14-6 0 6-2 12-8 20z" fill="#E86858" fillOpacity="0.55"/>
            <path d="M28 50c4-4 8-8 14-6 6 2 8 8 6 14-6 0-14-2-20-8z" fill="#F08070" fillOpacity="0.52"/>
            <circle cx="38" cy="50" r="4" fill="#FFD0C0" fillOpacity="0.75"/>
            <circle cx="38" cy="50" r="1.5" fill="#C03820" fillOpacity="0.70"/>
          </g>
          {/* Bottom hibiscus */}
          <g transform="translate(0,420) scale(1,-1)">
            <circle cx="38" cy="50" r="10" fill="#F06050" fillOpacity="0.18"/>
            <path d="M38 40c4 4 8 8 6 14-2 6-8 8-14 6 0-6 2-12 8-20z" fill="#E86858" fillOpacity="0.55"/>
            <path d="M48 50c-4 4-8 8-14 6-6-2-8-8-6-14 6 0 14 2 20 8z" fill="#F08070" fillOpacity="0.52"/>
            <path d="M38 60c-4-4-8-8-6-14 2-6 8-8 14-6 0 6-2 12-8 20z" fill="#E86858" fillOpacity="0.55"/>
            <path d="M28 50c4-4 8-8 14-6 6 2 8 8 6 14-6 0-14-2-20-8z" fill="#F08070" fillOpacity="0.52"/>
            <circle cx="38" cy="50" r="4" fill="#FFD0C0" fillOpacity="0.75"/>
          </g>
          <g transform="translate(280,420) scale(-1,-1)">
            <circle cx="38" cy="50" r="10" fill="#F06050" fillOpacity="0.18"/>
            <path d="M38 40c4 4 8 8 6 14-2 6-8 8-14 6 0-6 2-12 8-20z" fill="#E86858" fillOpacity="0.55"/>
            <path d="M48 50c-4 4-8 8-14 6-6-2-8-8-6-14 6 0 14 2 20 8z" fill="#F08070" fillOpacity="0.52"/>
            <path d="M38 60c-4-4-8-8-6-14 2-6 8-8 14-6 0 6-2 12-8 20z" fill="#E86858" fillOpacity="0.55"/>
            <path d="M28 50c4-4 8-8 14-6 6 2 8 8 6 14-6 0-14-2-20-8z" fill="#F08070" fillOpacity="0.52"/>
            <circle cx="38" cy="50" r="4" fill="#FFD0C0" fillOpacity="0.75"/>
          </g>
          {/* Soft outer frame */}
          <rect x="14" y="14" width="252" height="392" rx="20" ry="20" stroke="#E07060" strokeOpacity="0.18" strokeWidth="1" fill="none"/>
        </svg>
      </>
    ),
    topAdornment: <div className="text-[10px] uppercase tracking-[0.44em] text-[#C05840]/86">Coral Drift</div>,
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
  ceremonyEvents = [],
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

    if (theme.layoutVariant === "blossom") {
      return (
        <div className={`w-full rounded-[0.8rem] px-4 py-4 text-center ${theme.contentPanelClassName ?? ""}`}>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.38em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          <div className="mx-auto my-2 flex w-20 items-center gap-2">
            <span className="h-px flex-1 bg-[#C9A96E]/35" />
            <span className="text-[#C9A96E] text-[10px] leading-none">◆</span>
            <span className="h-px flex-1 bg-[#C9A96E]/35" />
          </div>
          <div className={`mx-auto overflow-hidden rounded-[999px] border border-[#C9A96E]/35 p-0.5 ${compact ? "max-w-[4.5rem]" : "max-w-[5.5rem]"}`}>
            <div className="aspect-[3/4] overflow-hidden rounded-[999px]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-2 mb-1 flex w-16 items-center gap-2">
            <span className="h-px flex-1 bg-[#C9A96E]/35" />
            <span className="text-[#C9A96E] text-[10px] leading-none">❧</span>
            <span className="h-px flex-1 bg-[#C9A96E]/35" />
          </div>
          {namesMarkup}
          <div className="mx-auto mt-2 flex w-16 items-center gap-2">
            <span className="h-px flex-1 bg-[#C9A96E]/30" />
            <span className="text-[#C9A96E] text-[8px] leading-none">◆</span>
            <span className="h-px flex-1 bg-[#C9A96E]/30" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1.5 text-xs italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-2 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "botanical") {
      return (
        <div className="w-full text-center">
          <div className="mx-auto w-[78%] pointer-events-none" style={{ height: compact ? '32px' : '38px' }}>
            <svg viewBox="0 0 200 56" fill="none" className="h-full w-full">
              <path d="M100 48 Q80 38 58 26 Q38 16 14 8" stroke="#6A8C5E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.75"/>
              <path d="M100 48 Q120 38 142 26 Q162 16 186 8" stroke="#6A8C5E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.75"/>
              <ellipse cx="74" cy="30" rx="9" ry="5" transform="rotate(-38 74 30)" fill="#7E9E72" fillOpacity="0.76"/>
              <ellipse cx="70" cy="36" rx="9" ry="5" transform="rotate(-142 70 36)" fill="#6A8C5E" fillOpacity="0.68"/>
              <ellipse cx="54" cy="20" rx="8" ry="4.5" transform="rotate(-35 54 20)" fill="#8FAA7E" fillOpacity="0.72"/>
              <ellipse cx="50" cy="26" rx="8" ry="4.5" transform="rotate(-140 50 26)" fill="#7E9E72" fillOpacity="0.65"/>
              <ellipse cx="32" cy="12" rx="7" ry="4" transform="rotate(-30 32 12)" fill="#6A8C5E" fillOpacity="0.68"/>
              <ellipse cx="126" cy="30" rx="9" ry="5" transform="rotate(-142 126 30)" fill="#7E9E72" fillOpacity="0.76"/>
              <ellipse cx="130" cy="36" rx="9" ry="5" transform="rotate(-38 130 36)" fill="#6A8C5E" fillOpacity="0.68"/>
              <ellipse cx="146" cy="20" rx="8" ry="4.5" transform="rotate(-145 146 20)" fill="#8FAA7E" fillOpacity="0.72"/>
              <ellipse cx="150" cy="26" rx="8" ry="4.5" transform="rotate(-40 150 26)" fill="#7E9E72" fillOpacity="0.65"/>
              <ellipse cx="168" cy="12" rx="7" ry="4" transform="rotate(-150 168 12)" fill="#6A8C5E" fillOpacity="0.68"/>
              <circle cx="100" cy="48" r="2.5" fill="#95A870" fillOpacity="0.82"/>
              <circle cx="96" cy="45" r="1.8" fill="#7E9E72" fillOpacity="0.72"/>
              <circle cx="104" cy="45" r="1.8" fill="#7E9E72" fillOpacity="0.72"/>
            </svg>
          </div>
          {theme.topAdornment}
          <div className={`mx-auto mt-2 overflow-hidden rounded-full border-2 border-[#6A8C5E]/28 p-0.5 ${compact ? "w-10 h-10" : "w-14 h-14"}`}>
            <div className="w-full h-full overflow-hidden rounded-full">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-2 text-[9px] uppercase tracking-[0.38em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          {namesMarkup}
          <div className="mx-auto my-1.5 flex w-24 items-center gap-2">
            <span className="h-px flex-1 bg-[#6A8C5E]/30" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C9 7 2 9 2 12c0 3 7 5 10 10 3-5 10-7 10-10 0-3-7-5-10-10z" fill="#6A8C5E" fillOpacity="0.7"/></svg>
            <span className="h-px flex-1 bg-[#6A8C5E]/30" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} text-xs italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <div className="mx-auto w-[78%] mt-2 rotate-180 pointer-events-none" style={{ height: compact ? '28px' : '34px' }}>
            <svg viewBox="0 0 200 56" fill="none" className="h-full w-full">
              <path d="M100 48 Q80 38 58 26 Q38 16 14 8" stroke="#6A8C5E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.65"/>
              <path d="M100 48 Q120 38 142 26 Q162 16 186 8" stroke="#6A8C5E" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.65"/>
              <ellipse cx="74" cy="30" rx="9" ry="5" transform="rotate(-38 74 30)" fill="#7E9E72" fillOpacity="0.65"/>
              <ellipse cx="54" cy="20" rx="8" ry="4.5" transform="rotate(-35 54 20)" fill="#8FAA7E" fillOpacity="0.62"/>
              <ellipse cx="32" cy="12" rx="7" ry="4" transform="rotate(-30 32 12)" fill="#6A8C5E" fillOpacity="0.6"/>
              <ellipse cx="126" cy="30" rx="9" ry="5" transform="rotate(-142 126 30)" fill="#7E9E72" fillOpacity="0.65"/>
              <ellipse cx="146" cy="20" rx="8" ry="4.5" transform="rotate(-145 146 20)" fill="#8FAA7E" fillOpacity="0.62"/>
              <ellipse cx="168" cy="12" rx="7" ry="4" transform="rotate(-150 168 12)" fill="#6A8C5E" fillOpacity="0.6"/>
              <circle cx="100" cy="48" r="2.5" fill="#95A870" fillOpacity="0.75"/>
            </svg>
          </div>
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

    if (theme.layoutVariant === "petal") {
      return (
        <div className={`w-full rounded-[0.8rem] px-4 py-4 text-center ${theme.contentPanelClassName ?? ""}`}>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.40em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          <div className="mx-auto my-2 flex w-24 items-center gap-2">
            <span className="h-px flex-1 bg-[#C9607A]/30" />
            <span className="text-[#C9607A] text-[9px] leading-none">✦</span>
            <span className="h-px flex-1 bg-[#C9607A]/30" />
          </div>
          <div className={`mx-auto overflow-hidden rounded-[999px] border-2 border-[#E8B4C0]/55 p-0.5 ${compact ? "max-w-[4.5rem]" : "max-w-[5.5rem]"}`}>
            <div className="aspect-[3/4] overflow-hidden rounded-[999px]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-2 mb-1 flex w-20 items-center gap-2">
            <span className="h-px flex-1 bg-[#C9607A]/28" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2c-2 4-6 6-10 7 4 1 8 3 10 7 2-4 6-6 10-7-4-1-8-3-10-7z" fill="#C9607A" fillOpacity="0.72"/></svg>
            <span className="h-px flex-1 bg-[#C9607A]/28" />
          </div>
          {namesMarkup}
          <div className="mx-auto mt-2 flex w-16 items-center gap-2">
            <span className="h-px flex-1 bg-[#C9607A]/22" />
            <span className="text-[#C9607A] text-[8px] leading-none">✦</span>
            <span className="h-px flex-1 bg-[#C9607A]/22" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1.5 text-xs italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-2 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "velvet") {
      return (
        <div className={`w-full rounded-[1rem] px-4 py-5 text-center ${theme.contentPanelClassName ?? ""}`}>
          {theme.topAdornment}
          <div className="mx-auto mt-3 mb-3 w-[82%] max-w-[12rem] overflow-hidden rounded-[1rem] border border-[#C9A0D4]/22 p-0.5">
            <div className="aspect-[4/5] overflow-hidden rounded-[0.8rem]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.38em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          {namesMarkup}
          <div className="mx-auto my-2 flex w-24 items-center gap-2">
            <span className="h-px flex-1 bg-[#E8C070]/28" />
            <span className="text-[#E8C070] text-[10px] leading-none">✦</span>
            <span className="h-px flex-1 bg-[#E8C070]/28" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} text-xs italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-2 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "minimal") {
      return (
        <div className="w-full text-center px-2">
          {theme.topAdornment}
          <p className={`${selectedTypographyConfig.bodyFont} mt-4 text-[9px] uppercase tracking-[0.52em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          <div className="mx-auto my-3 h-px w-16 bg-[#8C7860]/25" />
          {namesMarkup}
          <div className="mx-auto my-3 h-px w-16 bg-[#8C7860]/25" />
          <div className={`mx-auto overflow-hidden rounded-[0.5rem] border border-[#C8B89A]/30 ${compact ? "max-w-[5rem]" : "max-w-[8rem]"}`}>
            <div className="aspect-[4/3] overflow-hidden">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-3 text-[10px] italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-2 text-[9px] uppercase tracking-[0.32em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "garden") {
      return (
        <div className={`w-full rounded-[0.9rem] px-4 py-5 text-center ${theme.contentPanelClassName ?? ""}`}>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.40em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          <div className="mx-auto my-2 flex w-20 items-center gap-2">
            <span className="h-px flex-1 bg-[#7EAA5C]/35" />
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none"><path d="M10 2c-1 3-4 5-8 6 4 1 7 3 8 6 1-3 4-5 8-6-4-1-7-3-8-6z" fill="#7EAA5C" fillOpacity="0.80"/></svg>
            <span className="h-px flex-1 bg-[#7EAA5C]/35" />
          </div>
          <div className={`mx-auto overflow-hidden rounded-[999px_999px_0.8rem_0.8rem] border border-[#A8CC8C]/40 p-0.5 ${compact ? "max-w-[4.5rem]" : "max-w-[5.5rem]"}`}>
            <div className="aspect-[3/4] overflow-hidden rounded-[999px_999px_0.6rem_0.6rem]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-2 mb-1 flex w-16 items-center gap-2">
            <span className="h-px flex-1 bg-[#7EAA5C]/30" />
            <span className="text-[#7EAA5C] text-[8px] leading-none">✿</span>
            <span className="h-px flex-1 bg-[#7EAA5C]/30" />
          </div>
          {namesMarkup}
          <div className="mx-auto mt-2 flex w-16 items-center gap-2">
            <span className="h-px flex-1 bg-[#7EAA5C]/25" />
            <span className="text-[#7EAA5C] text-[7px] leading-none">✿</span>
            <span className="h-px flex-1 bg-[#7EAA5C]/25" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1.5 text-xs italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-2 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "crimson") {
      return (
        <div className={`w-full rounded-[0.9rem] px-4 py-4 text-center ${theme.contentPanelClassName ?? ""}`}>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.42em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          <div className="mx-auto my-2 flex w-24 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#B8922A]/35" />
            <span className="text-[#B8922A] text-[11px] leading-none">❧</span>
            <span className="h-px flex-1 bg-[#B8922A]/35" />
          </div>
          <div className={`mx-auto overflow-hidden rounded-[999px] border-2 border-[#D4606A]/35 p-0.5 ${compact ? "max-w-[4.5rem]" : "max-w-[5.5rem]"}`}>
            <div className="aspect-[3/4] overflow-hidden rounded-[999px]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-2 mb-1 flex w-20 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#B8922A]/30" />
            <span className="text-[#B8922A] text-[11px] leading-none">◆</span>
            <span className="h-px flex-1 bg-[#B8922A]/30" />
          </div>
          {namesMarkup}
          <div className="mx-auto mt-2 flex w-16 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#B8922A]/25" />
            <span className="text-[#B8922A] text-[8px] leading-none">◆</span>
            <span className="h-px flex-1 bg-[#B8922A]/25" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1.5 text-xs italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-2 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "harvest") {
      return (
        <div className={`w-full rounded-[0.9rem] px-4 py-4 text-center ${theme.contentPanelClassName ?? ""}`}>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.44em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          <div className="mx-auto my-1.5 flex w-22 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#C88A2A]/30" />
            <span className={`text-[10px] ${theme.accentToneClassName}`}>✦</span>
            <span className="h-px flex-1 bg-[#C88A2A]/30" />
          </div>
          {namesMarkup}
          <div className="mx-auto mt-2 mb-1 flex w-18 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#C88A2A]/28" />
            <span className={`text-[9px] ${theme.accentToneClassName}`}>❧</span>
            <span className="h-px flex-1 bg-[#C88A2A]/28" />
          </div>
          <div className={`mx-auto overflow-hidden rounded-[999px] border-2 border-[#D4A84A]/38 p-0.5 ${compact ? "max-w-[4.5rem]" : "max-w-[5.5rem]"}`}>
            <div className="aspect-[3/4] overflow-hidden rounded-[999px]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-2 flex w-16 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#C88A2A]/25" />
            <span className={`text-[8px] ${theme.accentToneClassName}`}>✦</span>
            <span className="h-px flex-1 bg-[#C88A2A]/25" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "wisteria") {
      return (
        <div className={`w-full rounded-[1rem] px-4 py-4 text-center ${theme.contentPanelClassName ?? ""}`}>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.42em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          <div className={`mx-auto my-2 overflow-hidden border-[1.5px] border-[#9A60BE]/32 p-0.5 ${compact ? "max-w-[5rem]" : "max-w-[6.5rem]"}`}
            style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}>
            <div className="aspect-[3/4] overflow-hidden" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}>
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto my-2 flex w-20 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#9A60BE]/28" />
            <span className={`text-[11px] ${theme.accentToneClassName}`}>✿</span>
            <span className="h-px flex-1 bg-[#9A60BE]/28" />
          </div>
          {namesMarkup}
          <p className={`${selectedTypographyConfig.bodyFont} mt-1.5 text-[9px] italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "pearl") {
      return (
        <div className={`w-full rounded-[1rem] px-4 py-4 text-center ${theme.contentPanelClassName ?? ""}`}>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.46em] ${theme.subTextToneClassName}`}>Wedding Invitation</p>
          <div className="mx-auto my-2 flex w-16 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#6890B8]/22" />
            <span className="text-[#6890B8] text-[11px]">◯</span>
            <span className="h-px flex-1 bg-[#6890B8]/22" />
          </div>
          {/* Pearl oval portrait */}
          <div className="relative mx-auto" style={{ width: compact ? '4.2rem' : '5.2rem' }}>
            <div className="absolute inset-[-3px] rounded-full border-2 border-[#B8D0E4]/45" />
            <div className="absolute inset-[-7px] rounded-full border border-[#B8D0E4]/22" />
            <div className={`overflow-hidden rounded-full border border-[#B8D0E4]/38`}>
              <div className="aspect-square overflow-hidden rounded-full">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-3 mb-2 flex w-16 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#6890B8]/22" />
            <span className="text-[#6890B8] text-[8px]">◆</span>
            <span className="h-px flex-1 bg-[#6890B8]/22" />
          </div>
          {namesMarkup}
          <p className={`${selectedTypographyConfig.bodyFont} mt-1.5 text-[9px] italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "royale") {
      return (
        <div className={`w-full rounded-[0.9rem] px-4 py-4 text-center ${theme.contentPanelClassName ?? ""}`}>
          <p className={`${selectedTypographyConfig.bodyFont} text-[9px] uppercase tracking-[0.46em] text-[#E8C868]/84`}>Royal Invitation</p>
          <div className="mx-auto my-1.5 flex w-20 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#E8C868]/25" />
            <span className="text-[#E8C868]/80 text-[11px]">✦</span>
            <span className="h-px flex-1 bg-[#E8C868]/25" />
          </div>
          {/* Ornate oval portrait on dark bg */}
          <div className="relative mx-auto" style={{ width: compact ? '4.5rem' : '5.5rem' }}>
            <div className="absolute inset-[-4px] rounded-full border border-[#E8C868]/32" />
            <div className="absolute inset-[-2px] rounded-full border-2 border-[#E8C868]/22" />
            <div className="overflow-hidden rounded-full border border-[#E8C868]/28">
              <div className="aspect-[3/4] overflow-hidden rounded-full">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-3 mb-1.5 flex w-16 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#E8C868]/22" />
            <span className="text-[#E8C868]/80 text-[8px]">◆</span>
            <span className="h-px flex-1 bg-[#E8C868]/22" />
          </div>
          {namesMarkup}
          <p className={`${selectedTypographyConfig.bodyFont} mt-1.5 text-[9px] italic ${theme.subTextToneClassName}`}>Together with their families</p>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1 text-[9px] uppercase tracking-[0.28em] text-[#E8C868]/70`}>{eventDate}</p>
        </div>
      );
    }

    if (theme.layoutVariant === "drift") {
      return (
        <div className={`w-full rounded-[0.9rem] px-4 py-4 text-center ${theme.contentPanelClassName ?? ""}`}>
          <div className={`mx-auto overflow-hidden rounded-xl border border-[#E07060]/28 ${compact ? "max-w-[5.5rem]" : "max-w-[7rem]"}`}>
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-3 mb-2 flex w-20 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#E07060]/28" />
            <span className={`text-[11px] ${theme.accentToneClassName}`}>✿</span>
            <span className="h-px flex-1 bg-[#E07060]/28" />
          </div>
          {namesMarkup}
          <div className="mx-auto mt-2 flex w-16 items-center gap-1.5">
            <span className="h-px flex-1 bg-[#E07060]/22" />
            <span className={`text-[8px] ${theme.accentToneClassName}`}>✦</span>
            <span className="h-px flex-1 bg-[#E07060]/22" />
          </div>
          <p className={`${selectedTypographyConfig.bodyFont} mt-1.5 text-[9px] uppercase tracking-[0.28em] ${theme.subTextToneClassName}`}>{eventDate}</p>
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
                <div className={`relative mx-auto aspect-[9/16] overflow-hidden rounded-[1.4rem] ${previewCardWidthClass} ${selectedTheme.previewClassName}`}>
                <div className="absolute inset-0" style={selectedTheme.overlay} />
                <div className="absolute inset-0">{selectedTheme.ornament}</div>
                <div className="absolute inset-[12px] rounded-[1.1rem]" style={selectedTheme.frameStyle} />
                <div className={`relative z-10 flex h-full items-center justify-center p-4 ${selectedTheme.textToneClassName}`}>
                  <div className="w-full">
                    {renderPreviewHero(selectedTheme)}
                    <div className="mt-4 text-center space-y-2">
                      <button className="px-6 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium">RSVP Now</button>
                      {ceremonyEvents.filter(e => e.google_maps_link).map((event, i) => (
                        <a
                          key={i}
                          href={event.google_maps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-5 py-1.5 rounded-lg border border-current/30 text-xs font-medium hover:bg-current/10 transition-colors"
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {ceremonyEvents.filter(e => e.google_maps_link).length > 1
                            ? `View Map · ${event.label}`
                            : 'View on Map'}
                        </a>
                      ))}
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
