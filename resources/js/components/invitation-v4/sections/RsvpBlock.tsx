import { Reveal } from "@/components/invitation/Reveal";
import { RsvpSection } from "@/components/invitation/RsvpModal";
import type { GuestInput, InvitationViewModel } from "../../invitation-v2/viewModel";

interface RsvpBlockProps {
  invitation: InvitationViewModel;
  guest?: GuestInput | null;
  eventToken?: string;
}

/**
 * Wraps the shared RsvpSection (unchanged: its Respond Now button still opens the popup).
 * The id is the target the hero Respond Now button and the footer quick link scroll to.
 */
export default function RsvpBlock({ invitation, guest, eventToken }: RsvpBlockProps) {
  return (
    <section id="rsvp" className="inv4-section">
      <Reveal animation="scaleIn" className="inv4-inner">
        <div className="inv4-glass px-5 py-9">
          <RsvpSection
            eventToken={eventToken}
            guest={guest}
            rsvpDeadline={invitation.rsvp_deadline}
            headingFont="font-t-heading text-[#1c2a44]"
            bodyFont="font-t-body"
            ctaClassName="bg-[#1c2a44] text-white"
            accentClassName="text-[#5b7aa6]"
            subTextClassName="text-[#5f6f8c]"
            modalClassName="bg-white border border-[#c9d3e3]"
            modalTextClassName="text-[#1c2a44]"
          />
        </div>
      </Reveal>
    </section>
  );
}
