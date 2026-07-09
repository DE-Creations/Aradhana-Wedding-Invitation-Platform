import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { AnimatedDesignProps } from "./types";
import { formatTime12 } from "./types";
import { MapPin, Clock, Calendar, Heart, Sparkles } from "lucide-react";

// Deterministic dust particles
const DUST = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: ((i * 43) % 100),
  top: ((i * 61) % 100),
  size: 2 + ((i * 3) % 5),
  delay: (i * 0.22) % 4,
  duration: 2.5 + ((i * 11) % 3),
  color: ["#C9943C", "#E8C060", "#F0D878", "#B07820"][i % 4],
}));

function DustField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {DUST.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{ width: d.size, height: d.size, left: `${d.left}%`, top: `${d.top}%`, backgroundColor: d.color }}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.4, 0.8], y: [0, -8, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const ZoomReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.82, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const StaggerFade = ({ children, index = 0 }: { children: React.ReactNode; index?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export function GoldenDustDesign({
  wedding: w,
  guest,
  coupleMainImage,
  ceremonyEvents = [],
}: AnimatedDesignProps) {
  const firstEvent = ceremonyEvents[0];

  return (
    <div className="relative min-h-screen bg-[linear-gradient(160deg,#FEFAEF,#FFF0C8)] overflow-x-hidden">
      <DustField />

      {/* Content */}
      <div className="relative z-10 px-4 py-16 max-w-2xl mx-auto">

        {/* Hero — dramatic zoom */}
        <div className="text-center mb-16 min-h-[58vh] flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-[#7D5A28] text-xs uppercase tracking-[0.35em] mb-6 border border-[#C9943C]/40 rounded-full px-4 py-1.5 bg-white/40 backdrop-blur"
          >
            <Sparkles className="h-3 w-3 text-[#C9943C]" /> You Are Invited
          </motion.div>

          {coupleMainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="w-44 h-44 rounded-full overflow-hidden border-4 border-[#C9943C]/40 shadow-[0_0_50px_rgba(201,148,60,0.35)] mx-auto mb-8"
            >
              <img src={coupleMainImage} alt="Couple" className="w-full h-full object-cover" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-serif text-5xl md:text-6xl text-[#7D5A28] font-light leading-tight mb-4">
              {w.bride_name}
              <span className="block text-[#C9943C] text-3xl my-2">&</span>
              {w.groom_name}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="text-[#7D5A28]/60 text-sm uppercase tracking-[0.4em]"
          >
            {firstEvent ? new Date(firstEvent.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Wedding Celebration"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#C9943C] to-transparent mx-auto mt-6"
          />
        </div>

        {/* Parents */}
        {(w.bride_parents_names || w.groom_parents_names) && (
          <ZoomReveal>
            <div className="mb-10 text-center bg-white/60 backdrop-blur border border-[#C9943C]/25 rounded-2xl p-6 shadow-sm">
              <p className="text-[#7D5A28]/60 text-xs uppercase tracking-[0.3em] mb-4">With the Blessings of</p>
              <div className="grid grid-cols-2 gap-4">
                {w.bride_parents_names && (
                  <div>
                    <p className="text-[#4A3010] text-sm leading-relaxed">{w.bride_parents_names}</p>
                    <p className="text-[#C9943C]/70 text-[10px] uppercase tracking-widest mt-1">Bride's Parents</p>
                  </div>
                )}
                {w.groom_parents_names && (
                  <div>
                    <p className="text-[#4A3010] text-sm leading-relaxed">{w.groom_parents_names}</p>
                    <p className="text-[#C9943C]/70 text-[10px] uppercase tracking-widest mt-1">Groom's Parents</p>
                  </div>
                )}
              </div>
            </div>
          </ZoomReveal>
        )}

        {/* Guest */}
        {guest && (
          <ZoomReveal delay={0.1}>
            <div className="mb-10 text-center bg-[#C9943C]/8 border border-[#C9943C]/30 rounded-2xl p-6">
              <Heart className="h-5 w-5 text-[#C9943C] mx-auto mb-2" />
              <p className="text-[#7D5A28]/70 text-xs uppercase tracking-[0.3em] mb-1">Dear</p>
              <p className="text-[#4A3010] text-2xl font-light font-serif">{guest.guest_name}</p>
              <p className="text-[#7D5A28]/60 text-sm mt-2">We joyfully invite you to share in our day of love and celebration.</p>
            </div>
          </ZoomReveal>
        )}

        {/* Events */}
        {ceremonyEvents.length > 0 && (
          <div className="space-y-4 mb-10">
            <StaggerFade>
              <p className="text-[#7D5A28]/70 text-xs uppercase tracking-[0.3em] text-center mb-6">Ceremony Details</p>
            </StaggerFade>
            {ceremonyEvents.map((ev, i) => (
              <StaggerFade key={i} index={i + 1}>
                <div className="bg-white/60 backdrop-blur border border-[#C9943C]/25 rounded-2xl p-5 shadow-sm">
                  <p className="text-[#C9943C] text-xs uppercase tracking-[0.28em] mb-3 font-semibold">{ev.label}</p>
                  <div className="space-y-2 text-sm text-[#4A3010]/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#C9943C]/60 shrink-0" />
                      <span>{new Date(ev.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#C9943C]/60 shrink-0" />
                      <span>{formatTime12(ev.start_time)} – {formatTime12(ev.end_time)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#C9943C]/60 shrink-0 mt-0.5" />
                      <span>{ev.venue}</span>
                    </div>
                    {ev.google_maps_link && (
                      <a href={ev.google_maps_link} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-1 text-[#C9943C] text-xs underline underline-offset-2">
                        View on Maps →
                      </a>
                    )}
                  </div>
                </div>
              </StaggerFade>
            ))}
          </div>
        )}

        <ZoomReveal delay={0.2}>
          <div className="text-center mt-12 pb-10">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9943C] to-transparent mx-auto mb-4" />
            <p className="text-[#7D5A28]/40 text-xs tracking-widest">
              {w.bride_name} &amp; {w.groom_name}
            </p>
          </div>
        </ZoomReveal>
      </div>
    </div>
  );
}
