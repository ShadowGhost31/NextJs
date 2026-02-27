import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { requireOrganizerOrAdmin } from "@/server/guards";
import { eventService, formatUahFromCents } from "@/server/services";
import { formatDateTime } from "@/lib/utils";
import { EventStatus } from "@prisma/client";
import { setEventStatusAction } from "../actions";

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

export default async function PanelEventsPage() {
  const me = await requireOrganizerOrAdmin("/panel/events");
  const events = await eventService.listOrganizerEvents(me.role === "ADMIN" ? me.sub : me.sub);

  const visible = me.role === "ADMIN" ? events : events;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Події</h2>
          <div className="text-sm text-slate-300 mt-1">
            {me.role === "ADMIN" ? "Адміністратор бачить власні події як організатор" : "Список ваших подій"}
          </div>
        </div>
        <Link
          href="/panel/events/new"
          className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition"
        >
          Створити подію
        </Link>
      </div>

      <Card>
        <div className="p-5 space-y-4">
          {visible.length === 0 && (
            <div className="text-slate-300">Подій ще немає. Створи першу подію.</div>
          )}

          <div className="grid gap-4">
            {visible.map((e: any) => {
              const sold = e.ticketTypes.reduce((s: number, t: any) => s + t.quantitySold, 0);
              const available = e.ticketTypes.reduce((s: number, t: any) => s + (t.quantityTotal - t.quantitySold), 0);
              const minPrice = e.ticketTypes.length ? Math.min(...e.ticketTypes.map((t: any) => t.price)) : null;
              return (
                <div key={e.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/panel/events/${e.id}/edit`} className="text-lg font-semibold hover:text-brand-blue transition">
                          {e.title}
                        </Link>
                        <StatusBadge status={e.status} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{formatDateTime(new Date(e.startAt))}</Badge>
                        <Badge>{e.venue.title}</Badge>
                        <Badge>{e.category.title}</Badge>
                        {minPrice != null ? <Badge>від {formatUahFromCents(minPrice)} грн</Badge> : <Badge>квитків немає</Badge>}
                        <Badge>продано {sold}</Badge>
                        <Badge>доступно {available}</Badge>
                      </div>
                      <div className="text-sm text-slate-300 line-clamp-2">{e.description}</div>
                    </div>

                    <div className="shrink-0 flex flex-col gap-2">
                      <Link
                        href={`/events/${e.id}`}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition text-center"
                      >
                        Відкрити сторінку
                      </Link>

                      <Link
                        href={`/panel/events/${e.id}/tickets`}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition text-center"
                      >
                        Квитки
                      </Link>

                      <Link
                        href={`/panel/events/${e.id}/orders`}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition text-center"
                      >
                        Замовлення
                      </Link>

                      <div className="grid grid-cols-2 gap-2">
                        {e.status !== "PUBLISHED" ? (
                          <form action={setEventStatusAction.bind(null, e.id, EventStatus.PUBLISHED)}>
                            <button className="w-full rounded-xl bg-brand-green px-3 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition">
                              Publish
                            </button>
                          </form>
                        ) : (
                          <form action={setEventStatusAction.bind(null, e.id, EventStatus.DRAFT)}>
                            <button className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition">
                              Draft
                            </button>
                          </form>
                        )}

                        <form action={setEventStatusAction.bind(null, e.id, EventStatus.CANCELED)}>
                          <button className="w-full rounded-xl border border-rose-300/20 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/15 transition">
                            Cancel
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
