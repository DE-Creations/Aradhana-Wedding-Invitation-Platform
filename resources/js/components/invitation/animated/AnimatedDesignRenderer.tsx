import { lazy, Suspense } from "react";
import type { AnimatedDesignProps } from "./types";
import { motion } from "framer-motion";

const InkAndGoldDesign = lazy(() =>
  import("./InkAndGoldDesign").then((m) => ({ default: m.InkAndGoldDesign }))
);
const CelestialNocturneDesign = lazy(() =>
  import("./CelestialNocturneDesign").then((m) => ({ default: m.CelestialNocturneDesign }))
);
const PetalWaltzDesign = lazy(() =>
  import("./PetalWaltzDesign").then((m) => ({ default: m.PetalWaltzDesign }))
);
const LiquidBloomDesign = lazy(() =>
  import("./LiquidBloomDesign").then((m) => ({ default: m.LiquidBloomDesign }))
);
const GoldenFiligreeDesign = lazy(() =>
  import("./GoldenFiligreeDesign").then((m) => ({ default: m.GoldenFiligreeDesign }))
);

interface AnimatedDesignRendererProps extends AnimatedDesignProps {
  templateKey: string;
}

const ANIMATED_DESIGN_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<AnimatedDesignProps>>> = {
  "ink-and-gold": InkAndGoldDesign,
  "celestial-nocturne": CelestialNocturneDesign,
  "petal-waltz": PetalWaltzDesign,
  "liquid-bloom": LiquidBloomDesign,
  "golden-filigree": GoldenFiligreeDesign,
};

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A14]">
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-center"
      >
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent border-[#C8A2E0] animate-spin mx-auto mb-4" />
        <p className="text-[#C8A2E0]/60 text-xs uppercase tracking-widest">Loading</p>
      </motion.div>
    </div>
  );
}

export function AnimatedDesignRenderer({ templateKey, ...props }: AnimatedDesignRendererProps) {
  const DesignComponent = ANIMATED_DESIGN_MAP[templateKey];
  if (!DesignComponent) return null;
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DesignComponent {...props} />
    </Suspense>
  );
}

export const ANIMATED_DESIGN_KEYS = new Set(Object.keys(ANIMATED_DESIGN_MAP));
