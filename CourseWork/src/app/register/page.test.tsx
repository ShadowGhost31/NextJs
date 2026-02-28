import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "./page";

const fetchSpy = vi.fn();

describe("RegisterPage", () => {
  beforeEach(() => {
    fetchSpy.mockReset();
    global.fetch = fetchSpy;
  });

  it("renders and submits", async () => {
    fetchSpy.mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "new@demo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Імʼя (необовʼязково)"), {
      target: { value: "New" },
    });
    fireEvent.change(screen.getByPlaceholderText(/пароль/i), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /зареєструватися/i }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe("/api/auth/register");
  });

  it("shows error when register fails", async () => {
    fetchSpy.mockResolvedValue({ ok: false, json: async () => ({ error: "Email already exists" }) });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@demo.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/пароль/i), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /зареєструватися/i }));

    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
  });
});
