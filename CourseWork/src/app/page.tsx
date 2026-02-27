import Link from "next/link";
import Card from "@/components/Card";
import CalendarWidget from "@/components/CalendarWidget";
import EventCard from "@/components/EventCard";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { eventService } from "@/server/services";

export const dynamic = "force-dynamic";

function parseCal(v: string | undefined) {
  const s = (v || "").trim();
  const m = /^\d{4}-\d{2}$/.exec(s);
  if (!m) return null;
  const [y, mo] = s.split("-").map(Number);
  if (!y || !mo) return null;
  return { year: y, month: mo - 1 };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const me = await getCurrentUserFromCookie();

  const calOverride = parseCal(typeof searchParams.cal === "string" ? searchParams.cal : undefined);
  const today = new Date();
  const calYear = calOverride?.year ?? today.getFullYear();
  const calMonth = calOverride?.month ?? today.getMonth();
  const counts = await eventService.listCalendarMonthDays({ year: calYear, month: calMonth });

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
        <p className="text-slate-300 text-sm">
          Сервіс афіші для міста: каталог подій, календар, квитки, відгуки, кабінет, панель організатора та адмінка.
        </p>
      </div>

      <Card>
        <div className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <form action="/events" method="get" className="flex flex-1 gap-2">
            <input
              name="q"
              placeholder="Пошук подій..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
            />
            <button className="rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition">
              Знайти
            </button>
          </form>

          <div className="flex gap-2">
            <Link
              href="/events"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
            >
              Каталог
            </Link>
            <Link
              href="/#calendar"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
            >
              Календар
            </Link>
          </div>
        </div>
      </Card>

      <div id="calendar" className="scroll-mt-24" />
      <Card>
        <div className="p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Календар подій</h2>
              <div className="text-sm text-slate-300 mt-1">Натисни на день, щоб перейти до каталогу з фільтром дати</div>
            </div>
            <div className="text-xs text-slate-400">Місто: Житомир</div>
          </div>
          <div className="mt-4">
            <CalendarWidget year={calYear} month={calMonth} counts={counts} eventsPath="/events" />
          </div>
        </div>
      </Card>

      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Найближчі події</h2>
          <div className="text-sm text-slate-300 mt-1">Добірка найближчих подій</div>
        </div>
        <Link
          href="/events"
          className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition"
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
          <div className="text-sm text-slate-300">
            Демо-акаунти: admin@demo.com / admin123, organizer@demo.com / organizer123, user@demo.com / user123
          </div>
        </div>
      </Card>
    </div>
  );
}
