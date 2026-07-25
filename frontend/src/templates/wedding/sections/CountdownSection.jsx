import { AnimatePresence, motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'
import { OrnamentalDivider } from '../components/Ornaments'
import { dateInWords, googleCalendarUrl } from '../utils'

function Digit({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className="glass-card"
        style={{
          minWidth: 88,
          padding: '1.1rem 0.75rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          height: 96,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="font-serif-display"
            style={{
              color: '#FAF7F2',
              fontSize: 'clamp(2.25rem, 7vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1,
              display: 'block',
            }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <p
        className="label-caps"
        style={{ fontSize: '0.7rem', marginTop: '0.6rem', letterSpacing: '0.2em' }}
      >
        {label}
      </p>
    </div>
  )
}

function Colon() {
  return (
    <span
      className="font-serif-display hide-mobile"
      style={{ color: '#C9A96E', fontSize: '2rem', alignSelf: 'flex-start', marginTop: 24 }}
    >
      :
    </span>
  )
}

export default function CountdownSection({ invitation }) {
  const { days, hours, minutes, seconds } = useCountdown(invitation.ceremony_date)

  return (
    <section className="section-full bg-radial-wine" style={{ textAlign: 'center' }}>
      <h2
        className="font-serif-display"
        style={{
          color: '#C9A96E',
          fontStyle: 'italic',
          fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
        }}
      >
        Counting Down to Forever
      </h2>
      <OrnamentalDivider />

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          maxWidth: 560,
          marginTop: '1rem',
        }}
      >
        <Digit value={days} label="Days" />
        <Colon />
        <Digit value={hours} label="Hours" />
        <Colon />
        <Digit value={minutes} label="Minutes" />
        <Colon />
        <Digit value={seconds} label="Seconds" />
      </div>

      <p
        className="font-body"
        style={{
          color: '#E8D5A3',
          fontStyle: 'italic',
          fontSize: '1.25rem',
          marginTop: '2.5rem',
          maxWidth: 560,
        }}
      >
        {dateInWords(invitation.ceremony_date)}
      </p>

      <a
        href={googleCalendarUrl(invitation)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold-outline"
        style={{ marginTop: '2rem' }}
      >
        <Calendar size={18} />
        Add to Google Calendar
      </a>
    </section>
  )
}
