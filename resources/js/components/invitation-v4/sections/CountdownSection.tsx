import { Calendar } from "lucide-react";
import { CountdownTimer } from "@/components/invitation/CountdownTimer";
import { Reveal } from "@/components/invitation/Reveal";
import { Divider } from "../components/Divider";
import { googleCalendarUrl } from "../../invitation-v2/utils";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

export default function CountdownSection({ invitation }: { invitation: InvitationViewModel }) {
  const first = invitation.ceremony_events[0];
  if (!first?.date) return null;

  const target = first.start_time ? `${first.date}T${first.start_time}` : first.date;

  return (
    <section className="inv4-section">
      <Reveal animation="fadeUp" className="inv4-inner">
        <p className="inv4-eyebrow font-t-body">Counting down to our big day</p>
        <h2 className="inv4-title font-t-heading">It&rsquo;s wedding time</h2>
        <Divider />
        <div className="mt-5">
          <CountdownTimer
            targetDate={target}
            boxClassName="inv4-glass"
            numberClassName="font-t-heading text-[#1c2a44]"
            labelClassName="inv4-eyebrow font-t-body"
          />
        </div>
        <a
          href={googleCalendarUrl({
            date: first.date,
            startTime: first.start_time,
            endTime: first.end_time,
            groomName: invitation.groom_name,
            brideName: invitation.bride_name,
            venue: first.venue,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="inv4-btn inv4-btn--ghost font-t-body mt-7"
        >
          <Calendar size={16} /> Add to Calendar
        </a>
      </Reveal>
    </section>
  );
}
