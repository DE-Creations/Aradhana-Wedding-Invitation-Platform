import { useState, useEffect, useRef } from "react";
import { Heart, MapPin, Clock, Calendar, ChevronLeft, ChevronRight, Phone, X, Check } from "lucide-react";
import { typographyOptions } from "@/data/invitationConstants";
import axios from "axios";
import { motion } from "framer-motion";

interface WeddingData {
  bride_name: string;
  groom_name: string;
  bride_parents_names: string | null;
  groom_parents_names: string | null;
  wedding_type_id: string;
  contact_number_1: string | null;
  contact_number_2: string | null;
  template_key: string;
  typography_key: string;
  rsvp_deadline?: string | null;
}

interface CeremonyEvent {
  label: string;
  date: string;
  venue: string;
  start_time: string;
  end_time: string;
  poruwa_time?: string;
  google_maps_link?: string;
}

interface GuestData {
  id: number;
  guest_name: string;
  guest_token: string;
  max_attendees: number;
  rsvp_status: string;
}

interface PublicInvitationPageProps {
  onBack?: () => void;
  templateKey: string;
  typographyKey: string;
  wedding: WeddingData;
  guest?: GuestData | null;
  eventToken?: string;
  coupleMainImage?: string | null;
  coupleGalleryImages?: string[];
  ceremonyEvents?: CeremonyEvent[];
  googleMapsLink?: string | null;
}

interface InvitationTheme {
  pageClassName: string;
  previewClassName: string;
  textToneClassName: string;
  subTextToneClassName: string;
  accentToneClassName: string;
  chipClassName: string;
  surfaceClassName: string;
  softSurfaceClassName: string;
  buttonClassName: string;
  modalClassName: string;
  overlay?: React.CSSProperties;
  frameStyle?: React.CSSProperties;
  layoutVariant?: "default" | "cameo" | "arch" | "split" | "celestial" | "asymmetric" | "blossom" | "botanical" | "petal" | "velvet" | "minimal" | "garden" | "crimson" | "harvest" | "wisteria" | "pearl" | "royale" | "drift";
  ornament: React.ReactNode;
}

const formatTime12 = (t: string | null | undefined): string => {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${mStr} ${ampm}`;
};

const formatGoogleCalendarDate = (date: string, time: string) => `${date.split("-").join("")}T${time.split(":").join("")}00`;

const buildGoogleCalendarUrl = (wedding: WeddingData, firstEvent?: CeremonyEvent) => {
  if (!firstEvent) return '#';
  const title = `${wedding.bride_name} & ${wedding.groom_name} Wedding`;
  const details = `Join us in celebrating the wedding of ${wedding.bride_name} and ${wedding.groom_name}.\n\nVenue: ${firstEvent.venue}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatGoogleCalendarDate(firstEvent.date, firstEvent.start_time)}/${formatGoogleCalendarDate(firstEvent.date, firstEvent.end_time)}`,
    details,
    location: firstEvent.venue,
    ctz: "Asia/Colombo",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const invitationThemes: Record<string, InvitationTheme> = {
  "rose-reverie": {
    pageClassName: "bg-[linear-gradient(180deg,#FFF7F6_0%,#F7E2E6_52%,#F5D6DA_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FFF7F6_0%,#F7E2E6_52%,#F5D6DA_100%)]",
    textToneClassName: "text-[#5E2433]",
    subTextToneClassName: "text-[#7A5561]/85",
    accentToneClassName: "text-[#C76A82]",
    chipClassName: "bg-white/70 border border-[#D89AA8]/45 text-[#B95B76] shadow-sm",
    surfaceClassName: "bg-white/58 border border-[#E8BBC6]/45 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(199,106,130,0.42)]",
    softSurfaceClassName: "bg-white/42 border border-[#EBC3CC]/40 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#D9748D] to-[#E6A07C] text-white shadow-[0_8px_24px_rgba(217,116,141,0.28)]",
    modalClassName: "bg-[#FFF6F4] border-[#D89AA8]/35",
    layoutVariant: "cameo",
    overlay: {
      backgroundImage: `radial-gradient(circle at 18% 18%, rgba(255,255,255,0.75) 0, transparent 26%), radial-gradient(circle at 82% 24%, rgba(226,150,169,0.22) 0, transparent 28%), radial-gradient(circle at 28% 78%, rgba(245,201,171,0.3) 0, transparent 24%), url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D98CA3' stroke-opacity='0.11' stroke-width='2'%3E%3Cpath d='M38 82c10-26 48-33 62-10 14 23-6 51-28 54-26 4-50-26-34-52z'/%3E%3Cpath d='M116 40c8 10 16 22 6 34-10 12-28 8-36-4-7-11-2-28 30-30z'/%3E%3Cpath d='M130 122c-16 10-34 12-48 2-12-8-14-24-2-34 14-13 34-3 44 12 7 16 2 26 6 20z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, auto, 180px 180px",
      backgroundPosition: "center, center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(199,106,130,0.26)",
      borderRadius: "2.8rem",
      boxShadow: "inset 0 0 0 8px rgba(255,255,255,0.22)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute inset-x-12 top-7 h-24 border border-[#D98CA3]/25 border-b-0 rounded-t-[999px] pointer-events-none" />
        <div className="absolute inset-x-16 bottom-7 h-16 border border-[#E6A07C]/18 border-t-0 rounded-b-[999px] pointer-events-none" />
        <div className="absolute -left-3 -top-3 h-40 w-40 opacity-80 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><path d="M62 48c12-15 31-18 43-7 14 12 12 33-3 46-15 13-36 13-48 0-12-13-6-29 8-39z" fill="#D97B92" fillOpacity="0.35"/><path d="M44 72c1-21 22-38 45-36 18 1 30 13 31 29 1 18-17 38-42 39-18 1-35-13-34-32z" fill="#F3B6C2" fillOpacity="0.42"/><path d="M98 112c8 10 15 19 11 28-4 9-18 9-31 1-13-8-23-24-17-32 7-9 24-7 37 3z" fill="#8CB58A" fillOpacity="0.45"/></svg>
        </div>
        <div className="absolute -right-3 bottom-0 h-40 w-40 rotate-180 opacity-80 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><path d="M62 48c12-15 31-18 43-7 14 12 12 33-3 46-15 13-36 13-48 0-12-13-6-29 8-39z" fill="#D97B92" fillOpacity="0.35"/><path d="M44 72c1-21 22-38 45-36 18 1 30 13 31 29 1 18-17 38-42 39-18 1-35-13-34-32z" fill="#F3B6C2" fillOpacity="0.42"/><path d="M98 112c8 10 15 19 11 28-4 9-18 9-31 1-13-8-23-24-17-32 7-9 24-7 37 3z" fill="#8CB58A" fillOpacity="0.45"/></svg>
        </div>
      </>
    ),
  },
  "moonstone-bliss": {
    pageClassName: "bg-[linear-gradient(180deg,#FBF8EF_0%,#EEF3EA_50%,#DDE6D6_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FBF8EF_0%,#EEF3EA_50%,#DDE6D6_100%)]",
    textToneClassName: "text-[#495545]",
    subTextToneClassName: "text-[#6D7765]/85",
    accentToneClassName: "text-[#C8A85A]",
    chipClassName: "bg-white/72 border border-[#D2B56C]/40 text-[#B89243] shadow-sm",
    surfaceClassName: "bg-white/52 border border-[#D6DFD1]/65 backdrop-blur-md shadow-[0_18px_46px_-28px_rgba(122,142,109,0.32)]",
    softSurfaceClassName: "bg-white/40 border border-[#DCE5D7]/70 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#C7A85E] to-[#E0C98B] text-[#4A4534] shadow-[0_8px_22px_rgba(199,168,94,0.25)]",
    modalClassName: "bg-[#FAF7EE] border-[#D2B56C]/35",
    layoutVariant: "arch",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.82) 0, transparent 24%), radial-gradient(circle at 20% 78%, rgba(199,168,94,0.14) 0, transparent 22%), url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D2B56C' stroke-opacity='0.12' stroke-width='2'%3E%3Cpath d='M20 140c24-46 58-70 90-70s66 24 90 70'/%3E%3Cpath d='M36 154c20-34 50-54 74-54s54 20 74 54'/%3E%3Cpath d='M60 166c14-20 32-30 50-30s36 10 50 30'/%3E%3Cpath d='M46 112c8-8 18-12 28-12 10 0 20 4 28 12'/%3E%3C/g%3E%3Cg fill='%23D2B56C' fill-opacity='0.11'%3E%3Cpath d='M110 92c8 12 16 18 30 24-14 6-22 12-30 24-8-12-16-18-30-24 14-6 22-12 30-24z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 220px 220px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(210,181,108,0.26)",
      borderRadius: "3rem 3rem 2.2rem 2.2rem / 2rem 2rem 2.8rem 2.8rem",
      boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.18)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute left-1/2 top-2 h-24 w-[72%] -translate-x-1/2 opacity-85 pointer-events-none">
          <svg viewBox="0 0 320 120" fill="none"><path d="M28 96c38-48 82-72 132-72s94 24 132 72" stroke="#D2B56C" strokeOpacity="0.34" strokeWidth="2.2"/><path d="M56 100c28-30 66-46 104-46s76 16 104 46" stroke="#D2B56C" strokeOpacity="0.28" strokeWidth="1.8"/><path d="M138 60c8 9 14 14 22 18-8 4-14 9-22 18-8-9-14-14-22-18 8-4 14-9 22-18z" fill="#D2B56C" fillOpacity="0.26"/><path d="M182 60c8 9 14 14 22 18-8 4-14 9-22 18-8-9-14-14-22-18 8-4 14-9 22-18z" fill="#D2B56C" fillOpacity="0.26"/></svg>
        </div>
        <div className="absolute left-1/2 bottom-2 h-20 w-[58%] -translate-x-1/2 rotate-180 opacity-70 pointer-events-none">
          <svg viewBox="0 0 320 120" fill="none"><path d="M28 96c38-48 82-72 132-72s94 24 132 72" stroke="#A2B58D" strokeOpacity="0.28" strokeWidth="2"/><path d="M56 100c28-30 66-46 104-46s76 16 104 46" stroke="#A2B58D" strokeOpacity="0.22" strokeWidth="1.6"/></svg>
        </div>
      </>
    ),
  },
  "lily-lagoon": {
    pageClassName: "bg-[linear-gradient(180deg,#F3FEFF_0%,#E1F5F7_50%,#D4F1F4_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#F3FEFF_0%,#E1F5F7_50%,#D4F1F4_100%)]",
    textToneClassName: "text-[#214B57]",
    subTextToneClassName: "text-[#597984]/82",
    accentToneClassName: "text-[#6BA7B8]",
    chipClassName: "bg-white/70 border border-[#8BC5CF]/42 text-[#5C96A8] shadow-sm",
    surfaceClassName: "bg-white/55 border border-[#C7E9EC]/68 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(107,167,184,0.32)]",
    softSurfaceClassName: "bg-white/42 border border-[#D5EFF2]/68 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#6BA7B8] to-[#95D2D9] text-white shadow-[0_8px_24px_rgba(107,167,184,0.28)]",
    modalClassName: "bg-[#F3FEFF] border-[#8BC5CF]/35",
    layoutVariant: "split",
    overlay: {
      backgroundImage: `radial-gradient(circle at 12% 18%, rgba(255,255,255,0.78) 0, transparent 24%), radial-gradient(circle at 82% 82%, rgba(107,167,184,0.18) 0, transparent 22%), url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236BA7B8' stroke-opacity='0.14' stroke-width='2'%3E%3Cpath d='M14 116c24-32 52-48 84-48 20 0 34 4 48 14'/%3E%3Cpath d='M18 130c26-20 54-30 84-30 18 0 32 3 44 10'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 160px 160px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(107,167,184,0.25)",
      borderRadius: "2.5rem 2.5rem 3rem 3rem / 2.6rem 2.6rem 2rem 2rem",
      boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.18)",
      margin: "0.95rem",
    },
    ornament: (
      <>
        <div className="absolute left-0 top-0 h-44 w-40 opacity-80 pointer-events-none">
          <svg viewBox="0 0 160 180" fill="none"><path d="M76 42c10 18 12 35 4 52-9 20-28 30-46 28 6-16 18-33 36-50 3-3 4-6 6-30z" fill="#FFFFFF" fillOpacity="0.88"/><path d="M82 46c18 12 28 26 30 42 3 18-6 34-24 44-6-18-8-38-6-60 0-8 0-14 0-26z" fill="#DDF8FA" fillOpacity="0.92"/><path d="M76 62c-16 8-28 20-34 34-7 16-4 31 8 46 10-16 18-35 24-58 2-7 2-12 2-22z" fill="#EAFDFE" fillOpacity="0.86"/><path d="M82 104c20 12 28 24 26 38-2 10-10 16-24 18-8-18-9-36-2-56z" fill="#7AB7B6" fillOpacity="0.4"/></svg>
        </div>
        <div className="absolute right-0 bottom-0 h-44 w-40 rotate-180 opacity-80 pointer-events-none">
          <svg viewBox="0 0 160 180" fill="none"><path d="M76 42c10 18 12 35 4 52-9 20-28 30-46 28 6-16 18-33 36-50 3-3 4-6 6-30z" fill="#FFFFFF" fillOpacity="0.88"/><path d="M82 46c18 12 28 26 30 42 3 18-6 34-24 44-6-18-8-38-6-60 0-8 0-14 0-26z" fill="#DDF8FA" fillOpacity="0.92"/><path d="M76 62c-16 8-28 20-34 34-7 16-4 31 8 46 10-16 18-35 24-58 2-7 2-12 2-22z" fill="#EAFDFE" fillOpacity="0.86"/><path d="M82 104c20 12 28 24 26 38-2 10-10 16-24 18-8-18-9-36-2-56z" fill="#7AB7B6" fillOpacity="0.4"/></svg>
        </div>
        <div className="absolute inset-x-14 top-8 h-20 border border-[#8BC5CF]/24 border-b-0 rounded-t-[999px] pointer-events-none" />
      </>
    ),
  },
  "faded-picture-overlay": {
    pageClassName: "bg-stone-900",
    previewClassName: "bg-stone-950",
    textToneClassName: "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
    subTextToneClassName: "text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
    accentToneClassName: "text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
    chipClassName: "bg-black/40 border border-white/20 text-white/90 shadow-md",
    surfaceClassName: "bg-black/40 border border-white/20 backdrop-blur-md shadow-lg",
    softSurfaceClassName: "bg-black/30 border border-white/15 backdrop-blur-md",
    buttonClassName: "bg-white text-stone-900 shadow-md hover:bg-white/90",
    modalClassName: "bg-[#201915] border-white/10",
    layoutVariant: "default",
    overlay: {
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    },
    frameStyle: {
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "inset 0 0 0 14px rgba(0, 0, 0, 0.3)",
    },
    ornament: (
      <>
        <div className="absolute inset-6 border border-white/20 rounded-lg pointer-events-none" />
        <div className="absolute inset-x-14 top-10 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
      </>
    ),
  },
  "midnight-celestial": {
    pageClassName: "bg-[linear-gradient(135deg,#1B1434_0%,#121933_54%,#0D1022_100%)]",
    previewClassName: "bg-[linear-gradient(135deg,#1B1434_0%,#121933_54%,#0D1022_100%)]",
    textToneClassName: "text-[#F9F2E2]",
    subTextToneClassName: "text-[#D8D1C6]/82",
    accentToneClassName: "text-[#F4D37B]",
    chipClassName: "bg-[#120F25]/72 border border-[#F4D37B]/28 text-[#F4D37B]",
    surfaceClassName: "bg-[#120F25]/46 border border-[#F4D37B]/16 backdrop-blur-md shadow-[0_24px_60px_-34px_rgba(0,0,0,0.65)]",
    softSurfaceClassName: "bg-[#17112B]/40 border border-[#F4D37B]/12 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#F4D37B] to-[#D9A95E] text-[#1A1531] shadow-[0_10px_28px_rgba(244,211,123,0.22)]",
    modalClassName: "bg-[#140F26] border-[#F4D37B]/22",
    layoutVariant: "celestial",
    overlay: {
      backgroundImage: `radial-gradient(circle at center, rgba(244,211,123,0.1) 0, transparent 32%), radial-gradient(circle at center, rgba(103,73,158,0.16) 0, transparent 52%), url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23F4D37B' stroke-opacity='0.12'%3E%3Ccircle cx='110' cy='110' r='28'/%3E%3Ccircle cx='110' cy='110' r='48'/%3E%3Ccircle cx='110' cy='110' r='68'/%3E%3Cpath d='M110 28l10 22 24 6-18 16 4 24-20-12-20 12 4-24-18-16 24-6z'/%3E%3Cpath d='M110 124l10 22 24 6-18 16 4 24-20-12-20 12 4-24-18-16 24-6z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 220px 220px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(244,211,123,0.24)",
      borderRadius: "3rem 3rem 2rem 2rem / 2.4rem 2.4rem 3rem 3rem",
      boxShadow: "inset 0 0 0 6px rgba(244,211,123,0.06)",
      margin: "1rem",
    },
    ornament: (
      <>
        <div className="absolute left-1/2 top-4 h-24 w-[76%] -translate-x-1/2 opacity-90 pointer-events-none">
          <svg viewBox="0 0 320 120" fill="none"><path d="M20 84c34-18 64-54 140-54s106 36 140 54" stroke="#F4D37B" strokeOpacity="0.24" strokeWidth="2"/><path d="M48 98c28-12 56-34 112-34s84 22 112 34" stroke="#F4D37B" strokeOpacity="0.18" strokeWidth="1.6"/><path d="M160 26l8 18 20 5-15 13 3 20-16-10-16 10 3-20-15-13 20-5z" fill="#F4D37B" fillOpacity="0.18"/></svg>
        </div>
        <div className="absolute left-1/2 bottom-4 h-20 w-[68%] -translate-x-1/2 opacity-70 pointer-events-none">
          <svg viewBox="0 0 320 120" fill="none"><path d="M30 36c42 22 58 50 130 50s88-28 130-50" stroke="#F4D37B" strokeOpacity="0.18" strokeWidth="2"/><path d="M58 30c28 14 42 28 102 28s74-14 102-28" stroke="#F4D37B" strokeOpacity="0.14" strokeWidth="1.4"/></svg>
        </div>
      </>
    ),
  },
  "blossom-glory": {
    pageClassName: "bg-[linear-gradient(180deg,#FFF8EE_0%,#F9EEDD_55%,#F3E1C0_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FFF8EE_0%,#F9EEDD_55%,#F3E1C0_100%)]",
    textToneClassName: "text-[#3D1018]",
    subTextToneClassName: "text-[#6B3040]/82",
    accentToneClassName: "text-[#C9A96E]",
    chipClassName: "bg-white/72 border border-[#C9A96E]/40 text-[#8B1A3A] shadow-sm",
    surfaceClassName: "bg-white/58 border border-[#C9A96E]/32 backdrop-blur-md shadow-[0_22px_50px_-28px_rgba(139,26,58,0.28)]",
    softSurfaceClassName: "bg-white/48 border border-[#C9A96E]/25 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#A41840] to-[#C84070] text-white shadow-[0_10px_26px_rgba(164,24,64,0.28)]",
    modalClassName: "bg-[#FFF6EE] border-[#C9A96E]/32",
    layoutVariant: "blossom",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(255,252,240,0.55) 0, transparent 70%)`,
    },
    frameStyle: {
      border: "1px solid rgba(201,169,110,0.38)",
      borderRadius: "3rem",
      boxShadow: "inset 0 0 0 8px rgba(255,255,255,0.28)",
      margin: "1rem",
    },
    ornament: (
      <>
        {/* Top-left rose */}
        <div className="absolute -left-4 -top-4 h-52 w-52 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none">
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
          </svg>
        </div>
        {/* Top-right rose (mirror X) */}
        <div className="absolute -right-4 -top-4 h-52 w-52 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none">
            <path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84070" fillOpacity="0.82"/>
            <path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84070" fillOpacity="0.78"/>
            <path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E07090" fillOpacity="0.82"/>
            <path d="M20 48c-2-10 6-22 18-22 12 0 20 10 18 22-2 12-12 18-26 12-6-2-10-8-10-12z" fill="#E07090" fillOpacity="0.78"/>
            <circle cx="44" cy="44" r="13" fill="#9A1840" fillOpacity="0.88"/>
            <circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.9"/>
            <path d="M80 42c-8-2-18 4-18 14s10 16 18 14c9-2 14-10 10-20-2-6-6-8-10-8z" fill="#D05070" fillOpacity="0.7"/>
            <circle cx="78" cy="58" r="9" fill="#AA2050" fillOpacity="0.78"/>
            <circle cx="75" cy="55" r="3.5" fill="#FCC0CC" fillOpacity="0.82"/>
            <path d="M44 44c5 8 10 20 14 36" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c-8 5-20 10-36 14" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M56 68c4 10 16 18 30 22C78 82 64 74 56 68z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M68 56c10 4 18 16 22 30C82 78 72 64 68 56z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M64 16c2 8 10 14 26 16C80 24 70 18 64 16z" fill="#357050" fillOpacity="0.64"/>
            <path d="M16 64c8 2 14 10 16 26C24 80 18 70 16 64z" fill="#357050" fillOpacity="0.64"/>
          </svg>
        </div>
        {/* Bottom-left rose (mirror Y) */}
        <div className="absolute -left-4 -bottom-4 h-52 w-52 pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none">
            <path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84070" fillOpacity="0.82"/>
            <path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84070" fillOpacity="0.78"/>
            <path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E07090" fillOpacity="0.82"/>
            <path d="M20 48c-2-10 6-22 18-22 12 0 20 10 18 22-2 12-12 18-26 12-6-2-10-8-10-12z" fill="#E07090" fillOpacity="0.78"/>
            <circle cx="44" cy="44" r="13" fill="#9A1840" fillOpacity="0.88"/>
            <circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.9"/>
            <path d="M80 42c-8-2-18 4-18 14s10 16 18 14c9-2 14-10 10-20-2-6-6-8-10-8z" fill="#D05070" fillOpacity="0.7"/>
            <circle cx="78" cy="58" r="9" fill="#AA2050" fillOpacity="0.78"/>
            <path d="M44 44c5 8 10 20 14 36" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c-8 5-20 10-36 14" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M56 68c4 10 16 18 30 22C78 82 64 74 56 68z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M68 56c10 4 18 16 22 30C82 78 72 64 68 56z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M64 16c2 8 10 14 26 16C80 24 70 18 64 16z" fill="#357050" fillOpacity="0.64"/>
            <path d="M16 64c8 2 14 10 16 26C24 80 18 70 16 64z" fill="#357050" fillOpacity="0.64"/>
          </svg>
        </div>
        {/* Bottom-right rose (rotate 180) */}
        <div className="absolute -right-4 -bottom-4 h-52 w-52 rotate-180 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none">
            <path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84070" fillOpacity="0.82"/>
            <path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84070" fillOpacity="0.78"/>
            <path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E07090" fillOpacity="0.82"/>
            <path d="M20 48c-2-10 6-22 18-22 12 0 20 10 18 22-2 12-12 18-26 12-6-2-10-8-10-12z" fill="#E07090" fillOpacity="0.78"/>
            <circle cx="44" cy="44" r="13" fill="#9A1840" fillOpacity="0.88"/>
            <circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.9"/>
            <path d="M80 42c-8-2-18 4-18 14s10 16 18 14c9-2 14-10 10-20-2-6-6-8-10-8z" fill="#D05070" fillOpacity="0.7"/>
            <circle cx="78" cy="58" r="9" fill="#AA2050" fillOpacity="0.78"/>
            <path d="M44 44c5 8 10 20 14 36" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M44 44c-8 5-20 10-36 14" stroke="#2A6040" strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
            <path d="M56 68c4 10 16 18 30 22C78 82 64 74 56 68z" fill="#2A6040" fillOpacity="0.72"/>
            <path d="M68 56c10 4 18 16 22 30C82 78 72 64 68 56z" fill="#2A6040" fillOpacity="0.72"/>
          </svg>
        </div>
        {/* Inner double border */}
        <div className="absolute inset-8 border border-[#C9A96E]/22 rounded-[2.2rem] pointer-events-none" />
        <div className="absolute inset-10 border border-[#C9A96E]/14 rounded-[1.9rem] pointer-events-none" />
      </>
    ),
  },
  "verdant-whisper": {
    pageClassName: "bg-[linear-gradient(180deg,#FEFCF5_0%,#F2F5EC_52%,#E8EDE0_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FEFCF5_0%,#F2F5EC_52%,#E8EDE0_100%)]",
    textToneClassName: "text-[#2C3E25]",
    subTextToneClassName: "text-[#4E6244]/82",
    accentToneClassName: "text-[#7A9B6A]",
    chipClassName: "bg-white/78 border border-[#9AB58A]/40 text-[#5A7A4E] shadow-sm",
    surfaceClassName: "bg-white/56 border border-[#9AB58A]/42 backdrop-blur-md shadow-[0_20px_48px_-28px_rgba(106,140,94,0.28)]",
    softSurfaceClassName: "bg-white/44 border border-[#B5C4A5]/45 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#5A7A4E] to-[#7A9B6A] text-white shadow-[0_10px_26px_rgba(90,122,78,0.25)]",
    modalClassName: "bg-[#FAFCF6] border-[#9AB58A]/34",
    layoutVariant: "botanical",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 18%, rgba(255,255,250,0.58) 0, transparent 52%), radial-gradient(circle at 50% 85%, rgba(195,215,180,0.18) 0, transparent 38%)`,
    },
    frameStyle: {
      border: "1px solid rgba(106,140,94,0.24)",
      borderRadius: "3rem",
      boxShadow: "inset 0 0 0 8px rgba(255,255,255,0.2)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        {/* Top botanical branch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[84%] pointer-events-none" style={{ height: '60px' }}>
          <svg viewBox="0 0 200 56" fill="none" className="h-full w-full">
            <path d="M100 48 Q80 38 58 26 Q38 16 14 8" stroke="#6A8C5E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.72"/>
            <path d="M100 48 Q120 38 142 26 Q162 16 186 8" stroke="#6A8C5E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.72"/>
            <ellipse cx="74" cy="30" rx="10" ry="5.5" transform="rotate(-38 74 30)" fill="#7E9E72" fillOpacity="0.76"/>
            <ellipse cx="70" cy="36" rx="10" ry="5.5" transform="rotate(-142 70 36)" fill="#6A8C5E" fillOpacity="0.68"/>
            <ellipse cx="54" cy="20" rx="9" ry="5" transform="rotate(-35 54 20)" fill="#8FAA7E" fillOpacity="0.72"/>
            <ellipse cx="50" cy="26" rx="9" ry="5" transform="rotate(-140 50 26)" fill="#7E9E72" fillOpacity="0.65"/>
            <ellipse cx="32" cy="12" rx="8" ry="4.5" transform="rotate(-30 32 12)" fill="#6A8C5E" fillOpacity="0.68"/>
            <ellipse cx="28" cy="17" rx="7" ry="4" transform="rotate(-144 28 17)" fill="#95AA82" fillOpacity="0.58"/>
            <ellipse cx="126" cy="30" rx="10" ry="5.5" transform="rotate(-142 126 30)" fill="#7E9E72" fillOpacity="0.76"/>
            <ellipse cx="130" cy="36" rx="10" ry="5.5" transform="rotate(-38 130 36)" fill="#6A8C5E" fillOpacity="0.68"/>
            <ellipse cx="146" cy="20" rx="9" ry="5" transform="rotate(-145 146 20)" fill="#8FAA7E" fillOpacity="0.72"/>
            <ellipse cx="150" cy="26" rx="9" ry="5" transform="rotate(-40 150 26)" fill="#7E9E72" fillOpacity="0.65"/>
            <ellipse cx="168" cy="12" rx="8" ry="4.5" transform="rotate(-150 168 12)" fill="#6A8C5E" fillOpacity="0.68"/>
            <ellipse cx="172" cy="17" rx="7" ry="4" transform="rotate(-36 172 17)" fill="#95AA82" fillOpacity="0.58"/>
            <circle cx="100" cy="48" r="3" fill="#95A870" fillOpacity="0.82"/>
            <circle cx="96" cy="44" r="2" fill="#7E9E72" fillOpacity="0.7"/>
            <circle cx="104" cy="44" r="2" fill="#7E9E72" fillOpacity="0.7"/>
          </svg>
        </div>
        {/* Bottom botanical branch (mirrored) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[84%] rotate-180 pointer-events-none" style={{ height: '60px' }}>
          <svg viewBox="0 0 200 56" fill="none" className="h-full w-full">
            <path d="M100 48 Q80 38 58 26 Q38 16 14 8" stroke="#6A8C5E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.72"/>
            <path d="M100 48 Q120 38 142 26 Q162 16 186 8" stroke="#6A8C5E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.72"/>
            <ellipse cx="74" cy="30" rx="10" ry="5.5" transform="rotate(-38 74 30)" fill="#7E9E72" fillOpacity="0.76"/>
            <ellipse cx="70" cy="36" rx="10" ry="5.5" transform="rotate(-142 70 36)" fill="#6A8C5E" fillOpacity="0.68"/>
            <ellipse cx="54" cy="20" rx="9" ry="5" transform="rotate(-35 54 20)" fill="#8FAA7E" fillOpacity="0.72"/>
            <ellipse cx="50" cy="26" rx="9" ry="5" transform="rotate(-140 50 26)" fill="#7E9E72" fillOpacity="0.65"/>
            <ellipse cx="32" cy="12" rx="8" ry="4.5" transform="rotate(-30 32 12)" fill="#6A8C5E" fillOpacity="0.68"/>
            <ellipse cx="126" cy="30" rx="10" ry="5.5" transform="rotate(-142 126 30)" fill="#7E9E72" fillOpacity="0.76"/>
            <ellipse cx="130" cy="36" rx="10" ry="5.5" transform="rotate(-38 130 36)" fill="#6A8C5E" fillOpacity="0.68"/>
            <ellipse cx="146" cy="20" rx="9" ry="5" transform="rotate(-145 146 20)" fill="#8FAA7E" fillOpacity="0.72"/>
            <ellipse cx="150" cy="26" rx="9" ry="5" transform="rotate(-40 150 26)" fill="#7E9E72" fillOpacity="0.65"/>
            <ellipse cx="168" cy="12" rx="8" ry="4.5" transform="rotate(-150 168 12)" fill="#6A8C5E" fillOpacity="0.68"/>
            <circle cx="100" cy="48" r="3" fill="#95A870" fillOpacity="0.82"/>
            <circle cx="96" cy="44" r="2" fill="#7E9E72" fillOpacity="0.7"/>
            <circle cx="104" cy="44" r="2" fill="#7E9E72" fillOpacity="0.7"/>
          </svg>
        </div>
        {/* Left fern frond */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: '140px', width: '32px' }}>
          <svg viewBox="0 0 30 120" fill="none" className="h-full w-full">
            <path d="M15 112 Q14 82 15 52 Q14 22 15 4" stroke="#6A8C5E" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.62"/>
            <ellipse cx="9" cy="92" rx="8" ry="4" transform="rotate(-130 9 92)" fill="#7E9E72" fillOpacity="0.62"/>
            <ellipse cx="9" cy="74" rx="8" ry="4" transform="rotate(-133 9 74)" fill="#6A8C5E" fillOpacity="0.56"/>
            <ellipse cx="10" cy="57" rx="7" ry="3.5" transform="rotate(-128 10 57)" fill="#8FAA7E" fillOpacity="0.52"/>
            <ellipse cx="11" cy="42" rx="6" ry="3" transform="rotate(-132 11 42)" fill="#7E9E72" fillOpacity="0.48"/>
            <ellipse cx="12" cy="29" rx="5.5" ry="2.8" transform="rotate(-130 12 29)" fill="#6A8C5E" fillOpacity="0.44"/>
            <ellipse cx="13" cy="18" rx="5" ry="2.5" transform="rotate(-128 13 18)" fill="#8FAA7E" fillOpacity="0.38"/>
          </svg>
        </div>
        {/* Right fern frond (mirror) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: '140px', width: '32px', transform: 'translateY(-50%) scaleX(-1)' }}>
          <svg viewBox="0 0 30 120" fill="none" className="h-full w-full">
            <path d="M15 112 Q14 82 15 52 Q14 22 15 4" stroke="#6A8C5E" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.62"/>
            <ellipse cx="9" cy="92" rx="8" ry="4" transform="rotate(-130 9 92)" fill="#7E9E72" fillOpacity="0.62"/>
            <ellipse cx="9" cy="74" rx="8" ry="4" transform="rotate(-133 9 74)" fill="#6A8C5E" fillOpacity="0.56"/>
            <ellipse cx="10" cy="57" rx="7" ry="3.5" transform="rotate(-128 10 57)" fill="#8FAA7E" fillOpacity="0.52"/>
            <ellipse cx="11" cy="42" rx="6" ry="3" transform="rotate(-132 11 42)" fill="#7E9E72" fillOpacity="0.48"/>
            <ellipse cx="12" cy="29" rx="5.5" ry="2.8" transform="rotate(-130 12 29)" fill="#6A8C5E" fillOpacity="0.44"/>
            <ellipse cx="13" cy="18" rx="5" ry="2.5" transform="rotate(-128 13 18)" fill="#8FAA7E" fillOpacity="0.38"/>
          </svg>
        </div>
      </>
    ),
  },
  "saffron-bloom": {
    pageClassName: "bg-[linear-gradient(180deg,#FFF0E2_0%,#FBDAB7_50%,#F6C68D_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FFF0E2_0%,#FBDAB7_50%,#F6C68D_100%)]",
    textToneClassName: "text-[#7B3A2E]",
    subTextToneClassName: "text-[#9A6457]/84",
    accentToneClassName: "text-[#E58B5B]",
    chipClassName: "bg-white/68 border border-[#E6A06C]/40 text-[#D16E47] shadow-sm",
    surfaceClassName: "bg-white/52 border border-[#F0C08D]/52 backdrop-blur-md shadow-[0_22px_50px_-28px_rgba(229,139,91,0.32)]",
    softSurfaceClassName: "bg-white/38 border border-[#F2C89A]/48 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#E58B5B] to-[#F0B66A] text-white shadow-[0_10px_26px_rgba(229,139,91,0.26)]",
    modalClassName: "bg-[#FFF4E8] border-[#E6A06C]/34",
    layoutVariant: "asymmetric",
    overlay: {
      backgroundImage: `radial-gradient(circle at 16% 20%, rgba(255,255,255,0.72) 0, transparent 24%), radial-gradient(circle at 84% 18%, rgba(229,139,91,0.18) 0, transparent 22%), radial-gradient(circle at 68% 84%, rgba(246,198,141,0.28) 0, transparent 24%), url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23E58B5B' stroke-opacity='0.14' stroke-width='2'%3E%3Cpath d='M24 132c18-38 52-64 92-70 18-2 34 0 48 6'/%3E%3Cpath d='M44 146c18-22 40-34 66-38 22-2 40 2 58 12'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, auto, 180px 180px",
      backgroundPosition: "center, center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(229,139,91,0.28)",
      borderRadius: "2.8rem 2.2rem 3rem 2.4rem / 2.2rem 2.8rem 2.2rem 3rem",
      boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.18)",
      margin: "0.95rem",
    },
    ornament: (
      <>
        <div className="absolute -left-4 bottom-0 h-44 w-44 opacity-82 pointer-events-none">
          <svg viewBox="0 0 180 180" fill="none"><path d="M76 54c16-20 42-24 58-9 18 15 16 42-4 58-20 17-49 17-64 0-16-17-8-37 10-49z" fill="#E58B5B" fillOpacity="0.3"/><path d="M58 82c2-28 28-50 58-48 24 2 38 18 40 38 1 24-21 49-52 51-23 1-47-17-46-41z" fill="#F7B6A0" fillOpacity="0.36"/><path d="M102 124c10 10 20 22 18 34-2 11-14 16-31 13-16-3-32-17-34-30-1-12 12-22 47-17z" fill="#89B978" fillOpacity="0.34"/></svg>
        </div>
        <div className="absolute right-0 top-0 h-44 w-44 rotate-180 opacity-78 pointer-events-none">
          <svg viewBox="0 0 180 180" fill="none"><path d="M76 54c16-20 42-24 58-9 18 15 16 42-4 58-20 17-49 17-64 0-16-17-8-37 10-49z" fill="#E58B5B" fillOpacity="0.3"/><path d="M58 82c2-28 28-50 58-48 24 2 38 18 40 38 1 24-21 49-52 51-23 1-47-17-46-41z" fill="#F7B6A0" fillOpacity="0.36"/><path d="M102 124c10 10 20 22 18 34-2 11-14 16-31 13-16-3-32-17-34-30-1-12 12-22 47-17z" fill="#89B978" fillOpacity="0.34"/></svg>
        </div>
        <div className="absolute inset-x-12 top-7 h-20 border border-[#E58B5B]/18 border-b-0 rounded-t-[999px] pointer-events-none" />
      </>
    ),
  },

  "petal-romance": {
    pageClassName: "bg-[linear-gradient(180deg,#FFF0F4_0%,#FFD8E2_52%,#FFCAD8_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FFF0F4_0%,#FFD8E2_52%,#FFCAD8_100%)]",
    textToneClassName: "text-[#3A1020]",
    subTextToneClassName: "text-[#8A4060]/84",
    accentToneClassName: "text-[#D4607C]",
    chipClassName: "bg-white/70 border border-[#E8A0B8]/42 text-[#C04870] shadow-sm",
    surfaceClassName: "bg-white/58 border border-[#F0B8CC]/45 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(212,96,124,0.38)]",
    softSurfaceClassName: "bg-white/42 border border-[#F4C0D0]/40 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#D4607C] to-[#F0A0B8] text-white shadow-[0_8px_24px_rgba(212,96,124,0.28)]",
    modalClassName: "bg-[#FFF4F6] border-[#E8A0B8]/35",
    layoutVariant: "petal",
    overlay: {
      backgroundImage: `radial-gradient(circle at 20% 18%, rgba(255,255,255,0.78) 0, transparent 26%), radial-gradient(circle at 80% 22%, rgba(212,96,124,0.16) 0, transparent 24%), url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4607C' stroke-opacity='0.11' stroke-width='2'%3E%3Cellipse cx='90' cy='90' rx='40' ry='28' transform='rotate(-30 90 90)'/%3E%3Cellipse cx='90' cy='90' rx='40' ry='28' transform='rotate(30 90 90)'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 180px 180px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(212,96,124,0.22)",
      borderRadius: "2.8rem",
      boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.22)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute -left-3 -top-3 h-44 w-44 opacity-82 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><ellipse cx="48" cy="48" rx="36" ry="24" transform="rotate(-35 48 48)" fill="#F4A0B8" fillOpacity="0.40"/><ellipse cx="48" cy="48" rx="36" ry="24" transform="rotate(10 48 48)" fill="#E87CA0" fillOpacity="0.35"/><circle cx="48" cy="48" r="9" fill="#D4607C" fillOpacity="0.55"/><path d="M48 48c8 24 20 48 26 72" stroke="#6A9A60" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/><ellipse cx="58" cy="80" rx="14" ry="6" transform="rotate(-40 58 80)" fill="#6A9A60" fillOpacity="0.55"/><ellipse cx="55" cy="100" rx="12" ry="5" transform="rotate(30 55 100)" fill="#507840" fillOpacity="0.48"/></svg>
        </div>
        <div className="absolute -right-3 -top-3 h-44 w-44 opacity-82 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none"><ellipse cx="48" cy="48" rx="36" ry="24" transform="rotate(-35 48 48)" fill="#F4A0B8" fillOpacity="0.40"/><ellipse cx="48" cy="48" rx="36" ry="24" transform="rotate(10 48 48)" fill="#E87CA0" fillOpacity="0.35"/><circle cx="48" cy="48" r="9" fill="#D4607C" fillOpacity="0.55"/><path d="M48 48c8 24 20 48 26 72" stroke="#6A9A60" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/><ellipse cx="58" cy="80" rx="14" ry="6" transform="rotate(-40 58 80)" fill="#6A9A60" fillOpacity="0.55"/></svg>
        </div>
        <div className="absolute -left-3 -bottom-3 h-44 w-44 opacity-78 pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none"><ellipse cx="48" cy="48" rx="36" ry="24" transform="rotate(-35 48 48)" fill="#F4A0B8" fillOpacity="0.38"/><ellipse cx="48" cy="48" rx="36" ry="24" transform="rotate(10 48 48)" fill="#E87CA0" fillOpacity="0.33"/><circle cx="48" cy="48" r="9" fill="#D4607C" fillOpacity="0.50"/></svg>
        </div>
        <div className="absolute -right-3 -bottom-3 h-44 w-44 rotate-180 opacity-78 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><ellipse cx="48" cy="48" rx="36" ry="24" transform="rotate(-35 48 48)" fill="#F4A0B8" fillOpacity="0.38"/><ellipse cx="48" cy="48" rx="36" ry="24" transform="rotate(10 48 48)" fill="#E87CA0" fillOpacity="0.33"/><circle cx="48" cy="48" r="9" fill="#D4607C" fillOpacity="0.50"/></svg>
        </div>
      </>
    ),
  },

  "velvet-dusk": {
    pageClassName: "bg-[linear-gradient(160deg,#1A0E26_0%,#2E1842_52%,#1E1030_100%)]",
    previewClassName: "bg-[linear-gradient(160deg,#1A0E26_0%,#2E1842_52%,#1E1030_100%)]",
    textToneClassName: "text-[#F5EED8]",
    subTextToneClassName: "text-[#D8C8B0]/84",
    accentToneClassName: "text-[#D4A864]",
    chipClassName: "bg-[#1A0E26]/72 border border-[#D4A864]/28 text-[#D4A864]",
    surfaceClassName: "bg-[#1A0E26]/48 border border-[#D4A864]/18 backdrop-blur-md shadow-[0_24px_60px_-34px_rgba(0,0,0,0.65)]",
    softSurfaceClassName: "bg-[#221240]/42 border border-[#D4A864]/14 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#D4A864] to-[#E8C890] text-[#1A0E26] shadow-[0_10px_28px_rgba(212,168,100,0.22)]",
    modalClassName: "bg-[#16082A] border-[#D4A864]/22",
    layoutVariant: "velvet",
    overlay: {
      backgroundImage: `radial-gradient(circle at center, rgba(212,168,100,0.12) 0, transparent 36%), radial-gradient(circle at center, rgba(80,40,120,0.18) 0, transparent 55%), url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4A864' stroke-opacity='0.10'%3E%3Ccircle cx='100' cy='100' r='32'/%3E%3Ccircle cx='100' cy='100' r='52'/%3E%3Ccircle cx='100' cy='100' r='72'/%3E%3Cpath d='M100 28l10 22 24 6-18 16 4 24-20-12-20 12 4-24-18-16 24-6z'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 200px 200px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(212,168,100,0.22)",
      borderRadius: "3rem 3rem 2rem 2rem / 2.4rem 2.4rem 3rem 3rem",
      boxShadow: "inset 0 0 0 6px rgba(212,168,100,0.06)",
      margin: "1rem",
    },
    ornament: (
      <>
        <div className="absolute left-1/2 top-4 h-24 w-[76%] -translate-x-1/2 opacity-88 pointer-events-none">
          <svg viewBox="0 0 320 120" fill="none"><path d="M20 84c34-18 64-54 140-54s106 36 140 54" stroke="#D4A864" strokeOpacity="0.28" strokeWidth="2"/><path d="M48 98c28-12 56-34 112-34s84 22 112 34" stroke="#D4A864" strokeOpacity="0.20" strokeWidth="1.6"/><path d="M160 26l8 18 20 5-15 13 3 20-16-10-16 10 3-20-15-13 20-5z" fill="#D4A864" fillOpacity="0.20"/></svg>
        </div>
        <div className="absolute left-1/2 bottom-4 h-20 w-[68%] -translate-x-1/2 opacity-65 pointer-events-none">
          <svg viewBox="0 0 320 120" fill="none"><path d="M30 36c42 22 58 50 130 50s88-28 130-50" stroke="#D4A864" strokeOpacity="0.20" strokeWidth="2"/></svg>
        </div>
      </>
    ),
  },

  "minimal-vow": {
    pageClassName: "bg-[linear-gradient(180deg,#FFFFF8_0%,#F8F4EB_52%,#F0E8D8_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FFFFF8_0%,#F8F4EB_52%,#F0E8D8_100%)]",
    textToneClassName: "text-[#2C2418]",
    subTextToneClassName: "text-[#6A5A48]/82",
    accentToneClassName: "text-[#8A7060]",
    chipClassName: "bg-white/78 border border-[#B8A898]/38 text-[#6A5A48] shadow-sm",
    surfaceClassName: "bg-white/52 border border-[#C8B8A8]/40 backdrop-blur-md shadow-[0_18px_46px_-28px_rgba(100,80,60,0.18)]",
    softSurfaceClassName: "bg-white/40 border border-[#D0C0B0]/42 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#6A5A48] to-[#8A7060] text-white shadow-[0_10px_26px_rgba(106,90,72,0.18)]",
    modalClassName: "bg-[#FEFDF8] border-[#B8A898]/34",
    layoutVariant: "minimal",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 20%, rgba(255,255,250,0.62) 0, transparent 38%)`,
    },
    frameStyle: {
      border: "1px solid rgba(138,112,96,0.20)",
      borderRadius: "2.8rem",
      boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.18)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[80%] pointer-events-none" style={{ height: '48px' }}>
          <svg viewBox="0 0 200 48" fill="none" className="h-full w-full">
            <path d="M100 42 Q80 32 56 20 Q36 10 12 4" stroke="#8A7060" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.52"/>
            <path d="M100 42 Q120 32 144 20 Q164 10 188 4" stroke="#8A7060" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.52"/>
            <ellipse cx="72" cy="26" rx="9" ry="4.5" transform="rotate(-38 72 26)" fill="#8A7060" fillOpacity="0.38"/>
            <ellipse cx="68" cy="32" rx="9" ry="4.5" transform="rotate(-142 68 32)" fill="#6A5A48" fillOpacity="0.32"/>
            <ellipse cx="128" cy="26" rx="9" ry="4.5" transform="rotate(-142 128 26)" fill="#8A7060" fillOpacity="0.38"/>
            <ellipse cx="132" cy="32" rx="9" ry="4.5" transform="rotate(-38 132 32)" fill="#6A5A48" fillOpacity="0.32"/>
            <circle cx="100" cy="42" r="2.5" fill="#8A7060" fillOpacity="0.60"/>
          </svg>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] rotate-180 pointer-events-none" style={{ height: '48px' }}>
          <svg viewBox="0 0 200 48" fill="none" className="h-full w-full">
            <path d="M100 42 Q80 32 56 20 Q36 10 12 4" stroke="#8A7060" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.42"/>
            <path d="M100 42 Q120 32 144 20 Q164 10 188 4" stroke="#8A7060" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.42"/>
            <ellipse cx="72" cy="26" rx="9" ry="4.5" transform="rotate(-38 72 26)" fill="#8A7060" fillOpacity="0.32"/>
            <ellipse cx="128" cy="26" rx="9" ry="4.5" transform="rotate(-142 128 26)" fill="#8A7060" fillOpacity="0.32"/>
            <circle cx="100" cy="42" r="2.5" fill="#8A7060" fillOpacity="0.50"/>
          </svg>
        </div>
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: '100px', width: '24px' }}>
          <svg viewBox="0 0 24 100" fill="none" className="h-full w-full">
            <path d="M12 8 Q11 30 12 50 Q13 70 12 92" stroke="#8A7060" strokeWidth="0.9" strokeOpacity="0.40" strokeLinecap="round" fill="none"/>
            <ellipse cx="7" cy="32" rx="7" ry="3.5" transform="rotate(-135 7 32)" fill="#8A7060" fillOpacity="0.35"/>
            <ellipse cx="7" cy="58" rx="7" ry="3.5" transform="rotate(-135 7 58)" fill="#6A5A48" fillOpacity="0.30"/>
          </svg>
        </div>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: '100px', width: '24px', transform: 'translateY(-50%) scaleX(-1)' }}>
          <svg viewBox="0 0 24 100" fill="none" className="h-full w-full">
            <path d="M12 8 Q11 30 12 50 Q13 70 12 92" stroke="#8A7060" strokeWidth="0.9" strokeOpacity="0.40" strokeLinecap="round" fill="none"/>
            <ellipse cx="7" cy="32" rx="7" ry="3.5" transform="rotate(-135 7 32)" fill="#8A7060" fillOpacity="0.35"/>
            <ellipse cx="7" cy="58" rx="7" ry="3.5" transform="rotate(-135 7 58)" fill="#6A5A48" fillOpacity="0.30"/>
          </svg>
        </div>
      </>
    ),
  },

  "garden-arch": {
    pageClassName: "bg-[linear-gradient(180deg,#F0FFF6_0%,#D4EEE0_52%,#BADED0_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#F0FFF6_0%,#D4EEE0_52%,#BADED0_100%)]",
    textToneClassName: "text-[#1A3828]",
    subTextToneClassName: "text-[#3A6048]/84",
    accentToneClassName: "text-[#4A8A60]",
    chipClassName: "bg-white/72 border border-[#80C09A]/42 text-[#3A6048] shadow-sm",
    surfaceClassName: "bg-white/56 border border-[#98C8B0]/55 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(64,120,80,0.28)]",
    softSurfaceClassName: "bg-white/40 border border-[#AADDC0]/52 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#3A6048] to-[#6A9A78] text-white shadow-[0_10px_26px_rgba(58,96,72,0.25)]",
    modalClassName: "bg-[#F2FFF7] border-[#80C09A]/34",
    layoutVariant: "garden",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.82) 0, transparent 26%), radial-gradient(circle at 22% 78%, rgba(74,138,96,0.14) 0, transparent 22%), url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%234A8A60' stroke-opacity='0.11' stroke-width='2'%3E%3Cpath d='M20 140c24-46 58-70 90-70s66 24 90 70'/%3E%3Cpath d='M40 154c18-30 48-48 70-48s52 18 70 48'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 220px 220px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(74,138,96,0.22)",
      borderRadius: "3rem 3rem 2.2rem 2.2rem / 2rem 2rem 2.8rem 2.8rem",
      boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.18)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute left-1/2 top-2 h-24 w-[72%] -translate-x-1/2 opacity-85 pointer-events-none">
          <svg viewBox="0 0 320 120" fill="none"><path d="M28 96c38-48 82-72 132-72s94 24 132 72" stroke="#4A8A60" strokeOpacity="0.32" strokeWidth="2.2"/><path d="M56 100c28-30 66-46 104-46s76 16 104 46" stroke="#4A8A60" strokeOpacity="0.22" strokeWidth="1.8"/><ellipse cx="160" cy="28" rx="12" ry="5" transform="rotate(-15 160 28)" fill="#4A8A60" fillOpacity="0.28"/><ellipse cx="155" cy="34" rx="11" ry="4.5" transform="rotate(20 155 34)" fill="#6AA87A" fillOpacity="0.24"/></svg>
        </div>
        <div className="absolute left-0 top-0 h-36 w-36 opacity-72 pointer-events-none">
          <svg viewBox="0 0 130 130" fill="none"><path d="M8 40 Q28 18 50 24 Q64 30 60 46 Q54 64 30 66" stroke="#4A8A60" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.50"/><ellipse cx="36" cy="32" rx="10" ry="5" transform="rotate(-30 36 32)" fill="#70A880" fillOpacity="0.52"/><ellipse cx="54" cy="38" rx="9" ry="4.5" transform="rotate(15 54 38)" fill="#4A8A60" fillOpacity="0.48"/><ellipse cx="44" cy="56" rx="10" ry="5" transform="rotate(-20 44 56)" fill="#8AB896" fillOpacity="0.46"/></svg>
        </div>
        <div className="absolute right-0 top-0 h-36 w-36 opacity-72 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 130 130" fill="none"><path d="M8 40 Q28 18 50 24 Q64 30 60 46 Q54 64 30 66" stroke="#4A8A60" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.50"/><ellipse cx="36" cy="32" rx="10" ry="5" transform="rotate(-30 36 32)" fill="#70A880" fillOpacity="0.52"/><ellipse cx="54" cy="38" rx="9" ry="4.5" transform="rotate(15 54 38)" fill="#4A8A60" fillOpacity="0.48"/><ellipse cx="44" cy="56" rx="10" ry="5" transform="rotate(-20 44 56)" fill="#8AB896" fillOpacity="0.46"/></svg>
        </div>
      </>
    ),
  },

  "crimson-velvet": {
    pageClassName: "bg-[linear-gradient(180deg,#FFFBF5_0%,#FAE8E4_52%,#F5D8D0_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FFFBF5_0%,#FAE8E4_52%,#F5D8D0_100%)]",
    textToneClassName: "text-[#2A0C10]",
    subTextToneClassName: "text-[#7A3040]/84",
    accentToneClassName: "text-[#B8922A]",
    chipClassName: "bg-white/72 border border-[#D4606A]/38 text-[#9E2030] shadow-sm",
    surfaceClassName: "bg-white/58 border border-[#C43040]/25 backdrop-blur-md shadow-[0_22px_50px_-28px_rgba(158,32,48,0.30)]",
    softSurfaceClassName: "bg-white/48 border border-[#D87080]/28 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#9E2030] to-[#C84050] text-white shadow-[0_10px_26px_rgba(158,32,48,0.28)]",
    modalClassName: "bg-[#FFF8F5] border-[#C43040]/28",
    layoutVariant: "crimson",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(255,252,240,0.55) 0, transparent 70%)`,
    },
    frameStyle: {
      border: "1px solid rgba(196,48,64,0.24)",
      borderRadius: "3rem",
      boxShadow: "inset 0 0 0 8px rgba(255,255,255,0.26)",
      margin: "1rem",
    },
    ornament: (
      <>
        <div className="absolute -left-4 -top-4 h-52 w-52 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84050" fillOpacity="0.78"/><path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84050" fillOpacity="0.74"/><path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E06070" fillOpacity="0.80"/><circle cx="44" cy="44" r="13" fill="#9A1830" fillOpacity="0.85"/><circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.90"/><path d="M44 44c5 8 10 20 14 36" stroke="#1E4228" strokeWidth="1.8" strokeLinecap="round" opacity="0.68"/><path d="M44 44c-8 5-20 10-36 14" stroke="#1E4228" strokeWidth="1.8" strokeLinecap="round" opacity="0.68"/><path d="M56 68c4 10 16 18 30 22C78 82 64 74 56 68z" fill="#1E4228" fillOpacity="0.72"/></svg>
        </div>
        <div className="absolute -right-4 -top-4 h-52 w-52 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none"><path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84050" fillOpacity="0.78"/><path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84050" fillOpacity="0.74"/><path d="M48 20c-10-2-22 6-22 18 0 12 10 20 22 18 12-2 18-12 12-26-2-6-8-10-12-10z" fill="#E06070" fillOpacity="0.80"/><circle cx="44" cy="44" r="13" fill="#9A1830" fillOpacity="0.85"/><circle cx="40" cy="40" r="5" fill="#FBBCC8" fillOpacity="0.90"/><path d="M44 44c5 8 10 20 14 36" stroke="#1E4228" strokeWidth="1.8" strokeLinecap="round" opacity="0.68"/></svg>
        </div>
        <div className="absolute -left-4 -bottom-4 h-52 w-52 pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none"><path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84050" fillOpacity="0.78"/><path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84050" fillOpacity="0.74"/><circle cx="44" cy="44" r="13" fill="#9A1830" fillOpacity="0.85"/></svg>
        </div>
        <div className="absolute -right-4 -bottom-4 h-52 w-52 rotate-180 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><path d="M48 8C34 2 14 10 10 26c-4 16 6 30 20 34 14 4 28-4 32-18 4-14-4-30-14-34z" fill="#C84050" fillOpacity="0.78"/><path d="M8 48C2 34 10 14 26 10c16-4 30 6 34 20 4 14-4 28-18 32C28 66 6 62 8 48z" fill="#C84050" fillOpacity="0.74"/><circle cx="44" cy="44" r="13" fill="#9A1830" fillOpacity="0.85"/></svg>
        </div>
        <div className="absolute inset-8 border border-[#B8922A]/20 rounded-[2.2rem] pointer-events-none" />
        <div className="absolute inset-10 border border-[#B8922A]/12 rounded-[1.9rem] pointer-events-none" />
      </>
    ),
  },

  "amber-harvest": {
    pageClassName: "bg-[linear-gradient(180deg,#FFF8EC_0%,#F9EDCD_52%,#F3E0A8_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FFF8EC_0%,#F9EDCD_52%,#F3E0A8_100%)]",
    textToneClassName: "text-[#3A2008]",
    subTextToneClassName: "text-[#7A5020]/84",
    accentToneClassName: "text-[#C88A2A]",
    chipClassName: "bg-white/72 border border-[#D4A84A]/42 text-[#9A6820] shadow-sm",
    surfaceClassName: "bg-white/56 border border-[#D4A84A]/35 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(180,130,40,0.28)]",
    softSurfaceClassName: "bg-white/44 border border-[#D4C080]/38 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#C88A2A] to-[#E0B060] text-white shadow-[0_10px_26px_rgba(200,138,42,0.25)]",
    modalClassName: "bg-[#FFFBF0] border-[#D4A84A]/34",
    layoutVariant: "harvest",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 44%, rgba(255,252,240,0.55) 0, transparent 68%)`,
    },
    frameStyle: {
      border: "1px solid rgba(200,138,42,0.26)",
      borderRadius: "2.8rem",
      boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.22)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute -left-3 -top-3 h-52 w-52 opacity-85 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><path d="M44 6c0 8-6 14-16 18 4 4 6 10 4 16 6-4 12-4 16 0 4-6 4-12 8-16-8-2-12-10-12-18z" fill="#D4601A" fillOpacity="0.80"/><path d="M28 24c-6 2-14 0-20-6 2 8 0 16-6 22 8-2 16 0 20 6 2-8 4-16 6-22z" fill="#E8A030" fillOpacity="0.74"/><path d="M60 22c6 2 14 0 20-6-2 8 0 16 6 22-8-2-16 0-20 6-2-8-4-16-6-22z" fill="#C85020" fillOpacity="0.70"/><path d="M44 6c0 8 0 20-2 36" stroke="#8A4010" strokeWidth="1.6" strokeLinecap="round" opacity="0.65"/><ellipse cx="44" cy="80" rx="7" ry="5" fill="#8A6030" fillOpacity="0.70"/><ellipse cx="44" cy="77" rx="7.5" ry="4" fill="#C8A050" fillOpacity="0.75"/></svg>
        </div>
        <div className="absolute -right-3 -top-3 h-52 w-52 opacity-85 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none"><path d="M44 6c0 8-6 14-16 18 4 4 6 10 4 16 6-4 12-4 16 0 4-6 4-12 8-16-8-2-12-10-12-18z" fill="#D4601A" fillOpacity="0.80"/><path d="M28 24c-6 2-14 0-20-6 2 8 0 16-6 22 8-2 16 0 20 6 2-8 4-16 6-22z" fill="#E8A030" fillOpacity="0.74"/><path d="M60 22c6 2 14 0 20-6-2 8 0 16 6 22-8-2-16 0-20 6-2-8-4-16-6-22z" fill="#C85020" fillOpacity="0.70"/><path d="M44 6c0 8 0 20-2 36" stroke="#8A4010" strokeWidth="1.6" strokeLinecap="round" opacity="0.65"/><ellipse cx="44" cy="80" rx="7" ry="5" fill="#8A6030" fillOpacity="0.70"/><ellipse cx="44" cy="77" rx="7.5" ry="4" fill="#C8A050" fillOpacity="0.75"/></svg>
        </div>
        <div className="absolute -left-3 -bottom-3 h-52 w-52 opacity-80 pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none"><path d="M44 6c0 8-6 14-16 18 4 4 6 10 4 16 6-4 12-4 16 0 4-6 4-12 8-16-8-2-12-10-12-18z" fill="#D4601A" fillOpacity="0.78"/><path d="M28 24c-6 2-14 0-20-6 2 8 0 16-6 22 8-2 16 0 20 6 2-8 4-16 6-22z" fill="#E8A030" fillOpacity="0.72"/><ellipse cx="44" cy="80" rx="7" ry="5" fill="#8A6030" fillOpacity="0.65"/></svg>
        </div>
        <div className="absolute -right-3 -bottom-3 h-52 w-52 rotate-180 opacity-80 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><path d="M44 6c0 8-6 14-16 18 4 4 6 10 4 16 6-4 12-4 16 0 4-6 4-12 8-16-8-2-12-10-12-18z" fill="#D4601A" fillOpacity="0.78"/><path d="M28 24c-6 2-14 0-20-6 2 8 0 16-6 22 8-2 16 0 20 6 2-8 4-16 6-22z" fill="#E8A030" fillOpacity="0.72"/><ellipse cx="44" cy="80" rx="7" ry="5" fill="#8A6030" fillOpacity="0.65"/></svg>
        </div>
      </>
    ),
  },

  "wisteria-dreams": {
    pageClassName: "bg-[linear-gradient(180deg,#FAF5FF_0%,#F0E8FA_52%,#E6D8F5_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FAF5FF_0%,#F0E8FA_52%,#E6D8F5_100%)]",
    textToneClassName: "text-[#28103C]",
    subTextToneClassName: "text-[#604878]/84",
    accentToneClassName: "text-[#9A60BE]",
    chipClassName: "bg-white/70 border border-[#C8A0DC]/42 text-[#7A4A9E] shadow-sm",
    surfaceClassName: "bg-white/52 border border-[#D0B0E8]/42 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(154,96,190,0.28)]",
    softSurfaceClassName: "bg-white/38 border border-[#D8B8F0]/38 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#7A4A9E] to-[#A070C8] text-white shadow-[0_10px_26px_rgba(122,74,158,0.25)]",
    modalClassName: "bg-[#FAF5FF] border-[#C8A0DC]/34",
    layoutVariant: "wisteria",
    overlay: {
      backgroundImage: `radial-gradient(circle at 50% 10%, rgba(255,255,255,0.78) 0, transparent 28%), radial-gradient(circle at 50% 90%, rgba(154,96,190,0.12) 0, transparent 28%)`,
    },
    frameStyle: {
      border: "1px solid rgba(154,96,190,0.20)",
      borderRadius: "3rem 3rem 2rem 2rem / 2rem 2rem 2.8rem 2.8rem",
      boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.18)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: '120px' }}>
          <svg viewBox="0 0 400 120" fill="none" className="h-full w-full">
            <path d="M0 0 Q40 12 52 36 Q64 60 38 82 Q18 98 28 114" stroke="#7A60A0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55"/>
            <path d="M400 0 Q360 12 348 36 Q336 60 362 82 Q382 98 372 114" stroke="#7A60A0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55"/>
            <ellipse cx="38" cy="86" rx="5" ry="7" fill="#B070D8" fillOpacity="0.58"/>
            <ellipse cx="28" cy="96" rx="4" ry="6" fill="#9A55C0" fillOpacity="0.52"/>
            <ellipse cx="44" cy="98" rx="4" ry="7" fill="#CC90E8" fillOpacity="0.50"/>
            <ellipse cx="362" cy="86" rx="5" ry="7" fill="#B070D8" fillOpacity="0.58"/>
            <ellipse cx="372" cy="96" rx="4" ry="6" fill="#9A55C0" fillOpacity="0.52"/>
            <ellipse cx="356" cy="98" rx="4" ry="7" fill="#CC90E8" fillOpacity="0.50"/>
            <path d="M80 0 Q88 18 76 38" stroke="#9A78BC" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
            <path d="M320 0 Q312 18 324 38" stroke="#9A78BC" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
            <ellipse cx="76" cy="40" rx="4" ry="6" fill="#B070D8" fillOpacity="0.50"/>
            <ellipse cx="324" cy="40" rx="4" ry="6" fill="#B070D8" fillOpacity="0.50"/>
            <ellipse cx="50" cy="18" rx="8" ry="3.5" transform="rotate(-30 50 18)" fill="#6A8C50" fillOpacity="0.52"/>
            <ellipse cx="350" cy="18" rx="8" ry="3.5" transform="rotate(30 350 18)" fill="#6A8C50" fillOpacity="0.52"/>
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-full rotate-180 pointer-events-none" style={{ height: '80px' }}>
          <svg viewBox="0 0 400 80" fill="none" className="h-full w-full">
            <path d="M0 0 Q36 8 46 26 Q56 44 36 60" stroke="#7A60A0" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.40"/>
            <path d="M400 0 Q364 8 354 26 Q344 44 364 60" stroke="#7A60A0" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.40"/>
            <ellipse cx="36" cy="62" rx="4" ry="6" fill="#CC90E8" fillOpacity="0.40"/>
            <ellipse cx="364" cy="62" rx="4" ry="6" fill="#CC90E8" fillOpacity="0.40"/>
          </svg>
        </div>
      </>
    ),
  },

  "pearl-mist": {
    pageClassName: "bg-[linear-gradient(180deg,#FDFEFF_0%,#F2F8FD_52%,#E8F2FB_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FDFEFF_0%,#F2F8FD_52%,#E8F2FB_100%)]",
    textToneClassName: "text-[#162436]",
    subTextToneClassName: "text-[#486080]/84",
    accentToneClassName: "text-[#6890B8]",
    chipClassName: "bg-white/74 border border-[#B8D0E4]/42 text-[#5878A0] shadow-sm",
    surfaceClassName: "bg-white/58 border border-[#C0D8EC]/48 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(100,150,200,0.22)]",
    softSurfaceClassName: "bg-white/42 border border-[#C8E0F0]/42 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#5878A0] to-[#7898C0] text-white shadow-[0_10px_26px_rgba(88,120,160,0.22)]",
    modalClassName: "bg-[#FAFEFF] border-[#B8D0E4]/34",
    layoutVariant: "pearl",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 30% 26%, rgba(255,255,255,0.85) 0, transparent 34%), radial-gradient(ellipse at 70% 74%, rgba(180,220,240,0.18) 0, transparent 30%)`,
    },
    frameStyle: {
      border: "1px solid rgba(104,144,184,0.20)",
      borderRadius: "2.8rem",
      boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.22)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full pointer-events-none" style={{ height: '80px' }}>
          <svg viewBox="0 0 400 80" fill="none" className="h-full w-full">
            <path d="M0 66 Q100 22 200 40 Q300 58 400 14" stroke="#B8D0E4" strokeOpacity="0.52" strokeWidth="1.8" fill="none"/>
            <path d="M0 74 Q100 30 200 48 Q300 66 400 22" stroke="#96B8D4" strokeOpacity="0.35" strokeWidth="1.4" fill="none"/>
            <circle cx="60" cy="50" r="4" fill="#E8F2FB" stroke="#B8D0E4" strokeWidth="1" strokeOpacity="0.72"/>
            <circle cx="130" cy="38" r="4.5" fill="#F5FAFF" stroke="#A8C4DC" strokeWidth="1" strokeOpacity="0.74"/>
            <circle cx="200" cy="40" r="5" fill="#FFFFFF" stroke="#B8D0E4" strokeWidth="1.2" strokeOpacity="0.76"/>
            <circle cx="200" cy="40" r="2" fill="#C8DCF0" fillOpacity="0.65"/>
            <circle cx="270" cy="42" r="4.5" fill="#F5FAFF" stroke="#A8C4DC" strokeWidth="1" strokeOpacity="0.74"/>
            <circle cx="340" cy="24" r="4" fill="#E8F2FB" stroke="#B8D0E4" strokeWidth="1" strokeOpacity="0.72"/>
          </svg>
        </div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full rotate-180 pointer-events-none" style={{ height: '64px' }}>
          <svg viewBox="0 0 400 64" fill="none" className="h-full w-full">
            <path d="M0 52 Q100 14 200 30 Q300 46 400 6" stroke="#B8D0E4" strokeOpacity="0.42" strokeWidth="1.6" fill="none"/>
            <circle cx="130" cy="26" r="3.5" fill="#F0F8FF" stroke="#A8C4DC" strokeWidth="1" strokeOpacity="0.65"/>
            <circle cx="200" cy="30" r="4" fill="#FFFFFF" stroke="#B8D0E4" strokeWidth="1.1" strokeOpacity="0.68"/>
            <circle cx="270" cy="32" r="3.5" fill="#F0F8FF" stroke="#A8C4DC" strokeWidth="1" strokeOpacity="0.65"/>
          </svg>
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: '160px', width: '20px' }}>
          <svg viewBox="0 0 20 160" fill="none" className="h-full w-full">
            <path d="M10 8 Q9 40 10 80 Q11 120 10 152" stroke="#B8D0E4" strokeWidth="0.9" strokeOpacity="0.52" strokeLinecap="round" fill="none"/>
            <circle cx="10" cy="28" r="4" fill="#EEF6FF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.65"/>
            <circle cx="10" cy="52" r="3.5" fill="#F5FAFF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.62"/>
            <circle cx="10" cy="80" r="5" fill="#FFFFFF" stroke="#B8D0E4" strokeWidth="1.1" strokeOpacity="0.70"/>
            <circle cx="10" cy="80" r="2" fill="#C0D8F0" fillOpacity="0.60"/>
            <circle cx="10" cy="108" r="3.5" fill="#F5FAFF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.62"/>
            <circle cx="10" cy="132" r="4" fill="#EEF6FF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.65"/>
          </svg>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ height: '160px', width: '20px', transform: 'translateY(-50%) scaleX(-1)' }}>
          <svg viewBox="0 0 20 160" fill="none" className="h-full w-full">
            <path d="M10 8 Q9 40 10 80 Q11 120 10 152" stroke="#B8D0E4" strokeWidth="0.9" strokeOpacity="0.52" strokeLinecap="round" fill="none"/>
            <circle cx="10" cy="28" r="4" fill="#EEF6FF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.65"/>
            <circle cx="10" cy="52" r="3.5" fill="#F5FAFF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.62"/>
            <circle cx="10" cy="80" r="5" fill="#FFFFFF" stroke="#B8D0E4" strokeWidth="1.1" strokeOpacity="0.70"/>
            <circle cx="10" cy="80" r="2" fill="#C0D8F0" fillOpacity="0.60"/>
            <circle cx="10" cy="108" r="3.5" fill="#F5FAFF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.62"/>
            <circle cx="10" cy="132" r="4" fill="#EEF6FF" stroke="#B0C8E0" strokeWidth="1" strokeOpacity="0.65"/>
          </svg>
        </div>
      </>
    ),
  },

  "indigo-royale": {
    pageClassName: "bg-[linear-gradient(160deg,#0E1A38_0%,#162040_52%,#1C2850_100%)]",
    previewClassName: "bg-[linear-gradient(160deg,#0E1A38_0%,#162040_52%,#1C2850_100%)]",
    textToneClassName: "text-[#EEF2FF]",
    subTextToneClassName: "text-[#BCC8E4]/84",
    accentToneClassName: "text-[#E8C868]",
    chipClassName: "bg-[#0E1628]/72 border border-[#E8C868]/28 text-[#E8C868]",
    surfaceClassName: "bg-[#0E1628]/48 border border-[#E8C868]/18 backdrop-blur-md shadow-[0_24px_60px_-34px_rgba(8,14,40,0.70)]",
    softSurfaceClassName: "bg-[#162040]/42 border border-[#E8C868]/14 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#E8C868] to-[#F0D888] text-[#0E1628] shadow-[0_10px_28px_rgba(232,200,104,0.22)]",
    modalClassName: "bg-[#101C3A] border-[#E8C868]/22",
    layoutVariant: "royale",
    overlay: {
      backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(190,204,232,0.10) 0, transparent 45%), radial-gradient(ellipse at 50% 80%, rgba(232,200,104,0.08) 0, transparent 35%), url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23E8C868' stroke-opacity='0.09'%3E%3Crect x='20' y='20' width='180' height='180' rx='4'/%3E%3Crect x='32' y='32' width='156' height='156' rx='3'/%3E%3Ccircle cx='110' cy='110' r='28'/%3E%3Ccircle cx='110' cy='110' r='50'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: "auto, auto, 220px 220px",
      backgroundPosition: "center, center, center",
    },
    frameStyle: {
      border: "1px solid rgba(232,200,104,0.22)",
      borderRadius: "2.8rem",
      boxShadow: "inset 0 0 0 6px rgba(232,200,104,0.06)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute inset-6 border border-[#E8C868]/16 rounded-[2.2rem] pointer-events-none" />
        <div className="absolute inset-9 border border-[#E8C868]/10 rounded-[1.9rem] pointer-events-none" />
        <div className="absolute left-1/2 top-4 h-20 w-[72%] -translate-x-1/2 opacity-85 pointer-events-none">
          <svg viewBox="0 0 320 80" fill="none"><path d="M20 56c34-12 64-36 140-36s106 24 140 36" stroke="#E8C868" strokeOpacity="0.28" strokeWidth="1.8"/><path d="M160 6l8 16 18 4-14 12 3 18-15-9-15 9 3-18-14-12 18-4z" fill="#E8C868" fillOpacity="0.22"/></svg>
        </div>
        <div className="absolute left-5 top-12 pointer-events-none">
          <svg width="24" height="80" viewBox="0 0 24 80" fill="none"><path d="M12 8 Q11 24 12 40 Q13 56 12 72" stroke="#E8C868" strokeWidth="0.8" strokeOpacity="0.22" strokeDasharray="4 6" strokeLinecap="round" fill="none"/><circle cx="12" cy="24" r="2.5" fill="#E8C868" fillOpacity="0.35"/><circle cx="12" cy="56" r="2.5" fill="#E8C868" fillOpacity="0.35"/></svg>
        </div>
        <div className="absolute right-5 top-12 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <svg width="24" height="80" viewBox="0 0 24 80" fill="none"><path d="M12 8 Q11 24 12 40 Q13 56 12 72" stroke="#E8C868" strokeWidth="0.8" strokeOpacity="0.22" strokeDasharray="4 6" strokeLinecap="round" fill="none"/><circle cx="12" cy="24" r="2.5" fill="#E8C868" fillOpacity="0.35"/><circle cx="12" cy="56" r="2.5" fill="#E8C868" fillOpacity="0.35"/></svg>
        </div>
        <div className="absolute left-4 top-4 opacity-55 pointer-events-none">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 4 Q20 8 22 14 Q24 20 18 22 Q12 24 8 20 Q4 16 8 10 Q12 4 15 4z" stroke="#E8C868" strokeWidth="1" strokeOpacity="0.55" fill="none"/><path d="M4 4 Q8 12 14 14" stroke="#E8C868" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" fill="none"/></svg>
        </div>
        <div className="absolute right-4 top-4 opacity-55 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 4 Q20 8 22 14 Q24 20 18 22 Q12 24 8 20 Q4 16 8 10 Q12 4 15 4z" stroke="#E8C868" strokeWidth="1" strokeOpacity="0.55" fill="none"/><path d="M4 4 Q8 12 14 14" stroke="#E8C868" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" fill="none"/></svg>
        </div>
        <div className="absolute left-4 bottom-4 opacity-55 pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 4 Q20 8 22 14 Q24 20 18 22 Q12 24 8 20 Q4 16 8 10 Q12 4 15 4z" stroke="#E8C868" strokeWidth="1" strokeOpacity="0.55" fill="none"/><path d="M4 4 Q8 12 14 14" stroke="#E8C868" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" fill="none"/></svg>
        </div>
        <div className="absolute right-4 bottom-4 rotate-180 opacity-55 pointer-events-none">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M15 4 Q20 8 22 14 Q24 20 18 22 Q12 24 8 20 Q4 16 8 10 Q12 4 15 4z" stroke="#E8C868" strokeWidth="1" strokeOpacity="0.55" fill="none"/><path d="M4 4 Q8 12 14 14" stroke="#E8C868" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" fill="none"/></svg>
        </div>
      </>
    ),
  },

  "coral-drift": {
    pageClassName: "bg-[linear-gradient(180deg,#FFF4F0_0%,#FFE0D4_52%,#FFD0BC_100%)]",
    previewClassName: "bg-[linear-gradient(180deg,#FFF4F0_0%,#FFE0D4_52%,#FFD0BC_100%)]",
    textToneClassName: "text-[#3C1410]",
    subTextToneClassName: "text-[#7A4030]/84",
    accentToneClassName: "text-[#E07060]",
    chipClassName: "bg-white/70 border border-[#F0A090]/42 text-[#C05840] shadow-sm",
    surfaceClassName: "bg-white/56 border border-[#F0B0A0]/42 backdrop-blur-md shadow-[0_20px_50px_-30px_rgba(220,112,96,0.28)]",
    softSurfaceClassName: "bg-white/40 border border-[#F8C0B0]/38 backdrop-blur-md",
    buttonClassName: "bg-gradient-to-r from-[#E07060] to-[#F09080] text-white shadow-[0_10px_26px_rgba(224,112,96,0.26)]",
    modalClassName: "bg-[#FFF6F4] border-[#F0A090]/34",
    layoutVariant: "drift",
    overlay: {
      backgroundImage: `radial-gradient(circle at 20% 22%, rgba(255,255,255,0.72) 0, transparent 26%), radial-gradient(circle at 80% 18%, rgba(240,160,144,0.18) 0, transparent 22%), radial-gradient(circle at 60% 82%, rgba(255,200,180,0.26) 0, transparent 24%)`,
    },
    frameStyle: {
      border: "1px solid rgba(224,112,96,0.22)",
      borderRadius: "2.8rem",
      boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.22)",
      margin: "0.9rem",
    },
    ornament: (
      <>
        <div className="absolute -left-3 -top-3 h-44 w-44 opacity-84 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><circle cx="56" cy="56" r="12" fill="#F06050" fillOpacity="0.18"/><path d="M56 44c4 4 8 8 6 14-2 6-8 8-14 6 0-6 2-12 8-20z" fill="#E86858" fillOpacity="0.60"/><path d="M68 56c-4 4-8 8-14 6-6-2-8-8-6-14 6 0 14 2 20 8z" fill="#F08070" fillOpacity="0.56"/><path d="M56 68c-4-4-8-8-6-14 2-6 8-8 14-6 0 6-2 12-8 20z" fill="#E86858" fillOpacity="0.60"/><path d="M44 56c4-4 8-8 14-6 6 2 8 8 6 14-6 0-14-2-20-8z" fill="#F08070" fillOpacity="0.56"/><circle cx="56" cy="56" r="4.5" fill="#FFD0C0" fillOpacity="0.80"/><ellipse cx="30" cy="30" rx="8" ry="4" transform="rotate(-28 30 30)" fill="#F08070" fillOpacity="0.48"/><ellipse cx="90" cy="20" rx="6" ry="3" transform="rotate(15 90 20)" fill="#F5A090" fillOpacity="0.42"/><ellipse cx="20" cy="80" rx="7" ry="3.5" transform="rotate(-45 20 80)" fill="#E86858" fillOpacity="0.44"/></svg>
        </div>
        <div className="absolute -right-3 -top-3 h-44 w-44 opacity-84 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none"><circle cx="56" cy="56" r="12" fill="#F06050" fillOpacity="0.18"/><path d="M56 44c4 4 8 8 6 14-2 6-8 8-14 6 0-6 2-12 8-20z" fill="#E86858" fillOpacity="0.60"/><path d="M68 56c-4 4-8 8-14 6-6-2-8-8-6-14 6 0 14 2 20 8z" fill="#F08070" fillOpacity="0.56"/><path d="M56 68c-4-4-8-8-6-14 2-6 8-8 14-6 0 6-2 12-8 20z" fill="#E86858" fillOpacity="0.60"/><path d="M44 56c4-4 8-8 14-6 6 2 8 8 6 14-6 0-14-2-20-8z" fill="#F08070" fillOpacity="0.56"/><circle cx="56" cy="56" r="4.5" fill="#FFD0C0" fillOpacity="0.80"/><ellipse cx="30" cy="30" rx="8" ry="4" transform="rotate(-28 30 30)" fill="#F08070" fillOpacity="0.48"/><ellipse cx="90" cy="20" rx="6" ry="3" transform="rotate(15 90 20)" fill="#F5A090" fillOpacity="0.42"/></svg>
        </div>
        <div className="absolute -left-3 -bottom-3 h-44 w-44 opacity-78 pointer-events-none" style={{ transform: 'scaleY(-1)' }}>
          <svg viewBox="0 0 160 160" fill="none"><circle cx="56" cy="56" r="12" fill="#F06050" fillOpacity="0.18"/><path d="M56 44c4 4 8 8 6 14-2 6-8 8-14 6 0-6 2-12 8-20z" fill="#E86858" fillOpacity="0.56"/><path d="M68 56c-4 4-8 8-14 6-6-2-8-8-6-14 6 0 14 2 20 8z" fill="#F08070" fillOpacity="0.52"/><path d="M56 68c-4-4-8-8-6-14 2-6 8-8 14-6 0 6-2 12-8 20z" fill="#E86858" fillOpacity="0.56"/><circle cx="56" cy="56" r="4.5" fill="#FFD0C0" fillOpacity="0.75"/></svg>
        </div>
        <div className="absolute -right-3 -bottom-3 h-44 w-44 rotate-180 opacity-78 pointer-events-none">
          <svg viewBox="0 0 160 160" fill="none"><circle cx="56" cy="56" r="12" fill="#F06050" fillOpacity="0.18"/><path d="M56 44c4 4 8 8 6 14-2 6-8 8-14 6 0-6 2-12 8-20z" fill="#E86858" fillOpacity="0.56"/><path d="M68 56c-4 4-8 8-14 6-6-2-8-8-6-14 6 0 14 2 20 8z" fill="#F08070" fillOpacity="0.52"/><path d="M56 68c-4-4-8-8-6-14 2-6 8-8 14-6 0 6-2 12-8 20z" fill="#E86858" fillOpacity="0.56"/><circle cx="56" cy="56" r="4.5" fill="#FFD0C0" fillOpacity="0.75"/></svg>
        </div>
        <div className="absolute inset-x-12 top-7 h-20 border border-[#E07060]/18 border-b-0 rounded-t-[999px] pointer-events-none" />
      </>
    ),
  },
};

export const PublicInvitationPage = ({
  onBack,
  templateKey,
  typographyKey,
  wedding,
  guest = null,
  eventToken,
  coupleMainImage = "",
  coupleGalleryImages = [],
  ceremonyEvents = [],
  googleMapsLink = null,
}: PublicInvitationPageProps) => {
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [attendingCount, setAttendingCount] = useState(1);
  const [note, setNote] = useState("");
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firstEvent = ceremonyEvents[0] ?? null;

  const w = wedding;

  const resolveTheme = (key: string): InvitationTheme => {
    const theme = invitationThemes[key] || invitationThemes["faded-picture-overlay"];
    if (key === "faded-picture-overlay" && coupleMainImage) {
      return {
        ...theme,
        overlay: {
          ...theme.overlay,
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%), url(${coupleMainImage})`,
        },
      };
    }
    return theme;
  };

  const selectedTheme = resolveTheme(templateKey);
  const selectedTypography = typographyOptions.find((typo) => typo.key === typographyKey) || typographyOptions[0];
  const googleCalendarLink = buildGoogleCalendarUrl(wedding, firstEvent ?? undefined);
  const invitationCanvasWidthClass = "w-full max-w-[700px]";
  const navigationButtonClassName = selectedTheme.textToneClassName.includes("white")
    ? "bg-black/35 border-white/12 text-white"
    : "bg-white/80 border-black/5 text-stone-900";
  const iconButtonClassName = selectedTheme.textToneClassName.includes("white")
    ? "bg-black/45 text-white border border-white/10 hover:bg-black/60"
    : "bg-white/85 text-stone-900 border border-black/5 hover:bg-white";

  const renderHeroSection = () => {
    const namesMarkup = (
      <h1 className={`mt-5 mx-auto max-w-[10ch] text-[clamp(2.4rem,10vw,5.15rem)] font-bold leading-[0.92] tracking-[-0.045em] ${selectedTypography.headingFont}`}>
        <span className="block break-words">{w.bride_name}</span>
        <span className={`block py-1 text-xl italic tracking-normal sm:text-2xl md:text-3xl ${selectedTheme.accentToneClassName} ${selectedTypography.headingFont}`}>&</span>
        <span className="block break-words">{w.groom_name}</span>
      </h1>
    );

    if (selectedTheme.layoutVariant === "cameo") {
      return (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <div className="mx-auto mb-6 w-[82%] max-w-[22rem] overflow-hidden rounded-[999px] border-[6px] border-white/60 bg-white/15 p-1 shadow-[0_24px_50px_-30px_rgba(199,106,130,0.45)]">
              <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[999px]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            {namesMarkup}
            <div className="mx-auto mt-5 h-px w-28 bg-current/20" />
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </motion.div>
        </>
      );
    }

    if (selectedTheme.layoutVariant === "arch") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className={`mx-auto max-w-xl rounded-[2.8rem_2.8rem_1.6rem_1.6rem] border p-5 md:p-7 ${selectedTheme.softSurfaceClassName}`}>
            <div className="mx-auto mb-5 w-[82%] max-w-[18rem] overflow-hidden rounded-[999px_999px_1.2rem_1.2rem] border border-current/15 p-1">
              <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[999px_999px_0.9rem_0.9rem]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            {namesMarkup}
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "split") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="mx-auto w-[84%] max-w-[32rem]">
            <div className={`overflow-hidden rounded-[2rem] border p-2 ${selectedTheme.softSurfaceClassName}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {coupleGalleryImages.slice(0, 3).map((src, index) => (
                <div key={index} className={`overflow-hidden rounded-[1rem] border p-1 ${selectedTheme.softSurfaceClassName}`}>
                  <div className="aspect-square overflow-hidden rounded-[0.8rem]">
                    <img src={src} alt="Gallery preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            <div className="mx-auto">{namesMarkup}</div>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "celestial") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className={`mx-auto max-w-2xl rounded-[2rem] p-6 md:p-8 ${selectedTheme.softSurfaceClassName}`}>
            <div className="relative mx-auto mb-6 w-[84%] max-w-xl">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-[112%] w-[112%] rounded-full border border-[#F4D37B]/18" />
                <div className="absolute h-[88%] w-[88%] rounded-full border border-[#F4D37B]/14" />
                <div className="absolute h-[72%] w-[72%] rounded-full border border-[#F4D37B]/10" />
              </div>
              <div className="mx-auto w-full overflow-hidden rounded-[999px] border border-[#F4D37B]/18 bg-[#140d24]/30 p-2 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.8)]">
                <div className="aspect-square overflow-hidden rounded-[999px]">
                  <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            {namesMarkup}
            <div className="mx-auto mt-5 flex w-fit items-center gap-3">
              <span className="h-px w-12 bg-current/25" />
              <span className={`text-base tracking-[0.35em] uppercase ${selectedTheme.accentToneClassName}`}>Ornate Night</span>
              <span className="h-px w-12 bg-current/25" />
            </div>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "blossom") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className={`mx-auto max-w-xl rounded-[2rem] px-6 py-8 md:px-8 md:py-10 ${selectedTheme.softSurfaceClassName}`}>
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <div className="mx-auto mt-5 flex w-44 items-center gap-3">
              <span className="h-px flex-1 bg-[#C9A96E]/35" />
              <span className="text-[#C9A96E] text-sm">◆</span>
              <span className="h-px flex-1 bg-[#C9A96E]/35" />
            </div>
            <div className="mx-auto mt-5 w-[78%] max-w-[20rem] overflow-hidden rounded-[999px] border-[5px] border-white/55 bg-white/20 p-1 shadow-[0_20px_46px_-28px_rgba(139,26,58,0.38)]">
              <div className="aspect-[3/4] h-full w-full overflow-hidden rounded-[999px]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="mx-auto mt-5 flex w-36 items-center gap-3">
              <span className="h-px flex-1 bg-[#C9A96E]/35" />
              <span className="text-[#C9A96E] text-base">❧</span>
              <span className="h-px flex-1 bg-[#C9A96E]/35" />
            </div>
            {namesMarkup}
            <div className="mx-auto mt-4 flex w-36 items-center gap-3">
              <span className="h-px flex-1 bg-[#C9A96E]/30" />
              <span className="text-[#C9A96E] text-xs">◆</span>
              <span className="h-px flex-1 bg-[#C9A96E]/30" />
            </div>
            <p className={`mt-4 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "botanical") {
      const eucaBranch = (
        <svg viewBox="0 0 200 56" fill="none" className="h-full w-full">
          <path d="M100 48 Q80 38 58 26 Q38 16 14 8" stroke="#6A8C5E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75"/>
          <path d="M100 48 Q120 38 142 26 Q162 16 186 8" stroke="#6A8C5E" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75"/>
          <ellipse cx="74" cy="30" rx="10" ry="5.5" transform="rotate(-38 74 30)" fill="#7E9E72" fillOpacity="0.78"/>
          <ellipse cx="70" cy="36" rx="10" ry="5.5" transform="rotate(-142 70 36)" fill="#6A8C5E" fillOpacity="0.7"/>
          <ellipse cx="54" cy="20" rx="9" ry="5" transform="rotate(-35 54 20)" fill="#8FAA7E" fillOpacity="0.74"/>
          <ellipse cx="50" cy="26" rx="9" ry="5" transform="rotate(-140 50 26)" fill="#7E9E72" fillOpacity="0.67"/>
          <ellipse cx="32" cy="12" rx="8" ry="4.5" transform="rotate(-30 32 12)" fill="#6A8C5E" fillOpacity="0.7"/>
          <ellipse cx="28" cy="17" rx="7" ry="4" transform="rotate(-144 28 17)" fill="#95AA82" fillOpacity="0.6"/>
          <ellipse cx="126" cy="30" rx="10" ry="5.5" transform="rotate(-142 126 30)" fill="#7E9E72" fillOpacity="0.78"/>
          <ellipse cx="130" cy="36" rx="10" ry="5.5" transform="rotate(-38 130 36)" fill="#6A8C5E" fillOpacity="0.7"/>
          <ellipse cx="146" cy="20" rx="9" ry="5" transform="rotate(-145 146 20)" fill="#8FAA7E" fillOpacity="0.74"/>
          <ellipse cx="150" cy="26" rx="9" ry="5" transform="rotate(-40 150 26)" fill="#7E9E72" fillOpacity="0.67"/>
          <ellipse cx="168" cy="12" rx="8" ry="4.5" transform="rotate(-150 168 12)" fill="#6A8C5E" fillOpacity="0.7"/>
          <ellipse cx="172" cy="17" rx="7" ry="4" transform="rotate(-36 172 17)" fill="#95AA82" fillOpacity="0.6"/>
          <circle cx="100" cy="48" r="3" fill="#95A870" fillOpacity="0.85"/>
          <circle cx="96" cy="44" r="2" fill="#7E9E72" fillOpacity="0.72"/>
          <circle cx="104" cy="44" r="2" fill="#7E9E72" fillOpacity="0.72"/>
        </svg>
      );
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="mx-auto w-[82%] max-w-xl" style={{ height: '64px' }}>{eucaBranch}</div>
          <span className={`inline-flex mt-4 rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
          <div className="mx-auto mt-6 w-[52%] max-w-[18rem] overflow-hidden rounded-full border-[5px] border-white/55 p-1 shadow-[0_18px_44px_-26px_rgba(44,62,37,0.28)]">
            <div className="aspect-square overflow-hidden rounded-full">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-6 flex w-48 items-center gap-3">
            <span className="h-px flex-1 bg-[#6A8C5E]/32" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C9 7 2 9 2 12c0 3 7 5 10 10 3-5 10-7 10-10 0-3-7-5-10-10z" fill="#6A8C5E" fillOpacity="0.72"/></svg>
            <span className="h-px flex-1 bg-[#6A8C5E]/32" />
          </div>
          <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
          {namesMarkup}
          <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          <div className="mx-auto mt-6 w-[82%] max-w-xl rotate-180" style={{ height: '64px' }}>{eucaBranch}</div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "asymmetric") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative mb-10">
          <div className="text-center">
            <div className={`mx-auto mb-6 w-[84%] max-w-[34rem] overflow-hidden rounded-[2.2rem_1.2rem_2.4rem_1.3rem] border p-2 rotate-[-4deg] ${selectedTheme.softSurfaceClassName}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-[1.7rem_0.8rem_1.9rem_0.9rem] rotate-[4deg]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <div>
              <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
              <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
              <div className="mx-auto">{namesMarkup}</div>
              <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-3 md:justify-end">
            {coupleGalleryImages.slice(0, 2).map((src, index) => (
              <div key={index} className={`w-24 overflow-hidden rounded-[1.1rem] border p-1 ${selectedTheme.softSurfaceClassName} ${index === 0 ? "rotate-[4deg]" : "-rotate-[5deg] mt-4"}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-[0.9rem]">
                  <img src={src} alt="Gallery preview" className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "petal") {
      return (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <div className="relative mx-auto mb-6 w-[78%] max-w-[22rem]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-[116%] w-[116%] rounded-full border border-[#D4607C]/18" />
                <div className="absolute h-[108%] w-[108%] rounded-full border border-[#E898B0]/14" />
              </div>
              <div className="mx-auto w-full overflow-hidden rounded-[999px] border-[6px] border-white/60 bg-white/15 p-1 shadow-[0_24px_50px_-30px_rgba(212,96,124,0.42)]">
                <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[999px]">
                  <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            {namesMarkup}
            <div className="mx-auto mt-5 h-px w-28 bg-current/20" />
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </motion.div>
        </>
      );
    }

    if (selectedTheme.layoutVariant === "velvet") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className={`mx-auto max-w-2xl rounded-[2rem] p-6 md:p-8 ${selectedTheme.softSurfaceClassName}`}>
            <div className="relative mx-auto mb-6 w-[80%] max-w-lg">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-[115%] w-[115%] rounded-full border border-[#D4A864]/20" />
                <div className="absolute h-[88%] w-[88%] rounded-full border border-[#D4A864]/15" />
                <div className="absolute h-[70%] w-[70%] rounded-full border border-[#D4A864]/10" />
              </div>
              <div className="mx-auto w-full overflow-hidden rounded-[999px] border border-[#D4A864]/20 bg-[#1A0E26]/35 p-2 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.85)]">
                <div className="aspect-square overflow-hidden rounded-[999px]">
                  <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            {namesMarkup}
            <div className="mx-auto mt-5 flex w-fit items-center gap-3">
              <span className="h-px w-12 bg-current/20" />
              <span className={`text-sm tracking-[0.35em] uppercase ${selectedTheme.accentToneClassName}`}>Velvet Evening</span>
              <span className="h-px w-12 bg-current/20" />
            </div>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "minimal") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
          <div className="mx-auto mt-5 h-px w-16 bg-current/20" />
          <div className="mx-auto mt-5 w-[54%] max-w-[18rem] overflow-hidden rounded-full border border-current/15 p-1 shadow-[0_16px_40px_-22px_rgba(44,36,24,0.18)]">
            <div className="aspect-square overflow-hidden rounded-full">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-5 h-px w-16 bg-current/20" />
          <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
          {namesMarkup}
          <div className="mx-auto mt-5 h-px w-24 bg-current/15" />
          <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "garden") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className={`mx-auto max-w-xl rounded-[2.8rem_2.8rem_1.6rem_1.6rem] border p-5 md:p-7 ${selectedTheme.softSurfaceClassName}`}>
            <div className="mx-auto mb-5 w-[80%] max-w-[19rem] overflow-hidden rounded-[999px_999px_1.2rem_1.2rem] border border-[#4A8A60]/20 p-1">
              <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[999px_999px_0.9rem_0.9rem]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            {namesMarkup}
            <div className="mx-auto mt-5 flex w-fit items-center gap-2">
              <span className="h-px w-10 bg-[#4A8A60]/30" />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C9 7 2 9 2 12c0 3 7 5 10 10 3-5 10-7 10-10 0-3-7-5-10-10z" fill="#4A8A60" fillOpacity="0.68"/></svg>
              <span className="h-px w-10 bg-[#4A8A60]/30" />
            </div>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "crimson") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className={`mx-auto max-w-xl rounded-[2rem] px-6 py-8 md:px-8 md:py-10 ${selectedTheme.softSurfaceClassName}`}>
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <div className="mx-auto mt-5 flex w-44 items-center gap-3">
              <span className="h-px flex-1 bg-[#B8922A]/35" />
              <span className="text-[#B8922A] text-sm">◆</span>
              <span className="h-px flex-1 bg-[#B8922A]/35" />
            </div>
            <div className="mx-auto mt-5 w-[76%] max-w-[20rem] overflow-hidden rounded-[999px] border-[5px] border-white/55 bg-white/20 p-1 shadow-[0_20px_46px_-28px_rgba(158,32,48,0.38)]">
              <div className="aspect-[3/4] h-full w-full overflow-hidden rounded-[999px]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="mx-auto mt-5 flex w-36 items-center gap-3">
              <span className="h-px flex-1 bg-[#B8922A]/35" />
              <span className="text-[#B8922A] text-base">❧</span>
              <span className="h-px flex-1 bg-[#B8922A]/35" />
            </div>
            {namesMarkup}
            <div className="mx-auto mt-4 flex w-36 items-center gap-3">
              <span className="h-px flex-1 bg-[#B8922A]/30" />
              <span className="text-[#B8922A] text-xs">◆</span>
              <span className="h-px flex-1 bg-[#B8922A]/30" />
            </div>
            <p className={`mt-4 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "harvest") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative mb-10">
          <div className="text-center">
            <div className={`mx-auto mb-6 w-[84%] max-w-[34rem] overflow-hidden rounded-[2.2rem_1.2rem_2.4rem_1.3rem] border p-2 rotate-[-3deg] ${selectedTheme.softSurfaceClassName}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-[1.7rem_0.8rem_1.9rem_0.9rem] rotate-[3deg]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <div>
              <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
              <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
              <div className="mx-auto">{namesMarkup}</div>
              <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-3">
            {coupleGalleryImages.slice(0, 2).map((src, index) => (
              <div key={index} className={`w-24 overflow-hidden rounded-[1.1rem] border p-1 ${selectedTheme.softSurfaceClassName} ${index === 0 ? "rotate-[3deg]" : "-rotate-[4deg] mt-4"}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-[0.9rem]">
                  <img src={src} alt="Gallery preview" className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "wisteria") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className={`mx-auto max-w-xl rounded-[2.8rem_2.8rem_1.6rem_1.6rem] border p-5 md:p-7 ${selectedTheme.softSurfaceClassName}`}>
            <div className="mx-auto mb-5 w-[80%] max-w-[18rem] overflow-hidden rounded-[999px_999px_1.2rem_1.2rem] border border-[#C8A0DC]/22 p-1">
              <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[999px_999px_0.9rem_0.9rem]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            {namesMarkup}
            <div className="mx-auto mt-5 flex w-fit items-center gap-3">
              <span className="h-px w-10 bg-[#9A60BE]/28" />
              <span className={`text-sm tracking-[0.3em] uppercase ${selectedTheme.accentToneClassName}`}>·❋·</span>
              <span className="h-px w-10 bg-[#9A60BE]/28" />
            </div>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "pearl") {
      return (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
            <div className="relative mx-auto mb-6 w-[78%] max-w-[22rem]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-[118%] w-[118%] rounded-full border border-[#B8D0E4]/28" />
                <div className="absolute h-[109%] w-[109%] rounded-full border border-[#C0D8EC]/20" />
              </div>
              <div className="mx-auto w-full overflow-hidden rounded-[999px] border-[6px] border-white/68 bg-white/20 p-1 shadow-[0_24px_50px_-30px_rgba(100,150,200,0.30)]">
                <div className="aspect-[4/5] h-full w-full overflow-hidden rounded-[999px]">
                  <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            {namesMarkup}
            <div className="mx-auto mt-5 flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="inline-block rounded-full border border-[#B8D0E4]/55 bg-white/50 shadow-sm" style={{ width: i === 2 ? 10 : 7, height: i === 2 ? 10 : 7 }} />
              ))}
            </div>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </motion.div>
        </>
      );
    }

    if (selectedTheme.layoutVariant === "royale") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className={`mx-auto max-w-2xl rounded-[2rem] p-6 md:p-8 ${selectedTheme.softSurfaceClassName}`}>
            <div className="relative mx-auto mb-6 w-[80%] max-w-lg">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-[118%] w-[118%] rounded-full border border-[#E8C868]/22" />
                <div className="absolute h-[90%] w-[90%] rounded-full border border-[#E8C868]/16" />
                <div className="absolute h-[70%] w-[70%] rounded-full border border-[#E8C868]/10" />
              </div>
              <div className="mx-auto w-full overflow-hidden rounded-[999px] border border-[#E8C868]/22 bg-[#0E1628]/35 p-2 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.90)]">
                <div className="aspect-square overflow-hidden rounded-[999px]">
                  <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            {namesMarkup}
            <div className="mx-auto mt-5 flex w-fit items-center gap-3">
              <span className="h-px w-12 bg-[#E8C868]/30" />
              <span className={`text-sm tracking-[0.35em] uppercase ${selectedTheme.accentToneClassName}`}>Royal Affair</span>
              <span className="h-px w-12 bg-[#E8C868]/30" />
            </div>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    if (selectedTheme.layoutVariant === "drift") {
      return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="mx-auto w-[84%] max-w-[32rem]">
            <div className={`overflow-hidden rounded-[2rem] border p-2 ${selectedTheme.softSurfaceClassName}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {coupleGalleryImages.slice(0, 3).map((src, index) => (
                <div key={index} className={`overflow-hidden rounded-[1rem] border p-1 ${selectedTheme.softSurfaceClassName}`}>
                  <div className="aspect-square overflow-hidden rounded-[0.8rem]">
                    <img src={src} alt="Gallery preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
            <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
            <div className="mx-auto">{namesMarkup}</div>
            <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
          </div>
        </motion.div>
      );
    }

    return (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8 md:mb-10">
          <span className={`inline-flex rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.45em] ${selectedTheme.chipClassName}`}>Wedding Invitation</span>
          <p className={`mt-5 text-sm italic ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Together with their families</p>
          {namesMarkup}
          <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{[firstEvent?.date ? new Date(firstEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '', firstEvent?.venue ?? ''].filter(Boolean).join(' · ')}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-8 md:mb-10">
          <div className={`mx-auto w-[84%] max-w-[36rem] overflow-hidden rounded-[1.5rem] p-2 ${selectedTheme.softSurfaceClassName}`}>
            <div className="aspect-[4/5] overflow-hidden rounded-[1.15rem]">
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </div>
          </div>
        </motion.div>
      </>
    );
  };

  useEffect(() => {
    const eventDate = firstEvent?.date;
    if (!eventDate) return;
    const diff = Math.ceil((new Date(eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diff));
  }, [firstEvent?.date]);

  // Auto-slide gallery
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      setGalleryIdx((p) => (p + 1) % coupleGalleryImages.length);
    }, 4000);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, []);

  const resetAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(() => {
      setGalleryIdx((p) => (p + 1) % coupleGalleryImages.length);
    }, 4000);
  };

  const goPrev = () => {
    setGalleryIdx((p) => (p - 1 + coupleGalleryImages.length) % coupleGalleryImages.length);
    resetAutoSlide();
  };

  const goNext = () => {
    setGalleryIdx((p) => (p + 1) % coupleGalleryImages.length);
    resetAutoSlide();
  };

  const handleSubmitRSVP = async () => {
    if (guest?.guest_token && eventToken) {
      try {
        await axios.post(`/invitation/${eventToken}/rsvp`, {
          guest_token:    guest.guest_token,
          attending:      attending,
          attending_count: attendingCount,
          note:           note,
        });
      } catch {
        // Still show success UI even if request fails
      }
    }
    setRsvpSubmitted(true);
    setTimeout(() => setShowRSVP(false), 2000);
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${selectedTheme.pageClassName}`}>
      {onBack && (
        <button onClick={onBack} className={`fixed top-4 left-4 z-50 rounded-full border px-3 py-1.5 text-sm shadow-card backdrop-blur-sm ${navigationButtonClassName}`}>← Back</button>
      )}

      <div className="relative z-10 px-4 py-10 md:px-8 md:py-12">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative mx-auto overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-32px_rgba(0,0,0,0.35)] ${invitationCanvasWidthClass} ${selectedTheme.previewClassName}`}
        >
          <div className="absolute inset-0" style={selectedTheme.overlay} />
          <div className="absolute inset-0">{selectedTheme.ornament}</div>
          <div className="relative m-3 rounded-[1.7rem] p-4 md:m-5 md:p-6" style={selectedTheme.frameStyle}>
            <div className={`relative z-10 rounded-[1.4rem] px-5 py-8 md:px-10 md:py-12 ${selectedTheme.textToneClassName}`}>
              <div className="mx-auto max-w-2xl">
                {renderHeroSection()}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={`mb-6 rounded-[1.4rem] p-6 text-center ${selectedTheme.softSurfaceClassName}`}>
                  <p className={`text-sm ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Save the date and join us in celebrating the first chapter of forever.</p>
                  <p className={`mt-3 text-2xl font-semibold ${selectedTypography.bodyFont}`}>{guest?.guest_name ?? "Dear Guest"}</p>
                  <p className={`mt-2 text-sm ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>We joyfully invite you to share in our day of love, blessings, and celebration.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  <div className={`rounded-[1.4rem] p-6 ${selectedTheme.surfaceClassName}`}>
                    <p className={`text-xs uppercase tracking-[0.3em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>With The Blessings Of</p>
                    <div className="mt-4 flex flex-col md:flex-row md:items-start">
                      <div className="flex-1 pb-4 md:pb-0 md:pr-5">
                        <p className={`text-base font-semibold leading-snug ${selectedTypography.bodyFont}`}>{w.bride_parents_names}</p>
                        <p className={`mt-1.5 text-[10px] uppercase tracking-[0.25em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Bride's Parents</p>
                      </div>
                      {/* Divider */}
                      <div className="h-px w-full md:h-auto md:w-px md:self-stretch bg-current/12 md:mx-0.5 shrink-0" />
                      <div className="flex-1 pt-4 md:pt-0 md:pl-5">
                        <p className={`text-base font-semibold leading-snug ${selectedTypography.bodyFont}`}>{w.groom_parents_names}</p>
                        <p className={`mt-1.5 text-[10px] uppercase tracking-[0.25em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Groom's Parents</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className={`rounded-[1.4rem] p-6 text-center ${selectedTheme.surfaceClassName}`}>
                      <p className={`text-xs uppercase tracking-[0.35em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Counting Down</p>
                      <p className={`mt-3 text-6xl font-bold leading-none ${selectedTypography.headingFont}`}>{daysLeft}</p>
                      <p className={`mt-2 text-sm ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>days to go</p>
                    </div>
                    <a
                      href={googleCalendarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 ${selectedTheme.buttonClassName}`}
                    >
                      <Calendar className="h-4 w-4" />
                      Add to Google Calendar
                    </a>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className={`mb-6 rounded-[1.4rem] p-6 ${selectedTheme.surfaceClassName}`}>
                  <p className={`text-xs uppercase tracking-[0.3em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Ceremony Details</p>
                  {ceremonyEvents.length === 0 && (
                    <p className={`mt-4 text-sm ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Details to be announced.</p>
                  )}
                  {ceremonyEvents.map((evt, idx) => (
                    <div key={idx} className={`mt-5 ${ceremonyEvents.length > 1 ? 'border-b border-current/10 pb-5 last:border-b-0 last:pb-0' : ''}`}>
                      {ceremonyEvents.length > 1 && (
                        <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] ${selectedTheme.accentToneClassName} ${selectedTypography.bodyFont}`}>{evt.label}</p>
                      )}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex gap-3">
                          <Calendar className={`mt-0.5 h-5 w-5 shrink-0 ${selectedTheme.accentToneClassName}`} />
                          <div>
                            <p className={`text-sm font-semibold ${selectedTypography.bodyFont}`}>{evt.date ? new Date(evt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</p>
                            <p className={`text-xs ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>{evt.label}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Clock className={`mt-0.5 h-5 w-5 shrink-0 ${selectedTheme.accentToneClassName}`} />
                          <div>
                            <p className={`text-sm font-semibold ${selectedTypography.bodyFont}`}>{evt.end_time ? `${formatTime12(evt.start_time)} – ${formatTime12(evt.end_time)}` : `${formatTime12(evt.start_time)} onwards`}</p>
                            {evt.poruwa_time && (
                              <p className={`text-xs ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Poruwa at {formatTime12(evt.poruwa_time)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <MapPin className={`mt-0.5 h-5 w-5 shrink-0 ${selectedTheme.accentToneClassName}`} />
                          <div>
                            <p className={`text-sm font-semibold ${selectedTypography.bodyFont}`}>{evt.venue || '—'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {ceremonyEvents.filter(e => e.google_maps_link).length > 0 && (
                    <div className="mt-5 flex flex-row gap-3">
                      {ceremonyEvents.filter(e => e.google_maps_link).map((evt, i) => (
                        <a
                          key={i}
                          href={evt.google_maps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex flex-1 items-center justify-center text-center gap-2 rounded-full px-5 py-3 text-base font-medium transition-opacity hover:opacity-90 ${selectedTheme.buttonClassName}`}
                        >
                          <MapPin className="h-4 w-4 shrink-0" />
                          {ceremonyEvents.filter(e => e.google_maps_link).length > 1
                            ? `View Map · ${evt.label}`
                            : 'View On Map'}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className={`mb-6 rounded-[1.4rem] p-6 ${selectedTheme.surfaceClassName}`}>
                  <div className="mb-4 text-center">
                    <p className={`text-xs uppercase tracking-[0.3em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Our Moments</p>
                  </div>
                  <div className={`relative overflow-hidden ${selectedTheme.layoutVariant === "split" ? "rounded-[2rem]" : selectedTheme.layoutVariant === "celestial" ? "rounded-[1.8rem] border border-white/10" : selectedTheme.layoutVariant === "asymmetric" ? "rounded-[2rem_1rem_2rem_1rem]" : "rounded-[1.2rem]"}`}>
                    <div className="relative aspect-[16/10]">
                      {coupleGalleryImages.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === galleryIdx ? "opacity-100" : "opacity-0"}`}
                        />
                      ))}
                    </div>
                    <button onClick={goPrev} className={`absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${iconButtonClassName}`}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={goNext} className={`absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${iconButtonClassName}`}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className={`absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 ${selectedTheme.layoutVariant === "celestial" ? "rounded-full bg-black/20 px-3 py-1" : ""}`}>
                      {coupleGalleryImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setGalleryIdx(i);
                            resetAutoSlide();
                          }}
                          className={`rounded-full transition-all ${selectedTheme.layoutVariant === "split" ? "h-2.5" : "h-2"} ${i === galleryIdx ? "w-5 bg-white" : "w-2 bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
                  <button onClick={() => {
                    setShowRSVP(true);
                    if (guest?.guest_token && eventToken) {
                      axios.post(`/invitation/${eventToken}/rsvp-click`, { guest_token: guest.guest_token }).catch(() => {});
                    }
                  }} className={`rounded-full px-8 py-3 text-sm font-medium shadow-wedding transition-opacity hover:opacity-90 ${selectedTheme.buttonClassName}`}>
                    <Heart className="mr-2 inline h-4 w-4 fill-current" /> Will You Attend?
                  </button>
                  {w.rsvp_deadline && (
                    <p className={`mt-3 text-xs ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>
                      Kindly confirm your presence by {new Date(w.rsvp_deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  <div className={`mt-8 rounded-[1.4rem] p-5 ${selectedTheme.softSurfaceClassName}`}>
                    <p className={`text-xs uppercase tracking-[0.3em] ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Contact Us</p>
                    <div className="mt-4 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-8">
                      <a href={`tel:${w.contact_number_1}`} className={`flex items-center gap-1.5 text-sm ${selectedTypography.bodyFont}`}><Phone className={`h-3.5 w-3.5 ${selectedTheme.accentToneClassName}`} />{w.contact_number_1}</a>
                      <a href={`tel:${w.contact_number_2}`} className={`flex items-center gap-1.5 text-sm ${selectedTypography.bodyFont}`}><Phone className={`h-3.5 w-3.5 ${selectedTheme.accentToneClassName}`} />{w.contact_number_2}</a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.article>
      </div>

      {/* RSVP Modal */}
      {showRSVP && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowRSVP(false)} />
          <div className={`relative w-full max-w-md rounded-t-2xl border p-6 shadow-wedding sm:rounded-2xl ${selectedTheme.modalClassName} ${selectedTheme.textToneClassName}`}>
            <button onClick={() => setShowRSVP(false)} className={`absolute right-4 top-4 ${selectedTheme.subTextToneClassName}`}><X className="h-5 w-5" /></button>

            {rsvpSubmitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"><Check className="h-7 w-7 text-success" /></div>
                <h3 className={`text-xl font-semibold ${selectedTypography.headingFont}`}>Thank You!</h3>
                <p className={`mt-1 text-sm ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Your RSVP has been submitted.</p>
              </div>
            ) : (
              <>
                <h3 className={`mb-4 text-xl font-semibold ${selectedTypography.headingFont}`}>RSVP</h3>
                <div className="space-y-4">
                  <div>
                    <p className={`mb-2 text-sm font-medium ${selectedTypography.bodyFont}`}>Will you be attending?</p>
                    <div className="flex gap-3">
                      <button onClick={() => setAttending(true)} className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${attending === true ? "border-success bg-success/10 text-success" : "border-border hover:bg-muted/40"}`}>Yes, I'll be there</button>
                      <button onClick={() => setAttending(false)} className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${attending === false ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:bg-muted/40"}`}>Can't make it</button>
                    </div>
                  </div>
                  {attending && (
                    <div>
                      <p className={`mb-1.5 text-sm font-medium ${selectedTypography.bodyFont}`}>Number of guests</p>
                      <input type="number" min={1} max={guest?.max_attendees ?? 10} value={attendingCount} onChange={(e) => setAttendingCount(Number(e.target.value))} className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-zinc-900" />
                      <p className={`mt-1 text-xs ${selectedTypography.bodyFont} ${selectedTheme.subTextToneClassName}`}>Max: {guest?.max_attendees ?? 10}</p>
                    </div>
                  )}
                  <div>
                    <p className={`mb-1.5 text-sm font-medium ${selectedTypography.bodyFont}`}>Message (optional)</p>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-white text-sm text-zinc-900 resize-none placeholder:text-zinc-400" placeholder="Write a message..." />
                  </div>
                  <button onClick={handleSubmitRSVP} disabled={attending === null} className={`w-full rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 ${selectedTheme.buttonClassName}`}>
                    Submit RSVP
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
