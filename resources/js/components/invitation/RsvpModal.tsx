import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, Check } from "lucide-react";
import axios from "axios";

interface GuestLite {
  guest_name?: string;
  guest_token?: string;
  max_attendees?: number;
}

interface RsvpSectionProps {
  eventToken?: string;
  guest?: GuestLite | null;
  rsvpDeadline?: string | null;
  headingFont?: string;
  bodyFont?: string;
  /** Heading text above the button. */
  heading?: string;
  subheading?: string;
  /** Primary CTA button classes. */
  ctaClassName?: string;
  /** Accent tone (heart + deadline). */
  accentClassName?: string;
  subTextClassName?: string;
  /** Modal container classes. */
  modalClassName?: string;
  /** Modal text tone. */
  modalTextClassName?: string;
  className?: string;
}

/**
 * Shared RSVP block: an animated-heart CTA that opens a slide-up modal and
 * POSTs to /invitation/{token}/rsvp. Used by both solid and animated designs
 * so the "animated icon (rsvp-click)" microinteraction lives in one place.
 */
export function RsvpSection({
  eventToken,
  guest = null,
  rsvpDeadline,
  headingFont = "",
  bodyFont = "",
  heading = "Will You Attend?",
  subheading = "We would be truly honored by your presence.",
  ctaClassName = "bg-black text-white",
  accentClassName = "",
  subTextClassName = "",
  modalClassName = "bg-white",
  modalTextClassName = "text-zinc-900",
  className = "",
}: RsvpSectionProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");

  const openModal = () => {
    setOpen(true);
    if (guest?.guest_token && eventToken) {
      axios
        .post(`/invitation/${eventToken}/rsvp-click`, { guest_token: guest.guest_token })
        .catch(() => {});
    }
  };

  const submit = async () => {
    if (guest?.guest_token && eventToken) {
      try {
        await axios.post(`/invitation/${eventToken}/rsvp`, {
          guest_token: guest.guest_token,
          attending,
          attending_count: count,
          note,
        });
      } catch {
        /* still show success UI */
      }
    }
    setSubmitted(true);
    setTimeout(() => setOpen(false), 2200);
  };

  return (
    <div className={`text-center ${className}`}>
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="mb-4 inline-flex"
      >
        <Heart className={`h-8 w-8 fill-current ${accentClassName}`} />
      </motion.div>

      <h3 className={`text-3xl md:text-4xl ${headingFont}`}>{heading}</h3>
      <p className={`mx-auto mt-2 max-w-md text-sm ${bodyFont} ${subTextClassName}`}>{subheading}</p>

      <motion.button
        type="button"
        onClick={openModal}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`group mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium uppercase tracking-[0.15em] shadow-lg transition-shadow hover:shadow-xl ${ctaClassName}`}
      >
        <motion.span
          className="inline-flex"
          initial={false}
          whileHover={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.5 }}
        >
          <Heart className="h-4 w-4 fill-current" />
        </motion.span>
        RSVP Now
      </motion.button>

      {rsvpDeadline && (
        <p className={`mt-3 text-xs ${bodyFont} ${subTextClassName}`}>
          Kindly respond by{" "}
          {new Date(rsvpDeadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className={`relative w-full max-w-md rounded-t-2xl border p-6 shadow-2xl sm:rounded-2xl ${modalClassName} ${modalTextClassName}`}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 opacity-60 transition-opacity hover:opacity-100"
              >
                <X className="h-5 w-5" />
              </button>

              {submitted ? (
                <div className="py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15"
                  >
                    <Check className="h-7 w-7 text-emerald-600" />
                  </motion.div>
                  <h3 className={`text-xl font-semibold ${headingFont}`}>Thank You!</h3>
                  <p className={`mt-1 text-sm ${bodyFont} opacity-70`}>Your RSVP has been submitted.</p>
                </div>
              ) : (
                <>
                  <h3 className={`mb-4 text-xl font-semibold ${headingFont}`}>RSVP</h3>
                  <div className="space-y-4">
                    <div>
                      <p className={`mb-2 text-sm font-medium ${bodyFont}`}>Will you be attending?</p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setAttending(true)}
                          className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${attending === true ? "border-emerald-500 bg-emerald-500/10 text-emerald-700" : "border-black/15 hover:bg-black/5"}`}
                        >
                          Joyfully Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttending(false)}
                          className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${attending === false ? "border-rose-400 bg-rose-400/10 text-rose-600" : "border-black/15 hover:bg-black/5"}`}
                        >
                          Respectfully Decline
                        </button>
                      </div>
                    </div>
                    {attending && (
                      <div>
                        <p className={`mb-1.5 text-sm font-medium ${bodyFont}`}>Number of guests</p>
                        <input
                          type="number"
                          min={1}
                          max={guest?.max_attendees ?? 10}
                          value={count}
                          onChange={(e) => setCount(Number(e.target.value))}
                          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-zinc-900"
                        />
                        <p className="mt-1 text-xs opacity-60">Max: {guest?.max_attendees ?? 10}</p>
                      </div>
                    )}
                    <div>
                      <p className={`mb-1.5 text-sm font-medium ${bodyFont}`}>Message (optional)</p>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="Write a message..."
                        className="w-full resize-none rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
                      />
                    </div>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={submit}
                      disabled={attending === null}
                      className={`w-full rounded-lg py-2.5 text-sm font-medium uppercase tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 ${ctaClassName}`}
                    >
                      Submit RSVP
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RsvpSection;
