import { motion } from "framer-motion";
import type { AnimatedDesignProps } from "./types";
import { AnimatedContent, type AnimatedPalette } from "./AnimatedContent";

const PETALS = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 53) % 100,
  delay: (i * 0.6) % 8,
  dur: 8 + ((i * 11) % 6),
  drift: 30 + ((i * 17) % 60),
  size: 12 + ((i * 7) % 12),
  color: ["#E89AAE", "#F3C6D2", "#D67A93"][i % 3],
}));

function FallingPetals() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {PETALS.map((s, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          style={{ left: `${s.left}%`, width: s.size, height: s.size, position: "absolute", top: -30 }}
          initial={{ y: -40, rotate: 0, opacity: 0 }}
          animate={{ y: "112vh", x: [0, s.drift, -s.drift * 0.5, 0], rotate: 320, opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeIn" }}
        >
          <path d="M12 2 C7 7 7 14 12 22 C17 14 17 7 12 2Z" fill={s.color} />
        </motion.svg>
      ))}
    </div>
  );
}

// Simple gesturing character avatars
function Characters() {
  return (
    <div className="flex items-end justify-center gap-2">
      {/* Bride */}
      <motion.svg viewBox="0 0 80 120" className="h-32 w-20" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M40 70 L20 118 L60 118 Z" fill="#F3C6D2" />
        <rect x="34" y="46" width="12" height="30" rx="6" fill="#F6D9BF" />
        <circle cx="40" cy="34" r="15" fill="#F6D9BF" />
        <path d="M25 32 Q40 8 55 32 Q52 20 40 18 Q28 20 25 32Z" fill="#5A3B2E" />
        <motion.line x1="30" y1="72" x2="14" y2="60" stroke="#F6D9BF" strokeWidth="6" strokeLinecap="round" animate={{ x2: [14, 18, 14], y2: [60, 54, 60] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.svg>
      {/* Groom */}
      <motion.svg viewBox="0 0 80 120" className="h-32 w-20" animate={{ rotate: [2, -2, 2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="28" y="60" width="24" height="58" rx="6" fill="#3A3A44" />
        <rect x="36" y="60" width="8" height="40" fill="#fff" />
        <rect x="34" y="44" width="12" height="24" rx="6" fill="#EAC6A0" />
        <circle cx="40" cy="34" r="15" fill="#EAC6A0" />
        <path d="M26 30 Q40 12 54 30 L54 24 Q40 14 26 24Z" fill="#2C221B" />
        <motion.line x1="50" y1="72" x2="66" y2="60" stroke="#EAC6A0" strokeWidth="6" strokeLinecap="round" animate={{ x2: [66, 62, 66], y2: [60, 54, 60] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.svg>
    </div>
  );
}

const palette: AnimatedPalette = {
  headingFont: "font-display italic",
  bodyFont: "font-serif",
  text: "text-[#6B2D3C]",
  sub: "text-[#6B2D3C]/60",
  accent: "text-[#C85F7C]",
  surface: "bg-white/75 backdrop-blur border border-[#E89AAE]/30",
  button: "bg-[#C85F7C] text-white",
  modal: "bg-[#FFF2F5] border-[#E89AAE]/40",
  isDark: false,
  arrow: "bg-white/80 text-[#6B2D3C] border border-[#E89AAE]/40",
  dotActive: "w-5 bg-[#C85F7C]",
  dot: "w-2 bg-[#C85F7C]/30",
};

export function PetalWaltzDesign({ wedding: w, coupleMainImage, ...rest }: AnimatedDesignProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#FFF2F5,#FDE3EB)]">
      <FallingPetals />

      <div className="relative z-10 px-4 pt-20">
        {/* Hero */}
        <div className="mx-auto mb-14 flex min-h-[62vh] max-w-2xl flex-col items-center justify-center text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} className="mb-4 text-xs uppercase tracking-[0.4em] text-[#C85F7C]">
            We're getting married
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
            <Characters />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-5xl italic leading-tight text-[#6B2D3C] md:text-7xl"
          >
            {w.bride_name}
            <span className="mx-3 text-[#C85F7C]">&amp;</span>
            {w.groom_name}
          </motion.h1>
        </div>

        <AnimatedContent palette={palette} wedding={w} coupleMainImage={coupleMainImage} {...rest} />
      </div>
    </div>
  );
}

export default PetalWaltzDesign;
