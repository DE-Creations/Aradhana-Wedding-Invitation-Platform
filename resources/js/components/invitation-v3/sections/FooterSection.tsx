import { Reveal } from "@/components/invitation/Reveal";
import { Ornament } from "../components/Ornament";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

export default function FooterSection({ invitation }: { invitation: InvitationViewModel }) {
  const year = new Date().getFullYear();

  return (
    <footer className="inv3-section inv3-section--alt" style={{ paddingBottom: "clamp(3.5rem, 10vw, 6rem)" }}>
      <Reveal animation="fadeIn" className="inv3-inner">
        <h2 className="inv3-shimmer font-t-heading text-5xl leading-tight">Thank You</h2>
        <p className="inv3-text-soft font-t-body mt-3">With love and gratitude</p>
        <p className="inv3-text font-t-heading mt-3 text-2xl">
          {invitation.bride_name} &amp; {invitation.groom_name}
        </p>
        <Ornament />
        <p className="inv3-text-soft font-t-body text-xs">&copy; {year} Aradhana. All rights reserved.</p>
        <p className="inv3-text-soft font-t-body mt-1 text-xs">
          Designed &amp; developed by{" "}
          <a href="https://www.decreations.lk" target="_blank" rel="noopener noreferrer" className="inv3-gold underline underline-offset-2">
            DE Creations
          </a>
        </p>
      </Reveal>
    </footer>
  );
}
