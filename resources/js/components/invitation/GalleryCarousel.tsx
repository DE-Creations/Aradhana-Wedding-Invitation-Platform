import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryCarouselProps {
  images: string[];
  /** Wrapper class. */
  className?: string;
  /** Radius/aspect wrapper class for the main stage. */
  stageClassName?: string;
  /** Class for the circular arrow buttons. */
  arrowClassName?: string;
  /** Class for the active dot. */
  dotActiveClassName?: string;
  /** Class for inactive dots. */
  dotClassName?: string;
  /** Auto-advance interval in ms (0 disables). */
  autoMs?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Self-built image carousel (no external carousel lib):
 * - drag / swipe navigation (framer-motion)
 * - slow Ken Burns zoom on the active image
 * - prev/next arrows, dot indicators
 * - auto-advance with pause on hover / touch
 */
export function GalleryCarousel({
  images,
  className = "",
  stageClassName = "rounded-[1.2rem]",
  arrowClassName = "bg-black/40 text-white border border-white/10",
  dotActiveClassName = "w-5 bg-white",
  dotClassName = "w-2 bg-white/50",
  autoMs = 4000,
}: GalleryCarouselProps) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = images.length;

  const paginate = useCallback(
    (dir: number) => {
      setState(([prev]) => [(prev + dir + count) % count, dir]);
    },
    [count],
  );

  const goTo = (i: number) => setState(([prev]) => [i, i > prev ? 1 : -1]);

  useEffect(() => {
    if (count <= 1 || paused || autoMs <= 0) return;
    timer.current = setInterval(() => paginate(1), autoMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [count, paused, autoMs, paginate]);

  if (count === 0) return null;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 90 : -90, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -90 : 90, opacity: 0, scale: 0.96 }),
  };

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className={`relative aspect-[16/10] overflow-hidden ${stageClassName}`}>
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) paginate(1);
              else if (info.offset.x > 70) paginate(-1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {/* Ken Burns slow zoom on the active image */}
            <motion.img
              src={images[index]}
              alt=""
              draggable={false}
              loading="lazy"
              initial={{ scale: 1 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 10, ease: "easeOut" }}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous photo"
              className={`absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${arrowClassName}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next photo"
              className={`absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-colors ${arrowClassName}`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${i === index ? dotActiveClassName : dotClassName}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GalleryCarousel;
