import { useCallback, useMemo } from 'react'
import Particles from 'react-tsparticles'

/*
  Subtle rose-petal particle system.
  The tsparticles slim engine is imported dynamically (inside init) so it stays
  out of the main bundle. Particle count is reduced on small screens.
*/
export default function FloatingPetals({ colors }) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const count = isMobile ? 15 : 30

  const particlesInit = useCallback(async (engine) => {
    const { loadSlim } = await import('tsparticles-slim')
    await loadSlim(engine)
  }, [])

  const petalColors = useMemo(
    () => [colors?.rose || '#8B3A4A', colors?.accent || '#C9A96E', '#F5E6E0'],
    [colors],
  )

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      detectRetina: true,
      fpsLimit: 60,
      particles: {
        number: { value: count },
        color: { value: petalColors },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.3, max: 0.7 },
        },
        size: {
          value: { min: 3, max: 8 },
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: 'random',
          animation: { enable: true, speed: 8, sync: false },
        },
        move: {
          enable: true,
          direction: 'bottom',
          speed: { min: 1, max: 2 },
          straight: false,
          outModes: { default: 'out' },
          drift: { min: -0.5, max: 0.5 },
        },
        wobble: {
          enable: true,
          distance: 15,
          speed: { min: -5, max: 5 },
        },
      },
    }),
    [count, petalColors],
  )

  if (prefersReduced) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Particles
        id="floating-petals"
        init={particlesInit}
        options={options}
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  )
}
