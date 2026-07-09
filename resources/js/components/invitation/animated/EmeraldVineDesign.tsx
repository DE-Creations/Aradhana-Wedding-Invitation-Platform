import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnimatedDesignProps } from "./types";
import { formatTime12 } from "./types";
import { MapPin, Clock, Calendar, Heart, Leaf } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Vine SVG with Framer Motion path draw animation
function VineSVG({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 120 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          d="M60 10 C80 40 30 70 60 100 C90 130 20 160 60 190 C100 220 30 250 60 290"
          stroke="#4CAF78"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
        />
        <circle cx="60" cy="55" r="12" fill="#4CAF78" opacity="0.15" />
        <circle cx="60" cy="145" r="14" fill="#4CAF78" opacity="0.12" />
        <circle cx="60" cy="240" r="10" fill="#4CAF78" opacity="0.1" />
      </svg>
    </div>
  );
}

const SlideFromLeft = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const SlideFromRight = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const ZoomReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export function EmeraldVineDesign({
  wedding: w,
  guest,
  coupleMainImage,
  ceremonyEvents = [],
}: AnimatedDesignProps) {
  const firstEvent = ceremonyEvents[0];

  return (
    <div className="relative min-h-screen bg-[linear-gradient(160deg,#0D2B1E,#1A4030)] overflow-x-hidden">
      {/* Decorative vine on side — desktop only */}
      <div className="fixed left-4 top-0 h-full w-12 z-[1] pointer-events-none hidden md:block opacity-30">
        <VineSVG className="h-full w-full" />
      </div>
      <div className="fixed right-4 top-0 h-full w-12 z-[1] pointer-events-none hidden md:block opacity-20 scale-x-[-1]">
        <VineSVG className="h-full w-full" />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Content */}
      <div className="relative z-10 px-4 py-16 max-w-2xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16 min-h-[58vh] flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 text-[#8DBF9C] text-xs uppercase tracking-[0.35em] mb-6 border border-[#4CAF78]/25 rounded-full px-4 py-1.5"
          >
            <Leaf className="h-3 w-3 text-[#4CAF78]" /> Wedding Invitation
          </motion.div>

          {coupleMainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.65, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-44 h-44 rounded-full overflow-hidden border-2 border-[#4CAF78]/40 shadow-[0_0_60px_rgba(76,175,120,0.25)] mx-auto mb-8"
            >
              <img src={coupleMainImage} alt="Couple" className="w-full h-full object-cover" />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-6xl text-[#E8F5EC] font-light leading-tight mb-4"
          >
            {w.bride_name}
            <span className="block text-[#4CAF78] text-3xl my-2">&</span>
            {w.groom_name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-[#8DBF9C]/70 text-sm uppercase tracking-[0.4em]"
          >
            {firstEvent ? new Date(firstEvent.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Save the Date"}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-[#4CAF78] to-transparent mx-auto mt-6"
          />
        </div>

        {/* Parents */}
        {(w.bride_parents_names || w.groom_parents_names) && (
          <SlideFromLeft>
            <div className="mb-10 bg-[#1A4030]/60 backdrop-blur border border-[#4CAF78]/20 rounded-2xl p-6">
              <p className="text-[#4CAF78]/70 text-xs uppercase tracking-[0.3em] text-center mb-4">With the Blessings of</p>
              <div className="grid grid-cols-2 gap-4">
                {w.bride_parents_names && (
                  <div className="text-center">
                    <p className="text-[#E8F5EC] text-sm leading-relaxed">{w.bride_parents_names}</p>
                    <p className="text-[#4CAF78]/60 text-[10px] uppercase tracking-widest mt-1">Bride's Parents</p>
                  </div>
                )}
                {w.groom_parents_names && (
                  <div className="text-center">
                    <p className="text-[#E8F5EC] text-sm leading-relaxed">{w.groom_parents_names}</p>
                    <p className="text-[#4CAF78]/60 text-[10px] uppercase tracking-widest mt-1">Groom's Parents</p>
                  </div>
                )}
              </div>
            </div>
          </SlideFromLeft>
        )}

        {/* Guest */}
        {guest && (
          <SlideFromRight>
            <div className="mb-10 text-center bg-[#4CAF78]/8 border border-[#4CAF78]/20 rounded-2xl p-6">
              <Heart className="h-5 w-5 text-[#4CAF78] mx-auto mb-2" />
              <p className="text-[#8DBF9C]/70 text-xs uppercase tracking-[0.3em] mb-1">Dear</p>
              <p className="text-[#E8F5EC] text-2xl font-light font-serif">{guest.guest_name}</p>
              <p className="text-[#8DBF9C]/60 text-sm mt-2">We joyfully invite you to share in our day of love and celebration.</p>
            </div>
          </SlideFromRight>
        )}

        {/* Events — alternating left/right */}
        {ceremonyEvents.length > 0 && (
          <div className="space-y-4 mb-10">
            <ZoomReveal>
              <p className="text-[#4CAF78]/70 text-xs uppercase tracking-[0.3em] text-center mb-6">Ceremony Details</p>
            </ZoomReveal>
            {ceremonyEvents.map((ev, i) => {
              const SlideComp = i % 2 === 0 ? SlideFromLeft : SlideFromRight;
              return (
                <SlideComp key={i} delay={i * 0.08}>
                  <div className="bg-[#1A4030]/60 backdrop-blur border border-[#4CAF78]/20 rounded-2xl p-5">
                    <p className="text-[#4CAF78] text-xs uppercase tracking-[0.28em] mb-3 font-semibold">{ev.label}</p>
                    <div className="space-y-2 text-sm text-[#E8F5EC]/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#4CAF78]/60 shrink-0" />
                        <span>{new Date(ev.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#4CAF78]/60 shrink-0" />
                        <span>{formatTime12(ev.start_time)} – {formatTime12(ev.end_time)}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#4CAF78]/60 shrink-0 mt-0.5" />
                        <span>{ev.venue}</span>
                      </div>
                      {ev.google_maps_link && (
                        <a href={ev.google_maps_link} target="_blank" rel="noopener noreferrer"
                          className="inline-block mt-1 text-[#4CAF78] text-xs underline underline-offset-2">
                          View on Maps →
                        </a>
                      )}
                    </div>
                  </div>
                </SlideComp>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <ZoomReveal delay={0.2}>
          <div className="text-center mt-12 pb-10">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#4CAF78] to-transparent mx-auto mb-4" />
            <p className="text-[#8DBF9C]/40 text-xs tracking-widest">
              {w.bride_name} &amp; {w.groom_name}
            </p>
          </div>
        </ZoomReveal>
      </div>
    </div>
  );
}
