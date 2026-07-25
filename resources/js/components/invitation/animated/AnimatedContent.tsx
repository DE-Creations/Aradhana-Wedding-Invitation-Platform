import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import type { AnimatedDesignProps } from "./types";
import { formatTime12 } from "./types";
import { Reveal } from "../Reveal";
import { CountdownTimer } from "../CountdownTimer";
import { GalleryCarousel } from "../GalleryCarousel";
import { RsvpSection } from "../RsvpModal";

export interface AnimatedPalette {
  headingFont: string;
  bodyFont: string;
  text: string;
  sub: string;
  accent: string;
  surface: string;
  button: string;
  modal: string;
  isDark: boolean;
  arrow: string;
  dotActive: string;
  dot: string;
}

interface AnimatedContentProps extends AnimatedDesignProps {
  palette: AnimatedPalette;
}

function longDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "";
}

/**
 * Shared content sections for every animated design: greeting, parents,
 * countdown, ceremony, gallery, RSVP, contact and footer. Each design supplies
 * its own hero + ambient background, then drops this in for full parity.
 */
export function AnimatedContent({
  palette: p,
  wedding: w,
  guest,
  eventToken,
  coupleGalleryImages = [],
  ceremonyEvents = [],
}: AnimatedContentProps) {
  const firstEvent = ceremonyEvents[0];
  const label = `text-xs uppercase tracking-[0.3em] ${p.sub}`;

  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pb-20">
      {/* Guest greeting */}
      {guest && (
        <Reveal animation="blurIn" className={`mb-8 rounded-2xl p-6 text-center ${p.surface}`}>
          <p className={label}>Dear</p>
          <p className={`mt-2 text-2xl ${p.headingFont} ${p.text}`}>{guest.guest_name}</p>
          <p className={`mt-2 text-sm ${p.bodyFont} ${p.sub}`}>
            We joyfully invite you to share in our day of love and celebration.
          </p>
        </Reveal>
      )}

      {/* Parents */}
      {(w.bride_parents_names || w.groom_parents_names) && (
        <Reveal animation="fadeUp" className={`mb-8 rounded-2xl p-6 ${p.surface}`}>
          <p className={`text-center ${label}`}>With the Blessings of</p>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {w.bride_parents_names && (
              <div className="text-center">
                <p className={`text-sm ${p.bodyFont} ${p.text}`}>{w.bride_parents_names}</p>
                <p className={`mt-1 text-[10px] uppercase tracking-widest ${p.accent}`}>Bride's Parents</p>
              </div>
            )}
            {w.groom_parents_names && (
              <div className="text-center">
                <p className={`text-sm ${p.bodyFont} ${p.text}`}>{w.groom_parents_names}</p>
                <p className={`mt-1 text-[10px] uppercase tracking-widest ${p.accent}`}>Groom's Parents</p>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {/* Countdown */}
      {firstEvent && (
        <Reveal animation="scaleIn" className={`mb-8 rounded-2xl p-6 text-center ${p.surface}`}>
          <p className={label}>Counting Down</p>
          <div className="mt-5">
            <CountdownTimer
              targetDate={`${firstEvent.date}T${firstEvent.start_time || "00:00"}`}
              boxClassName={p.isDark ? "bg-white/10 border border-white/15" : "bg-black/[0.04] border border-black/10"}
              numberClassName={`${p.headingFont} ${p.text}`}
              labelClassName={p.sub}
              separatorClassName={p.accent}
            />
          </div>
        </Reveal>
      )}

      {/* Ceremony */}
      {ceremonyEvents.length > 0 && (
        <div className="mb-8">
          <Reveal animation="fadeUp">
            <p className={`text-center ${label} mb-5`}>Ceremony Details</p>
          </Reveal>
          <div className="space-y-4">
            {ceremonyEvents.map((ev, i) => (
              <Reveal key={i} animation={i % 2 === 0 ? "slideRight" : "slideLeft"} delay={i * 0.06} className={`rounded-2xl p-5 ${p.surface}`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${p.accent}`}>{ev.label}</p>
                <div className={`mt-3 space-y-2 text-sm ${p.bodyFont} ${p.sub}`}>
                  <p className="flex items-center gap-2"><Calendar className={`h-4 w-4 shrink-0 ${p.accent}`} /> {longDate(ev.date)}</p>
                  <p className="flex items-center gap-2"><Clock className={`h-4 w-4 shrink-0 ${p.accent}`} /> {formatTime12(ev.start_time)}{ev.end_time ? ` - ${formatTime12(ev.end_time)}` : ""}</p>
                  <p className="flex items-start gap-2"><MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${p.accent}`} /> {ev.venue}</p>
                </div>
                {ev.google_maps_link && (
                  <a href={ev.google_maps_link} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${p.button}`}>
                    <MapPin className="h-4 w-4" /> View on Map
                  </a>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      {coupleGalleryImages.length > 0 && (
        <Reveal animation="fadeUp" className={`mb-8 rounded-2xl p-6 ${p.surface}`}>
          <p className={`text-center ${label} mb-5`}>Our Moments</p>
          <GalleryCarousel
            images={coupleGalleryImages}
            stageClassName="rounded-2xl"
            arrowClassName={p.arrow}
            dotActiveClassName={p.dotActive}
            dotClassName={p.dot}
          />
        </Reveal>
      )}

      {/* RSVP */}
      <Reveal animation="scaleIn" className="mb-8 py-4">
        <RsvpSection
          eventToken={eventToken}
          guest={guest}
          rsvpDeadline={w.rsvp_deadline}
          headingFont={`${p.headingFont} ${p.text}`}
          bodyFont={p.bodyFont}
          accentClassName={p.accent}
          subTextClassName={p.sub}
          ctaClassName={p.button}
          modalClassName={p.modal}
          modalTextClassName={p.text}
        />
      </Reveal>

      {/* Contact */}
      {(w.contact_number_1 || w.contact_number_2) && (
        <Reveal animation="fadeUp" className={`mb-8 rounded-2xl p-6 text-center ${p.surface}`}>
          <p className={label}>Get in Touch</p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
            {w.contact_number_1 && (
              <a href={`tel:${w.contact_number_1}`} className={`flex items-center gap-2 text-sm ${p.bodyFont} ${p.text}`}>
                <Phone className={`h-4 w-4 ${p.accent}`} /> {w.contact_number_1}
              </a>
            )}
            {w.contact_number_2 && (
              <a href={`tel:${w.contact_number_2}`} className={`flex items-center gap-2 text-sm ${p.bodyFont} ${p.text}`}>
                <Phone className={`h-4 w-4 ${p.accent}`} /> {w.contact_number_2}
              </a>
            )}
          </div>
        </Reveal>
      )}

      {/* Footer */}
      <Reveal animation="fadeIn" className="mt-12 text-center">
        <p className={`text-3xl ${p.headingFont} ${p.accent}`}>Thank You</p>
        <p className={`mt-2 text-sm ${p.bodyFont} ${p.sub}`}>With love and gratitude</p>
        <p className={`mt-1 text-lg ${p.bodyFont} ${p.text}`}>{w.bride_name} &amp; {w.groom_name}</p>
        <p className={`mt-3 text-xs ${p.sub}`}>&copy; {new Date().getFullYear()}</p>
      </Reveal>
    </div>
  );
}

export default AnimatedContent;
