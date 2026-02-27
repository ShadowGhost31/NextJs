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

    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (!res.ok) setIsFav(prev);

    setLoading(false);
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
      className={`${cls} border border-white/10 bg-white/5 hover:bg-white/10 transition disabled:opacity-60`}
      title={isFav ? "Забрати з обраного" : "Додати в обране"}
    >
      {isFav ? "★ В обраному" : "☆ В обране"}
    </button>
  );
}
