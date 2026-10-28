import { Armchair, Heart } from "lucide-react";
import { scrollToSection } from "./hooks/useSmoothScroll";

interface HeroActionsProps {
  /** Shows the Find Table button (only when the client has Table Management). */
  showFindTable: boolean;
  /** Classes for the filled Respond Now button (colours / border / shadow). */
  primaryClassName: string;
  /** Classes for the outlined Find Table button. */
  secondaryClassName: string;
  /** Font utility applied to both buttons. */
  fontClassName?: string;
  className?: string;
}

/**
 * Two quick actions shown right under the couple names, always on one row.
 * Respond Now scrolls the guest down to the "Will You Attend?" section (the
 * existing Respond Now button there is unchanged); Find Table scrolls to the
 * "Your Table" section. Sizes are fluid so both stay on one line down to 320px.
 */
export function HeroActions({
  showFindTable,
  primaryClassName,
  secondaryClassName,
  fontClassName = "",
  className = "",
}: HeroActionsProps) {
  const base =
    "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-2.5 " +
    "text-[clamp(0.6rem,2.9vw,0.8rem)] font-medium uppercase tracking-[0.08em] transition-opacity hover:opacity-90";

  return (
    <div className={`mx-auto flex w-full max-w-sm flex-row flex-nowrap items-stretch justify-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => scrollToSection("rsvp")}
        className={`${base} ${fontClassName} ${primaryClassName}`}
      >
        <Heart className="h-3.5 w-3.5 shrink-0 fill-current max-[339px]:hidden" />
        <span>Respond Now</span>
      </button>
      {showFindTable && (
        <button
          type="button"
          onClick={() => scrollToSection("your-table")}
          className={`${base} ${fontClassName} ${secondaryClassName}`}
        >
          <Armchair className="h-3.5 w-3.5 shrink-0 max-[339px]:hidden" />
          <span>Find Table</span>
        </button>
      )}
    </div>
  );
}

export default HeroActions;
