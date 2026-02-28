import Link from "next/link";
import Card from "@/components/Card";
import EventCard from "@/components/EventCard";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { eventService } from "@/server/services";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const me = await getCurrentUserFromCookie();

  const { events } = await eventService.listCatalog({
    sort: "soon",
    page: 1,
    pageSize: 6,
    userId: me?.sub || null,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Афіша подій • Житомир</h1>
        <p className="text-slate-600 text-sm">
          Каталог подій, календар як віджет у каталозі, квитки, відгуки, кабінет, панель організатора та адмінка.
        </p>
      </div>

      <Card>
        <div className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form action="/events" method="get" className="flex flex-1 gap-2">
            <input
              name="q"
              placeholder="Пошук подій..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
            />
            <button className="rounded-2xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
              Знайти
            </button>
          </form>

          <div className="flex gap-2">
            <Link
              href="/events"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 transition"
            >
              Каталог
            </Link>
          </div>
        </div>
      </Card>

      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Найближчі події</h2>
          <div className="text-sm text-slate-600 mt-1">Добірка найближчих подій</div>
        </div>
        <Link
          href="/events"
          className="rounded-2xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          Перейти до каталогу
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e: any) => (
          <EventCard key={e.id} event={e} isAuthed={!!me} />
        ))}
      </div>

      <Card>
        <div className="p-5">
          <div className="text-sm text-slate-600">
            Демо-акаунти: admin@demo.com / admin123, organizer@demo.com / organizer123, user@demo.com / user123
          </div>
        </div>
      </Card>
    </div>
  );
}
