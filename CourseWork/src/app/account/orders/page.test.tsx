import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/server/guards", () => ({
  requireAuth: vi.fn(async () => ({ sub: "u1", email: "user", role: "USER" })),
}));

vi.mock("@/server/services", () => ({
  orderService: {
    listUserOrders: vi.fn(async () => [
      {
        id: "o1",
        status: "PENDING_PAYMENT",
        total: 20000,
        createdAt: new Date("2026-02-01"),
        items: [
          {
            id: "i1",
            quantity: 2,
            ticketType: { name: "VIP", event: { id: "e1", title: "Концерт", venue: { title: "Філармонія" } } },
          },
        ],
      },
    ]),
  },
}));

vi.mock("./actions", () => ({
  payOrderAction: vi.fn(async () => undefined),
  cancelOrderAction: vi.fn(async () => undefined),
}));

import OrdersPage from "./page";

describe("Account OrdersPage", () => {
  it("renders order list", async () => {
    const ui = await OrdersPage({ searchParams: {} });
    render(ui as any);
    expect(screen.getByText(/Мої замовлення/)).toBeInTheDocument();
    expect(screen.getByText("Концерт")).toBeInTheDocument();
    expect(screen.getByText("Оплатити")).toBeInTheDocument();
  });
});
