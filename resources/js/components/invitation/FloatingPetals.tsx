import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FloatingPetalsProps {
  /** Petal fill colours (cycled). */
  colors?: string[];
  /** z-index for the fixed layer. */
  zIndex?: number;
}

interface Seed {
  left: number;
  delay: number;
  dur: number;
  drift: number;
  rot: number;
  size: number;
  color: string;
}

const DEFAULT_COLORS = ["#8B3A4A", "#C9A96E", "#F5E6E0", "#E78AA0"];

/**
 * Full-viewport ambient rose-petal layer (fixed, non-interactive).
 * Uses framer-motion (consistent with the rest of the invitation animations)
 * and honours the user's reduced-motion preference. Petal count drops on
 * small screens for performance.
 */
export function FloatingPetals({ colors = DEFAULT_COLORS, zIndex = 1 }: FloatingPetalsProps) {
  const shouldReduce = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const count = shouldReduce ? 0 : isMobile ? 14 : 26;

  const seeds = useMemo<Seed[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 97,
        delay: Math.random() * 8,
        dur: 8 + Math.random() * 7,
        drift: 24 + Math.random() * 55,
        rot: Math.random() * 360,
        size: 10 + Math.random() * 12,
        color: colors[i % colors.length],
      })),
    [count, colors],
  );

  if (count === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex }} aria-hidden="true">
      {seeds.map((s, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 28 28"
          style={{ left: `${s.left}%`, width: s.size, height: s.size, position: "absolute", top: -32 }}
          initial={{ y: -40, x: 0, rotate: s.rot, opacity: 0 }}
          animate={{
            y: "115vh",
            x: [0, s.drift, -s.drift * 0.6, s.drift * 0.3, 0],
            rotate: s.rot + 340,
            opacity: [0, 0.7, 0.7, 0.5, 0],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeIn" }}
        >
          <path d="M14 2 C8 8 8 15 14 24 C20 15 20 8 14 2 Z" fill={s.color} opacity="0.85" />
          <path d="M14 5 C10 10 10 16 14 22 C18 16 18 10 14 5 Z" fill="#FFFFFF" opacity="0.28" />
        </motion.svg>
      ))}
    </div>
  );
}

export default FloatingPetals;
