import { motion } from "framer-motion";
import type { AnimatedDesignProps } from "./types";
import { AnimatedContent, type AnimatedPalette } from "./AnimatedContent";

const STARS = Array.from({ length: 46 }, (_, i) => ({
  left: (i * 61) % 100,
  top: (i * 37) % 100,
  size: 1 + ((i * 3) % 3),
  delay: (i * 0.29) % 4,
  dur: 2 + ((i * 7) % 4),
}));

function StarField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 1, 0.15], scale: [1, 1.4, 1] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// Morphing crescent moon (subtle breathing + drift of the inner cutout)
function CrescentMoon() {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden>
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F3E7C0" />
          <stop offset="100%" stopColor="#D4B25E" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="46" fill="url(#moonGlow)" />
      <motion.circle
        cx="78"
        cy="52"
        r="42"
        fill="#0B1026"
        animate={{ cx: [78, 82, 78], cy: [52, 50, 52] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

const palette: AnimatedPalette = {
  headingFont: "font-display",
  bodyFont: "font-serif",
  text: "text-[#E8ECF7]",
  sub: "text-[#E8ECF7]/55",
  accent: "text-[#D4B25E]",
  surface: "bg-white/[0.05] backdrop-blur border border-white/10",
  button: "bg-[#D4B25E] text-[#0B1026]",
  modal: "bg-[#141a33] border-[#D4B25E]/25",
  isDark: true,
  arrow: "bg-black/40 text-white border border-white/15",
  dotActive: "w-5 bg-[#D4B25E]",
  dot: "w-2 bg-white/40",
};

export function CelestialNocturneDesign({ wedding: w, coupleMainImage, ...rest }: AnimatedDesignProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#E8ECF7]">
      {/* Ambient night-sky gradient */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ background: "linear-gradient(180deg,#0B1026,#161B3D,#0B1026)", backgroundSize: "100% 200%" }}
        animate={{ backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <StarField />

      <div className="relative z-10 px-4 pt-20">
        {/* Hero */}
        <div className="mx-auto mb-14 flex min-h-[64vh] max-w-2xl flex-col items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <CrescentMoon />
          </motion.div>

          {coupleMainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="my-6 h-36 w-36 overflow-hidden rounded-full border border-[#D4B25E]/40 p-1"
            >
              <img src={coupleMainImage} alt="Couple" className="h-full w-full rounded-full object-cover" />
            </motion.div>
          )}

          <h1 className="font-display text-5xl leading-tight md:text-7xl">
            <span className="block">{w.bride_name}</span>
            {/* Self-drawing constellation link */}
            <svg viewBox="0 0 200 40" className="mx-auto my-1 h-8 w-48" fill="none">
              <motion.path
                d="M10 20 L70 12 L100 26 L130 12 L190 20"
                stroke="#D4B25E"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.6, delay: 0.6, ease: "easeInOut" }}
              />
              {[10, 70, 100, 130, 190].map((x, i) => (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={[20, 12, 26, 12, 20][i]}
                  r="2.4"
                  fill="#F3E7C0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.35 }}
                />
              ))}
            </svg>
            <span className="block">{w.groom_name}</span>
          </h1>
        </div>

        <AnimatedContent palette={palette} wedding={w} coupleMainImage={coupleMainImage} {...rest} />
      </div>
    </div>
  );
}

export default CelestialNocturneDesign;
