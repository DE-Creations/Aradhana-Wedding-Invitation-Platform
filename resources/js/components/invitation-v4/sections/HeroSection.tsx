import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HeroActions } from "@/components/invitation/HeroActions";
import type { CeremonyEventInput, InvitationViewModel } from "../../invitation-v2/viewModel";
import { formatLongDate } from "../lineup";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.16 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Full-screen hero: photo with Ken Burns zoom, names, date, venue and the two quick actions. */
export default function HeroSection({ invitation, showFindTable }: { invitation: InvitationViewModel; showFindTable: boolean }) {
  const first: CeremonyEventInput | undefined = invitation.ceremony_events[0];

  return (
    <section className="inv4-hero">
      {invitation.couple_photo ? (
        <img src={invitation.couple_photo} alt={`${invitation.bride_name} and ${invitation.groom_name}`} className="inv4-hero__photo" />
      ) : (
        <div className="inv4-hero__photo inv4-hero__photo--none" />
      )}
      <div className="inv4-hero__overlay" />

      <motion.div variants={container} initial="hidden" animate="visible" className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <motion.p variants={item} className="font-t-body text-[0.72rem] uppercase tracking-[0.3em] text-white/80">
          Together with their families
        </motion.p>

        <motion.h1 variants={item} className="inv4-hero__names font-t-heading mt-4">
          {invitation.bride_name}
          <span className="inv4-hero__amp">&amp;</span>
          {invitation.groom_name}
        </motion.h1>

        <motion.p variants={item} className="font-t-body mt-4 text-base italic text-white/85">
          are getting married
        </motion.p>

        <motion.div variants={item} className="mt-7 w-full">
          <HeroActions
            showFindTable={showFindTable}
            fontClassName="font-t-body"
            primaryClassName="bg-white text-[#1c2a44] shadow-lg shadow-black/25"
            secondaryClassName="border border-white/60 bg-white/10 text-white backdrop-blur-sm"
          />
        </motion.div>

        {first?.date && (
          <motion.div variants={item} className="font-t-body mt-8 text-white">
            <p className="text-[0.66rem] uppercase tracking-[0.3em] text-white/70">Join us on</p>
            <p className="font-t-heading mt-1 text-2xl">{formatLongDate(first.date)}</p>
            {first.venue && <p className="mt-2 text-sm text-white/80">{first.venue}</p>}
          </motion.div>
        )}
      </motion.div>

      <ChevronDown className="absolute bottom-6 z-10 h-6 w-6 text-white/80" style={{ animation: "inv4-bob 2.4s ease-in-out infinite" }} aria-hidden="true" />
    </section>
  );
}
