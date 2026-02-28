"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TicketType = {
  id: string;
  name: string;
  price: number;
  quantityTotal: number;
  quantitySold: number;
  isActive: boolean;
};

export default function BuyTicketForm({
  ticketTypes,
  isAuthed,
  loginHref,
}: {
  ticketTypes: TicketType[];
  isAuthed: boolean;
  loginHref: string;
}) {
  const active = ticketTypes.filter((t) => t.isActive);
  const initial = active?.[0]?.id || "";
  const [ticketTypeId, setTicketTypeId] = useState(initial);
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => active.find((t) => t.id === ticketTypeId) || null,
    [active, ticketTypeId]
  );

  async function submit() {
    setMsg(null);
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketTypeId, quantity }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) setMsg(data.error || "Помилка");
    else setMsg(`Замовлення створено. Статус: очікує оплати. Сума: ${(data.total / 100).toFixed(2)} грн`);
  }

  const available = selected ? selected.quantityTotal - selected.quantitySold : 0;

  return (
    <div className="mt-4 space-y-3">
      {!isAuthed ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Щоб оформити замовлення, потрібно увійти.
          <div className="mt-3">
            <Link
              href={loginHref}
              className="inline-block rounded-2xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Увійти
            </Link>
          </div>
        </div>
      ) : active.length === 0 ? (
        <div className="text-slate-600">Квитків поки що немає.</div>
      ) : (
        <>
          <label className="text-xs text-slate-600">Тип квитка</label>
          <select
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
            value={ticketTypeId}
            onChange={(e) => setTicketTypeId(e.target.value)}
          >
            {active.map((t) => {
              const a = t.quantityTotal - t.quantitySold;
              return (
                <option key={t.id} value={t.id}>
                  {t.name} — {(t.price / 100).toFixed(2)} грн (доступно {a})
                </option>
              );
            })}
          </select>

          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-600">Кількість (1–10)</label>
              <input
                type="number"
                min={1}
                max={10}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-slate-700">
                Доступно: <span className="font-semibold text-slate-900">{available}</span>
              </div>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading || !ticketTypeId}
            className="w-full rounded-2xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Оформлення..." : "Оформити замовлення"}
          </button>
        </>
      )}

      {msg && <div className="text-sm text-slate-700">{msg}</div>}
    </div>
  );
}
