import AnimatedSection from '../components/AnimatedSection';
import { Flourish } from '../components/Ornaments';
import type { InvitationViewModel } from '../viewModel';

export default function FooterSection({ invitation }: { invitation: InvitationViewModel }) {
  const year = new Date().getFullYear();
  const couple = `${invitation.groom_name?.split(' ')[0]} & ${invitation.bride_name?.split(' ')[0]}`;

  return (
    <footer className="section-pad bg-charcoal" style={{ textAlign: 'center', paddingBottom: '3rem' }}>
      <AnimatedSection animation="fadeUp">
        <h2 className="font-script" style={{ color: '#C9A96E', fontSize: 'clamp(2.5rem, 8vw, 3rem)', margin: 0 }}>
          Thank You
        </h2>
        <p className="font-body" style={{ color: '#E8D5A3', fontSize: '1rem', marginTop: '0.5rem' }}>
          With love and gratitude
        </p>
        <p className="font-body" style={{ color: '#FAF7F2', fontSize: '1.25rem', marginTop: '0.75rem' }}>
          {couple}
        </p>
        <div style={{ margin: '1.5rem 0' }}>
          <Flourish width={120} />
        </div>
        <p className="font-body" style={{ color: 'rgba(201,169,110,0.6)', fontSize: '0.85rem' }}>
          &copy; {year} &middot; Made with love
        </p>
      </AnimatedSection>
    </footer>
  );
}
