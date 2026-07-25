import { motion } from "framer-motion";
import type { AnimatedDesignProps } from "./types";
import { AnimatedContent, type AnimatedPalette } from "./AnimatedContent";

// Ambient shimmer sweep
function Shimmer() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: "linear-gradient(115deg, transparent 40%, rgba(201,169,110,0.10) 50%, transparent 60%)",
        backgroundSize: "300% 300%",
      }}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
      transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
    />
  );
}

// Self-drawing filigree frame around the hero
function FiligreeFrame() {
  return (
    <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none">
      <motion.rect
        x="8"
        y="8"
        width="304"
        height="184"
        rx="4"
        stroke="#C9A96E"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      {[
        "M8 40 C40 40 40 8 72 8",
        "M312 40 C280 40 280 8 248 8",
        "M8 160 C40 160 40 192 72 192",
        "M312 160 C280 160 280 192 248 192",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#C9A96E"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.4 + i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

const palette: AnimatedPalette = {
  headingFont: "font-display",
  bodyFont: "font-serif",
  text: "text-[#F3ECDD]",
  sub: "text-[#F3ECDD]/55",
  accent: "text-[#C9A96E]",
  surface: "bg-white/[0.04] backdrop-blur border border-[#C9A96E]/20",
  button: "bg-[#C9A96E] text-[#0C0B0A]",
  modal: "bg-[#16130E] border-[#C9A96E]/30",
  isDark: true,
  arrow: "bg-black/40 text-[#F3ECDD] border border-[#C9A96E]/25",
  dotActive: "w-5 bg-[#C9A96E]",
  dot: "w-2 bg-[#C9A96E]/30",
};

export function GoldenFiligreeDesign({ wedding: w, coupleMainImage, ...rest }: AnimatedDesignProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_50%_0%,#1a1611,#0C0B0A)] text-[#F3ECDD]">
      <Shimmer />

      <div className="relative z-10 px-4 pt-20">
        {/* Hero */}
        <div className="mx-auto mb-14 max-w-2xl">
          <div className="relative flex min-h-[54vh] flex-col items-center justify-center px-8 py-12 text-center">
            <FiligreeFrame />

            {coupleMainImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative mb-6 h-32 w-32 overflow-hidden rounded-full border border-[#C9A96E]/50 p-1"
              >
                <img src={coupleMainImage} alt="Couple" className="h-full w-full rounded-full object-cover" />
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative mb-3 text-xs uppercase tracking-[0.4em] text-[#C9A96E]"
            >
              Request the honour of your presence
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative font-display text-4xl leading-tight md:text-6xl"
            >
              {w.bride_name}
              <span className="mx-3 text-[#C9A96E]">&amp;</span>
              {w.groom_name}
            </motion.h1>
          </div>
        </div>

        <AnimatedContent palette={palette} wedding={w} coupleMainImage={coupleMainImage} {...rest} />
      </div>
    </div>
  );
}

export default GoldenFiligreeDesign;
