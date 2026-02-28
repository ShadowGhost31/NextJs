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
      status: "DRAFT",
      description: "Опис",
      categoryId: "c1",
      venueId: "v1",
      imageUrl: null,
      startAt: new Date("2026-02-10T18:00:00.000Z"),
      endAt: null,
      venue: { title: "Філармонія" },
      category: { title: "Театр" },
    })),
  },
}));

vi.mock("../../ui/EventForm", () => ({
  default: () => <div data-testid="event-form">FORM</div>,
}));

vi.mock("../../../actions", () => ({
  deleteEventAction: vi.fn(async () => undefined),
  setEventStatusAction: vi.fn(async () => undefined),
  saveEventAction: vi.fn(async () => undefined),
}));

import EditEventPage from "./page";

describe("EditEventPage", () => {
  it("renders editor when event exists", async () => {
    const ui = await EditEventPage({ params: { id: "e1" }, searchParams: {} });
    render(ui as any);
    expect(screen.getByText("Подія 1")).toBeInTheDocument();
    expect(screen.getByTestId("event-form")).toBeInTheDocument();
  });
});
