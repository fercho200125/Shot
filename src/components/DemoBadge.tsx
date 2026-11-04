export function DemoBadge({ label = "DEMO", className = "" }: { label?: string; className?: string }) {
  return (
    <span
      title="Dato de demostración: no es información comercial real"
      className={`inline-flex items-center rounded-full border border-amber-300/70 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-700 ${className}`}
    >
      {label}
    </span>
  );
}
