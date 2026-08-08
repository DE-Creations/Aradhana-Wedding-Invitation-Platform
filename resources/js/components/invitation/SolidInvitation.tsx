import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import type { SolidTheme } from "@/data/invitationThemes";
import type { TypographyOption } from "@/data/invitationConstants";
import type { WeddingData, CeremonyEvent, GuestData } from "./animated/types";
import { formatTime12 } from "./animated/types";
import { Reveal } from "./Reveal";
import { CountdownTimer } from "./CountdownTimer";
import { GalleryCarousel } from "./GalleryCarousel";
import { RsvpSection } from "./RsvpModal";

interface SolidInvitationProps {
  theme: SolidTheme;
  typography: TypographyOption;
  wedding: WeddingData;
  guest?: GuestData | null;
  eventToken?: string;
  coupleMainImage?: string | null;
  coupleGalleryImages?: string[];
  ceremonyEvents?: CeremonyEvent[];
}

function buildGoogleCalendarUrl(w: WeddingData, ev?: CeremonyEvent): string {
  if (!ev) return "#";
  const fmt = (date: string, time: string) => `${date.split("-").join("")}T${(time || "00:00").split(":").join("")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${w.bride_name} & ${w.groom_name} Wedding`,
    dates: `${fmt(ev.date, ev.start_time)}/${fmt(ev.date, ev.end_time || ev.start_time)}`,
    details: `Join us in celebrating the wedding of ${w.bride_name} and ${w.groom_name}.\n\nVenue: ${ev.venue}`,
    location: ev.venue,
    ctz: "Asia/Colombo",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function longDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
}

/** Thin ornamental divider using the theme accent. */
function Divider({ theme }: { theme: SolidTheme }) {
  return (
    <div className="mx-auto my-6 flex items-center justify-center gap-2">
      <span className={`h-px w-16 ${theme.dividerClassName}`} />
      <span className={`text-lg ${theme.accentToneClassName}`}>&#10086;</span>
      <span className={`h-px w-16 ${theme.dividerClassName}`} />
    </div>
  );
}

/**
 * Full-bleed, borderless, scroll-animated solid invitation.
 * Layout: hero (parallax photo) -> greeting -> parents (row) -> countdown (row)
 * -> ceremony -> gallery -> RSVP -> contact -> footer.
 */
export function SolidInvitation({
  theme,
  typography,
  wedding: w,
  guest = null,
  eventToken,
  coupleMainImage,
  coupleGalleryImages = [],
  ceremonyEvents = [],
}: SolidInvitationProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const firstEvent = ceremonyEvents[0];
  const countdownTarget = firstEvent ? `${firstEvent.date}T${firstEvent.start_time || "00:00"}` : null;

  // Marks the end of the Ceremony Details section — the gallery carousel starts
  // auto-advancing as soon as the scroll passes this point, rather than waiting
  // for the gallery itself to scroll into view.
  const ceremonyEndRef = useRef<HTMLDivElement>(null);
  const ceremonyPassed = useInView(ceremonyEndRef, { once: true, amount: 0 });

  const sectionLabel = `text-xs uppercase tracking-[0.32em] ${typography.bodyFont} ${theme.subTextToneClassName}`;
  const sectionHeading = `text-3xl md:text-4xl ${typography.headingFont} ${theme.textToneClassName}`;

  return (
    <div className={`relative w-full overflow-hidden ${theme.pageClassName} ${theme.textToneClassName}`}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative flex h-[100svh] min-h-[560px] items-end justify-center overflow-hidden">
        {coupleMainImage ? (
          <motion.img
            src={coupleMainImage}
            alt="Couple"
            style={{ y: imageY }}
            className="absolute inset-0 h-[122%] w-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 ${theme.pageClassName}`} />
        )}
        <div className="absolute inset-0" style={{ background: theme.heroScrim }} />

        <motion.div style={{ y: contentY }} className="relative z-10 mb-16 px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-[10px] uppercase tracking-[0.4em] text-white/90 backdrop-blur-sm"
          >
            Wedding Invitation
          </motion.span>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className={`mt-6 text-sm uppercase tracking-[0.35em] text-white/70 ${typography.bodyFont}`}
          >
            Together with their families
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-3 text-[clamp(2.6rem,11vw,5.5rem)] leading-[0.95] text-white ${typography.headingFont}`}
          >
            <span className="block">{w.bride_name}</span>
            <span className={`my-1 block text-2xl italic md:text-3xl ${theme.accentToneClassName}`}>&amp;</span>
            <span className="block">{w.groom_name}</span>
          </motion.h1>
          {firstEvent && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              className={`mt-6 text-sm uppercase tracking-[0.3em] text-white/80 ${typography.bodyFont}`}
            >
              {[longDate(firstEvent.date), firstEvent.venue].filter(Boolean).join("  \u00b7  ")}
            </motion.p>
          )}
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-20 md:px-8">
        {/* ── Guest greeting ── */}
        <Reveal animation="blurIn" className="text-center">
          <p className={sectionLabel}>Dear</p>
          <p className={`mt-3 text-3xl md:text-4xl ${typography.headingFont} ${theme.textToneClassName}`}>
            {guest?.guest_name ?? "Beloved Guest"}
          </p>
          <p className={`mx-auto mt-3 max-w-lg text-base ${typography.bodyFont} ${theme.subTextToneClassName}`}>
            We would be honored by your gracious presence on our special day.
          </p>
        </Reveal>

        <Divider theme={theme} />

        {/* ── Parents (own row) ── */}
        {(w.bride_parents_names || w.groom_parents_names) && (
          <Reveal animation="fadeUp" className="py-8">
            <p className={`text-center ${sectionLabel}`}>With the Blessings of</p>
            <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-0">
              <div className="flex-1 text-center md:px-8">
                <p className={`text-[11px] uppercase tracking-[0.3em] ${typography.bodyFont} ${theme.accentToneClassName}`}>
                  Family of the Bride
                </p>
                <p className={`mt-3 text-xl ${typography.bodyFont} ${theme.textToneClassName}`}>{w.bride_parents_names}</p>
              </div>
              <div className={`hidden h-20 w-px shrink-0 md:block ${theme.dividerClassName}`} aria-hidden />
              <div className="flex-1 text-center md:px-8">
                <p className={`text-[11px] uppercase tracking-[0.3em] ${typography.bodyFont} ${theme.accentToneClassName}`}>
                  Family of the Groom
                </p>
                <p className={`mt-3 text-xl ${typography.bodyFont} ${theme.textToneClassName}`}>{w.groom_parents_names}</p>
              </div>
            </div>
          </Reveal>
        )}

        <Divider theme={theme} />

        {/* ── Countdown (own row) ── */}
        {countdownTarget && (
          <Reveal animation="scaleIn" className="py-8 text-center">
            <p className={sectionLabel}>Counting Down to Forever</p>
            <div className="mt-8">
              <CountdownTimer
                targetDate={countdownTarget}
                boxClassName={theme.surfaceClassName}
                numberClassName={`${typography.headingFont} ${theme.textToneClassName}`}
                labelClassName={`${typography.bodyFont} ${theme.subTextToneClassName}`}
                separatorClassName={theme.accentToneClassName}
              />
            </div>
            <a
              href={buildGoogleCalendarUrl(w, firstEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 ${theme.buttonClassName}`}
            >
              <Calendar className="h-4 w-4" /> Add to Google Calendar
            </a>
          </Reveal>
        )}

        <Divider theme={theme} />

        {/* ── Ceremony details ── */}
        {ceremonyEvents.length > 0 && (
          <Reveal animation="fadeUp" className="py-8">
            <p className={`text-center ${sectionLabel}`}>Ceremony Details</p>
            <h2 className={`mt-2 text-center ${sectionHeading}`}>The Celebration</h2>
            <div className={ceremonyEvents.length === 1 ? "mt-8 flex justify-center" : "mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"}>
              {ceremonyEvents.map((ev, i) => (
                <Reveal
                  key={i}
                  animation={i % 2 === 0 ? "slideRight" : "slideLeft"}
                  delay={i * 0.08}
                  className={`rounded-2xl p-6 ${theme.surfaceClassName} ${ceremonyEvents.length === 1 ? "w-full max-w-xl" : ""}`}
                >
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${typography.bodyFont} ${theme.accentToneClassName}`}>
                    {ev.label}
                  </p>
                  <div className={`mt-4 space-y-2.5 text-sm ${typography.bodyFont} ${theme.subTextToneClassName}`}>
                    <p className="flex items-center justify-center gap-2 md:justify-start">
                      <Calendar className={`h-4 w-4 shrink-0 ${theme.accentToneClassName}`} /> {longDate(ev.date)}
                    </p>
                    <p className="flex items-center justify-center gap-2 md:justify-start">
                      <Clock className={`h-4 w-4 shrink-0 ${theme.accentToneClassName}`} />
                      {ev.end_time ? `${formatTime12(ev.start_time)} - ${formatTime12(ev.end_time)}` : `${formatTime12(ev.start_time)} onwards`}
                      {ev.poruwa_time ? ` \u00b7 Poruwa ${formatTime12(ev.poruwa_time)}` : ""}
                    </p>
                    <p className="flex items-center justify-center gap-2 md:justify-start">
                      <MapPin className={`h-4 w-4 shrink-0 ${theme.accentToneClassName}`} /> {ev.venue}
                    </p>
                  </div>
                  {ev.google_maps_link && (
                    <a
                      href={ev.google_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${theme.buttonClassName}`}
                    >
                      <MapPin className="h-4 w-4" /> View on Map
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
            <div ref={ceremonyEndRef} aria-hidden="true" />
          </Reveal>
        )}

        {/* ── Gallery ── */}
        {coupleGalleryImages.length > 0 && (
          <>
            <Divider theme={theme} />
            <Reveal animation="fadeUp" className="py-8">
              <p className={`text-center ${sectionLabel}`}>Our Moments</p>
              <h2 className={`mt-2 text-center ${sectionHeading}`}>A Glimpse of Our Journey</h2>
              <div className="mt-8">
                <GalleryCarousel
                  images={coupleGalleryImages}
                  stageClassName="rounded-2xl"
                  arrowClassName={theme.isDark ? "bg-black/40 text-white border border-white/15" : "bg-white/80 text-zinc-900 border border-black/10"}
                  dotActiveClassName={`w-5 ${theme.isDark ? "bg-white" : "bg-zinc-800"}`}
                  dotClassName={theme.isDark ? "w-2 bg-white/40" : "w-2 bg-zinc-400"}
                  autoplayTrigger={ceremonyEvents.length > 0 ? ceremonyPassed : undefined}
                  autoMs={3200}
                />
              </div>
            </Reveal>
          </>
        )}

        <Divider theme={theme} />

        {/* ── RSVP ── */}
        <Reveal animation="scaleIn" className="py-8">
          <RsvpSection
            eventToken={eventToken}
            guest={guest}
            rsvpDeadline={w.rsvp_deadline}
            headingFont={`${typography.headingFont} ${theme.textToneClassName}`}
            bodyFont={typography.bodyFont}
            accentClassName={theme.accentToneClassName}
            subTextClassName={theme.subTextToneClassName}
            ctaClassName={theme.buttonClassName}
            modalClassName={theme.modalClassName}
            modalTextClassName={theme.textToneClassName}
          />
        </Reveal>

        {/* ── Contact ── */}
        {(w.contact_number_1 || w.contact_number_2) && (
          <>
            <Divider theme={theme} />
            <Reveal animation="fadeUp" className={`rounded-2xl p-6 text-center ${theme.softSurfaceClassName}`}>
              <p className={sectionLabel}>Get in Touch</p>
              <div className="mt-4 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-10">
                {w.contact_number_1 && (
                  <a href={`tel:${w.contact_number_1}`} className={`flex items-center gap-2 text-sm ${typography.bodyFont} ${theme.textToneClassName}`}>
                    <Phone className={`h-4 w-4 ${theme.accentToneClassName}`} /> {w.contact_number_1}
                  </a>
                )}
                {w.contact_number_2 && (
                  <a href={`tel:${w.contact_number_2}`} className={`flex items-center gap-2 text-sm ${typography.bodyFont} ${theme.textToneClassName}`}>
                    <Phone className={`h-4 w-4 ${theme.accentToneClassName}`} /> {w.contact_number_2}
                  </a>
                )}
              </div>
            </Reveal>
          </>
        )}

        {/* ── Footer ── */}
        <Reveal animation="fadeIn" className="mt-16 pb-16 text-center md:pb-24">
          <p className={`text-4xl ${typography.headingFont} ${theme.accentToneClassName}`}>Thank You</p>
          <p className={`mt-3 text-sm ${typography.bodyFont} ${theme.subTextToneClassName}`}>With love and gratitude</p>
          <p className={`mt-2 text-lg ${typography.bodyFont} ${theme.textToneClassName}`}>
            {w.bride_name} &amp; {w.groom_name}
          </p>
          <p className={`mt-4 text-xs ${typography.bodyFont} ${theme.subTextToneClassName}`}>
            &copy; {new Date().getFullYear()} Aradhana. All rights reserved.
          </p>
          <p className={`mt-1 text-xs ${typography.bodyFont} ${theme.subTextToneClassName}`}>
            Designed &amp; developed by{" "}
            <a
              href="https://www.decreations.lk"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 hover:opacity-80 ${theme.accentToneClassName}`}
            >
              DE Creations
            </a>
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/** Compact hero used by the design picker thumbnails and large preview. */
export function SolidHeroPreview({
  theme,
  typography,
  coupleMainImage,
  brideName,
  groomName,
}: {
  theme: SolidTheme;
  typography: TypographyOption;
  coupleMainImage?: string | null;
  brideName: string;
  groomName: string;
}) {
  return (
    <div className={`relative flex h-full w-full items-end justify-center overflow-hidden ${theme.pageClassName}`}>
      {coupleMainImage && <img src={coupleMainImage} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0" style={{ background: theme.heroScrim }} />
      <div className="relative z-10 mb-5 px-3 text-center">
        <p className="text-[7px] uppercase tracking-[0.35em] text-white/70">Together with their families</p>
        <p className={`mt-1 text-lg leading-tight text-white ${typography.headingFont}`}>
          {brideName}
          <span className={`mx-1 ${theme.accentToneClassName}`}>&amp;</span>
          {groomName}
        </p>
      </div>
    </div>
  );
}

export default SolidInvitation;
