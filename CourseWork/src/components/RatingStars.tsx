export default function RatingStars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, value));
  const full = Math.round(v);

  const stars = Array.from({ length: 5 })
    .map((_, i) => (i < full ? "★" : "☆"))
    .join("");

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="text-brand-yellow leading-none">{stars}</span>
      <span className="text-slate-600">{v.toFixed(1)}</span>
    </span>
  );
}
