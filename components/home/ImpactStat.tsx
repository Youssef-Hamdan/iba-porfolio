export function ImpactStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-iba-muted/35 bg-white p-4 shadow-sm">
      <p className="text-2xl font-bold text-iba-orange md:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-iba-sky/65">{label}</p>
    </div>
  );
}
