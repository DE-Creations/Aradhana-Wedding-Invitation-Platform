import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { AnimatedDesignProps } from "./types";
import { formatTime12 } from "./types";
import { MapPin, Clock, Calendar, Heart } from "lucide-react";

// Generate deterministic petal data to avoid hydration issues
const PETALS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: ((i * 37) % 100),
  delay: (i * 0.35) % 5,
  duration: 4 + ((i * 17) % 4),
  size: 6 + ((i * 7) % 8),
  drift: ((i % 3) - 1) * 30,
  color: ["#E8A0B4", "#F5C0D0", "#FFB3CC", "#FFCCE0"][i % 4],
}));

function PetalField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {PETALS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: -16, backgroundColor: p.color, opacity: 0.7 }}
          animate={{ y: ["0vh", "105vh"], x: [0, p.drift, 0, -p.drift, 0], rotate: [0, 180, 360], opacity: [0.7, 0.5, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

const SlideSection = ({ children, fromRight = false, delay = 0 }: { children: React.ReactNode; fromRight?: boolean; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromRight ? 70 : -70 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const ZoomIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export function CherryBlossomFallDesign({
  wedding: w,
  guest,
  coupleMainImage,
  ceremonyEvents = [],
}: AnimatedDesignProps) {
  const firstEvent = ceremonyEvents[0];

  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,#FFF0F5,#FFD6E8)] overflow-x-hidden">
      <PetalField />

      {/* Soft overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,240,245,0.35) 0%, rgba(255,214,232,0.5) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 px-4 py-16 max-w-2xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16 min-h-[55vh] flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 text-[#8B2252] text-xs uppercase tracking-[0.35em] mb-6 border border-[#E8A0B4]/50 rounded-full px-4 py-1.5 bg-white/40 backdrop-blur"
          >
            <Heart className="h-3 w-3 fill-[#E8A0B4]" /> Wedding Invitation
          </motion.div>

          {coupleMainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-44 h-44 rounded-full overflow-hidden border-4 border-white/70 shadow-[0_20px_60px_rgba(139,34,82,0.2)] mx-auto mb-8"
            >
              <img src={coupleMainImage} alt="Couple" className="w-full h-full object-cover" />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-6xl text-[#8B2252] font-light leading-tight mb-4"
          >
            {w.bride_name}
            <span className="block text-[#E8A0B4] text-3xl my-2">&</span>
            {w.groom_name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-[#8B2252]/60 text-sm uppercase tracking-[0.4em]"
          >
            {firstEvent ? new Date(firstEvent.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Save the Date"}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="w-28 h-0.5 bg-gradient-to-r from-transparent via-[#E8A0B4] to-transparent mx-auto mt-6"
          />
        </div>

        {/* Parents */}
        {(w.bride_parents_names || w.groom_parents_names) && (
          <SlideSection>
            <div className="mb-10 text-center bg-white/55 backdrop-blur border border-[#E8A0B4]/30 rounded-2xl p-6 shadow-sm">
              <p className="text-[#8B2252]/60 text-xs uppercase tracking-[0.3em] mb-4">With the Blessings of</p>
              <div className="grid grid-cols-2 gap-4">
                {w.bride_parents_names && (
                  <div>
                    <p className="text-[#4A1030] text-sm leading-relaxed">{w.bride_parents_names}</p>
                    <p className="text-[#E8A0B4] text-[10px] uppercase tracking-widest mt-1">Bride's Parents</p>
                  </div>
                )}
                {w.groom_parents_names && (
                  <div>
                    <p className="text-[#4A1030] text-sm leading-relaxed">{w.groom_parents_names}</p>
                    <p className="text-[#E8A0B4] text-[10px] uppercase tracking-widest mt-1">Groom's Parents</p>
                  </div>
                )}
              </div>
            </div>
          </SlideSection>
        )}

        {/* Guest greeting */}
        {guest && (
          <ZoomIn>
            <div className="mb-10 text-center bg-white/55 backdrop-blur border border-[#E8A0B4]/30 rounded-2xl p-6 shadow-sm">
              <p className="text-[#8B2252]/60 text-xs uppercase tracking-[0.3em] mb-2">Dear</p>
              <p className="text-[#4A1030] text-2xl font-light font-serif">{guest.guest_name}</p>
              <p className="text-[#8B2252]/60 text-sm mt-2">We joyfully invite you to share in our day of love and celebration.</p>
            </div>
          </ZoomIn>
        )}

        {/* Events */}
        {ceremonyEvents.length > 0 && (
          <div className="space-y-4 mb-10">
            <SlideSection fromRight>
              <p className="text-[#8B2252]/70 text-xs uppercase tracking-[0.3em] text-center mb-6">Ceremony Details</p>
            </SlideSection>
            {ceremonyEvents.map((ev, i) => (
              <SlideSection key={i} fromRight={i % 2 === 0} delay={i * 0.1}>
                <div className="bg-white/55 backdrop-blur border border-[#E8A0B4]/30 rounded-2xl p-5 shadow-sm">
                  <p className="text-[#8B2252] text-xs uppercase tracking-[0.28em] mb-3 font-semibold">{ev.label}</p>
                  <div className="space-y-2 text-sm text-[#4A1030]/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#E8A0B4] shrink-0" />
                      <span>{new Date(ev.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#E8A0B4] shrink-0" />
                      <span>{formatTime12(ev.start_time)} – {formatTime12(ev.end_time)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#E8A0B4] shrink-0 mt-0.5" />
                      <span>{ev.venue}</span>
                    </div>
                    {ev.google_maps_link && (
                      <a href={ev.google_maps_link} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-1 text-[#8B2252] text-xs underline underline-offset-2">
                        View on Maps →
                      </a>
                    )}
                  </div>
                </div>
              </SlideSection>
            ))}
          </div>
        )}

        <ZoomIn delay={0.2}>
          <div className="text-center mt-12 pb-10">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#E8A0B4] to-transparent mx-auto mb-4" />
            <p className="text-[#8B2252]/40 text-xs tracking-widest">
              {w.bride_name} &amp; {w.groom_name}
            </p>
          </div>
        </ZoomIn>
      </div>
    </div>
  );
}
