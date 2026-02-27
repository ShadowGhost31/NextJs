import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { requireAdmin } from "@/server/guards";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { EventStatus } from "@prisma/client";
import { setEventStatusAdminAction } from "../actions";

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

export default async function AdminEventsPage() {
  await requireAdmin("/admin/events");

  const events = await prisma.event.findMany({
    where: { city: "Житомир" },
    include: {
      venue: true,
      category: true,
      organizer: { select: { email: true, name: true } },
      ticketTypes: true,
    },
    orderBy: { startAt: "asc" },
  });

  return (
    <Card>
      <div className="p-5 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Події та контроль контенту</h2>
          <div className="text-sm text-slate-300 mt-1">
            Адміністратор може змінювати статус подій та керувати видимістю у каталозі.
          </div>
        </div>

        <div className="grid gap-4">
          {events.map((e) => {
            const sold = e.ticketTypes.reduce((s, t) => s + t.quantitySold, 0);
            return (
              <div key={e.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/events/${e.id}`} className="text-lg font-semibold hover:text-brand-blue transition">
                        {e.title}
                      </Link>
                      <StatusBadge status={e.status} />
                      {sold > 0 && <Badge>продано {sold}</Badge>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge>{formatDateTime(new Date(e.startAt))}</Badge>
                      <Badge>{e.venue.title}</Badge>
                      <Badge>{e.category.title}</Badge>
                    </div>

                    <div className="text-sm text-slate-300">
                      Організатор: {e.organizer.name || "—"} • {e.organizer.email}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-wrap gap-2">
                    <form action={setEventStatusAdminAction.bind(null, e.id, EventStatus.DRAFT)}>
                      <button className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition">
                        У чернетки
                      </button>
                    </form>
                    <form action={setEventStatusAdminAction.bind(null, e.id, EventStatus.PUBLISHED)}>
                      <button className="rounded-xl bg-brand-green px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition">
                        Опублікувати
                      </button>
                    </form>
                    <form action={setEventStatusAdminAction.bind(null, e.id, EventStatus.CANCELED)}>
                      <button className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/15 transition">
                        Скасувати
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && <div className="text-slate-300">Подій поки немає.</div>}
      </div>
    </Card>
  );
}
