import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { requireAdmin } from "@/server/guards";
import { reviewService } from "@/server/services";
import { formatDateTime } from "@/lib/utils";
import { moderateReviewAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({ searchParams }: { searchParams: any }) {
  await requireAdmin("/admin/reviews");
  const pending = await reviewService.listPendingReviews();
  const error = String(searchParams?.error || "");

  return (
    <Card>
      <div className="p-5 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Модерація відгуків</h2>
          <div className="text-sm text-slate-300 mt-1">
            Нові відгуки створюються зі статусом PENDING і стають видимими на сторінці події лише після APPROVED.
          </div>
          {error && <div className="text-sm text-rose-200 mt-2">Некоректні дані</div>}
        </div>

        {pending.length === 0 && <div className="text-slate-300">Немає відгуків, що очікують модерації.</div>}

        <div className="grid gap-4">
          {pending.map((r: any) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-slate-300">
                    {r.user.name || r.user.email} • Оцінка: {r.rating} • {formatDateTime(new Date(r.createdAt))}
                  </div>
                  <div className="text-sm text-slate-400">
                    Подія: <Link href={`/events/${r.event.id}`} className="hover:text-brand-blue transition">{r.event.title}</Link> • {r.event.venue.title}
                  </div>
                  <div className="mt-2">{r.text}</div>
                </div>

                <div className="shrink-0 w-full md:w-[320px]">
                  <form action={moderateReviewAction.bind(null, r.id)} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge>PENDING</Badge>
                      <select
                        name="status"
                        defaultValue="APPROVED"
                        className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                    <input
                      name="rejectReason"
                      placeholder="Причина (для REJECTED)"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
                    />
                    <button className="w-full rounded-xl bg-brand-green px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition">
                      Застосувати
                    </button>
                    <div className="text-xs text-slate-400">
                      Якщо обрано APPROVED, причина ігнорується.
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
