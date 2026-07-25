import { motion, useScroll, useSpring } from 'framer-motion'

/*
  Slim vertical scroll-progress indicator pinned to the right edge.
  Fills with gold as the user scrolls the page.
*/
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 2,
        height: '100vh',
        background: 'rgba(201, 169, 110, 0.12)',
        zIndex: 50,
      }}
    >
      <motion.div
        style={{
          transformOrigin: 'top',
          scaleY,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, #C9A96E, #8B3A4A)',
        }}
      />
    </div>
  )
}
