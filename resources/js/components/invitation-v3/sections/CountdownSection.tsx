import { Calendar } from "lucide-react";
import { CountdownTimer } from "@/components/invitation/CountdownTimer";
import { Reveal } from "@/components/invitation/Reveal";
import { Ornament } from "../components/Ornament";
import { dateInWords, googleCalendarUrl } from "../../invitation-v2/utils";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

export default function CountdownSection({ invitation }: { invitation: InvitationViewModel }) {
  const firstEvent = invitation.ceremony_events[0];
  if (!firstEvent?.date) return null;

  const target = firstEvent.start_time ? `${firstEvent.date}T${firstEvent.start_time}` : firstEvent.date;

  return (
    <section className="inv3-section">
      <Reveal animation="fadeUp" className="inv3-inner">
        <p className="inv3-eyebrow font-t-body">Save the date</p>
        <h2 className="inv3-title font-t-heading">Counting Down to Forever</h2>
        <Ornament />
        <div className="mt-6">
          <CountdownTimer
            targetDate={target}
            boxClassName="inv3-card"
            numberClassName="font-t-heading text-[#F8E6A6]"
            labelClassName="inv3-eyebrow font-t-body"
          />
        </div>
        <p className="inv3-text-soft font-t-body mt-8 text-lg italic">{dateInWords(firstEvent.date)}</p>
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
          className="inv3-btn-outline font-t-body mt-6"
        >
          <Calendar size={16} /> Add to Google Calendar
        </a>
      </Reveal>
    </section>
  );
}
