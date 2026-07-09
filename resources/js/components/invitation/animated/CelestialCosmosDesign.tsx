import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnimatedDesignProps } from "./types";
import { formatTime12 } from "./types";
import { MapPin, Clock, Calendar, Heart } from "lucide-react";
import type * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function GoldenOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.08;
    meshRef.current.rotation.y = t * 0.12;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={[2.2, 1.2, -3]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#D4A843" emissive="#7A4C10" roughness={0.3} metalness={0.85} />
      </mesh>
    </Float>
  );
}

function CosmosScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.8} color="#D4A843" />
      <pointLight position={[-4, -2, 2]} intensity={0.5} color="#6060FF" />
      <Stars radius={80} depth={50} count={4000} factor={4} saturation={0} fade speed={0.6} />
      <GoldenOrb />
    </>
  );
}

const FadeSection = ({ children, fromRight = false }: { children: React.ReactNode; fromRight?: boolean }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromRight ? 60 : -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const ZoomSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

export function CelestialCosmosDesign({
  wedding: w,
  guest,
  coupleMainImage,
  ceremonyEvents = [],
}: AnimatedDesignProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(titleRef.current, { opacity: 0, y: 40, letterSpacing: "0.5em" }, { opacity: 1, y: 0, letterSpacing: "0.12em", duration: 1.4, ease: "power3.out" })
      .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");
    return () => { tl.kill(); };
  }, []);

  const firstEvent = ceremonyEvents[0];

  return (
    <div className="relative min-h-screen bg-[#070B1A] text-[#F5ECD5] overflow-x-hidden">
      {/* 3D Canvas background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
            <CosmosScene />
          </Canvas>
        </Suspense>
      </div>

      {/* Radial vignette overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(7,11,26,0.85) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 px-4 py-16 max-w-2xl mx-auto">

        {/* Hero */}
        <div ref={heroRef} className="text-center mb-16 min-h-[60vh] flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 text-[#D4A843] text-xs uppercase tracking-[0.35em] mb-6 border border-[#D4A843]/30 rounded-full px-4 py-1.5">
              <Heart className="h-3 w-3 fill-current" /> Together Forever
            </div>
          </motion.div>

          {coupleMainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-44 h-44 rounded-full overflow-hidden border-2 border-[#D4A843]/50 shadow-[0_0_60px_rgba(212,168,67,0.3)] mx-auto mb-8"
            >
              <img src={coupleMainImage} alt="Couple" className="w-full h-full object-cover" />
            </motion.div>
          )}

          <h1 ref={titleRef} className="font-serif text-5xl md:text-6xl font-light text-[#F5ECD5] mb-4 leading-tight" style={{ opacity: 0 }}>
            {w.bride_name}
            <span className="block text-[#D4A843] text-3xl my-2">&</span>
            {w.groom_name}
          </h1>
          <p ref={subtitleRef} className="text-[#D4A843]/80 text-sm uppercase tracking-[0.4em]" style={{ opacity: 0 }}>
            {firstEvent ? new Date(firstEvent.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Wedding Invitation"}
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4A843] to-transparent mx-auto mt-8"
          />
        </div>

        {/* Parents section */}
        {(w.bride_parents_names || w.groom_parents_names) && (
          <FadeSection>
            <div className="mb-10 text-center bg-[#1A2240]/60 backdrop-blur border border-[#D4A843]/15 rounded-2xl p-6">
              <p className="text-[#D4A843]/70 text-xs uppercase tracking-[0.3em] mb-4">With the Blessings of</p>
              <div className="grid grid-cols-2 gap-4">
                {w.bride_parents_names && (
                  <div>
                    <p className="text-[#F5ECD5] text-sm leading-relaxed">{w.bride_parents_names}</p>
                    <p className="text-[#D4A843]/60 text-[10px] uppercase tracking-widest mt-1">Bride's Parents</p>
                  </div>
                )}
                {w.groom_parents_names && (
                  <div>
                    <p className="text-[#F5ECD5] text-sm leading-relaxed">{w.groom_parents_names}</p>
                    <p className="text-[#D4A843]/60 text-[10px] uppercase tracking-widest mt-1">Groom's Parents</p>
                  </div>
                )}
              </div>
            </div>
          </FadeSection>
        )}

        {/* Guest greeting */}
        {guest && (
          <ZoomSection>
            <div className="mb-10 text-center bg-[#D4A843]/8 border border-[#D4A843]/25 rounded-2xl p-6">
              <p className="text-[#D4A843]/70 text-xs uppercase tracking-[0.3em] mb-2">Dear</p>
              <p className="text-[#F5ECD5] text-2xl font-light">{guest.guest_name}</p>
              <p className="text-[#F5ECD5]/60 text-sm mt-2">We joyfully invite you to share in our day of love and celebration.</p>
            </div>
          </ZoomSection>
        )}

        {/* Events */}
        {ceremonyEvents.length > 0 && (
          <div className="space-y-4 mb-10">
            <FadeSection>
              <p className="text-[#D4A843]/70 text-xs uppercase tracking-[0.3em] text-center mb-6">Ceremony Details</p>
            </FadeSection>
            {ceremonyEvents.map((ev, i) => (
              <FadeSection key={i} fromRight={i % 2 === 1}>
                <div className="bg-[#1A2240]/60 backdrop-blur border border-[#D4A843]/15 rounded-2xl p-5">
                  <p className="text-[#D4A843] text-xs uppercase tracking-[0.28em] mb-3 font-medium">{ev.label}</p>
                  <div className="space-y-2 text-sm text-[#F5ECD5]/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#D4A843]/60 shrink-0" />
                      <span>{new Date(ev.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#D4A843]/60 shrink-0" />
                      <span>{formatTime12(ev.start_time)} – {formatTime12(ev.end_time)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#D4A843]/60 shrink-0 mt-0.5" />
                      <span>{ev.venue}</span>
                    </div>
                    {ev.google_maps_link && (
                      <a href={ev.google_maps_link} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-1 text-[#D4A843] text-xs underline underline-offset-2">
                        View on Maps →
                      </a>
                    )}
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        )}

        {/* Footer */}
        <ZoomSection>
          <div className="text-center mt-12 pb-10">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4A843] to-transparent mx-auto mb-6" />
            <p className="text-[#F5ECD5]/40 text-xs tracking-widest">
              {w.bride_name} &amp; {w.groom_name}
            </p>
          </div>
        </ZoomSection>
      </div>
    </div>
  );
}
