import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ─── Shared types ─────────────────────────────────────────────────────────────

export type OverlayIntensity = "preview" | "full";

// ─── RosePetalsOverlay ────────────────────────────────────────────────────────

interface PetalSeed {
  left: number;
  delay: number;
  dur: number;
  drift: number;
  rot: number;
  size: number;
}

export function RosePetalsOverlay({ intensity = "full" }: { intensity?: OverlayIntensity }) {
  const shouldReduce = useReducedMotion();
  const count = intensity === "full" ? 22 : 8;

  const seeds = useMemo<PetalSeed[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 96,
        delay: Math.random() * 7,
        dur: 7 + Math.random() * 6,
        drift: 28 + Math.random() * 55,
        rot: Math.random() * 360,
        size: 13 + Math.random() * 18,
      })),
    [count]
  );

  if (shouldReduce) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[10, 30, 55, 75, 90].map((left, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            style={{ left: `${left}%`, width: 16, height: 16, position: "absolute", top: `${15 + i * 15}%`, opacity: 0.35 }}
          >
            <path d="M12 2 C7 7 7 13 12 22 C17 13 17 7 12 2 Z" fill="#E78AA0" />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {seeds.map((s, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 28 28"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            position: "absolute",
            top: -32,
          }}
          initial={{ y: -40, x: 0, rotate: s.rot, opacity: 0 }}
          animate={{
            y: "115%",
            x: [0, s.drift, -s.drift * 0.6, s.drift * 0.3, 0],
            rotate: s.rot + 340,
            opacity: [0, 0.9, 0.9, 0.7, 0],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        >
          {/* Rose petal shape */}
          <path d="M14 2 C8 8 8 15 14 24 C20 15 20 8 14 2 Z" fill="#E78AA0" opacity="0.88" />
          <path d="M14 5 C10 10 10 16 14 22 C18 16 18 10 14 5 Z" fill="#F2B8C8" opacity="0.5" />
        </motion.svg>
      ))}
    </div>
  );
}

// ─── SparklingStarsOverlay ────────────────────────────────────────────────────

interface StarSeed {
  left: number;
  top: number;
  delay: number;
  dur: number;
  fallDur: number;
  size: number;
  color: string;
  isFalling: boolean;
}

const STAR_COLORS = ["#F4D37B", "#FFFFFF", "#FFE5A0", "#E8ECF4"];

export function SparklingStarsOverlay({ intensity = "full" }: { intensity?: OverlayIntensity }) {
  const shouldReduce = useReducedMotion();
  const fallingCount = intensity === "full" ? 16 : 6;
  const staticCount = 4;

  const fallSeeds = useMemo<StarSeed[]>(
    () =>
      Array.from({ length: fallingCount }, (_, i) => ({
        left: Math.random() * 95,
        top: -28,
        delay: Math.random() * 8,
        dur: 1.2 + Math.random() * 0.8,
        fallDur: 6 + Math.random() * 5,
        size: 6 + Math.random() * 10,
        color: STAR_COLORS[i % STAR_COLORS.length],
        isFalling: true,
      })),
    [fallingCount]
  );

  const staticSeeds = useMemo<StarSeed[]>(
    () =>
      Array.from({ length: staticCount }, (_, i) => ({
        left: 10 + i * 22,
        top: 8 + (i % 2) * 12,
        delay: i * 0.8,
        dur: 1.8 + i * 0.4,
        fallDur: 0,
        size: 10 + i * 3,
        color: STAR_COLORS[i % STAR_COLORS.length],
        isFalling: false,
      })),
    []
  );

  const FourPointStar = ({ size, color }: { size: number; color: string }) => (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path
        d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill={color}
      />
    </svg>
  );

  if (shouldReduce) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {staticSeeds.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: `${s.left}%`, top: `${s.top}%`, opacity: 0.4 }}>
            <FourPointStar size={s.size} color={s.color} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Falling stars */}
      {fallSeeds.map((s, i) => (
        <motion.div
          key={`fall-${i}`}
          style={{ position: "absolute", left: `${s.left}%`, top: s.top }}
          initial={{ y: -30, opacity: 0, scale: 0.5 }}
          animate={{ y: "120%", opacity: [0, 1, 1, 0], scale: [0.5, 1, 0.8, 0.3] }}
          transition={{
            duration: s.fallDur,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: s.dur, repeat: Infinity, ease: "linear" }}
          >
            <FourPointStar size={s.size} color={s.color} />
          </motion.div>
        </motion.div>
      ))}
      {/* Static twinkling hero stars */}
      {staticSeeds.map((s, i) => (
        <motion.div
          key={`static-${i}`}
          style={{ position: "absolute", left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <FourPointStar size={s.size} color={s.color} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── MotionFlourishOverlay ────────────────────────────────────────────────────

export function MotionFlourishOverlay({ intensity = "full" }: { intensity?: OverlayIntensity }) {
  const shouldReduce = useReducedMotion();

  const leaves = useMemo(
    () => [
      { top: "-4%", left: "-5%",  rotate: -15, dur: 14, delay: 0,   color: "#6A8C5E", opacity: 0.55, size: 80 },
      { top: "-3%", right: "-5%", rotate: 20,  dur: 16, delay: 2,   color: "#D4B870", opacity: 0.45, size: 70 },
      { bottom: "-4%", left: "-4%",  rotate: 10,  dur: 18, delay: 1,   color: "#6A8C5E", opacity: 0.5,  size: 90 },
      { bottom: "-3%", right: "-4%", rotate: -20, dur: 13, delay: 3,   color: "#D4B870", opacity: 0.4,  size: 75 },
      { top: "38%",  left: "-6%",  rotate: 5,   dur: 15, delay: 0.5, color: "#A8C888", opacity: 0.38, size: 55 },
    ],
    []
  );

  if (shouldReduce) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {leaves.map((l, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: l.top,
              left: "left" in l ? l.left : undefined,
              right: "right" in l ? l.right : undefined,
              bottom: "bottom" in l ? l.bottom : undefined,
              opacity: l.opacity * 0.6,
              transform: `rotate(${l.rotate}deg)`,
            }}
          >
            <LeafSvg size={l.size} color={l.color} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: l.top,
            left: "left" in l ? l.left : undefined,
            right: "right" in l ? l.right : undefined,
            bottom: "bottom" in l ? l.bottom : undefined,
            opacity: intensity === "preview" ? l.opacity * 0.7 : l.opacity,
          }}
          animate={{
            y: [0, -12, 0],
            rotate: [l.rotate - 3, l.rotate + 3, l.rotate - 3],
          }}
          transition={{
            duration: l.dur,
            delay: l.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <LeafSvg size={l.size} color={l.color} />
        </motion.div>
      ))}
    </div>
  );
}

function LeafSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 100 160" width={size} height={size * 1.6} fill="none">
      <path
        d="M50 8 C20 20 8 55 15 95 C22 130 40 150 50 155 C60 150 78 130 85 95 C92 55 80 20 50 8 Z"
        fill={color}
        opacity="0.82"
      />
      <path
        d="M50 20 C35 35 28 65 32 95 C36 118 44 138 50 148"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

// ─── AvatarRevealOverlay ──────────────────────────────────────────────────────

export function AvatarRevealOverlay({ intensity = "full" }: { intensity?: OverlayIntensity }) {
  const shouldReduce = useReducedMotion();

  if (intensity === "preview" && !shouldReduce) {
    // In gallery cards show avatars statically (no entrance animation) to save resources
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{ position: "absolute", bottom: "8%", left: "-2%" }}>
          <BrideAvatar size={68} />
        </div>
        <div style={{ position: "absolute", bottom: "8%", right: "-2%" }}>
          <GroomAvatar size={68} />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Bride — left side */}
      <motion.div
        style={{ position: "absolute", bottom: "6%", left: "-2%" }}
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      >
        <BrideAvatar size={80} />
      </motion.div>

      {/* Groom — right side with wave */}
      <motion.div
        style={{ position: "absolute", bottom: "6%", right: "-2%" }}
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
      >
        <GroomAvatar size={80} />
      </motion.div>
    </div>
  );
}

function BrideAvatar({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 120" width={size} height={size * 1.5} fill="none">
      {/* Head */}
      <circle cx="40" cy="22" r="14" fill="#FDDBB8" />
      {/* Hair */}
      <path d="M26 18 C26 8 54 8 54 18 C54 10 50 4 40 4 C30 4 26 10 26 18Z" fill="#4A3020" />
      {/* Veil */}
      <path d="M26 16 C20 20 18 35 22 50 L26 50" stroke="white" strokeWidth="1.5" fill="none" opacity="0.9" />
      <path d="M54 16 C60 20 62 35 58 50 L54 50" stroke="white" strokeWidth="1.5" fill="none" opacity="0.9" />
      {/* Dress */}
      <path d="M28 36 C20 50 18 80 20 110 L60 110 C62 80 60 50 52 36 Z" fill="#F9EEF5" />
      <path d="M30 36 C28 50 26 80 28 110" stroke="#E8C0D8" strokeWidth="1" fill="none" opacity="0.5" />
      {/* Bouquet */}
      <circle cx="52" cy="70" r="8" fill="#E78AA0" opacity="0.85" />
      <circle cx="56" cy="66" r="5" fill="#F2B8C8" opacity="0.75" />
      <circle cx="48" cy="66" r="5" fill="#C76A82" opacity="0.75" />
      {/* Face */}
      <circle cx="36" cy="22" r="2" fill="#4A3020" />
      <circle cx="44" cy="22" r="2" fill="#4A3020" />
      <path d="M37 27 Q40 30 43 27" stroke="#C76A82" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function GroomAvatar({ size }: { size: number }) {
  const shouldReduce = useReducedMotion();

  return (
    <svg viewBox="0 0 80 120" width={size} height={size * 1.5} fill="none">
      {/* Head */}
      <circle cx="40" cy="22" r="14" fill="#FDDBB8" />
      {/* Hair */}
      <path d="M27 16 C27 8 53 8 53 16 C53 12 50 6 40 6 C30 6 27 12 27 16Z" fill="#2A1A0A" />
      {/* Suit jacket */}
      <path d="M26 36 C20 48 18 80 20 110 L60 110 C62 80 60 48 54 36 Z" fill="#1A2040" />
      {/* Shirt & tie */}
      <path d="M36 36 L40 50 L44 36" fill="white" />
      <path d="M40 38 L39 56 L40 62 L41 56 Z" fill="#C76A82" />
      {/* Lapels */}
      <path d="M36 36 L26 48" stroke="#2A3060" strokeWidth="2" fill="none" />
      <path d="M44 36 L54 48" stroke="#2A3060" strokeWidth="2" fill="none" />
      {/* Wave arm */}
      <motion.g
        style={{ transformOrigin: "54px 48px" }}
        animate={shouldReduce ? {} : { rotate: [-8, 10, -8] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
      >
        <path d="M54 48 L68 36 L70 32" stroke="#FDDBB8" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Hand */}
        <circle cx="70" cy="30" r="5" fill="#FDDBB8" />
      </motion.g>
      {/* Face */}
      <circle cx="36" cy="22" r="2" fill="#2A1A0A" />
      <circle cx="44" cy="22" r="2" fill="#2A1A0A" />
      <path d="M37 27 Q40 30 43 27" stroke="#C76A82" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
