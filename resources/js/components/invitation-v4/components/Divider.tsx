/** Thin silver-blue rule with a centred dot. */
export function Divider({ symbol = "◆" }: { symbol?: string }) {
  return (
    <div className="inv4-divider" aria-hidden="true">
      <span className="text-[0.6rem]">{symbol}</span>
    </div>
  );
}

export default Divider;
