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
          <div className="text-sm text-slate-600 mt-1">
            Нові відгуки створюються зі статусом PENDING і стають видимими на сторінці події лише після APPROVED.
          </div>
          {error && <div className="text-sm text-rose-600 mt-2">Некоректні дані</div>}
        </div>

        {pending.length === 0 && <div className="text-slate-600">Немає відгуків, що очікують модерації.</div>}

        <div className="grid gap-4">
          {pending.map((r: any) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="text-sm text-slate-600">
                    {r.user.name || r.user.email} • Оцінка: {r.rating} • {formatDateTime(new Date(r.createdAt))}
                  </div>
                  <div className="text-sm text-slate-500">
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
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                    <input
                      name="rejectReason"
                      placeholder="Причина (для REJECTED)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                    />
                    <button className="w-full rounded-xl bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
                      Застосувати
                    </button>
                    <div className="text-xs text-slate-500">
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
