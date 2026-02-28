import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/auth", () => ({
  getCurrentUserFromCookie: vi.fn(async () => null),
}));

vi.mock("@/server/services", async () => {
  return {
    eventService: {
      listCalendarMonthDays: vi.fn(async () => ({ "2026-02-10": 2 })),
      listCatalog: vi.fn(async () => ({
        events: [
          {
            id: "e1",
            title: "Концерт",
            description: "Опис події",
            city: "Житомир",
            imageUrl: null,
            startAt: new Date("2026-02-10T18:00:00.000Z"),
            venue: { title: "Міський парк культури" },
            category: { title: "Музика" },
            avgRating: 4.5,
            reviews: [],
            minPrice: 10000,
            isFavorite: false,
          },
        ],
        total: 1,
      })),
    },
  };
});

import HomePage from "./page";

describe("HomePage", () => {
  it("renders calendar and upcoming events", async () => {
    const ui = await HomePage({ searchParams: {} });
    render(ui as any);

    expect(screen.getByText(/Афіша подій/)).toBeInTheDocument();
    expect(screen.getByText(/Календар подій/)).toBeInTheDocument();
    expect(screen.getByText("Концерт")).toBeInTheDocument();
  });
});
