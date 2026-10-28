import { useMemo } from "react";

/** Deterministic pseudo-random so the specks sit in the same place on every render. */
const seeded = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/**
 * Fixed ambience behind every section: glowing orbs, a faint dotted grid,
 * thin outline rings and twinkling gold specks.
 */
export function Backdrop() {
  const specks = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: seeded(i + 1) * 100,
        top: seeded(i + 101) * 100,
        delay: seeded(i + 201) * 4,
        duration: 3 + seeded(i + 301) * 3,
      })),
    [],
  );

  return (
    <div className="inv3-backdrop" aria-hidden="true">
      <div
        className="inv3-orb"
        style={{ top: "-12rem", left: "50%", width: "32rem", height: "32rem", transform: "translateX(-50%)", background: "rgba(201,162,39,0.10)" }}
      />
      <div
        className="inv3-orb"
        style={{ bottom: "-10rem", left: "50%", width: "36rem", height: "24rem", transform: "translateX(-50%)", background: "rgba(245,230,200,0.07)" }}
      />
      <div className="inv3-grid" />
      <div className="inv3-ring" style={{ top: "-6rem", right: "-6rem", width: "18rem", height: "18rem" }} />
      <div className="inv3-ring" style={{ bottom: "-7rem", left: "-7rem", width: "24rem", height: "24rem" }} />
      {specks.map((s, i) => (
        <span key={i} className="inv3-speck" style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s` }} />
      ))}
      <div style={{ position: "absolute", inset: "0 0 auto 0", height: "10rem", background: "linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)" }} />
      <div style={{ position: "absolute", inset: "auto 0 0 0", height: "10rem", background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }} />
    </div>
  );
}

export default Backdrop;
