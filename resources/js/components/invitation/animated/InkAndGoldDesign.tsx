import { motion } from "framer-motion";
import type { AnimatedDesignProps } from "./types";
import { AnimatedContent, type AnimatedPalette } from "./AnimatedContent";

const DUST = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47) % 100,
  top: (i * 29) % 100,
  size: 2 + ((i * 5) % 4),
  delay: (i * 0.37) % 5,
  dur: 4 + ((i * 13) % 5),
}));

// Ambient floating gold dust
function GoldDust() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {DUST.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#C9A96E]"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ opacity: [0.1, 0.6, 0.1], y: [0, -14, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// Self-drawing floral line art
function InkFloral({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} fill="none">
      <motion.path
        d="M100 72 C100 50 80 44 60 44 C40 44 34 24 52 14 M100 72 C100 50 120 44 140 44 C160 44 166 24 148 14 M100 72 L100 34 M100 40 C92 34 92 26 100 20 C108 26 108 34 100 40Z"
        stroke="#C9A96E"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

const palette: AnimatedPalette = {
  headingFont: "font-display italic",
  bodyFont: "font-serif",
  text: "text-[#2A2620]",
  sub: "text-[#2A2620]/60",
  accent: "text-[#A8842E]",
  surface: "bg-white/70 backdrop-blur border border-[#C9A96E]/25",
  button: "bg-[#2A2620] text-[#F6EBCF]",
  modal: "bg-[#FBF7EE] border-[#C9A96E]/30",
  isDark: false,
  arrow: "bg-white/80 text-[#2A2620] border border-[#C9A96E]/30",
  dotActive: "w-5 bg-[#A8842E]",
  dot: "w-2 bg-[#A8842E]/30",
};

export function InkAndGoldDesign({ wedding: w, coupleMainImage, ...rest }: AnimatedDesignProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#FBF7EE,#F3E9D2)]">
      <GoldDust />

      <div className="relative z-10 px-4 pt-20">
        {/* Hero */}
        <div className="mx-auto mb-14 flex min-h-[62vh] max-w-2xl flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-xs uppercase tracking-[0.4em] text-[#A8842E]"
          >
            Together with their families
          </motion.p>

          {coupleMainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 h-40 w-40 overflow-hidden rounded-full border border-[#C9A96E]/50 p-1.5"
            >
              <img src={coupleMainImage} alt="Couple" className="h-full w-full rounded-full object-cover" />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl italic leading-tight text-[#2A2620] md:text-7xl"
          >
            {w.bride_name}
            <span className="mx-3 text-[#A8842E]">&amp;</span>
            {w.groom_name}
          </motion.h1>

          <InkFloral className="mt-6 h-16 w-48" />
        </div>

        <AnimatedContent palette={palette} wedding={w} coupleMainImage={coupleMainImage} {...rest} />
      </div>
    </div>
  );
}

export default InkAndGoldDesign;
