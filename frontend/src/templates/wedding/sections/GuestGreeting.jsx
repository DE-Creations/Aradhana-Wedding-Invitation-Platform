import AnimatedSection from '../components/AnimatedSection'
import { Flourish } from '../components/Ornaments'

export default function GuestGreeting({ guestName, message }) {
  const name = guestName || 'Beloved Guest'

  return (
    <section className="section-pad bg-charcoal" style={{ textAlign: 'center' }}>
      <AnimatedSection animation="blurIn" duration={1}>
        <p className="font-body" style={{ color: '#C9A96E', fontSize: '1.25rem' }}>
          Dear
        </p>
        <h2
          className="font-script"
          style={{
            color: '#FAF7F2',
            fontSize: 'clamp(2.25rem, 6vw, 2.75rem)',
            margin: '0.5rem 0 1rem',
          }}
        >
          {name}
        </h2>
        <Flourish width={90} className="" />
        <p
          className="font-body"
          style={{
            color: '#E8D5A3',
            fontSize: '1.05rem',
            maxWidth: 540,
            margin: '1.25rem auto 0',
            lineHeight: 1.7,
          }}
        >
          {message ||
            'We would be honored by your gracious presence on our special day'}
        </p>
      </AnimatedSection>
    </section>
  )
}
