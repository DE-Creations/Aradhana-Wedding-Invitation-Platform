/* Date / URL helpers for the invitation-v2 template. */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty'];
const ORDINALS: Record<number, string> = {
  1: 'First', 2: 'Second', 3: 'Third', 5: 'Fifth', 8: 'Eighth', 9: 'Ninth',
  12: 'Twelfth', 20: 'Twentieth', 30: 'Thirtieth',
};

function twoDigitWords(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`;
}

/** Ordinal words for a day of month (1-31): "Fifteenth". */
export function dayOrdinalWords(day: number): string {
  if (ORDINALS[day]) return ORDINALS[day];
  if (day < 20) return `${ONES[day]}th`;
  const t = Math.floor(day / 10);
  const o = day % 10;
  if (o === 0) return TENS[t].replace('y', 'ieth');
  return `${TENS[t]}-${ORDINALS[o] || `${ONES[o]}th`}`;
}

/** Year in words: 2026 -> "Two Thousand and Twenty Six". */
export function yearInWords(year: number): string {
  const thousands = Math.floor(year / 1000);
  const remainder = year % 1000;
  const hundreds = Math.floor(remainder / 100);
  const rest = remainder % 100;

  let out = `${ONES[thousands]} Thousand`;
  if (hundreds > 0) out += ` ${ONES[hundreds]} Hundred`;
  if (rest > 0) out += ` and ${twoDigitWords(rest)}`;
  return out;
}

/** "Saturday, the Fifteenth of August, Two Thousand and Twenty Six" */
export function dateInWords(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  return `${weekday}, the ${dayOrdinalWords(d.getDate())} of ${month}, ${yearInWords(d.getFullYear())}`;
}

/** "Saturday, 15th August 2026" */
export function formatDateShort(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' :
    day % 10 === 2 && day !== 12 ? 'nd' :
    day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  return `${weekday}, ${day}${suffix} ${month} ${d.getFullYear()}`;
}

/** "10:00 AM" from a "HH:mm" or "HH:mm:ss" time string. */
export function formatTime12(t?: string | null): string {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  if (Number.isNaN(h)) return '';
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${mStr} ${ampm}`;
}

function toCalendarStamp(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Build a Google Calendar "add event" URL for the first ceremony event. */
export function googleCalendarUrl(params: {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  groomName: string;
  brideName: string;
  venue?: string | null;
}): string {
  const { date, startTime, endTime, groomName, brideName, venue } = params;
  if (!date) return '#';

  const start = toCalendarStamp(startTime ? `${date}T${startTime}` : date);
  const end = toCalendarStamp(
    endTime ? `${date}T${endTime}` : new Date(new Date(date).getTime() + 3 * 3600 * 1000).toISOString(),
  );

  const searchParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Wedding of ${groomName} & ${brideName}`,
    dates: `${start}/${end}`,
    location: venue || '',
  });
  return `https://calendar.google.com/calendar/render?${searchParams.toString()}`;
}

/** Google Maps URL: prefers an explicit link, falls back to an address search. */
export function mapUrl(googleMapsLink?: string | null, address?: string | null): string {
  if (googleMapsLink) return googleMapsLink;
  if (address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  return '#';
}
