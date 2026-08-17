import { motion } from 'framer-motion';
import { OrnamentalDivider, Flourish } from '../components/Ornaments';
import type { InvitationViewModel } from '../viewModel';

interface FamilyColumnProps {
  label: string;
  names: string;
  from: 'left' | 'right';
}

/**
 * Laravel stores parents as one combined string per side (e.g.
 * "Mr. Kamal Perera & Mrs. Nilanthi Perera") rather than separate
 * father/mother fields, so it's shown as a single line.
 */
function FamilyColumn({ label, names, from }: FamilyColumnProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === 'left' ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ flex: 1, textAlign: 'center', padding: '1rem 1.5rem' }}
    >
      <p className="label-caps" style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}>
        {label}
      </p>
      <p className="font-body" style={{ color: '#FAF7F2', fontSize: '1.3rem', marginTop: '1rem' }}>
        {names || '—'}
      </p>
    </motion.div>
  );
}

export default function ParentsSection({ invitation }: { invitation: InvitationViewModel }) {
  if (!invitation.groom_parents_names && !invitation.bride_parents_names) return null;

  return (
    <section className="section-pad bg-wine" style={{ textAlign: 'center' }}>
      <h2 className="font-serif-display" style={{ color: '#C9A96E', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}>
        With the Blessings of
      </h2>
      <OrnamentalDivider />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', maxWidth: 900, width: '100%', margin: '1.5rem auto 0' }}>
        <FamilyColumn label="Family of the Groom" names={invitation.groom_parents_names} from="left" />

        <div className="gold-line-vertical hide-mobile" style={{ height: 120, alignSelf: 'center' }} aria-hidden="true" />

        <FamilyColumn label="Family of the Bride" names={invitation.bride_parents_names} from="right" />
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <Flourish width={140} />
      </div>
    </section>
  );
}
