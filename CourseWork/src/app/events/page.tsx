import Link from "next/link";
import type { ReactNode } from "react";
import Card from "@/components/Card";
import CalendarWidget from "@/components/CalendarWidget";
import EventCard from "@/components/EventCard";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { catalogQuerySchema } from "@/server/schemas";
import { eventService, metaService } from "@/server/services";

export const dynamic = "force-dynamic";

function parseCal(v: string | undefined) {
  const s = (v || "").trim();
  const m = /^\d{4}-\d{2}$/.exec(s);
  if (!m) return null;
  const [y, mo] = s.split("-").map(Number);
  if (!y || !mo) return null;
  return { year: y, month: mo - 1 };
}

export default async function EventsCatalogPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const me = await getCurrentUserFromCookie();

  const calOverride = parseCal(typeof searchParams.cal === "string" ? searchParams.cal : undefined);
  const today = new Date();
  const calYear = calOverride?.year ?? today.getFullYear();
  const calMonth = calOverride?.month ?? today.getMonth();
  const calendarOpen = String(searchParams.calendar || "") === "1";
  const counts = await eventService.listCalendarMonthDays({ year: calYear, month: calMonth });

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
  const withTickets =
    qParsed.withTickets === "on" || qParsed.withTickets === "1" || qParsed.withTickets === "true";

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

  function buildHref(overrides: Partial<Record<keyof typeof qParsed, string>>) {
    const params = new URLSearchParams();

    for (const [k, v] of Object.entries(qParsed)) {
      if (!v) continue;
      if (k === "page") continue;
      params.set(k, String(v));
    }

    for (const [k, v] of Object.entries(overrides)) {
      if (v === "") params.delete(k);
      else if (v != null) params.set(k, String(v));
    }

    params.set("page", "1");
    const qs = params.toString();
    return qs ? `/events?${qs}#list` : "/events#list";
  }

  const calendarHref = (() => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(qParsed)) {
      if (!v) continue;
      if (k === "page") continue;
      params.set(k, String(v));
    }
    params.set("calendar", "1");
    const qs = params.toString();
    return qs ? `/events?${qs}#calendar` : "/events?calendar=1#calendar";
  })();

  function Chip({
    href,
    active,
    children,
  }: {
    href: string;
    active: boolean;
    children: ReactNode;
  }) {
    return (
      <Link
        href={href}
        className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition ${
          active
            ? "border-brand-blue bg-brand-blue/10 text-brand-deep"
            : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Події в Житомирі</h1>
          <p className="text-sm text-slate-600 mt-1">Пошук, фільтри та сортування • як на афішах типу Karabas</p>
        </div>
        <Link
          href={calendarHref}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 transition"
        >
          Календар
        </Link>
      </div>

      <div id="calendar" className="scroll-mt-24" />
      <Card>
        <div className="p-4 md:p-5">
          <details open={calendarOpen} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Календар подій</div>
                <div className="text-xs text-slate-600 mt-0.5">Натисни на день, щоб застосувати фільтр дати</div>
              </div>
              <div className="text-slate-500 group-open:rotate-180 transition">▾</div>
            </summary>
            <div className="mt-4">
              <CalendarWidget year={calYear} month={calMonth} counts={counts} eventsPath="/events" />
            </div>
          </details>
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Chip href={buildHref({ category: "" })} active={!qParsed.category}>
            Усі категорії
          </Chip>
          {categories.slice(0, 12).map((c) => (
            <Chip key={c.id} href={buildHref({ category: c.id })} active={qParsed.category === c.id}>
              <span className="inline-flex items-center gap-2">
                <span className={`h-4 w-4 rounded border ${qParsed.category === c.id ? "border-brand-blue bg-brand-blue" : "border-slate-300"}`} />
                {c.title}
              </span>
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Chip href={buildHref({ venue: "" })} active={!qParsed.venue}>
            Усі місця
          </Chip>
          {venues.slice(0, 10).map((v) => (
            <Chip key={v.id} href={buildHref({ venue: v.id })} active={qParsed.venue === v.id}>
              {v.title}
            </Chip>
          ))}
        </div>
      </div>

      <Card>
        <div className="p-4 md:p-5">
          <form className="grid gap-3 md:grid-cols-6" action="/events" method="get">
            <input
              name="q"
              defaultValue={qParsed.q}
              placeholder="Пошук (назва/опис/локація)"
              className="md:col-span-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
            />

            <select
              name="sort"
              defaultValue={qParsed.sort}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
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
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
              />
              <input
                type="date"
                name="dateTo"
                defaultValue={qParsed.dateTo}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </div>

            <div className="flex gap-2 md:col-span-2">
              <input
                name="priceMin"
                defaultValue={qParsed.priceMin}
                placeholder="Ціна від (грн)"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
              />
              <input
                name="priceMax"
                defaultValue={qParsed.priceMax}
                placeholder="Ціна до (грн)"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 md:col-span-3">
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" name="free" defaultChecked={free} className="h-4 w-4 accent-brand-blue" />
                Безкоштовно
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  name="withTickets"
                  defaultChecked={withTickets}
                  className="h-4 w-4 accent-brand-blue"
                />
                Є квитки
              </label>

              <select
                name="category"
                defaultValue={qParsed.category}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
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
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
              >
                <option value="">Місце (усі)</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>

            <input type="hidden" name="page" value="1" />

            <div className="flex gap-2 md:col-span-3 md:justify-end">
              <button className="rounded-2xl bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
                Застосувати
              </button>
              <Link
                href="/events"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-2 text-sm text-slate-800 hover:bg-slate-50 transition"
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
          <div className="text-sm text-slate-600 mt-1">Знайдено: {total}</div>
        </div>
        <div className="text-xs text-slate-500">Сторінка {page} з {pages}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e: any) => (
          <EventCard key={e.id} event={e} isAuthed={!!me} />
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-slate-600">Нічого не знайдено. Спробуй інші фільтри.</div>
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
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  active
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
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
