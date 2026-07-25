import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { OrnamentalDivider } from '../components/Ornaments'

const AUTO_MS = 4000

export default function GallerySection({ photos = [] }) {
  const [[index, direction], setState] = useState([0, 0])
  const [paused, setPaused] = useState(false)
  const count = photos.length
  const timer = useRef(null)

  const paginate = useCallback(
    (dir) => {
      setState(([prev]) => [(prev + dir + count) % count, dir])
    },
    [count],
  )

  const goTo = (i) => setState(([prev]) => [i, i > prev ? 1 : -1])

  // Auto-advance (paused on hover / touch).
  useEffect(() => {
    if (count <= 1 || paused) return
    timer.current = setInterval(() => paginate(1), AUTO_MS)
    return () => clearInterval(timer.current)
  }, [count, paused, paginate])

  if (count === 0) return null

  const active = photos[index]
  const prev = photos[(index - 1 + count) % count]
  const next = photos[(index + 1) % count]

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.95 }),
  }

  return (
    <section className="section-full bg-wine" style={{ textAlign: 'center' }}>
      <h2
        className="font-serif-display"
        style={{ color: '#C9A96E', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}
      >
        Our Moments
      </h2>
      <p className="font-body" style={{ color: '#E8D5A3', fontSize: '1.05rem' }}>
        A glimpse into our journey together
      </p>
      <OrnamentalDivider />

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          width: '100%',
          maxWidth: 1000,
          marginTop: '1rem',
        }}
      >
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous photo"
          className="gallery-arrow"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Side peek (desktop only) */}
        <img
          src={prev.photo_path}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="hide-mobile gallery-side"
          onClick={() => paginate(-1)}
        />

        {/* Main stage */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 auto',
            maxWidth: 560,
            height: 'min(60vh, 420px)',
            overflow: 'hidden',
            borderRadius: 12,
          }}
        >
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.x < -80) paginate(1)
                else if (info.offset.x > 80) paginate(-1)
              }}
              style={{
                position: 'absolute',
                inset: 0,
                border: '1px solid #C9A96E',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                cursor: 'grab',
              }}
            >
              <img
                key={`img-${index}`}
                src={active.photo_path}
                alt={active.caption || 'Gallery photo'}
                loading="lazy"
                draggable={false}
                className="kenburns"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {active.caption && (
                <div
                  className="font-body"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem 1rem 1rem',
                    background: 'linear-gradient(0deg, rgba(13,13,13,0.85), transparent)',
                    color: '#FAF7F2',
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                  }}
                >
                  {active.caption}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <img
          src={next.photo_path}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="hide-mobile gallery-side"
          onClick={() => paginate(1)}
        />

        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next photo"
          className="gallery-arrow"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: '1.5rem' }}>
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: i === index ? 26 : 10,
              height: 10,
              borderRadius: 999,
              border: 'none',
              background: i === index ? '#C9A96E' : 'rgba(201,169,110,0.35)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  )
}
