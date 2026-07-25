import { motion } from 'framer-motion'
import { Phone, Heart } from 'lucide-react'
import { OrnamentalDivider } from '../components/Ornaments'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function ContactCard({ name, role, phone, photo }) {
  return (
    <motion.div variants={item} style={{ flex: '1 1 240px', maxWidth: 320, textAlign: 'center' }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '2px solid #C9A96E',
          overflow: 'hidden',
          margin: '0 auto 1rem',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        {photo && (
          <img
            src={photo}
            alt={name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <p className="font-body" style={{ color: '#FAF7F2', fontSize: '1.25rem' }}>
        {name}
      </p>
      <p className="label-caps" style={{ fontSize: '0.7rem' }}>
        {role}
      </p>
      {phone && (
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className="font-body"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#E8D5A3',
            fontSize: '1.05rem',
            marginTop: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <Phone size={16} color="#C9A96E" />
          {phone}
        </a>
      )}
    </motion.div>
  )
}

export default function ContactSection({ invitation }) {
  if (!invitation.groom_phone && !invitation.bride_phone) return null

  return (
    <section className="section-pad bg-wine" style={{ textAlign: 'center' }}>
      <h2
        className="font-serif-display"
        style={{ color: '#C9A96E', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 4.5vw, 1.9rem)' }}
      >
        Get in Touch
      </h2>
      <OrnamentalDivider />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: 760,
          margin: '1.5rem auto 0',
        }}
      >
        <ContactCard
          name={invitation.groom_name}
          role="The Groom"
          phone={invitation.groom_phone}
          photo={invitation.groom_photo}
        />

        <span className="hide-mobile" style={{ color: '#8B3A4A' }}>
          <Heart size={24} fill="#8B3A4A" strokeWidth={0} />
        </span>

        <ContactCard
          name={invitation.bride_name}
          role="The Bride"
          phone={invitation.bride_phone}
          photo={invitation.bride_photo}
        />
      </motion.div>
    </section>
  )
}
