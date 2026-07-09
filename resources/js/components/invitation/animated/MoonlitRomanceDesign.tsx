import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import type { AnimatedDesignProps } from "./types";
import { formatTime12 } from "./types";
import { MapPin, Clock, Calendar, Heart } from "lucide-react";
import type * as THREE from "three";

function MoonMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.05;
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.04;
  });
  return (
    <Float speed={0.6} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[1.6, 48, 48]} position={[1.5, 0.8, -2]}>
        <meshStandardMaterial color="#C8A2E0" emissive="#3A1860" roughness={0.45} metalness={0.6} />
      </Sphere>
    </Float>
  );
}

function FloatingOrb({ position, color, size = 0.2 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.3;
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.7} />
    </mesh>
  );
}

function MoonScene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[-3, 3, 3]} intensity={2.5} color="#C8A2E0" />
      <pointLight position={[5, -2, 1]} intensity={0.8} color="#6080FF" />
      <MoonMesh />
      <FloatingOrb position={[-2.5, 1.5, -4]} color="#F0E6FF" size={0.12} />
      <FloatingOrb position={[3, -1.5, -3]} color="#C8A2E0" size={0.08} />
      <FloatingOrb position={[-1, -2, -2]} color="#9060C0" size={0.15} />
      <FloatingOrb position={[2.8, 2.2, -5]} color="#E0D0F8" size={0.1} />
      <FloatingOrb position={[-3.2, -0.5, -3.5]} color="#B080D0" size={0.07} />
    </>
  );
}

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const SlideSection = ({ children, fromRight = false, delay = 0 }: { children: React.ReactNode; fromRight?: boolean; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromRight ? 60 : -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export function MoonlitRomanceDesign({
  wedding: w,
  guest,
  coupleMainImage,
  ceremonyEvents = [],
}: AnimatedDesignProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.4]);
  const canvasY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const firstEvent = ceremonyEvents[0];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[radial-gradient(ellipse_at_50%_20%,#2A1B4A,#0E0A1E)] text-[#F0E6FF] overflow-x-hidden">
      {/* 3D Moon + orbs */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: canvasOpacity, y: canvasY }}
      >
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
            <MoonScene />
          </Canvas>
        </Suspense>
      </motion.div>

      {/* Deep vignette */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(14,10,30,0.8) 100%)" }} />

      {/* Star dots */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-16 max-w-2xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16 min-h-[60vh] flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 text-[#C8A2E0] text-xs uppercase tracking-[0.35em] mb-6 border border-[#C8A2E0]/25 rounded-full px-4 py-1.5"
          >
            <Heart className="h-3 w-3 fill-[#C8A2E0]" /> Moonlit Celebration
          </motion.div>

          {coupleMainImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-44 h-44 rounded-full overflow-hidden border-2 border-[#C8A2E0]/40 shadow-[0_0_70px_rgba(200,162,224,0.35)] mx-auto mb-8"
            >
              <img src={coupleMainImage} alt="Couple" className="w-full h-full object-cover" />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-6xl text-[#F0E6FF] font-light leading-tight mb-4"
          >
            {w.bride_name}
            <span className="block text-[#C8A2E0] text-3xl my-2">&</span>
            {w.groom_name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-[#C8A2E0]/70 text-sm uppercase tracking-[0.4em]"
          >
            {firstEvent ? new Date(firstEvent.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Wedding Invitation"}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.1 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-[#C8A2E0] to-transparent mx-auto mt-6"
          />
        </div>

        {/* Parents */}
        {(w.bride_parents_names || w.groom_parents_names) && (
          <FadeUp>
            <div className="mb-10 bg-[#2A1B4A]/60 backdrop-blur border border-[#C8A2E0]/15 rounded-2xl p-6">
              <p className="text-[#C8A2E0]/60 text-xs uppercase tracking-[0.3em] text-center mb-4">With the Blessings of</p>
              <div className="grid grid-cols-2 gap-4">
                {w.bride_parents_names && (
                  <div className="text-center">
                    <p className="text-[#F0E6FF] text-sm leading-relaxed">{w.bride_parents_names}</p>
                    <p className="text-[#C8A2E0]/60 text-[10px] uppercase tracking-widest mt-1">Bride's Parents</p>
                  </div>
                )}
                {w.groom_parents_names && (
                  <div className="text-center">
                    <p className="text-[#F0E6FF] text-sm leading-relaxed">{w.groom_parents_names}</p>
                    <p className="text-[#C8A2E0]/60 text-[10px] uppercase tracking-widest mt-1">Groom's Parents</p>
                  </div>
                )}
              </div>
            </div>
          </FadeUp>
        )}

        {/* Guest */}
        {guest && (
          <FadeUp delay={0.1}>
            <div className="mb-10 text-center bg-[#C8A2E0]/8 border border-[#C8A2E0]/20 rounded-2xl p-6">
              <p className="text-[#C8A2E0]/70 text-xs uppercase tracking-[0.3em] mb-2">Dear</p>
              <p className="text-[#F0E6FF] text-2xl font-light font-serif">{guest.guest_name}</p>
              <p className="text-[#C8A2E0]/60 text-sm mt-2">We joyfully invite you to share in our moonlit celebration of love.</p>
            </div>
          </FadeUp>
        )}

        {/* Events — alternating parallax slides */}
        {ceremonyEvents.length > 0 && (
          <div className="space-y-4 mb-10">
            <FadeUp>
              <p className="text-[#C8A2E0]/70 text-xs uppercase tracking-[0.3em] text-center mb-6">Ceremony Details</p>
            </FadeUp>
            {ceremonyEvents.map((ev, i) => (
              <SlideSection key={i} fromRight={i % 2 === 1} delay={i * 0.08}>
                <div className="bg-[#2A1B4A]/60 backdrop-blur border border-[#C8A2E0]/15 rounded-2xl p-5">
                  <p className="text-[#C8A2E0] text-xs uppercase tracking-[0.28em] mb-3 font-semibold">{ev.label}</p>
                  <div className="space-y-2 text-sm text-[#F0E6FF]/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#C8A2E0]/60 shrink-0" />
                      <span>{new Date(ev.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#C8A2E0]/60 shrink-0" />
                      <span>{formatTime12(ev.start_time)} – {formatTime12(ev.end_time)}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#C8A2E0]/60 shrink-0 mt-0.5" />
                      <span>{ev.venue}</span>
                    </div>
                    {ev.google_maps_link && (
                      <a href={ev.google_maps_link} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-1 text-[#C8A2E0] text-xs underline underline-offset-2">
                        View on Maps →
                      </a>
                    )}
                  </div>
                </div>
              </SlideSection>
            ))}
          </div>
        )}

        {/* Footer */}
        <FadeUp delay={0.2}>
          <div className="text-center mt-12 pb-10">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C8A2E0] to-transparent mx-auto mb-4" />
            <p className="text-[#C8A2E0]/40 text-xs tracking-widest">
              {w.bride_name} &amp; {w.groom_name}
            </p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
