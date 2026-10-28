import { Calendar, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/invitation/Reveal";
import { formatTime12 } from "@/components/invitation/animated/types";
import { Ornament } from "../components/Ornament";
import { dateInWords } from "../../invitation-v2/utils";
import type { CeremonyEventInput } from "../../invitation-v2/viewModel";

function EventCard({ event, index }: { event: CeremonyEventInput; index: number }) {
  const time = event.end_time
    ? `${formatTime12(event.start_time)} - ${formatTime12(event.end_time)}`
    : `${formatTime12(event.start_time)} onwards`;

  return (
    <Reveal animation={index % 2 === 0 ? "slideRight" : "slideLeft"} delay={index * 0.08} className="inv3-card w-full max-w-md flex-1 basis-72 p-7 text-left">
      <p className="inv3-eyebrow font-t-body">{event.label}</p>
      <div className="inv3-text font-t-body mt-5 space-y-3 text-sm">
        <p className="flex items-start gap-3">
          <Calendar className="inv3-gold mt-0.5 h-4 w-4 shrink-0" /> {dateInWords(event.date)}
        </p>
        <p className="flex items-start gap-3">
          <Clock className="inv3-gold mt-0.5 h-4 w-4 shrink-0" />
          {time}
          {event.poruwa_time ? ` · Poruwa ${formatTime12(event.poruwa_time)}` : ""}
        </p>
        <p className="flex items-start gap-3">
          <MapPin className="inv3-gold mt-0.5 h-4 w-4 shrink-0" /> {event.venue}
        </p>
      </div>
      {event.google_maps_link && (
        <a href={event.google_maps_link} target="_blank" rel="noopener noreferrer" className="inv3-btn-outline font-t-body mt-6 w-full">
          <MapPin size={15} /> View on Map
        </a>
      )}
    </Reveal>
  );
}

export default function CeremonySection({ events }: { events: CeremonyEventInput[] }) {
  if (events.length === 0) return null;

  return (
    <section className="inv3-section inv3-section--alt">
      <div className="inv3-inner">
        <p className="inv3-eyebrow font-t-body">Ceremony Details</p>
        <h2 className="inv3-title font-t-heading">The Celebration</h2>
        <Ornament />
        <div className="mt-6 flex flex-wrap items-stretch justify-center gap-5">
          {events.map((event, i) => (
            <EventCard key={`${event.label}-${i}`} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
