import { Reveal } from "@/components/invitation/Reveal";
import { RsvpSection } from "@/components/invitation/RsvpModal";
import type { GuestInput, InvitationViewModel } from "../../invitation-v2/viewModel";

interface RsvpBlockProps {
  invitation: InvitationViewModel;
  guest?: GuestInput | null;
  eventToken?: string;
}

/**
 * Wraps the shared RsvpSection (unchanged: its Respond Now button still opens the
 * popup). The id is the target the hero Respond Now button scrolls to.
 */
export default function RsvpBlock({ invitation, guest, eventToken }: RsvpBlockProps) {
  return (
    <section id="rsvp" className="inv3-section inv3-section--alt">
      <Reveal animation="scaleIn" className="inv3-inner">
        <RsvpSection
          eventToken={eventToken}
          guest={guest}
          rsvpDeadline={invitation.rsvp_deadline}
          headingFont="font-t-heading text-[#F5E6C8]"
          bodyFont="font-t-body"
          ctaClassName="bg-gradient-to-r from-[#C9A227] to-[#8C1D2F] text-white"
          accentClassName="text-[#C9A227]"
          subTextClassName="text-[#F8E6A6]/80"
          modalClassName="bg-[#2A060C] border border-[rgba(201,162,39,0.4)]"
          modalTextClassName="text-[#F5E6C8]"
        />
      </Reveal>
    </section>
  );
}
