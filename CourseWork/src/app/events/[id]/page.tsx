import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import FavoriteButton from "@/components/FavoriteButton";
import { formatDateTime } from "@/lib/utils";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { eventService, reviewService } from "@/server/services";
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
          <div className="text-slate-700">Подію не знайдено або вона недоступна.</div>
          <Link
            href="/events"
            className="inline-block mt-4 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 transition"
          >
            До каталогу
          </Link>
        </div>
      </Card>
    );
  }

  const minPrice = (event.ticketTypes as any[]).length
    ? Math.min(...(event.ticketTypes as any[]).map((t) => t.price))
    : null;

  const loginHref = `/login?next=${encodeURIComponent(`/events/${event.id}`)}`;

  const eligibility = me
    ? await reviewService.getReviewEligibility({ eventId: event.id, userId: me.sub })
    : { canReview: false, reason: "Увійдіть, щоб залишити відгук" };

  const addressParts = [event.venue.address, (event.venue as any).city].filter(Boolean);
  const mapHref = addressParts.length
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressParts.join(", "))}`
    : null;

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid gap-4 p-5 md:grid-cols-[280px_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={1200}
                height={800}
                className="h-[220px] w-full object-cover md:h-full"
              />
            ) : (
              <div className="flex h-[220px] items-center justify-center text-slate-500 md:h-full">
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
                  href={loginHref}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 transition"
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
              {minPrice != null ? <Badge>від {(minPrice / 100).toFixed(2)} грн</Badge> : <Badge>квитків немає</Badge>}
            </div>

            {event.venue.address && (
              <div className="text-sm text-slate-700">Адреса: {event.venue.address}</div>
            )}

            {mapHref && (
              <div>
                <Link
                  href={mapHref}
                  target="_blank"
                  className="inline-block rounded-2xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  Відкрити на мапі
                </Link>
              </div>
            )}

            <div className="text-sm text-slate-700">
              Організатор:{" "}
              {event.organizer ? (
                <Link href={"/organizers/" + event.organizer.id} className="hover:text-brand-blue transition">
                  {event.organizer.name || "Організатор"}
                </Link>
              ) : (
                "Організатор"
              )}
            </div>

            <div className="text-slate-800 whitespace-pre-wrap">{event.description}</div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold">Квитки</h2>
            <p className="text-sm text-slate-600 mt-1">
              Після оформлення замовлення його можна оплатити або скасувати в особистому кабінеті.
            </p>
            <BuyTicketForm ticketTypes={event.ticketTypes as any} isAuthed={!!me} loginHref={loginHref} />
            {me && (
              <div className="mt-3">
                <Link
                  href="/account/orders"
                  className="inline-block rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 transition"
                >
                  Мої замовлення
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold">Залишити відгук</h2>
            <p className="text-sm text-slate-600 mt-1">Відгук зʼявиться після модерації адміністратором.</p>
            <ReviewForm
              eventId={event.id}
              isAuthed={!!me}
              canReview={eligibility.canReview}
              reason={eligibility.reason}
              loginHref={loginHref}
            />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-5">
          <h2 className="text-lg font-semibold">Відгуки</h2>
          <div className="mt-3 space-y-3">
            {event.reviews.length === 0 && <div className="text-slate-600">Поки немає відгуків.</div>}
            {event.reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-600">
                  {r.user?.name || "Користувач"} • Оцінка: {r.rating} • {formatDateTime(new Date(r.createdAt))}
                </div>
                <div className="mt-2 text-slate-800">{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div>
        <Link
          href="/events"
          className="inline-block rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 transition"
        >
          ← До каталогу
        </Link>
      </div>
    </div>
  );
}
