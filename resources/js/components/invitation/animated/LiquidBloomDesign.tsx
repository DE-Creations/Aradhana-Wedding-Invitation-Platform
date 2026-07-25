import { motion } from "framer-motion";
import type { AnimatedDesignProps } from "./types";
import { AnimatedContent, type AnimatedPalette } from "./AnimatedContent";

// Morphing gradient blobs
function Blobs() {
  const common = "absolute rounded-full blur-3xl mix-blend-multiply opacity-50";
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className={`${common} bg-[#F6A77C]`}
        style={{ width: 340, height: 340, top: "-6%", left: "-8%" }}
        animate={{ borderRadius: ["42% 58% 63% 37%", "58% 42% 37% 63%", "42% 58% 63% 37%"], x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${common} bg-[#B79CE8]`}
        style={{ width: 380, height: 380, bottom: "-8%", right: "-10%" }}
        animate={{ borderRadius: ["60% 40% 40% 60%", "40% 60% 60% 40%", "60% 40% 40% 60%"], x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${common} bg-[#F5C6D6]`}
        style={{ width: 300, height: 300, top: "40%", left: "50%" }}
        animate={{ borderRadius: ["50% 50% 40% 60%", "40% 60% 55% 45%", "50% 50% 40% 60%"], scale: [1, 1.15, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

const palette: AnimatedPalette = {
  headingFont: "font-display",
  bodyFont: "font-sans",
  text: "text-[#3A2E4A]",
  sub: "text-[#3A2E4A]/60",
  accent: "text-[#B06A4A]",
  surface: "bg-white/60 backdrop-blur-xl border border-white/60",
  button: "bg-gradient-to-r from-[#F6A77C] to-[#B79CE8] text-white",
  modal: "bg-white/90 backdrop-blur border-white/70",
  isDark: false,
  arrow: "bg-white/70 text-[#3A2E4A] border border-white/70",
  dotActive: "w-5 bg-[#B06A4A]",
  dot: "w-2 bg-[#3A2E4A]/25",
};

export function LiquidBloomDesign({ wedding: w, coupleMainImage, ...rest }: AnimatedDesignProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FBF7FB]">
      <Blobs />

      <div className="relative z-10 px-4 pt-20">
        {/* Hero */}
        <div className="mx-auto mb-14 flex min-h-[62vh] max-w-2xl flex-col items-center justify-center text-center">
          {coupleMainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 h-44 w-44 overflow-hidden shadow-2xl"
              style={{ borderRadius: "60% 40% 55% 45%" }}
            >
              <img src={coupleMainImage} alt="Couple" className="h-full w-full object-cover" />
            </motion.div>
          )}

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} className="mb-3 text-xs uppercase tracking-[0.4em] text-[#B06A4A]">
            The beginning of forever
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl leading-tight text-[#3A2E4A] md:text-7xl"
          >
            {w.bride_name}
            <span className="mx-3 bg-gradient-to-r from-[#F6A77C] to-[#B79CE8] bg-clip-text text-transparent">&amp;</span>
            {w.groom_name}
          </motion.h1>

          {/* Self-drawing underline */}
          <svg viewBox="0 0 200 12" className="mt-4 h-4 w-56" fill="none">
            <motion.path
              d="M4 8 C50 2 150 2 196 8"
              stroke="#B06A4A"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.8, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <AnimatedContent palette={palette} wedding={w} coupleMainImage={coupleMainImage} {...rest} />
      </div>
    </div>
  );
}

export default LiquidBloomDesign;
