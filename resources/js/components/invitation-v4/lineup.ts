import { formatTime12 } from "@/components/invitation/animated/types";
import type { CeremonyEventInput } from "../invitation-v2/viewModel";

export interface LineupItem {
  /** 12-hour clock text, e.g. "5:28 PM". */
  time: string;
  title: string;
  /** Long date text; only shown when the lineup spans more than one day. */
  date: string;
  sortKey: string;
}

export const formatLongDate = (date?: string | null): string =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

/**
 * Builds the "Wedding Lineup" from the ceremony events the owner already entered:
 * one step per event start time, plus a Poruwa step when that time is set. Ordered by date, then time.
 */
export function buildLineup(events: CeremonyEventInput[]): LineupItem[] {
  const items: LineupItem[] = [];

  for (const event of events) {
    if (event.start_time) {
      items.push({
        time: formatTime12(event.start_time),
        title: event.label,
        date: formatLongDate(event.date),
        sortKey: `${event.date}T${event.start_time}`,
      });
    }
    if (event.poruwa_time) {
      items.push({
        time: formatTime12(event.poruwa_time),
        title: "Poruwa Ceremony",
        date: formatLongDate(event.date),
        sortKey: `${event.date}T${event.poruwa_time}`,
      });
    }
  }

  return items.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}
