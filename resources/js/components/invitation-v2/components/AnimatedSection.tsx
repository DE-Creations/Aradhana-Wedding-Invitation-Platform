import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1]; // ease-out cubic

const PRESETS = {
  fadeUp: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  slideLeft: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  scaleIn: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
} as const;

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: keyof typeof PRESETS;
  delay?: number;
  duration?: number;
  amount?: number;
  className?: string;
}

/** Reusable scroll-reveal wrapper. */
export default function AnimatedSection({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  amount = 0.3,
  className = '',
}: AnimatedSectionProps) {
  const variants = PRESETS[animation] ?? PRESETS.fadeUp;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
