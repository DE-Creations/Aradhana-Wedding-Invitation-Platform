import { Phone } from "lucide-react";
import { Reveal } from "@/components/invitation/Reveal";
import { Divider } from "../components/Divider";
import type { InvitationViewModel } from "../../invitation-v2/viewModel";

function ContactCard({ name, role, phone }: { name: string; role: string; phone: string }) {
  return (
    <div className="inv4-glass flex-1 basis-56 p-5">
      <p className="font-t-heading inv4-text text-xl">{name}</p>
      <p className="inv4-eyebrow font-t-body mt-1">{role}</p>
      <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-t-body inv4-text mt-3 inline-flex min-h-11 items-center gap-2 text-base">
        <Phone size={15} className="inv4-accent" /> {phone}
      </a>
    </div>
  );
}

export default function ContactSection({ invitation }: { invitation: InvitationViewModel }) {
  if (!invitation.contact_number_1 && !invitation.contact_number_2) return null;

  return (
    <section className="inv4-section">
      <Reveal animation="fadeUp" className="inv4-inner">
        <p className="inv4-eyebrow font-t-body">Questions?</p>
        <h2 className="inv4-title font-t-heading">Get in Touch</h2>
        <Divider />
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          {invitation.contact_number_1 && <ContactCard name={invitation.groom_name} role="The Groom" phone={invitation.contact_number_1} />}
          {invitation.contact_number_2 && <ContactCard name={invitation.bride_name} role="The Bride" phone={invitation.contact_number_2} />}
        </div>
      </Reveal>
    </section>
  );
}
