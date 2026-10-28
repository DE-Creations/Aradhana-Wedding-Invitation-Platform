import { Phone } from "lucide-react";
import { Reveal } from "@/components/invitation/Reveal";
import { Ornament } from "../components/Ornament";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

function ContactCard({ name, role, phone }: { name: string; role: string; phone: string }) {
  return (
    <div className="inv3-card flex-1 basis-60 p-6">
      <p className="inv3-text font-t-heading text-xl">{name}</p>
      <p className="inv3-eyebrow font-t-body mt-1">{role}</p>
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        className="inv3-text-soft font-t-body mt-4 inline-flex items-center gap-2 text-base"
      >
        <Phone size={15} className="inv3-gold" /> {phone}
      </a>
    </div>
  );
}

export default function ContactSection({ invitation }: { invitation: InvitationViewModel }) {
  if (!invitation.contact_number_1 && !invitation.contact_number_2) return null;

  return (
    <section className="inv3-section">
      <Reveal animation="fadeUp" className="inv3-inner">
        <p className="inv3-eyebrow font-t-body">Questions?</p>
        <h2 className="inv3-title font-t-heading">Get in Touch</h2>
        <Ornament />
        <div className="mt-6 flex flex-wrap justify-center gap-5">
          {invitation.contact_number_1 && <ContactCard name={invitation.groom_name} role="The Groom" phone={invitation.contact_number_1} />}
          {invitation.contact_number_2 && <ContactCard name={invitation.bride_name} role="The Bride" phone={invitation.contact_number_2} />}
        </div>
      </Reveal>
    </section>
  );
}
