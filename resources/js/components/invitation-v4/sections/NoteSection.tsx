import { Reveal } from "@/components/invitation/Reveal";
import { Divider } from "../components/Divider";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

/** A warm default message to guests (no owner-editable text yet), signed with the couple's names. */
export default function NoteSection({ invitation }: { invitation: InvitationViewModel }) {
  return (
    <section className="inv4-section">
      <Reveal animation="fadeUp" className="inv4-inner">
        <p className="inv4-eyebrow font-t-body">A special note</p>
        <h2 className="inv4-title font-t-heading">To Our Lovely Guests</h2>
        <Divider />
        <div className="inv4-text-soft font-t-body mx-auto max-w-md space-y-4 text-base leading-relaxed">
          <p>
            With hearts full of love and gratitude, we are so happy to share this beautiful chapter of our lives with you.
            Your presence means more to us than words can express.
          </p>
          <p>Thank you for your love, your blessings and for being part of our journey. We cannot wait to celebrate together.</p>
        </div>
        <p className="font-t-heading inv4-text mt-6 text-2xl">
          {invitation.bride_name} &amp; {invitation.groom_name}
        </p>
      </Reveal>
    </section>
  );
}
