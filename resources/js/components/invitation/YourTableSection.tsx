import { Armchair } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { TableInfo } from "./animated/types";

interface YourTableSectionProps {
  tableInfo?: TableInfo | null;
  sectionClassName?: string;
  sectionStyle?: CSSProperties;
  eyebrowClassName?: string;
  /** Font utility for the heading and the table label. */
  headingFontClassName?: string;
  /** Colour utility for the heading. */
  headingToneClassName?: string;
  cardClassName?: string;
  textClassName?: string;
  subTextClassName?: string;
  accentClassName?: string;
}

const formatEventDate = (date?: string | null) =>
  date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

/**
 * "Your Table" block shown just below Ceremony Details. Renders only when the
 * client has Table Management. The server decides what is revealed: the table
 * label is not sent to the page before the event date.
 */
export function YourTableSection({
  tableInfo,
  sectionClassName = "",
  sectionStyle,
  eyebrowClassName = "",
  headingFontClassName = "",
  headingToneClassName = "",
  cardClassName = "",
  textClassName = "",
  subTextClassName = "",
  accentClassName = "",
}: YourTableSectionProps) {
  if (!tableInfo?.enabled) return null;

  const eventDate = formatEventDate(tableInfo.event_date);

  let body: ReactNode;
  switch (tableInfo.state) {
    case "assigned":
      body = (
        <>
          <p className={`text-xs uppercase tracking-[0.3em] ${subTextClassName}`}>Table No.</p>
          <p className={`mt-2 break-words text-5xl leading-tight ${headingFontClassName} ${accentClassName}`}>{tableInfo.table_name}</p>
          <p className={`mt-3 text-sm ${subTextClassName}`}>Welcome! We look forward to celebrating with you.</p>
        </>
      );
      break;
    case "unassigned":
      body = (
        <p className={`text-lg ${textClassName}`}>Please contact the event planner.</p>
      );
      break;
    case "before_event":
      body = (
        <>
          <p className={`text-lg ${textClassName}`}>Please check on the event date.</p>
          {eventDate && <p className={`mt-2 text-sm ${subTextClassName}`}>{eventDate}</p>}
        </>
      );
      break;
    default:
      body = <p className={`text-base ${textClassName}`}>Open your personal invitation link to see your table.</p>;
  }

  return (
    <section id="your-table" className={`scroll-mt-6 ${sectionClassName}`} style={sectionStyle}>
      <div className="mx-auto w-full max-w-xl text-center">
        <p className={`text-xs uppercase tracking-[0.32em] ${eyebrowClassName}`}>Seating</p>
        <h2 className={`mt-2 text-3xl md:text-4xl ${headingFontClassName} ${headingToneClassName}`}>Your Table</h2>
        <div className={`mt-8 rounded-2xl p-8 ${cardClassName}`}>
          <Armchair className={`mx-auto mb-4 h-7 w-7 ${accentClassName}`} />
          {body}
        </div>
      </div>
    </section>
  );
}

export default YourTableSection;
