import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/server/guards", () => ({
  requireOrganizerOrAdmin: vi.fn(async () => ({ sub: "o1", email: "org", role: "ORGANIZER" })),
}));

vi.mock("@/server/services", () => ({
  eventService: {
    listOrganizerEvents: vi.fn(async () => [
      {
        id: "e1",
        title: "Подія 1",
        description: "Опис",
        status: "DRAFT",
        startAt: new Date("2026-02-10T18:00:00.000Z"),
        venue: { title: "Філармонія" },
        category: { title: "Театр" },
        ticketTypes: [{ price: 10000, quantityTotal: 10, quantitySold: 2 }],
      },
    ]),
  },
  formatUahFromCents: (c: number) => String(c / 100),
}));

vi.mock("../actions", () => ({
  setEventStatusAction: vi.fn(async () => undefined),
}));

import PanelEventsPage from "./page";

describe("PanelEventsPage", () => {
  it("renders organizer events", async () => {
    const ui = await PanelEventsPage();
    render(ui as any);
    expect(screen.getByText("Події")).toBeInTheDocument();
    expect(screen.getByText("Подія 1")).toBeInTheDocument();
  });
});
