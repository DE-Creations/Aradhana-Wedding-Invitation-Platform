import { useState } from "react";
import { motion } from "framer-motion";

interface EnvelopeRevealProps {
  brideName?: string;
  groomName?: string;
  onReveal?: () => void;
  /** Accent (gold) colour for lines & seal ring. */
  accent?: string;
  /** Wax seal fill colour. */
  sealColor?: string;
  /** Background gradient (CSS) for the overlay. */
  background?: string;
  /** Colour of the envelope body. */
  envelopeColor?: string;
}

/**
 * Full-screen opening animation shown once before the invitation is revealed.
 * On tap: the seal cracks & fades, the flap opens (3D), a card rises, then the
 * overlay fades away and `onReveal()` fires.
 */
export function EnvelopeReveal({
  brideName = "A",
  groomName = "B",
  onReveal,
  accent = "#C9A96E",
  sealColor = "#8B3A4A",
  background = "radial-gradient(circle at center, #2a1016 0%, #0d0d0d 75%)",
  envelopeColor = "#1a0a0f",
}: EnvelopeRevealProps) {
  const [opening, setOpening] = useState(false);

  const brideInitial = (brideName || "A").trim().charAt(0).toUpperCase();
  const groomInitial = (groomName || "B").trim().charAt(0).toUpperCase();

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => onReveal?.(), 1500);
  };

  return (
    <motion.div
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label="Open your invitation"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
      initial={{ opacity: 1 }}
      animate={opening ? { opacity: 0, scale: 1.08 } : { opacity: 1 }}
      transition={{ duration: 0.5, delay: opening ? 1.1 : 0 }}
      className="fixed inset-0 z-[120] flex cursor-pointer flex-col items-center justify-center gap-6 p-6"
      style={{ background }}
    >
      <motion.p
        className="text-xs uppercase tracking-[0.35em]"
        style={{ color: accent }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        You are cordially invited
      </motion.p>

      <motion.div
        className="relative"
        style={{ width: 260, height: 180 }}
        animate={opening ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: opening ? 1.0 : 0 }}
      >
        {/* Rising card */}
        <motion.div
          initial={{ y: 0, scale: 0.6, opacity: 0 }}
          animate={opening ? { y: -120, scale: 1, opacity: 1 } : { y: 0, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.6, delay: opening ? 0.5 : 0, ease: "easeOut" }}
          className="absolute left-[12%] top-[8%] z-[1] h-[84%] w-[76%] rounded-md shadow-2xl"
          style={{ background: "linear-gradient(160deg, #faf7f2, #e8d5a3)" }}
        />

        {/* Envelope body */}
        <svg viewBox="0 0 260 180" width="260" height="180" className="absolute inset-0 z-[2]" aria-hidden="true">
          <rect x="1" y="40" width="258" height="138" rx="6" fill={envelopeColor} stroke={accent} strokeWidth="1.5" />
          <path d="M1 46 L130 130 L259 46" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.6" />
          <path d="M1 178 L110 96" stroke={accent} strokeWidth="1" opacity="0.4" />
          <path d="M259 178 L150 96" stroke={accent} strokeWidth="1" opacity="0.4" />
        </svg>

        {/* Flap */}
        <motion.div
          className="absolute inset-0 z-[4]"
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d", perspective: 800 }}
          animate={opening ? { rotateX: -160 } : { rotateX: 0 }}
          transition={{ duration: 0.6, delay: opening ? 0.3 : 0, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 260 180" width="260" height="180" aria-hidden="true">
            <path d="M1 46 L1 40 L130 4 L259 40 L259 46 L130 130 Z" fill={envelopeColor} stroke={accent} strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* Wax seal + monogram */}
        <motion.div
          className="absolute left-1/2 top-[58%] z-[5] -translate-x-1/2 -translate-y-1/2"
          animate={
            opening
              ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] }
              : { scale: [1, 1.05, 1], opacity: 1 }
          }
          transition={
            opening
              ? { duration: 0.4 }
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <svg width="70" height="70" viewBox="0 0 70 70" aria-hidden="true">
            <circle cx="35" cy="35" r="30" fill={sealColor} stroke={accent} strokeWidth="2" />
            <circle cx="35" cy="35" r="24" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.6" />
            <text x="35" y="42" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="18" fill="#E8D5A3">
              {brideInitial}&amp;{groomInitial}
            </text>
          </svg>
        </motion.div>
      </motion.div>

      <motion.p
        className="text-base tracking-[0.15em]"
        style={{ color: accent }}
        animate={opening ? { opacity: 0 } : { opacity: 1, y: [0, -6, 0] }}
        transition={opening ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        Tap to Open
      </motion.p>
    </motion.div>
  );
}

export default EnvelopeReveal;
