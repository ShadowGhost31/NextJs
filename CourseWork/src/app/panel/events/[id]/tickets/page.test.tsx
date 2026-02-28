import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/server/guards", () => ({
  requireOrganizerOrAdmin: vi.fn(async () => ({ sub: "o1", email: "org", role: "ORGANIZER" })),
}));

vi.mock("@/server/services", () => ({
  eventService: {
    getOrganizerEvent: vi.fn(async () => ({
      id: "e1",
      title: "Подія 1",
      venue: { title: "Філармонія" },
      category: { title: "Театр" },
      ticketTypes: [
        { id: "t1", name: "VIP", price: 20000, quantityTotal: 10, quantitySold: 3, isActive: true },
      ],
    })),
  },
  formatUahFromCents: (c: number) => String(c / 100),
}));

vi.mock("../../../actions", () => ({
  createTicketTypeAction: vi.fn(async () => undefined),
  updateTicketTypeAction: vi.fn(async () => undefined),
}));

import TicketsPage from "./page";

describe("TicketsPage", () => {
  it("renders tickets list", async () => {
    const ui = await TicketsPage({ params: { id: "e1" }, searchParams: {} });
    render(ui as any);
    expect(screen.getByText(/Квитки:/)).toBeInTheDocument();
    expect(screen.getByText("VIP")).toBeInTheDocument();
  });
});
