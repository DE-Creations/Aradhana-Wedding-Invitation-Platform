import { Reveal } from "@/components/invitation/Reveal";
import { Divider } from "../components/Divider";
import { buildLineup } from "../lineup";
import type { CeremonyEventInput } from "../../invitation-v2/viewModel";

/** "The Wedding Lineup": numbered timeline built from the ceremony events and their times. */
export default function LineupSection({ events }: { events: CeremonyEventInput[] }) {
  const items = buildLineup(events);
  if (items.length === 0) return null;

  const multiDay = new Set(items.map((i) => i.date)).size > 1;

  return (
    <section className="inv4-section">
      <Reveal animation="fadeUp" className="inv4-inner">
        <p className="inv4-eyebrow font-t-body">Our celebration</p>
        <h2 className="inv4-title font-t-heading">The Wedding Lineup</h2>
        <Divider />
        <ol className="inv4-timeline">
          {items.map((item, i) => (
            <li key={`${item.sortKey}-${i}`} className="inv4-step">
              <span className="inv4-step__num font-t-body">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 pt-0.5">
                <p className="font-t-heading text-2xl leading-tight inv4-text">{item.time}</p>
                <p className="font-t-body inv4-text-soft mt-0.5 text-sm">{item.title}</p>
                {multiDay && <p className="font-t-body inv4-accent mt-0.5 text-xs">{item.date}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
