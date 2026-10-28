/** Thin gold rule with a centred star, used between a heading and its content. */
export function Ornament({ symbol = "✦" }: { symbol?: string }) {
  return (
    <div className="inv3-ornament" aria-hidden="true">
      <span>{symbol}</span>
    </div>
  );
}

export default Ornament;
