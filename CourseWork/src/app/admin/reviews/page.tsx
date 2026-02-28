import Link from "next/link";
import Card from "@/components/Card";
import { requireAdmin } from "@/server/guards";
import { reviewService } from "@/server/services";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  await requireAdmin("/admin");

  const error = String(searchParams?.error || "");
  const reviews = await reviewService.listRecentReviews(100);

  return (
    <Card>
      <div className="p-5 space-y-4">
        <div>
          <div className="text-lg font-semibold">Відгуки</div>
          <div className="text-sm text-slate-600 mt-1">
            Відгуки публікуються одразу. Видаляти їх можна прямо на сторінці події.
          </div>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        {reviews.length === 0 ? (
          <div className="text-sm text-slate-600">Поки що немає відгуків.</div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {r.user.name || r.user.email} • Оцінка: {r.rating}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Подія: {r.event.title} ({r.event.venue.title})
                    </div>
                  </div>

                  <Link
                    href={`/events/${r.eventId}`}
                    className="rounded-2xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50"
                  >
                    Відкрити подію
                  </Link>
                </div>
                <div className="mt-3 text-sm text-slate-800 whitespace-pre-wrap">{r.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
