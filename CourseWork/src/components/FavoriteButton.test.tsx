import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FavoriteButton from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("toggles favorite state and calls API", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true } as any));
    vi.stubGlobal("fetch", fetchMock);

    render(<FavoriteButton eventId="e1" initial={false} />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent("☆");
    fireEvent.click(btn);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/favorites",
      expect.objectContaining({ method: "POST" })
    );
  });
});
