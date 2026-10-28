/** Pearl orbs with small leaves; the same set decorates the cover card and sits behind the page. */
const ORBS = [
  { top: "6%", left: "6%", size: 56, delay: 0 },
  { top: "10%", right: "7%", size: 40, delay: 1.5 },
  { bottom: "9%", left: "8%", size: 46, delay: 3 },
  { bottom: "12%", right: "6%", size: 60, delay: 0.8 },
] as const;

const LEAVES = [
  { top: "5%", left: "17%", rotate: 20, delay: 0.4 },
  { top: "17%", right: "16%", rotate: -30, delay: 1.2 },
  { bottom: "19%", left: "19%", rotate: 160, delay: 2.2 },
  { bottom: "8%", right: "18%", rotate: 200, delay: 1.7 },
] as const;

/** `fixed` keeps the ornaments on screen behind the whole page; otherwise they fill their container (the cover card). */
export function PearlDecor({ fixed = false }: { fixed?: boolean }) {
  return (
    <div className="inv4-backdrop" aria-hidden="true" style={{ position: fixed ? "fixed" : "absolute" }}>
      {ORBS.map(({ size, delay, ...position }, i) => (
        <span key={`o${i}`} className="inv4-orb" style={{ ...position, width: size, height: size, animationDelay: `${delay}s` }} />
      ))}
      {LEAVES.map(({ rotate, delay, ...position }, i) => (
        <span
          key={`l${i}`}
          className="inv4-leaf"
          style={{ ...position, ["--r" as string]: `${rotate}deg`, animationDelay: `${delay}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default PearlDecor;
