import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/server/guards", () => ({
  requireAdmin: vi.fn(async () => ({ sub: "a1", email: "admin", role: "ADMIN" })),
}));

vi.mock("@/server/services", () => ({
  reviewService: {
    listRecentReviews: vi.fn(async () => [
      {
        id: "r1",
        eventId: "e1",
        rating: 5,
        text: "Класна подія!",
        createdAt: new Date("2026-02-02"),
        user: { name: "User", email: "user@demo.com" },
        event: { id: "e1", title: "Концерт", venue: { title: "Філармонія" } },
      },
    ]),
  },
}));

import AdminReviewsPage from "./page";

describe("AdminReviewsPage", () => {
  it("renders reviews list", async () => {
    const ui = await AdminReviewsPage({ searchParams: {} });
    render(ui as any);
    expect(screen.getByText(/Відгуки/)).toBeInTheDocument();
    expect(screen.getByText("Класна подія!")).toBeInTheDocument();
  });
});
