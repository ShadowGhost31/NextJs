import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { formatDateTime } from "@/lib/utils";
import { requireAuth } from "@/server/guards";
import { favoriteService } from "@/server/services";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const me = await requireAuth("/account/favorites");
  const favorites = await favoriteService.listUserFavorites(me.sub);

  const mapped = favorites.map((f) => {
    const e: any = f.event;
    const avg = e.reviews.length ? e.reviews.reduce((s: number, r: any) => s + r.rating, 0) / e.reviews.length : 0;
    const minPrice = e.ticketTypes.length ? Math.min(...e.ticketTypes.map((t: any) => t.price)) : null;
    return { fav: f, event: e, avgRating: Number(avg.toFixed(2)), minPrice };
  });

  return (
    <Card>
      <div className="p-5">
        <h2 className="text-lg font-semibold">Обране</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {mapped.length === 0 && <div className="text-slate-300">В обраному поки порожньо.</div>}

          {mapped.map(({ event, avgRating, minPrice }) => (
            <div key={event.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Link href={`/events/${event.id}`} className="text-lg font-semibold hover:text-brand-blue transition">
                {event.title}
              </Link>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{formatDateTime(new Date(event.startAt))}</Badge>
                <Badge>{event.venue.title}</Badge>
                <Badge>{event.category.title}</Badge>
                <Badge>Рейтинг: {avgRating}</Badge>
                {minPrice != null ? <Badge>від {(minPrice / 100).toFixed(2)} грн</Badge> : <Badge>квитків немає</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
