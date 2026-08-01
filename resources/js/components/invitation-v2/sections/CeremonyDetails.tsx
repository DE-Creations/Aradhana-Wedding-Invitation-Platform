import { motion } from 'framer-motion';
import { Church, MapPin } from 'lucide-react';
import { OrnamentalDivider } from '../components/Ornaments';
import { formatDateShort, formatTime12, mapUrl } from '../utils';
import type { CeremonyEventInput } from '../viewModel';

interface DetailCardProps {
  event: CeremonyEventInput;
  delay: number;
}

/**
 * Laravel supports a variable-length list of ceremony events (Sinhala,
 * Christian, Tamil, Muslim weddings each have their own event set), so this
 * renders one card per event rather than assuming a fixed ceremony+reception.
 */
function DetailCard({ event, delay }: DetailCardProps) {
  const href = mapUrl(event.google_maps_link, event.venue);

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ flex: '1 1 300px', maxWidth: 400, padding: '2.5rem 2rem', textAlign: 'center' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Church size={38} color="#C9A96E" strokeWidth={1.2} />
      </div>
      <h3 className="font-serif-display" style={{ color: '#FAF7F2', fontSize: '1.5rem', margin: 0 }}>
        {event.label}
      </h3>
      {event.date && (
        <p className="font-body" style={{ color: '#E8D5A3', fontSize: '1.1rem', marginTop: '1rem' }}>
          {formatDateShort(event.date)}
        </p>
      )}
      {(event.start_time || event.poruwa_time) && (
        <p className="font-body" style={{ color: '#E8D5A3', fontSize: '1.1rem' }}>
          {formatTime12(event.start_time)}
          {event.end_time ? ` – ${formatTime12(event.end_time)}` : ''}
          {event.poruwa_time ? ` (Poruwa: ${formatTime12(event.poruwa_time)})` : ''}
        </p>
      )}
      {event.venue && (
        <p className="font-body" style={{ color: '#FAF7F2', fontSize: '1rem', marginTop: '0.75rem' }}>
          {event.venue}
        </p>
      )}
      {href && href !== '#' && (
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn-gold-outline" style={{ marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.7rem 1.4rem' }}>
          <MapPin size={16} />
          View on Map
        </a>
      )}
    </motion.div>
  );
}

export default function CeremonyDetails({ events }: { events: CeremonyEventInput[] }) {
  if (events.length === 0) return null;

  return (
    <section className="section-full bg-charcoal" style={{ textAlign: 'center' }}>
      <h2 className="font-serif-display" style={{ color: '#C9A96E', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}>
        Ceremony Details
      </h2>
      <OrnamentalDivider />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'stretch', maxWidth: 900, width: '100%', marginTop: '1.5rem' }}>
        {events.map((event, i) => (
          <DetailCard key={`${event.label}-${i}`} event={event} delay={i * 0.2} />
        ))}
      </div>
    </section>
  );
}
