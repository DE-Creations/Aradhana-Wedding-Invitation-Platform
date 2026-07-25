import { motion } from 'framer-motion'
import { Church, GlassWater, MapPin } from 'lucide-react'
import { OrnamentalDivider } from '../components/Ornaments'
import { formatDateShort, formatTime, mapUrl } from '../utils'

function DetailCard({ icon: Icon, title, date, time, venue, address, href, delay }) {
  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: '1 1 300px',
        maxWidth: 400,
        padding: '2.5rem 2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Icon size={38} color="#C9A96E" strokeWidth={1.2} />
      </div>
      <h3
        className="font-serif-display"
        style={{ color: '#FAF7F2', fontSize: '1.5rem', margin: 0 }}
      >
        {title}
      </h3>
      {date && (
        <p className="font-body" style={{ color: '#E8D5A3', fontSize: '1.1rem', marginTop: '1rem' }}>
          {date}
        </p>
      )}
      {time && (
        <p className="font-body" style={{ color: '#E8D5A3', fontSize: '1.1rem' }}>
          {time}
        </p>
      )}
      {venue && (
        <p className="font-body" style={{ color: '#FAF7F2', fontSize: '1rem', marginTop: '0.75rem' }}>
          {venue}
        </p>
      )}
      {address && (
        <p
          className="font-body"
          style={{ color: 'rgba(201,169,110,0.75)', fontSize: '0.9rem', marginTop: '0.25rem' }}
        >
          {address}
        </p>
      )}
      {href && href !== '#' && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold-outline"
          style={{ marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.7rem 1.4rem' }}
        >
          <MapPin size={16} />
          View on Map
        </a>
      )}
    </motion.div>
  )
}

export default function CeremonyDetails({ invitation }) {
  return (
    <section className="section-full bg-charcoal" style={{ textAlign: 'center' }}>
      <h2
        className="font-serif-display"
        style={{
          color: '#C9A96E',
          fontStyle: 'italic',
          fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
        }}
      >
        Ceremony Details
      </h2>
      <OrnamentalDivider />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'stretch',
          maxWidth: 900,
          width: '100%',
          marginTop: '1.5rem',
        }}
      >
        <DetailCard
          icon={Church}
          title="Holy Ceremony"
          date={formatDateShort(invitation.ceremony_date)}
          time={formatTime(invitation.ceremony_date)}
          venue={invitation.ceremony_venue}
          address={invitation.ceremony_address}
          href={mapUrl(invitation.ceremony_lat, invitation.ceremony_lng, invitation.ceremony_address)}
          delay={0}
        />

        {(invitation.reception_venue || invitation.reception_time) && (
          <DetailCard
            icon={GlassWater}
            title="Wedding Reception"
            date={formatDateShort(invitation.reception_time || invitation.ceremony_date)}
            time={formatTime(invitation.reception_time)}
            venue={invitation.reception_venue}
            address={invitation.reception_address}
            href={mapUrl(invitation.reception_lat, invitation.reception_lng, invitation.reception_address)}
            delay={0.2}
          />
        )}
      </div>
    </section>
  )
}
