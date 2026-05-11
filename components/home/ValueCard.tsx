export function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-iba-muted/25 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-6">{icon}</div>
      <h3 className="mb-3 text-xl font-bold text-iba-sky">{title}</h3>
      <p className="text-sm leading-relaxed text-iba-sky/80">{description}</p>
    </div>
  );
}
