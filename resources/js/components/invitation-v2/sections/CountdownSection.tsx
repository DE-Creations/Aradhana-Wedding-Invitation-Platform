import { Calendar, Sparkles } from 'lucide-react';
import { CountdownTimer } from '@/components/invitation/CountdownTimer';
import { OrnamentalDivider } from '../components/Ornaments';
import { dateInWords, googleCalendarUrl } from '../utils';
import type { InvitationViewModel } from '../viewModel';

export default function CountdownSection({ invitation }: { invitation: InvitationViewModel }) {
  const firstEvent = invitation.ceremony_events[0];
  if (!firstEvent?.date) return null;

  const targetDateTime = firstEvent.start_time ? `${firstEvent.date}T${firstEvent.start_time}` : firstEvent.date;

  return (
    <section className="section-pad bg-radial-wine" style={{ textAlign: 'center' }}>
      <h2 className="font-serif-display" style={{ color: '#C9A96E', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}>
        Counting Down to Forever
      </h2>
      <span className="seal-glow" style={{ display: 'inline-block', color: '#E8D5A3', marginTop: '0.5rem' }} aria-hidden="true">
        <Sparkles size={18} />
      </span>
      <OrnamentalDivider />

      <div style={{ marginTop: '1rem' }}>
        <CountdownTimer
          targetDate={targetDateTime}
          boxClassName="glass-card"
          numberClassName="font-serif-display"
          labelClassName="label-caps"
        />
      </div>

      <p className="font-body" style={{ color: '#E8D5A3', fontStyle: 'italic', fontSize: '1.25rem', margin: '2.5rem auto 0', maxWidth: 560 }}>
        {dateInWords(firstEvent.date)}
      </p>

      <a
        href={googleCalendarUrl({
          date: firstEvent.date,
          startTime: firstEvent.start_time,
          endTime: firstEvent.end_time,
          groomName: invitation.groom_name,
          brideName: invitation.bride_name,
          venue: firstEvent.venue,
        })}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold-outline"
        style={{ marginTop: '2rem' }}
      >
        <Calendar size={18} />
        Add to Google Calendar
      </a>
    </section>
  );
}
