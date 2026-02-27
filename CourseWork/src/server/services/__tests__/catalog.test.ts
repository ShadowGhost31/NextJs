import { describe, expect, it } from "vitest";
import { buildCatalogWhere, parseDateOnly, parseOptionalPrice } from "../catalog";

describe("catalog utils", () => {
  it("parses date-only strings", () => {
    const dt = parseDateOnly("2026-02-27");
    expect(dt).not.toBeNull();
    expect(dt!.getFullYear()).toBe(2026);
    expect(dt!.getMonth()).toBe(1);
    expect(dt!.getDate()).toBe(27);
  });

  it("rejects invalid date-only strings", () => {
    expect(parseDateOnly("")).toBeNull();
    expect(parseDateOnly("2026-2-27")).toBeNull();
    expect(parseDateOnly("nope")).toBeNull();
  });

  it("parses optional price", () => {
    expect(parseOptionalPrice("")).toBeNull();
    expect(parseOptionalPrice("10")).toBe(1000);
    expect(parseOptionalPrice("10,5")).toBe(1050);
  });

  it("builds where with defaults", () => {
    const where = buildCatalogWhere({});
    expect(where.status).toBe("PUBLISHED");
    expect(where.city).toBe("Житомир");
  });

  it("builds where for search and tickets filters", () => {
    const where = buildCatalogWhere({
      q: "театр",
      free: true,
      withTickets: true,
      categoryId: "cat",
      venueId: "v",
    }) as any;

    expect(where.OR?.length).toBe(4);
    expect(where.categoryId).toBe("cat");
    expect(where.venueId).toBe("v");
    expect(where.ticketTypes?.some?.isActive).toBe(true);
    expect(where.ticketTypes?.some?.price).toBe(0);
    expect(where.ticketTypes?.some?.quantityTotal?.gt).toBe(0);
  });

  it("builds where for price range", () => {
    const where = buildCatalogWhere({ priceMinCents: 1000, priceMaxCents: 2500 }) as any;
    expect(where.ticketTypes?.some?.price?.gte).toBe(1000);
    expect(where.ticketTypes?.some?.price?.lte).toBe(2500);
  });
});
