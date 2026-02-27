import Link from "next/link";
import Card from "@/components/Card";
import EventCard from "@/components/EventCard";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { catalogQuerySchema } from "@/server/schemas";
import { eventService, metaService } from "@/server/services";

export const dynamic = "force-dynamic";

export default async function EventsCatalogPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const me = await getCurrentUserFromCookie();

  const raw: any = {};
  for (const [k, v] of Object.entries(searchParams)) {
    raw[k] = Array.isArray(v) ? v[0] : v;
  }

  const qParsed = catalogQuerySchema.parse(raw);

  const page = Math.max(1, Number(qParsed.page || "1") || 1);
  const pageSize = 10;

  const dateFrom = eventService.parseDateOnly(qParsed.dateFrom);
  const dateToBase = eventService.parseDateOnly(qParsed.dateTo);
  const dateTo = dateToBase
    ? new Date(dateToBase.getFullYear(), dateToBase.getMonth(), dateToBase.getDate(), 23, 59, 59)
    : null;

  const priceMinCents = eventService.parseOptionalPrice(qParsed.priceMin);
  const priceMaxCents = eventService.parseOptionalPrice(qParsed.priceMax);

  const free = qParsed.free === "on" || qParsed.free === "1" || qParsed.free === "true";
  const withTickets = qParsed.withTickets === "on" || qParsed.withTickets === "1" || qParsed.withTickets === "true";

  const { categories, venues } = await metaService.listCatalogMeta();

  const { total, events } = await eventService.listCatalog({
    q: qParsed.q,
    categoryId: qParsed.category || undefined,
    venueId: qParsed.venue || undefined,
    dateFrom,
    dateTo,
    priceMinCents,
    priceMaxCents,
    free,
    withTickets,
    sort: qParsed.sort,
    page,
    pageSize,
    userId: me?.sub || null,
  });

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Каталог подій • Житомир</h1>
          <p className="text-sm text-slate-300 mt-1">Пошук, фільтри та сортування</p>
        </div>
        <Link
          href="/#calendar"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
        >
          Календар
        </Link>
      </div>

      <Card>
        <div className="p-4 md:p-5">
          <form className="grid gap-3 md:grid-cols-6" action="/events" method="get">
            <input
              name="q"
              defaultValue={qParsed.q}
              placeholder="Пошук (назва/опис/локація)"
              className="md:col-span-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
            />

            <select
              name="category"
              defaultValue={qParsed.category}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
            >
              <option value="">Категорія (усі)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              name="venue"
              defaultValue={qParsed.venue}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
            >
              <option value="">Місце (усі)</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={qParsed.sort}
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
            >
              <option value="soon">Найближчі</option>
              <option value="new">Нові</option>
              <option value="rating">Рейтинг</option>
              <option value="price_asc">Ціна ↑</option>
              <option value="price_desc">Ціна ↓</option>
            </select>

            <div className="flex gap-2 md:col-span-2">
              <input
                type="date"
                name="dateFrom"
                defaultValue={qParsed.dateFrom}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
              />
              <input
                type="date"
                name="dateTo"
                defaultValue={qParsed.dateTo}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
              />
            </div>

            <div className="flex gap-2 md:col-span-2">
              <input
                name="priceMin"
                defaultValue={qParsed.priceMin}
                placeholder="Ціна від (грн)"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
              />
              <input
                name="priceMax"
                defaultValue={qParsed.priceMax}
                placeholder="Ціна до (грн)"
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" name="free" defaultChecked={free} className="h-4 w-4" />
              Безкоштовно
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" name="withTickets" defaultChecked={withTickets} className="h-4 w-4" />
              Є квитки
            </label>

            <input type="hidden" name="page" value="1" />

            <div className="flex gap-2 md:col-span-2">
              <button className="flex-1 rounded-xl bg-brand-blue px-3 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition">
                Застосувати
              </button>
              <Link
                href="/events"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
              >
                Скинути
              </Link>
            </div>
          </form>
        </div>
      </Card>

      <div id="list" className="scroll-mt-24" />
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Події</h2>
          <div className="text-sm text-slate-300 mt-1">Знайдено: {total}</div>
        </div>
        <div className="text-xs text-slate-400">Сторінка {page} з {pages}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e: any) => (
          <EventCard key={e.id} event={e} isAuthed={!!me} />
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-slate-300">Нічого не знайдено. Спробуй інші фільтри.</div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {Array.from({ length: pages }).slice(0, 12).map((_, i) => {
            const p = i + 1;
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(qParsed)) {
              if (!v) continue;
              if (k === "page") continue;
              params.set(k, String(v));
            }
            params.set("page", String(p));
            const href = `/events?${params.toString()}#list`;

            const active = p === page;
            return (
              <Link
                key={p}
                href={href}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  active
                    ? "border-brand-blue bg-brand-blue text-slate-950"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
