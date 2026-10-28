import { Reveal } from "@/components/invitation/Reveal";
import { Divider } from "../components/Divider";

/** Personal greeting for the guest opening their own link. */
export default function GreetingSection({ guestName }: { guestName?: string | null }) {
  return (
    <section className="inv4-section">
      <Reveal animation="blurIn" className="inv4-inner">
        <p className="inv4-eyebrow font-t-body">Dear</p>
        <h2 className="inv4-title font-t-heading">{guestName || "Beloved Guest"}</h2>
        <Divider />
        <p className="inv4-text-soft font-t-body mx-auto max-w-md text-base leading-relaxed">
          We would be honoured to have you with us as we begin this beautiful new chapter together.
        </p>
      </Reveal>
    </section>
  );
}
