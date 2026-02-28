import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { requireOrganizerOrAdmin } from "@/server/guards";
import { eventService, formatUahFromCents } from "@/server/services";
import { createTicketTypeAction, updateTicketTypeAction } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function TicketsPage({ params, searchParams }: { params: { id: string }; searchParams: any }) {
  const me = await requireOrganizerOrAdmin(`/panel/events/${params.id}/tickets`);
  const event = await eventService.getOrganizerEvent(params.id, me.sub, me.role === "ADMIN");

  if (!event) {
    return (
      <Card>
        <div className="p-5">
          <div className="text-slate-700">Подію не знайдено або недостатньо прав.</div>
          <Link href="/panel/events" className="inline-block mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition">
            До списку подій
          </Link>
        </div>
      </Card>
    );
  }

  const error = String(searchParams?.error || "");

  return (
    <div className="space-y-5">
      <Card>
        <div className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Квитки: {event.title}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>{event.venue.title}</Badge>
              <Badge>{event.category.title}</Badge>
            </div>
            {error && <div className="text-sm text-rose-600">{decodeURIComponent(error)}</div>}
          </div>
          <div className="flex gap-2">
            <Link href={`/panel/events/${event.id}/edit`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition">
              Редагувати подію
            </Link>
            <Link href={`/events/${event.id}`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition">
              Публічна сторінка
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="p-5">
            <h3 className="text-lg font-semibold">Додати тип квитка</h3>
            <form action={createTicketTypeAction.bind(null, event.id)} className="mt-3 space-y-2">
              <input
                name="name"
                placeholder="Назва (Стандарт, VIP...)"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="priceUah"
                  placeholder="Ціна (грн)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                />
                <input
                  name="quantityTotal"
                  placeholder="Кількість"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                />
              </div>
              <button className="w-full rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
                Додати
              </button>
              <div className="text-xs text-slate-500">
                Ціна вводиться у гривнях, зберігається у копійках.
              </div>
            </form>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h3 className="text-lg font-semibold">Поточні квитки</h3>
            <div className="mt-3 space-y-3">
              {event.ticketTypes.length === 0 && <div className="text-slate-600">Типів квитків поки немає.</div>}
              {event.ticketTypes.map((t) => {
                const available = t.quantityTotal - t.quantitySold;
                return (
                  <div key={t.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm text-slate-600 mt-1">
                          {formatUahFromCents(t.price)} грн • продано {t.quantitySold} • доступно {available}
                        </div>
                      </div>
                      <Badge>{t.isActive ? "активний" : "вимкнено"}</Badge>
                    </div>

                    <form
                      action={updateTicketTypeAction.bind(null, t.id, event.id)}
                      className="mt-3 grid gap-2 md:grid-cols-4"
                    >
                      <input
                        name="name"
                        defaultValue={t.name}
                        className="md:col-span-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                      />
                      <input
                        name="priceUah"
                        defaultValue={formatUahFromCents(t.price)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                      />
                      <input
                        name="quantityTotal"
                        defaultValue={String(t.quantityTotal)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
                      />

                      <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" name="isActive" defaultChecked={t.isActive} className="h-4 w-4" />
                        Активний
                      </label>

                      <button className="md:col-span-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition">
                        Зберегти
                      </button>

                      <div className="md:col-span-4 text-xs text-slate-500">
                        Кількість не може бути меншою, ніж уже продано.
                      </div>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
