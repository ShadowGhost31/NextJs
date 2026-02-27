import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import FavoriteButton from "@/components/FavoriteButton";
import { formatDateTime } from "@/lib/utils";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { eventService } from "@/server/services";
import BuyTicketForm from "./ui/BuyTicketForm";
import ReviewForm from "./ui/ReviewForm";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: { id: string } }) {
  const me = await getCurrentUserFromCookie();
  const event = await eventService.getPublicEvent(params.id, me?.sub || null);

  if (!event) {
    return (
      <Card>
        <div className="p-5">
          <div className="text-slate-200">Подію не знайдено або вона недоступна.</div>
          <Link href="/" className="inline-block mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
            Повернутися на головну
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid gap-4 p-5 md:grid-cols-[280px_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={1200}
                height={800}
                className="h-[220px] w-full object-cover md:h-full"
                unoptimized
              />
            ) : (
              <div className="flex h-[220px] items-center justify-center text-slate-400 md:h-full">
                Немає зображення
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
              {me ? (
                <FavoriteButton eventId={event.id} initial={(event as any).isFavorite} />
              ) : (
                <Link
                  href={`/login?next=${encodeURIComponent(`/events/${event.id}`)}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                >
                  ☆ В обране
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>{formatDateTime(new Date(event.startAt))}</Badge>
              <Badge>{event.venue.title}</Badge>
              <Badge>{event.category.title}</Badge>
              <Badge>Рейтинг: {(event as any).avgRating}</Badge>
            </div>

            <div className="text-sm text-slate-300">
              Адреса: {event.venue.address}
            </div>

            {event.venue.mapUrl && (
              <div>
                <Link
                  href={event.venue.mapUrl}
                  target="_blank"
                  className="inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                >
                  Відкрити на мапі
                </Link>
              </div>
            )}
            <div className="text-sm text-slate-300">
              Організатор: {event.organizer ? (
                <Link href={"/organizers/" + event.organizer.id} className="hover:text-brand-blue transition">
                  {event.organizer.name || "Організатор"}
                </Link>
              ) : (
                "Організатор"
              )}
            </div>
            <div className="text-slate-100/95 whitespace-pre-wrap">{event.description}</div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold">Квитки</h2>
            <p className="text-sm text-slate-300 mt-1">Оплата не інтегрована — замовлення фіксується в БД.</p>
            <BuyTicketForm ticketTypes={event.ticketTypes as any} />
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold">Залишити відгук</h2>
            <p className="text-sm text-slate-300 mt-1">Відгук зʼявиться після модерації адміністратором.</p>
            <ReviewForm eventId={event.id} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-5">
          <h2 className="text-lg font-semibold">Відгуки</h2>
          <div className="mt-3 space-y-3">
            {event.reviews.length === 0 && <div className="text-slate-300">Поки немає відгуків.</div>}
            {event.reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-slate-300">
                  {r.user?.name || "Користувач"} • Оцінка: {r.rating} • {formatDateTime(new Date(r.createdAt))}
                </div>
                <div className="mt-2">{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
