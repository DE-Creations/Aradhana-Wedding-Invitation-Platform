import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/*
  Ambient "clip art" layer — hearts, sparkles, and tiny flowers drifting
  gently upward across the screen, distinct from FloatingPetals' downward
  fall. Kept strictly within the invitation-v2 palette (gold / gold-light /
  rose / blush) so it reads as part of the design, not a random emoji sprinkle.
*/

const GOLD = '#C9A96E';
const GOLD_LIGHT = '#E8D5A3';
const ROSE = '#8B3A4A';
const BLUSH = '#F5E6E0';

type StickerKind = 'heart' | 'sparkle' | 'flower';

interface Seed {
  kind: StickerKind;
  left: number;
  delay: number;
  dur: number;
  drift: number;
  size: number;
  color: string;
}

const COLORS = [GOLD, GOLD_LIGHT, ROSE, BLUSH];
const KINDS: StickerKind[] = ['heart', 'sparkle', 'flower'];

function HeartSticker({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <path
        d="M16 28 C16 28 3 19.5 3 11.5 C3 6.8 6.7 3.5 11 3.5 C13.3 3.5 15.2 4.7 16 6.5 C16.8 4.7 18.7 3.5 21 3.5 C25.3 3.5 29 6.8 29 11.5 C29 19.5 16 28 16 28 Z"
        fill={color}
        opacity="0.88"
      />
      <path d="M9 10.5 C9.5 8.5 11.2 7 13 7" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" fill="none" />
    </svg>
  );
}

function SparkleSticker({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <path
        d="M16 1 C16.5 9.5 17.5 14.5 22.5 15.5 C17.5 16.5 16.5 21.5 16 30 C15.5 21.5 14.5 16.5 9.5 15.5 C14.5 14.5 15.5 9.5 16 1 Z"
        fill={color}
        opacity="0.9"
      />
      <circle cx="26" cy="7" r="1.6" fill={color} opacity="0.7" />
      <circle cx="6" cy="24" r="1.2" fill={color} opacity="0.6" />
    </svg>
  );
}

function FlowerSticker({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%">
      <g opacity="0.88">
        <ellipse cx="16" cy="9" rx="5" ry="7" fill={color} transform="rotate(0 16 16)" />
        <ellipse cx="16" cy="9" rx="5" ry="7" fill={color} transform="rotate(72 16 16)" />
        <ellipse cx="16" cy="9" rx="5" ry="7" fill={color} transform="rotate(144 16 16)" />
        <ellipse cx="16" cy="9" rx="5" ry="7" fill={color} transform="rotate(216 16 16)" />
        <ellipse cx="16" cy="9" rx="5" ry="7" fill={color} transform="rotate(288 16 16)" />
      </g>
      <circle cx="16" cy="16" r="3.2" fill="#FFFFFF" opacity="0.4" />
    </svg>
  );
}

function Sticker({ kind, color }: { kind: StickerKind; color: string }) {
  if (kind === 'heart') return <HeartSticker color={color} />;
  if (kind === 'sparkle') return <SparkleSticker color={color} />;
  return <FlowerSticker color={color} />;
}

interface FloatingStickersProps {
  zIndex?: number;
}

export function FloatingStickers({ zIndex = 1 }: FloatingStickersProps) {
  const shouldReduce = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const count = shouldReduce ? 0 : isMobile ? 10 : 18;

  const seeds = useMemo<Seed[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        kind: KINDS[i % KINDS.length],
        left: Math.random() * 96,
        delay: Math.random() * 9,
        dur: 10 + Math.random() * 8,
        drift: 16 + Math.random() * 40,
        size: 14 + Math.random() * 16,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  );

  if (count === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex }} aria-hidden="true">
      {seeds.map((s, i) => (
        <motion.div
          key={i}
          style={{ left: `${s.left}%`, width: s.size, height: s.size, position: 'absolute', bottom: -32 }}
          initial={{ y: 0, x: 0, opacity: 0, scale: 0.7 }}
          animate={{
            y: '-115vh',
            x: [0, s.drift, -s.drift * 0.5, s.drift * 0.25, 0],
            opacity: [0, 0.85, 0.85, 0.6, 0],
            scale: [0.7, 1, 0.85, 1, 0.7],
            rotate: [0, 12, -10, 6, 0],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sticker kind={s.kind} color={s.color} />
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingStickers;
