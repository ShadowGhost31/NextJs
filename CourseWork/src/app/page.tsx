import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import FavoriteButton from "@/components/FavoriteButton";
import CalendarWidget from "@/components/CalendarWidget";
import { formatDateTime } from "@/lib/utils";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { catalogQuerySchema } from "@/server/schemas";
import { eventService, metaService } from "@/server/services";

export const dynamic = "force-dynamic";

function toDateInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

  const calOverride = parseCal(typeof searchParams.cal === "string" ? searchParams.cal : undefined);
  const today = new Date();
  const calYear = calOverride?.year ?? today.getFullYear();
  const calMonth = calOverride?.month ?? today.getMonth();
  const counts = await eventService.listCalendarMonthDays({ year: calYear, month: calMonth });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Афіша подій • Житомир</h1>
        <p className="text-slate-300 text-sm">
          Каталог подій, календар, квитки та відгуки. Для демонстрації курсового проєкту.
        </p>
      </div>

      <Card>
        <div className="p-4 md:p-5">
          <form className="grid gap-3 md:grid-cols-6" action="/" method="get">
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
                href={`/`}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
              >
                Скинути
              </Link>
            </div>
          </form>
        </div>
      </Card>

      <div id="calendar" className="scroll-mt-24" />
      <Card>
        <div className="p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Календар подій</h2>
              <div className="text-sm text-slate-300 mt-1">Віджет календаря на головній сторінці</div>
            </div>
            <div className="text-xs text-slate-400">Місто: Житомир</div>
          </div>
          <div className="mt-4">
            <CalendarWidget year={calYear} month={calMonth} counts={counts} />
          </div>
        </div>
      </Card>

      <div id="events" className="scroll-mt-24" />
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Події</h2>
          <div className="text-sm text-slate-300 mt-1">Знайдено: {total}</div>
        </div>
        <div className="text-xs text-slate-400">Сторінка {page} з {pages}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e: any) => (
          <Card key={e.id}>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Link href={`/events/${e.id}`} className="text-lg font-semibold hover:text-brand-blue transition">
                    {e.title}
                  </Link>

                  <div className="flex flex-wrap gap-2">
                    <Badge>{formatDateTime(new Date(e.startAt))}</Badge>
                    <Badge>{e.venue.title}</Badge>
                    <Badge>{e.category.title}</Badge>
                    {e.minPrice != null ? <Badge>від {(e.minPrice / 100).toFixed(2)} грн</Badge> : <Badge>квитків немає</Badge>}
                  </div>

                  <div className="text-sm text-slate-300 line-clamp-2">{e.description}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400">Рейтинг</div>
                  <div className="text-lg font-semibold">{e.avgRating}</div>
                  <div className="text-xs text-slate-400">{e.reviews.length} відгуків</div>
                  {me ? (
                    <div className="mt-2">
                      <FavoriteButton eventId={e.id} initial={e.isFavorite} size="sm" />
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Link
                        href={`/login?next=${encodeURIComponent(`/events/${e.id}`)}`}
                        className="inline-block rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10 transition"
                      >
                        ☆ В обране
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-slate-300">Нічого не знайдено. Спробуй інші фільтри.</div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pages }).slice(0, 9).map((_, i) => {
            const p = i + 1;
            const params = new URLSearchParams();
            for (const [k, v] of Object.entries(qParsed)) {
              if (!v) continue;
              if (k === "page") continue;
              params.set(k, String(v));
            }
            params.set("page", String(p));
            const href = `/?${params.toString()}#events`;

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
