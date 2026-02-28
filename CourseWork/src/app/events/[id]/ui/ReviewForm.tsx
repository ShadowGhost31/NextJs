"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReviewForm({
  eventId,
  isAuthed,
  canReview,
  reason,
  loginHref,
}: {
  eventId: string;
  isAuthed: boolean;
  canReview: boolean;
  reason: string | null;
  loginHref: string;
}) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg(null);
    setLoading(true);

    const res = await fetch(`/api/events/${eventId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, text }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) setMsg(data.error || "Помилка");
    else setMsg("Відгук надіслано та очікує модерації.");
  }

  if (!isAuthed) {
    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        Щоб залишити відгук, потрібно увійти.
        <div className="mt-3">
          <Link
            href={loginHref}
            className="inline-block rounded-2xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Увійти
          </Link>
        </div>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        {reason || "Ви не можете залишити відгук."}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <label className="text-xs text-slate-600">Оцінка</label>
      <select
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <label className="text-xs text-slate-600">Текст</label>
      <textarea
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ваш відгук..."
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded-2xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Надсилання..." : "Надіслати"}
      </button>

      {msg && <div className="text-sm text-slate-700">{msg}</div>}
    </div>
  );
}
