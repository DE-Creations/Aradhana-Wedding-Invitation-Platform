/*
  Reusable ornamental SVGs — elegant gold scrollwork used as dividers and
  accents between sections. Kept inline for performance & crisp scaling.
*/

const gold = '#C9A96E'

/** Small centered flourish accent. */
export function Flourish({ width = 120, className = '' }) {
  return (
    <svg
      className={className}
      width={width}
      height={width * 0.25}
      viewBox="0 0 200 50"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 25 C 40 25, 55 10, 70 25 C 85 40, 100 40, 100 25"
        stroke={gold}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M190 25 C 160 25, 145 10, 130 25 C 115 40, 100 40, 100 25"
        stroke={gold}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="100" cy="25" r="3.5" fill={gold} />
      <circle cx="100" cy="14" r="1.6" fill={gold} />
      <circle cx="100" cy="36" r="1.6" fill={gold} />
    </svg>
  )
}

/** Full ornamental divider with a diamond center motif. */
export function OrnamentalDivider({ width = 280, className = '' }) {
  return (
    <div
      className={className}
      style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}
    >
      <svg
        width={width}
        height={width * 0.14}
        viewBox="0 0 300 42"
        fill="none"
        aria-hidden="true"
      >
        <line x1="20" y1="21" x2="120" y2="21" stroke={gold} strokeWidth="1" opacity="0.6" />
        <line x1="180" y1="21" x2="280" y2="21" stroke={gold} strokeWidth="1" opacity="0.6" />
        <path
          d="M120 21 C 132 8, 132 34, 150 21 C 168 8, 168 34, 180 21"
          stroke={gold}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path d="M150 12 l6 9 l-6 9 l-6 -9 z" stroke={gold} strokeWidth="1.2" fill="none" />
        <circle cx="150" cy="21" r="2" fill={gold} />
        <circle cx="118" cy="21" r="2" fill={gold} />
        <circle cx="182" cy="21" r="2" fill={gold} />
      </svg>
    </div>
  )
}

/** Vertical scroll flourish (used near hero). */
export function VerticalFlourish({ height = 60, className = '' }) {
  return (
    <svg
      className={className}
      width={height * 0.5}
      height={height}
      viewBox="0 0 30 60"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 2 C 15 15, 5 18, 15 30 C 25 42, 15 45, 15 58"
        stroke={gold}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="15" cy="30" r="2.5" fill={gold} />
    </svg>
  )
}
