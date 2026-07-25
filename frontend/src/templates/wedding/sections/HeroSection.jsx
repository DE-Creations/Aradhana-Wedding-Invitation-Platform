import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Flourish } from '../components/Ornaments'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function HeroSection({ invitation }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Image moves slower than text (subtle parallax).
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <section
      ref={ref}
      className="section-full bg-radial-wine"
      style={{ textAlign: 'center' }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 900,
        }}
      >
        <motion.div variants={item}>
          <Flourish width={110} />
        </motion.div>

        <motion.p
          variants={item}
          className="label-caps"
          style={{ fontSize: '0.85rem', marginTop: '1rem' }}
        >
          Together with their families
        </motion.p>

        <motion.div variants={item} className="gold-line" />

        <motion.h1
          variants={item}
          className="font-script"
          style={{
            color: '#FAF7F2',
            fontSize: 'clamp(3rem, 9vw, 5rem)',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {invitation.groom_name}
        </motion.h1>

        <motion.span
          variants={item}
          className="font-serif-display"
          style={{
            color: '#C9A96E',
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            margin: '0.25rem 0',
          }}
        >
          &amp;
        </motion.span>

        <motion.h1
          variants={item}
          className="font-script"
          style={{
            color: '#FAF7F2',
            fontSize: 'clamp(3rem, 9vw, 5rem)',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {invitation.bride_name}
        </motion.h1>

        <motion.div variants={item} className="gold-line" />

        <motion.p
          variants={item}
          className="font-body"
          style={{
            color: '#E8D5A3',
            fontSize: 'clamp(1rem, 2.4vw, 1.15rem)',
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Request the pleasure of your company at their wedding celebration
        </motion.p>

        {invitation.couple_photo && (
          <motion.div
            variants={item}
            style={{ overflow: 'hidden', marginTop: '2.5rem' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.4, ease: 'easeOut' }}
              style={{ y: imageY }}
            >
              <div
                style={{
                  padding: 8,
                  border: '1px solid #C9A96E',
                  borderRadius: 8,
                  boxShadow: '0 0 40px rgba(201, 169, 110, 0.25)',
                }}
              >
                <img
                  src={invitation.couple_photo}
                  alt={`${invitation.groom_name} and ${invitation.bride_name}`}
                  loading="lazy"
                  style={{
                    width: 'min(70vw, 640px)',
                    maxHeight: 500,
                    objectFit: 'cover',
                    borderRadius: 4,
                    display: 'block',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div variants={item} style={{ marginTop: '2rem' }}>
          <Flourish width={110} />
        </motion.div>
      </motion.div>
    </section>
  )
}
