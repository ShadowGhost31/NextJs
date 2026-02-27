import { EventStatus } from "@prisma/client";
import { toCentsFromUahString } from "./money";

export type CatalogSort = "soon" | "new" | "price_asc" | "price_desc" | "rating";

export function buildCatalogWhere(input: {
  q?: string;
  categoryId?: string;
  venueId?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  priceMinCents?: number | null;
  priceMaxCents?: number | null;
  free?: boolean;
  withTickets?: boolean;
}) {
  const where: any = { status: EventStatus.PUBLISHED, city: "Житомир" };

  const q = (input.q || "").trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { venue: { title: { contains: q, mode: "insensitive" } } },
      { venue: { address: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (input.categoryId) where.categoryId = input.categoryId;
  if (input.venueId) where.venueId = input.venueId;

  if (input.dateFrom || input.dateTo) {
    where.startAt = {};
    if (input.dateFrom) where.startAt.gte = input.dateFrom;
    if (input.dateTo) where.startAt.lte = input.dateTo;
  }

  if (input.withTickets || input.free || input.priceMinCents != null || input.priceMaxCents != null) {
    const ttWhere: any = { isActive: true };
    if (input.withTickets) ttWhere.quantityTotal = { gt: 0 };

    if (input.free) {
      ttWhere.price = 0;
    } else {
      if (input.priceMinCents != null || input.priceMaxCents != null) {
        ttWhere.price = {};
        if (input.priceMinCents != null) ttWhere.price.gte = input.priceMinCents;
        if (input.priceMaxCents != null) ttWhere.price.lte = input.priceMaxCents;
      }
    }

    where.ticketTypes = { some: ttWhere };
  }

  return where;
}

export function parseDateOnly(v: string) {
  const s = (v || "").trim();
  if (!s) return null;
  const m = /^\d{4}-\d{2}-\d{2}$/.test(s);
  if (!m) return null;
  const [y, mo, d] = s.split("-").map(Number);
  const dt = new Date(y, mo - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function parseOptionalPrice(v: string) {
  const s = (v || "").trim();
  if (!s) return null;
  return toCentsFromUahString(s);
}
