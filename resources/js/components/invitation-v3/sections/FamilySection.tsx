import { Reveal } from "@/components/invitation/Reveal";
import { Ornament } from "../components/Ornament";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

function Column({ label, names }: { label: string; names: string }) {
  return (
    <div className="inv3-card flex-1 basis-64 p-6">
      <p className="inv3-eyebrow font-t-body">{label}</p>
      <p className="inv3-text font-t-heading mt-3 text-xl leading-snug">{names || "—"}</p>
    </div>
  );
}

/** Parents of the bride and groom, one combined line per side (as stored). */
export default function FamilySection({ invitation }: { invitation: InvitationViewModel }) {
  if (!invitation.bride_parents_names && !invitation.groom_parents_names) return null;

  return (
    <section className="inv3-section inv3-section--alt">
      <Reveal animation="fadeUp" className="inv3-inner">
        <p className="inv3-eyebrow font-t-body">With the blessings of</p>
        <h2 className="inv3-title font-t-heading">Our Families</h2>
        <Ornament />
        <div className="mt-6 flex flex-wrap justify-center gap-5">
          <Column label="Family of the Bride" names={invitation.bride_parents_names} />
          <Column label="Family of the Groom" names={invitation.groom_parents_names} />
        </div>
      </Reveal>
    </section>
  );
}
