import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/auth", () => ({
  getCurrentUserFromCookie: vi.fn(async () => null),
}));

vi.mock("@/server/services", async () => {
  return {
    eventService: {
      parseDateOnly: vi.fn(() => null),
      parseOptionalPrice: vi.fn(() => null),
      listCatalog: vi.fn(async () => ({
        total: 1,
        events: [
          {
            id: "e1",
            title: "Вистава",
            description: "Опис",
            startAt: new Date("2026-02-10T18:00:00.000Z"),
            venue: { title: "Філармонія" },
            category: { title: "Театр" },
            avgRating: 4.1,
            reviews: [],
            minPrice: 0,
            isFavorite: false,
            ticketTypes: [],
          },
        ],
      })),
    },
    metaService: {
      listCatalogMeta: vi.fn(async () => ({
        categories: [{ id: "c1", title: "Театр" }],
        venues: [{ id: "v1", title: "Філармонія" }],
      })),
    },
  };
});

import EventsCatalogPage from "./page";

describe("EventsCatalogPage", () => {
  it("renders filters and results", async () => {
    const ui = await EventsCatalogPage({ searchParams: { q: "test" } });
    render(ui as any);
    expect(screen.getByText(/Каталог подій/)).toBeInTheDocument();
    expect(screen.getByText("Знайдено: 1")).toBeInTheDocument();
    expect(screen.getByText("Вистава")).toBeInTheDocument();
  });
});
