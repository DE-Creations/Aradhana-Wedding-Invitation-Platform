import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HeroActions } from "@/components/invitation/HeroActions";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.18 } } };
const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

const initial = (name: string) => name.trim().charAt(0).toUpperCase();

/** Cover: monogram, names, the two quick actions, date and a scroll cue. */
export default function HeroSection({ invitation, showFindTable }: { invitation: InvitationViewModel; showFindTable: boolean }) {
  const firstEvent = invitation.ceremony_events[0];
  const when = firstEvent?.date
    ? new Date(`${firstEvent.date}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <section className="inv3-hero">
      <motion.div variants={container} initial="hidden" animate="visible" className="inv3-inner flex flex-col items-center">
        <motion.p variants={item} className="inv3-eyebrow font-t-body">
          A Wedding Invitation
        </motion.p>

        <motion.p variants={item} className="inv3-shimmer font-t-heading mt-4 text-2xl tracking-[0.4em]">
          {initial(invitation.bride_name)} &#10022; {initial(invitation.groom_name)}
        </motion.p>

        <motion.h1 variants={item} className="inv3-names font-t-heading mt-6">
          {invitation.bride_name}
          <span className="inv3-amp">&amp;</span>
          {invitation.groom_name}
        </motion.h1>

        <motion.div variants={item} className="mt-8 w-full">
          <HeroActions
            showFindTable={showFindTable}
            fontClassName="font-t-body"
            primaryClassName="bg-gradient-to-r from-[#C9A227] to-[#8C1D2F] text-white shadow-lg shadow-black/30"
            secondaryClassName="border border-[rgba(201,162,39,0.6)] bg-black/10 text-[#F8E6A6]"
          />
        </motion.div>

        {when && (
          <motion.p variants={item} className="inv3-text-soft font-t-body mt-8 max-w-md text-sm uppercase tracking-[0.25em]">
            {when}
          </motion.p>
        )}

        {invitation.couple_photo && (
          <motion.div variants={item} className="mt-10">
            <div className="rounded-[999px] border border-[rgba(201,162,39,0.55)] p-2 shadow-[0_0_48px_rgba(201,162,39,0.18)]">
              <img
                src={invitation.couple_photo}
                alt={`${invitation.bride_name} and ${invitation.groom_name}`}
                loading="lazy"
                className="h-[min(48svh,22rem)] w-[min(66vw,16rem)] rounded-[999px] object-cover"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      <ChevronDown className="inv3-gold absolute bottom-6 h-6 w-6" style={{ animation: "inv3-bob 2.4s ease-in-out infinite" }} aria-hidden="true" />
    </section>
  );
}
