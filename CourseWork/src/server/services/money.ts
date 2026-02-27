export function toCentsFromUahString(v: string) {
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function formatUahFromCents(cents: number) {
  return (cents / 100).toFixed(2);
}
