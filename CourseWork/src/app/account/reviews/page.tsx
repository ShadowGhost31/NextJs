import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { formatDateTime } from "@/lib/utils";
import { requireAuth } from "@/server/guards";
import { reviewService } from "@/server/services";

export const dynamic = "force-dynamic";

function statusBadge(s: string) {
  if (s === "APPROVED") return <Badge>Схвалено</Badge>;
  if (s === "REJECTED") return <Badge>Відхилено</Badge>;
  return <Badge>Очікує</Badge>;
}

export default async function ReviewsPage() {
  const me = await requireAuth("/account/reviews");
  const reviews = await reviewService.listUserReviews(me.sub);

  return (
    <Card>
      <div className="p-5">
        <h2 className="text-lg font-semibold">Мої відгуки</h2>
        <div className="mt-3 space-y-3">
          {reviews.length === 0 && <div className="text-slate-300">Відгуків ще немає.</div>}

          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-slate-300">
                  {formatDateTime(new Date(r.createdAt))} • Оцінка: {r.rating}
                </div>
                {statusBadge(r.status)}
              </div>

              <div className="mt-2 text-sm">
                Подія:{" "}
                <Link href={`/events/${r.eventId}`} className="hover:text-brand-blue transition">
                  {r.event.title}
                </Link>
                <span className="text-slate-400"> • {r.event.venue.title}</span>
              </div>

              <div className="mt-2">{r.text}</div>

              {r.status === "REJECTED" && (
                <div className="mt-2 text-sm text-rose-200">
                  Причина: {r.rejectReason || "—"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
