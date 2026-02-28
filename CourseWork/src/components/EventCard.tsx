import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import FavoriteButton from "@/components/FavoriteButton";
import RatingStars from "@/components/RatingStars";
import { formatDateTime } from "@/lib/utils";

type EventCardModel = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startAt: Date;
  venue: { title: string };
  category: { title: string };
  avgRating: number;
  reviews: unknown[];
  minPrice: number | null;
  isFavorite?: boolean;
};

export default function EventCard({
  event,
  isAuthed,
}: {
  event: EventCardModel;
  isAuthed: boolean;
}) {
  const priceLabel =
    event.minPrice != null ? `від ${(event.minPrice / 100).toFixed(2)} грн` : "квитків немає";

  return (
    <Card>
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <Link
              href={`/events/${event.id}`}
              className="text-lg font-semibold text-slate-900 hover:text-brand-blue transition"
            >
              {event.title}
            </Link>

            <div className="flex flex-wrap gap-2">
              <Badge>{formatDateTime(new Date(event.startAt))}</Badge>
              <Badge>{event.venue.title}</Badge>
              <Badge>{event.category.title}</Badge>
              <Badge>{priceLabel}</Badge>
            </div>

            <div className="text-sm text-slate-600 line-clamp-2">{event.description}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-xs text-slate-500">Рейтинг</div>
            <div className="mt-1">
              <RatingStars value={event.avgRating} />
            </div>
            <div className="text-xs text-slate-500 mt-1">{event.reviews.length} відгуків</div>

            <div className="mt-2">
              {isAuthed ? (
                <FavoriteButton eventId={event.id} initial={!!event.isFavorite} size="sm" />
              ) : (
                <Link
                  href={`/login?next=${encodeURIComponent(`/events/${event.id}`)}`}
                  className="inline-block rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 hover:bg-slate-50 transition"
                >
                  ☆ В обране
                </Link>
              )}
            </div>
          </div>
        </div>

        {event.imageUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={1200}
              height={800}
              className="h-[180px] w-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
