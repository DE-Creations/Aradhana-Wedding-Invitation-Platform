import { Reveal } from "@/components/invitation/Reveal";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

/** Invitation wording with both sets of parents (stored as one line per side). */
export default function FamilySection({ invitation }: { invitation: InvitationViewModel }) {
  const { bride_parents_names: bride, groom_parents_names: groom } = invitation;
  if (!bride && !groom) return null;

  return (
    <section className="inv4-section pt-0">
      <Reveal animation="fadeUp" className="inv4-inner">
        <div className="inv4-glass px-6 py-9">
          <p className="inv4-eyebrow font-t-body">With love</p>
          <div className="font-t-body mt-4 space-y-2 text-[clamp(1rem,4.2vw,1.2rem)] font-semibold uppercase leading-snug tracking-[0.06em] inv4-text">
            {bride && <p className="break-words">{bride}</p>}
            {bride && groom && <p className="inv4-accent text-base">&amp;</p>}
            {groom && <p className="break-words">{groom}</p>}
          </div>
          <p className="inv4-text-soft font-t-body mx-auto mt-5 max-w-sm text-sm leading-relaxed">
            request the honour of your presence to celebrate the marriage of their loving children
          </p>
        </div>
      </Reveal>
    </section>
  );
}
