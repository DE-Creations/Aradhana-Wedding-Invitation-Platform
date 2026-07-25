/* Date / URL helpers for the wedding template. */

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
]
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty']
const ORDINALS = {
  1: 'First', 2: 'Second', 3: 'Third', 5: 'Fifth', 8: 'Eighth', 9: 'Ninth',
  12: 'Twelfth', 20: 'Twentieth', 30: 'Thirtieth',
}

function twoDigitWords(n) {
  if (n < 20) return ONES[n]
  const t = Math.floor(n / 10)
  const o = n % 10
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`
}

/** Ordinal words for a day of month (1–31): "Fifteenth". */
export function dayOrdinalWords(day) {
  if (ORDINALS[day]) return ORDINALS[day]
  if (day < 20) return `${ONES[day]}th`
  const t = Math.floor(day / 10)
  const o = day % 10
  if (o === 0) return TENS[t].replace('y', 'ieth')
  return `${TENS[t]}-${ORDINALS[o] || `${ONES[o]}th`}`
}

/** Year in words: 2026 → "Two Thousand and Twenty Six". */
export function yearInWords(year) {
  const thousands = Math.floor(year / 1000)
  const remainder = year % 1000
  const hundreds = Math.floor(remainder / 100)
  const rest = remainder % 100

  let out = `${ONES[thousands]} Thousand`
  if (hundreds > 0) out += ` ${ONES[hundreds]} Hundred`
  if (rest > 0) out += ` and ${twoDigitWords(rest)}`
  return out
}

/** "Saturday, the Fifteenth of August, Two Thousand and Twenty Six" */
export function dateInWords(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  return `${weekday}, the ${dayOrdinalWords(d.getDate())} of ${month}, ${yearInWords(d.getFullYear())}`
}

/** "Saturday, 15th August 2026" */
export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  const day = d.getDate()
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  return `${weekday}, ${day}${suffix} ${month} ${d.getFullYear()}`
}

/** "10:00 AM" */
export function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function toCalendarStamp(dateStr) {
  const d = new Date(dateStr)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Build a Google Calendar "add event" URL. */
export function googleCalendarUrl(invitation) {
  if (!invitation?.ceremony_date) return '#'
  const start = toCalendarStamp(invitation.ceremony_date)
  const endSource =
    invitation.reception_time ||
    new Date(new Date(invitation.ceremony_date).getTime() + 3 * 3600 * 1000)
  const end = toCalendarStamp(endSource)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Wedding of ${invitation.groom_name} & ${invitation.bride_name}`,
    dates: `${start}/${end}`,
    details: invitation.message || '',
    location: `${invitation.ceremony_venue || ''}, ${invitation.ceremony_address || ''}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Google Maps search URL from coords (fallback to address). */
export function mapUrl(lat, lng, address) {
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }
  return '#'
}
