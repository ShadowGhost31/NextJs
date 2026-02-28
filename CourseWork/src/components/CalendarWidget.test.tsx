import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CalendarWidget from "./CalendarWidget";

const push = vi.fn();
const sp = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
  useSearchParams: () => sp,
}));

describe("CalendarWidget", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("renders month and navigates on day click", () => {
    render(
      <CalendarWidget
        year={2026}
        month={0}
        counts={{ "2026-01-10": 2 }}
        eventsPath="/events"
      />
    );

    const dayBtn = screen
      .getAllByRole("button")
      .find((b) => (b.textContent || "").trim().startsWith("10"));

    expect(dayBtn).toBeTruthy();

    if (dayBtn) {
      fireEvent.click(dayBtn);
      expect(push).toHaveBeenCalledWith("/events?dateFrom=2026-01-10&dateTo=2026-01-10&page=1#list");
    }

    fireEvent.click(screen.getByRole("button", { name: "→" }));
    expect(push).toHaveBeenCalledWith("/?cal=2026-02#calendar");
  });

  it("renders disabled buttons for days outside the current month", () => {
    render(
      <CalendarWidget
        year={2026}
        month={3}
        counts={{}}
        eventsPath="/events"
      />
    );

    const disabledButtons = Array.from(document.querySelectorAll("button[disabled]"));
    expect(disabledButtons.length).toBeGreaterThan(0);
  });
});
