import { useState } from 'react'
import { motion } from 'framer-motion'

/*
  Full-screen opening animation. Plays once per session.
  On click: seal cracks & fades, flap opens (3D), card rises, overlay fades out,
  then `onReveal()` fires (parent starts music + petals + reveals content).
*/
export default function EnvelopeReveal({ groomName, brideName, onReveal }) {
  const [opening, setOpening] = useState(false)

  const groomInitial = (groomName || 'A').trim().charAt(0).toUpperCase()
  const brideInitial = (brideName || 'B').trim().charAt(0).toUpperCase()

  const handleOpen = () => {
    if (opening) return
    setOpening(true)
    // Total sequence ~1.8s; reveal underlying content near the end.
    window.setTimeout(() => onReveal?.(), 1500)
  }

  return (
    <motion.div
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label="Open your invitation"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen()}
      initial={{ opacity: 1 }}
      animate={opening ? { opacity: 0, scale: 1.1 } : { opacity: 1 }}
      transition={{ duration: 0.5, delay: opening ? 1.2 : 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at center, #2a1016 0%, #0d0d0d 75%)',
        cursor: 'pointer',
        gap: '1.5rem',
        padding: '1.5rem',
      }}
    >
      <motion.p
        className="label-caps"
        style={{ fontSize: '0.9rem' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        You are cordially invited
      </motion.p>

      {/* Envelope */}
      <motion.div
        style={{ position: 'relative', width: 260, height: 180 }}
        animate={opening ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: opening ? 1.0 : 0 }}
      >
        {/* Rising card */}
        <motion.div
          initial={{ y: 0, scale: 0.6, opacity: 0 }}
          animate={
            opening
              ? { y: -120, scale: 1, opacity: 1 }
              : { y: 0, scale: 0.6, opacity: 0 }
          }
          transition={{ duration: 0.6, delay: opening ? 0.5 : 0, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: '12%',
            top: '8%',
            width: '76%',
            height: '84%',
            background: 'linear-gradient(160deg, #faf7f2, #e8d5a3)',
            borderRadius: 6,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        />

        {/* Envelope body */}
        <svg
          viewBox="0 0 260 180"
          width="260"
          height="180"
          style={{ position: 'absolute', inset: 0, zIndex: 2 }}
          aria-hidden="true"
        >
          <rect x="1" y="40" width="258" height="138" rx="6" fill="#1a0a0f" stroke="#C9A96E" strokeWidth="1.5" />
          <path d="M1 46 L130 130 L259 46" fill="none" stroke="#C9A96E" strokeWidth="1.2" opacity="0.6" />
          <path d="M1 178 L110 96" stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
          <path d="M259 178 L150 96" stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
        </svg>

        {/* Flap (opens upward with perspective) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            perspective: 800,
          }}
          animate={opening ? { rotateX: -160 } : { rotateX: 0 }}
          transition={{ duration: 0.6, delay: opening ? 0.3 : 0, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 260 180" width="260" height="180" aria-hidden="true">
            <path d="M1 46 L1 40 L130 4 L259 40 L259 46 L130 130 Z" fill="#220d13" stroke="#C9A96E" strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* Wax seal + monogram */}
        <motion.div
          className={opening ? '' : 'seal-glow'}
          style={{
            position: 'absolute',
            left: '50%',
            top: '58%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}
          animate={opening ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: opening ? 0 : 0 }}
        >
          <svg width="70" height="70" viewBox="0 0 70 70" aria-hidden="true">
            <circle cx="35" cy="35" r="30" fill="#8B3A4A" stroke="#C9A96E" strokeWidth="2" />
            <circle cx="35" cy="35" r="24" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.6" />
            <text
              x="35"
              y="42"
              textAnchor="middle"
              fontFamily="'Playfair Display', serif"
              fontSize="20"
              fill="#E8D5A3"
            >
              {groomInitial}&amp;{brideInitial}
            </text>
          </svg>
        </motion.div>
      </motion.div>

      {/* Tap to open */}
      <motion.p
        className="font-body"
        style={{ color: '#C9A96E', fontSize: '1rem', letterSpacing: '0.15em' }}
        animate={
          opening
            ? { opacity: 0 }
            : { opacity: 1, y: [0, -6, 0] }
        }
        transition={
          opening
            ? { duration: 0.3 }
            : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        Tap to Open
      </motion.p>
    </motion.div>
  )
}
