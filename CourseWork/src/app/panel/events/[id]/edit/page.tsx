import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import EventForm from "../../ui/EventForm";
import { requireOrganizerOrAdmin } from "@/server/guards";
import { eventService } from "@/server/services";
import { EventStatus } from "@prisma/client";
import { deleteEventAction, setEventStatusAction, saveEventAction } from "../../../actions";
import ConfirmForm from "@/components/ConfirmForm";
import { decodeFieldErrors } from "@/lib/validation";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: EventStatus }) {
  const label = status === "PUBLISHED" ? "Опубліковано" : status === "DRAFT" ? "Чернетка" : "Скасовано";
  const cls =
    status === "PUBLISHED"
      ? "border-brand-green/30 bg-brand-green/10"
      : status === "DRAFT"
      ? "border-brand-yellow/30 bg-brand-yellow/10"
      : "border-rose-300/30 bg-rose-500/10";
  return <span className={`rounded-full border ${cls} px-3 py-1 text-xs`}>{label}</span>;
}

export default async function EditEventPage({ params, searchParams }: { params: { id: string }; searchParams: any }) {
  const me = await requireOrganizerOrAdmin(`/panel/events/${params.id}/edit`);
  const event = await eventService.getOrganizerEvent(params.id, me.sub, me.role === "ADMIN");

  if (!event) {
    return (
      <Card>
        <div className="p-5">
          <div className="text-slate-700">Подію не знайдено або недостатньо прав.</div>
          <Link
            href="/panel/events"
            className="inline-block mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition"
          >
            До списку подій
          </Link>
        </div>
      </Card>
    );
  }

  const saved = String(searchParams?.saved || "") === "1";
  const error = searchParams?.error ? String(searchParams.error) : "";
  const fieldErrors = decodeFieldErrors(searchParams?.fe);

  return (
    <div className="space-y-5">
      <Card>
        <div className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <StatusBadge status={event.status} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{event.venue.title}</Badge>
              <Badge>{event.category.title}</Badge>
            </div>
            {saved && <div className="text-sm text-brand-green">Зміни збережено</div>}
            {error && <div className="text-sm text-rose-600">{error}</div>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/panel/events/${event.id}/tickets`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition"
            >
              Квитки
            </Link>
            <Link
              href={`/panel/events/${event.id}/orders`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition"
            >
              Замовлення
            </Link>
            <Link
              href={`/events/${event.id}`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition"
            >
              Публічна сторінка
            </Link>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-5">
          <h3 className="text-lg font-semibold">Статус</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <form action={setEventStatusAction.bind(null, event.id, EventStatus.DRAFT)}>
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition">
                У чернетки
              </button>
            </form>
            <form action={setEventStatusAction.bind(null, event.id, EventStatus.PUBLISHED)}>
              <button className="rounded-xl bg-brand-green px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition">
                Опублікувати
              </button>
            </form>
            <form action={setEventStatusAction.bind(null, event.id, EventStatus.CANCELED)}>
              <button className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/15 transition">
                Скасувати
              </button>
            </form>
          </div>
          <div className="text-xs text-slate-500 mt-2">Для відображення у каталозі подія має бути "Опубліковано".</div>
        </div>
      </Card>

      <EventForm
        title="Редагувати подію"
        action={saveEventAction.bind(null, event.id)}
        fieldErrors={fieldErrors}
        initial={{
          title: event.title,
          description: event.description,
          categoryId: event.categoryId,
          venueId: event.venueId,
          imageUrl: event.imageUrl,
          startAt: event.startAt,
          endAt: event.endAt,
        }}
      />

      <Card>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-rose-700">Небезпечна зона</h3>
          <div className="text-sm text-slate-600 mt-1">Видалення події можливе лише якщо для неї немає замовлень.</div>
          <div className="mt-4">
            <ConfirmForm
              action={deleteEventAction.bind(null, event.id)}
              confirmText="Видалити подію назавжди? Цю дію неможливо скасувати."
            >
              <button className="rounded-xl border border-rose-300 bg-rose-200 px-4 py-2 text-sm font-semibold text-black hover:bg-rose-300 transition">
                Видалити подію
              </button>
            </ConfirmForm>
          </div>
        </div>
      </Card>
    </div>
  );
}
