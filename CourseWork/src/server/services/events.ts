import { prisma } from "@/lib/db";
import { EventStatus, ReviewStatus } from "@prisma/client";
import { buildCatalogWhere, type CatalogSort } from "./catalog";

export { parseDateOnly, parseOptionalPrice } from "./catalog";
export type { CatalogSort } from "./catalog";

export async function listCatalog(params: {
  q?: string;
  categoryId?: string;
  venueId?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  priceMinCents?: number | null;
  priceMaxCents?: number | null;
  free?: boolean;
  withTickets?: boolean;
  sort?: CatalogSort;
  page: number;
  pageSize: number;
  userId?: string | null;
}) {
  const where = buildCatalogWhere(params);

  const include = {
    category: true,
    venue: true,
    image: { select: { id: true } },
    ticketTypes: { where: { isActive: true } },
    reviews: { where: { status: ReviewStatus.APPROVED } },
    favorites: params.userId ? { where: { userId: params.userId }, select: { id: true } } : false,
  } as any;

  const [total, events] = await prisma.$transaction([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      include,
      orderBy: params.sort === "new" ? { createdAt: "desc" } : { startAt: "asc" },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ]);

  const mapped = events.map((e: any) => {
    const avg = e.reviews.length ? e.reviews.reduce((s: number, r: any) => s + r.rating, 0) / e.reviews.length : 0;
    const minPrice = e.ticketTypes.length ? Math.min(...e.ticketTypes.map((t: any) => t.price)) : null;
    const isFav = params.userId ? e.favorites.length > 0 : false;
    const imageUrl = e.image ? `/api/events/${e.id}/image` : null;
    return { ...e, imageUrl, avgRating: Number(avg.toFixed(2)), minPrice, isFavorite: isFav };
  });

  if (params.sort === "rating") {
    mapped.sort((a: any, b: any) => b.avgRating - a.avgRating || a.startAt.getTime() - b.startAt.getTime());
  }

  if (params.sort === "price_asc") {
    mapped.sort((a: any, b: any) => (a.minPrice ?? Number.MAX_SAFE_INTEGER) - (b.minPrice ?? Number.MAX_SAFE_INTEGER));
  }

  if (params.sort === "price_desc") {
    mapped.sort((a: any, b: any) => (b.minPrice ?? -1) - (a.minPrice ?? -1));
  }

  return { total, events: mapped };
}

export async function getPublicEvent(eventId: string, userId?: string | null) {
  const event = await prisma.event.findFirst({
    where: { id: eventId, status: EventStatus.PUBLISHED },
    include: {
      category: true,
      venue: true,
      image: { select: { id: true } },
      organizer: { select: { id: true, name: true } },
      ticketTypes: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
      reviews: {
        where: { status: ReviewStatus.APPROVED },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      favorites: userId ? { where: { userId }, select: { id: true } } : false,
    },
  });

  if (!event) return null;

  const avg = event.reviews.length ? event.reviews.reduce((s, r) => s + r.rating, 0) / event.reviews.length : 0;
  const isFavorite = userId ? (event as any).favorites.length > 0 : false;
  const imageUrl = (event as any).image ? `/api/events/${event.id}/image` : null;
  return { ...(event as any), imageUrl, avgRating: Number(avg.toFixed(2)), isFavorite };
}

export async function listCalendarMonthDays(input: { year: number; month: number }) {
  const start = new Date(input.year, input.month, 1);
  const end = new Date(input.year, input.month + 1, 1);

  const rows = await prisma.event.findMany({
    where: {
      city: "Житомир",
      status: EventStatus.PUBLISHED,
      startAt: { gte: start, lt: end },
    },
    select: { startAt: true },
  });

  const map = new Map<string, number>();
  for (const r of rows) {
    const y = r.startAt.getFullYear();
    const m = String(r.startAt.getMonth() + 1).padStart(2, "0");
    const d = String(r.startAt.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${d}`;
    map.set(key, (map.get(key) || 0) + 1);
  }

  return Object.fromEntries(map.entries());
}

export async function listOrganizerEvents(organizerId: string) {
  return await prisma.event.findMany({
    where: { organizerId },
    include: {
      category: true,
      venue: true,
      image: { select: { id: true } },
      ticketTypes: true,
      reviews: { where: { status: ReviewStatus.APPROVED } },
    },
    orderBy: { startAt: "asc" },
  });
}

export async function getOrganizerEvent(eventId: string, organizerId: string, isAdmin: boolean) {
  const event = await prisma.event.findFirst({
    where: isAdmin ? { id: eventId } : { id: eventId, organizerId },
    include: {
      category: true,
      venue: true,
      image: { select: { id: true } },
      ticketTypes: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!event) return null;
  const imageUrl = (event as any).image ? `/api/events/${event.id}/image` : null;
  return { ...(event as any), imageUrl };
}

export async function upsertEvent(input: {
  organizerId: string;
  isAdmin: boolean;
  eventId?: string;
  title: string;
  description: string;
  categoryId: string;
  venueId: string;
  startAt: Date;
  endAt?: Date | null;
}) {
  const venue = await prisma.venue.findUnique({ where: { id: input.venueId } });
  if (!venue) return { ok: false as const, error: "Локацію не знайдено" };

  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) return { ok: false as const, error: "Категорію не знайдено" };

  if (input.eventId) {
    const existing = await prisma.event.findUnique({ where: { id: input.eventId } });
    if (!existing) return { ok: false as const, error: "Подію не знайдено" };
    if (!input.isAdmin && existing.organizerId !== input.organizerId) return { ok: false as const, error: "Forbidden" };

    const updated = await prisma.event.update({
      where: { id: input.eventId },
      data: {
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        venueId: input.venueId,
        city: venue.city,
        startAt: input.startAt,
        endAt: input.endAt || null,
      },
    });

    return { ok: true as const, event: updated };
  }

  const created = await prisma.event.create({
    data: {
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      venueId: input.venueId,
      city: venue.city,
      startAt: input.startAt,
      endAt: input.endAt || null,
      organizerId: input.organizerId,
    },
  });

  return { ok: true as const, event: created };
}

export async function setEventStatus(input: {
  eventId: string;
  actorId: string;
  isAdmin: boolean;
  status: EventStatus;
}) {
  const existing = await prisma.event.findUnique({ where: { id: input.eventId } });
  if (!existing) return { ok: false as const, error: "Подію не знайдено" };
  if (!input.isAdmin && existing.organizerId !== input.actorId) return { ok: false as const, error: "Forbidden" };

  const data: any = { status: input.status };
  if (input.status === EventStatus.PUBLISHED) data.publishedAt = new Date();
  if (input.status !== EventStatus.PUBLISHED) data.publishedAt = null;

  const updated = await prisma.event.update({ where: { id: input.eventId }, data });
  return { ok: true as const, event: updated };
}

export async function deleteEventIfAllowed(input: { eventId: string; actorId: string; isAdmin: boolean }) {
  const event = await prisma.event.findUnique({
    where: { id: input.eventId },
    select: { id: true, organizerId: true, status: true, ticketTypes: { select: { id: true } } },
  });

  if (!event) return { ok: false as const, error: "Подію не знайдено" };
  if (!input.isAdmin && event.organizerId !== input.actorId) return { ok: false as const, error: "Forbidden" };

  const ticketTypeIds = event.ticketTypes.map((t) => t.id);
  const used = ticketTypeIds.length
    ? await prisma.orderItem.count({ where: { ticketTypeId: { in: ticketTypeIds } } })
    : 0;

  if (used > 0) return { ok: false as const, error: "Неможливо видалити: є замовлення" };

  await prisma.$transaction(async (tx) => {
    await tx.favorite.deleteMany({ where: { eventId: event.id } });
    await tx.review.deleteMany({ where: { eventId: event.id } });
    await tx.ticketType.deleteMany({ where: { eventId: event.id } });
    await tx.eventImage.deleteMany({ where: { eventId: event.id } });
    await tx.event.delete({ where: { id: event.id } });
  });

  return { ok: true as const };
}
