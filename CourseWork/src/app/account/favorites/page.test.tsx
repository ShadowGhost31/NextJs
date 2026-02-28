import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/server/guards", () => ({
  requireAuth: vi.fn(async () => ({ sub: "u1", email: "user", role: "USER" })),
}));

vi.mock("@/server/services", () => ({
  favoriteService: {
    listUserFavorites: vi.fn(async () => [
      {
        event: {
          id: "e1",
          title: "Подія в обраному",
          startAt: new Date("2026-02-10T18:00:00.000Z"),
          venue: { title: "Філармонія" },
          category: { title: "Театр" },
          reviews: [{ rating: 5 }, { rating: 4 }],
          ticketTypes: [{ price: 10000 }],
        },
      },
    ]),
  },
}));

import FavoritesPage from "./page";

describe("FavoritesPage", () => {
  it("renders favorite events", async () => {
    const ui = await FavoritesPage();
    render(ui as any);
    expect(screen.getByText(/Обране/)).toBeInTheDocument();
    expect(screen.getByText("Подія в обраному")).toBeInTheDocument();
  });
});
