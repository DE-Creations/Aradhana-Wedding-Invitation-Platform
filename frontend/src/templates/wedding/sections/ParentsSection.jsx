import { motion } from 'framer-motion'
import { OrnamentalDivider, Flourish } from '../components/Ornaments'

function FamilyColumn({ label, father, mother, from }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === 'left' ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ flex: 1, textAlign: 'center', padding: '1rem 1.5rem' }}
    >
      <p
        className="label-caps"
        style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}
      >
        {label}
      </p>
      <p
        className="font-body"
        style={{ color: '#FAF7F2', fontSize: '1.4rem', marginTop: '1rem' }}
      >
        {father || '—'}
      </p>
      <p className="font-body" style={{ color: '#C9A96E', fontSize: '1.1rem' }}>
        &amp;
      </p>
      <p className="font-body" style={{ color: '#FAF7F2', fontSize: '1.4rem' }}>
        {mother || '—'}
      </p>
    </motion.div>
  )
}

export default function ParentsSection({ invitation }) {
  return (
    <section className="section-full bg-wine" style={{ textAlign: 'center' }}>
      <h2
        className="font-serif-display"
        style={{
          color: '#C9A96E',
          fontStyle: 'italic',
          fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
        }}
      >
        With the Blessings of
      </h2>
      <OrnamentalDivider />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 900,
          width: '100%',
          marginTop: '1.5rem',
        }}
      >
        <FamilyColumn
          label="Family of the Groom"
          father={invitation.groom_father}
          mother={invitation.groom_mother}
          from="left"
        />

        <div
          className="gold-line-vertical hide-mobile"
          style={{ height: 120, alignSelf: 'center' }}
          aria-hidden="true"
        />

        <FamilyColumn
          label="Family of the Bride"
          father={invitation.bride_father}
          mother={invitation.bride_mother}
          from="right"
        />
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <Flourish width={140} />
      </div>
    </section>
  )
}
