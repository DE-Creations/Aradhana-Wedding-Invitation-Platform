import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PearlDecor } from "./PearlDecor";
import "../invitation-v4.css";

interface PearlCoverProps {
  brideName?: string;
  groomName?: string;
  onReveal: () => void;
}

/** Frosted-glass cover card with an "Open Invitation" button; replaces the envelope for Silver Pearl. */
export function PearlCover({ brideName, groomName, onReveal }: PearlCoverProps) {
  const [leaving, setLeaving] = useState(false);

  const open = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onReveal, 650);
  };

  return (
    <motion.div className="inv4-cover inv4-root" initial={{ opacity: 1 }} animate={{ opacity: leaving ? 0 : 1, y: leaving ? -24 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
      <PearlDecor />
      <div className="inv4-cover__card inv4-glass">
        <span className="inv4-eyebrow font-t-body inline-flex items-center gap-2 rounded-full border border-[var(--inv4-silver)] bg-white/70 px-3 py-1 text-[0.62rem]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--inv4-primary)]" /> Wedding Invitation
        </span>
        <p className="inv4-eyebrow font-t-body mt-5 text-[0.62rem]">You are invited</p>
        <h1 className="font-t-heading mt-2 break-words text-[clamp(2.4rem,12vw,3.4rem)] leading-[1.1] text-[var(--inv4-primary)]">
          {brideName}
          <span className="inv4-accent block text-[0.5em]">&amp;</span>
          {groomName}
        </h1>
        <div className="inv4-divider" aria-hidden="true">
          <span className="text-[0.6rem]">&#9670;</span>
        </div>
        <p className="inv4-text-soft font-t-body mx-auto max-w-[17rem] text-sm leading-relaxed">
          Join us as we celebrate love, joy and unforgettable moments together
        </p>
        <button type="button" onClick={open} className="inv4-btn font-t-body mt-6 w-full max-w-[16rem]">
          Open Invitation <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

export default PearlCover;
