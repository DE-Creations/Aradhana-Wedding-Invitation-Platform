import { Reveal } from "@/components/invitation/Reveal";
import { FooterQuickLinks } from "@/components/invitation/FooterQuickLinks";
import { Divider } from "../components/Divider";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

interface FooterSectionProps {
  invitation: InvitationViewModel;
  showTableLink: boolean;
}

/** Closing block with quick links (RSVP, Table, Back to top). */
export default function FooterSection({ invitation, showTableLink }: FooterSectionProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="inv4-section" style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}>
      <Reveal animation="fadeIn" className="inv4-inner">
        <h2 className="inv4-title font-t-heading text-5xl">Thank You</h2>
        <p className="inv4-text-soft font-t-body mt-3">With love and gratitude</p>
        <p className="font-t-heading inv4-text mt-3 text-2xl">
          {invitation.bride_name} &amp; {invitation.groom_name}
        </p>
        <Divider />
        <FooterQuickLinks
          showTable={showTableLink}
          fontClassName="font-t-body"
          buttonClassName="border border-[#c9d3e3] bg-white/70 text-[#1c2a44] shadow-[0_4px_12px_rgba(60,80,120,0.12)]"
        />
        <p className="inv4-text-soft font-t-body mt-8 text-xs">&copy; {year} Aradhana. All rights reserved.</p>
        <p className="inv4-text-soft font-t-body mt-1 text-xs">
          Designed &amp; developed by{" "}
          <a href="https://www.decreations.lk" target="_blank" rel="noopener noreferrer" className="inv4-accent underline underline-offset-2">
            DE Creations
          </a>
        </p>
      </Reveal>
    </footer>
  );
}
