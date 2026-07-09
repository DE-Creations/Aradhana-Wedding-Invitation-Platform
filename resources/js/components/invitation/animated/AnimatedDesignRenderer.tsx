import { lazy, Suspense } from "react";
import type { AnimatedDesignProps } from "./types";
import { motion } from "framer-motion";

const CelestialCosmosDesign = lazy(() =>
  import("./CelestialCosmosDesign").then((m) => ({ default: m.CelestialCosmosDesign }))
);
const CherryBlossomFallDesign = lazy(() =>
  import("./CherryBlossomFallDesign").then((m) => ({ default: m.CherryBlossomFallDesign }))
);
const GoldenDustDesign = lazy(() =>
  import("./GoldenDustDesign").then((m) => ({ default: m.GoldenDustDesign }))
);
const EmeraldVineDesign = lazy(() =>
  import("./EmeraldVineDesign").then((m) => ({ default: m.EmeraldVineDesign }))
);
const MoonlitRomanceDesign = lazy(() =>
  import("./MoonlitRomanceDesign").then((m) => ({ default: m.MoonlitRomanceDesign }))
);

interface AnimatedDesignRendererProps extends AnimatedDesignProps {
  templateKey: string;
}

const ANIMATED_DESIGN_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<AnimatedDesignProps>>> = {
  "celestial-cosmos": CelestialCosmosDesign,
  "cherry-blossom-fall": CherryBlossomFallDesign,
  "golden-dust": GoldenDustDesign,
  "emerald-vine": EmeraldVineDesign,
  "moonlit-romance": MoonlitRomanceDesign,
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
