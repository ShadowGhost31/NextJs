import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/server/guards", () => ({
  requireOrganizerOrAdmin: vi.fn(async () => ({ sub: "o1", email: "org", role: "ORGANIZER" })),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    event: {
      findMany: vi.fn(async () => [
        { status: "PUBLISHED", ticketTypes: [{ quantitySold: 2 }] },
        { status: "DRAFT", ticketTypes: [{ quantitySold: 0 }] },
      ]),
    },
    orderItem: {
      findMany: vi.fn(async () => [{ quantity: 2, unitPrice: 10000 }]),
    },
  },
}));

import PanelHomePage from "./page";

describe("PanelHomePage", () => {
  it("renders stats", async () => {
    const ui = await PanelHomePage();
    render(ui as any);
    expect(screen.getByText("Подій (усього)")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
