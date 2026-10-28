import { Reveal } from "@/components/invitation/Reveal";
import { Ornament } from "../components/Ornament";

/** Personal greeting for the guest opening their own link. */
export default function GreetingSection({ guestName }: { guestName?: string | null }) {
  return (
    <section className="inv3-section">
      <Reveal animation="blurIn" className="inv3-inner">
        <p className="inv3-eyebrow font-t-body">Dear</p>
        <h2 className="inv3-title font-t-heading">{guestName || "Beloved Guest"}</h2>
        <Ornament />
        <p className="inv3-text-soft font-t-body mx-auto max-w-lg text-base leading-relaxed">
          Together with their families, we joyfully invite you to share in the blessing of our wedding celebration.
        </p>
      </Reveal>
    </section>
  );
}
