"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function keyOfDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function monthLabel(d: Date) {
  return d.toLocaleString("uk-UA", { month: "long", year: "numeric" });
}

function buildGrid(d: Date) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const startDow = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startDow);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const x = new Date(gridStart);
    x.setDate(gridStart.getDate() + i);
    days.push(x);
  }
  return days;
}

export default function CalendarWidget({
  year,
  month,
  counts,
}: {
  year: number;
  month: number;
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const date = useMemo(() => new Date(year, month, 1), [year, month]);
  const days = useMemo(() => buildGrid(date), [date]);

  function setDayFilter(day: Date) {
    const from = keyOfDate(day);
    const to = keyOfDate(day);
    const params = new URLSearchParams(sp.toString());
    params.set("dateFrom", from);
    params.set("dateTo", to);
    params.set("page", "1");
    router.push(`/?${params.toString()}#events`);
  }

  function shiftMonth(delta: number) {
    const d2 = new Date(year, month + delta, 1);
    const params = new URLSearchParams(sp.toString());
    params.set("cal", `${d2.getFullYear()}-${pad2(d2.getMonth() + 1)}`);
    router.push(`/?${params.toString()}#calendar`);
  }

  const title = monthLabel(date);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-lg font-semibold">{title}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-slate-400">
        {['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map((x) => (
          <div key={x} className="text-center">{x}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const inMonth = d.getMonth() === month;
          const k = keyOfDate(d);
          const c = counts[k] || 0;

          return (
            <button
              type="button"
              key={k}
              onClick={() => setDayFilter(d)}
              disabled={!inMonth}
              className={`rounded-2xl border border-white/10 px-2 py-2 text-left transition ${
                inMonth ? "bg-white/5 hover:bg-white/10" : "bg-white/0 opacity-40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-sm font-semibold">{d.getDate()}</div>
                {c > 0 && (
                  <span className="rounded-full bg-brand-blue/90 px-2 py-0.5 text-[11px] font-semibold text-slate-950">
                    {c}
                  </span>
                )}
              </div>
              <div className="mt-1 h-1 rounded-full bg-brand-orange/30" style={{ opacity: c > 0 ? 1 : 0 }} />
            </button>
          );
        })}
      </div>

      <div className="text-xs text-slate-400">
        Натисни на день, щоб показати події на цю дату.
      </div>
    </div>
  );
}
