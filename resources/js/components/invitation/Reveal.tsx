import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export type RevealAnimation =
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "blurIn";

interface RevealProps {
  children: ReactNode;
  animation?: RevealAnimation;
  delay?: number;
  /** Fraction of the element visible before triggering. */
  amount?: number;
  className?: string;
  as?: "div" | "section" | "li";
}

const PRESETS: Record<RevealAnimation, { hidden: Record<string, number | string>; show: Record<string, number | string> }> = {
  fadeUp: { hidden: { opacity: 0, y: 42 }, show: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  slideLeft: { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } },
  scaleIn: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
  blurIn: { hidden: { opacity: 0, filter: "blur(10px)" }, show: { opacity: 1, filter: "blur(0px)" } },
};

/**
 * Scroll-reveal (AOS-style) wrapper built on framer-motion `whileInView`.
 * Honours reduced-motion by rendering children immediately.
 */
export function Reveal({
  children,
  animation = "fadeUp",
  delay = 0,
  amount = 0.25,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const preset = PRESETS[animation];

  const variants: Variants = {
    hidden: reduce ? { opacity: 1 } : preset.hidden,
    show: {
      ...preset.show,
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
