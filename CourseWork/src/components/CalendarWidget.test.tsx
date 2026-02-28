import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CalendarWidget from "./CalendarWidget";
import { __testRouter, __testSearchParams } from "../../vitest.setup";

describe("CalendarWidget", () => {
  it("navigates to events list when day clicked", () => {
    __testRouter.push.mockClear();
    __testSearchParams.forEach((_, k) => __testSearchParams.delete(k));

    render(<CalendarWidget year={2026} month={1} counts={{ "2026-02-10": 2 }} eventsPath="/events" />);

    const day = screen.getAllByRole("button").find((b) => b.textContent?.trim().startsWith("10"));
    expect(day).toBeTruthy();
    fireEvent.click(day!);

    expect(__testRouter.push).toHaveBeenCalled();
    const arg = __testRouter.push.mock.calls[0][0] as string;
    expect(arg).toContain("/events?");
    expect(arg).toContain("dateFrom=2026-02-10");
    expect(arg).toContain("dateTo=2026-02-10");
  });

  it("changes month via arrows", () => {
    __testRouter.push.mockClear();
    __testSearchParams.forEach((_, k) => __testSearchParams.delete(k));

    render(<CalendarWidget year={2026} month={1} counts={{}} />);
    fireEvent.click(screen.getByRole("button", { name: "→" }));

    expect(__testRouter.push).toHaveBeenCalled();
    const href = __testRouter.push.mock.calls[0][0] as string;
    expect(href).toContain("cal=2026-03");
  });
});
