/*
  Reusable ornamental SVGs — elegant gold scrollwork used as dividers and
  accents between sections. Kept inline for performance & crisp scaling.
*/

const gold = '#C9A96E';

interface FlourishProps {
  width?: number;
  className?: string;
}

/** Small centered flourish accent. */
export function Flourish({ width = 120, className = '' }: FlourishProps) {
  return (
    <svg className={className} width={width} height={width * 0.25} viewBox="0 0 200 50" fill="none" aria-hidden="true">
      <path d="M10 25 C 40 25, 55 10, 70 25 C 85 40, 100 40, 100 25" stroke={gold} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M190 25 C 160 25, 145 10, 130 25 C 115 40, 100 40, 100 25" stroke={gold} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="100" cy="25" r="3.5" fill={gold} />
      <circle cx="100" cy="14" r="1.6" fill={gold} />
      <circle cx="100" cy="36" r="1.6" fill={gold} />
    </svg>
  );
}

interface OrnamentalDividerProps {
  width?: number;
  className?: string;
}

/**
 * Full ornamental divider with a diamond center motif. The dip is a single
 * mirror-symmetric curve about the horizontal center (x=150) rather than an
 * S-wave, so it reads as a clean, balanced flourish at any size.
 */
export function OrnamentalDivider({ width = 280, className = '' }: OrnamentalDividerProps) {
  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
      <svg width={width} height={width * 0.15} viewBox="0 0 300 46" fill="none" aria-hidden="true">
        <line x1="20" y1="18" x2="116" y2="18" stroke={gold} strokeWidth="1" opacity="0.6" />
        <line x1="184" y1="18" x2="280" y2="18" stroke={gold} strokeWidth="1" opacity="0.6" />
        <path
          d="M116 18 C 130 18, 136 32, 150 32 C 164 32, 170 18, 184 18"
          stroke={gold}
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="116" cy="18" r="1.8" fill={gold} />
        <circle cx="184" cy="18" r="1.8" fill={gold} />
        <path d="M150 26 L155.5 32 L150 38 L144.5 32 Z" stroke={gold} strokeWidth="1.2" fill="none" />
        <circle cx="150" cy="32" r="1.6" fill={gold} />
      </svg>
    </div>
  );
}
