import { ArrowUp, Armchair, Heart } from "lucide-react";
import { scrollToSection, scrollToTop } from "./hooks/useSmoothScroll";

interface FooterQuickLinksProps {
  /** Shows the Table link (only when the client has Table Management). */
  showTable: boolean;
  /** Colour, border and background classes for each pill (supplied by the template). */
  buttonClassName: string;
  /** Font utility applied to every pill. */
  fontClassName?: string;
  className?: string;
}

/**
 * Quick links at the end of an invitation: RSVP and Table scroll to their sections,
 * Back to top returns to the cover. Shared by every template so they behave the same.
 */
export function FooterQuickLinks({ showTable, buttonClassName, fontClassName = "", className = "" }: FooterQuickLinksProps) {
  const pill =
    "inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 " +
    "text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-80";
  const cls = `${pill} ${fontClassName} ${buttonClassName}`;

  return (
    <nav aria-label="Quick links" className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      <button type="button" className={cls} onClick={() => scrollToSection("rsvp")}>
        <Heart size={14} /> RSVP
      </button>
      {showTable && (
        <button type="button" className={cls} onClick={() => scrollToSection("your-table")}>
          <Armchair size={14} /> Table
        </button>
      )}
      <button type="button" className={cls} onClick={scrollToTop}>
        <ArrowUp size={14} /> Back to top
      </button>
    </nav>
  );
}

export default FooterQuickLinks;
