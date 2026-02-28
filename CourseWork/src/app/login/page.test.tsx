import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";

const fetchSpy = vi.fn();

describe("LoginPage", () => {
  beforeEach(() => {
    fetchSpy.mockReset();
    global.fetch = fetchSpy;
  });

  it("renders and submits", async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@demo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Пароль"), {
      target: { value: "user123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /увійти/i }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe("/api/auth/login");
  });

  it("shows error when login fails", async () => {
    fetchSpy.mockResolvedValue({ ok: false, json: async () => ({ error: "Bad credentials" }) });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@demo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Пароль"), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: /увійти/i }));

    expect(await screen.findByText(/bad credentials/i)).toBeInTheDocument();
  });
});
