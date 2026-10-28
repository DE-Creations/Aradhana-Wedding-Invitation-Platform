import { Calendar, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/invitation/Reveal";
import { formatTime12 } from "@/components/invitation/animated/types";
import { Divider } from "../components/Divider";
import { formatLongDate } from "../lineup";
import type { CeremonyEventInput } from "../../invitation-v2/viewModel";

function EventCard({ event, index }: { event: CeremonyEventInput; index: number }) {
  const range = event.end_time
    ? `${formatTime12(event.start_time)} - ${formatTime12(event.end_time)}`
    : `${formatTime12(event.start_time)} onwards`;
  // e.g. "8:00 AM - 4:00 PM · Poruwa 9:00 AM" (same wording as the other designs)
  const time = event.poruwa_time ? `${range} · Poruwa ${formatTime12(event.poruwa_time)}` : range;

  return (
    <Reveal animation="fadeUp" delay={index * 0.08} className="inv4-glass w-full max-w-md flex-1 basis-72 p-6 text-left">
      <p className="inv4-eyebrow font-t-body">{event.label}</p>
      <div className="inv4-text font-t-body mt-4 space-y-3 text-sm">
        <p className="flex items-start gap-3">
          <Calendar className="inv4-accent mt-0.5 h-4 w-4 shrink-0" /> {formatLongDate(event.date)}
        </p>
        <p className="flex items-start gap-3">
          <Clock className="inv4-accent mt-0.5 h-4 w-4 shrink-0" />
          {time}
        </p>
        <p className="flex items-start gap-3">
          <MapPin className="inv4-accent mt-0.5 h-4 w-4 shrink-0" /> {event.venue}
        </p>
      </div>
      {event.google_maps_link && (
        <a href={event.google_maps_link} target="_blank" rel="noopener noreferrer" className="inv4-btn font-t-body mt-5 w-full">
          <MapPin size={15} /> View Location
        </a>
      )}
    </Reveal>
  );
}

export default function CeremonySection({ events }: { events: CeremonyEventInput[] }) {
  if (events.length === 0) return null;

  return (
    <section className="inv4-section">
      <div className="inv4-inner">
        <p className="inv4-eyebrow font-t-body">Ceremony Details</p>
        <h2 className="inv4-title font-t-heading">Wedding Details</h2>
        <Divider />
        <div className="mt-5 flex flex-wrap items-stretch justify-center gap-5">
          {events.map((event, i) => (
            <EventCard key={`${event.label}-${i}`} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
