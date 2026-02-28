import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FavoriteButton from "./FavoriteButton";

const fetchSpy = vi.fn();

describe("FavoriteButton", () => {
  beforeEach(() => {
    fetchSpy.mockReset();
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders initial state and toggles", async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<FavoriteButton eventId="e1" initial={false} />);
    const btn = screen.getByRole("button", { name: /в обране/i });

    fireEvent.click(btn);

    expect(screen.getByRole("button").textContent).toContain("В обраному");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("reverts optimistic state if request fails", async () => {
    fetchSpy.mockResolvedValue({ ok: false, json: async () => ({ error: "fail" }) });

    render(<FavoriteButton eventId="e1" initial={false} />);
    const btn = screen.getByRole("button", { name: /в обране/i });

    fireEvent.click(btn);
    expect(screen.getByRole("button").textContent).toContain("В обраному");

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toContain("В обране");
    });
  });

  it("reverts optimistic state on network error", async () => {
    fetchSpy.mockRejectedValue(new Error("network"));

    render(<FavoriteButton eventId="e1" initial={false} />);
    const btn = screen.getByRole("button", { name: /в обране/i });

    fireEvent.click(btn);
    expect(screen.getByRole("button").textContent).toContain("В обраному");

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toContain("В обране");
    });
  });
});
