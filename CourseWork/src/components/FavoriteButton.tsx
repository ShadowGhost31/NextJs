"use client";

import { useState } from "react";

export default function FavoriteButton({
  eventId,
  initial,
  size = "md",
}: {
  eventId: string;
  initial: boolean;
  size?: "sm" | "md";
}) {
  const [isFav, setIsFav] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const prev = isFav;
    setIsFav(!prev);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!res.ok) setIsFav(prev);
    } catch {
      setIsFav(prev);
    } finally {
      setLoading(false);
    }
  }

  const cls =
    size === "sm"
      ? "rounded-xl px-2.5 py-1.5 text-xs"
      : "rounded-xl px-3 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`${cls} border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-60`}
      title={isFav ? "Забрати з обраного" : "Додати в обране"}
    >
      {isFav ? "★ В обраному" : "☆ В обране"}
    </button>
  );
}
