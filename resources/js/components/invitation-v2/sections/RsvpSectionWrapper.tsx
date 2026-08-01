import { RsvpSection } from '@/components/invitation/RsvpModal';
import type { GuestInput, InvitationViewModel } from '../viewModel';

interface RsvpSectionWrapperProps {
  invitation: InvitationViewModel;
  guest?: GuestInput | null;
  eventToken?: string;
}

/**
 * Restyled wrapper around the existing, already-wired RsvpSection
 * (POSTs to /invitation/{token}/rsvp and /rsvp-click) so the new design
 * doesn't duplicate that networking logic.
 */
export default function RsvpSectionWrapper({ invitation, guest, eventToken }: RsvpSectionWrapperProps) {
  return (
    <section className="section-pad bg-charcoal" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <RsvpSection
        eventToken={eventToken}
        guest={guest}
        rsvpDeadline={invitation.rsvp_deadline}
        headingFont="font-serif-display"
        bodyFont="font-body"
        ctaClassName="bg-gradient-to-r from-[#C9A96E] to-[#8B3A4A] text-white"
        accentClassName="text-[#8B3A4A]"
        subTextClassName="text-[#E8D5A3]"
        modalClassName="bg-[#1a0a0f] border border-[rgba(201,169,110,0.4)]"
        modalTextClassName="text-[#FAF7F2]"
      />
    </section>
  );
}
