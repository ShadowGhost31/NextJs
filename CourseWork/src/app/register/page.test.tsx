import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "./page";
import { __testRouter, __testSearchParams } from "../../../vitest.setup";

describe("RegisterPage", () => {
  it("creates account and redirects", async () => {
    __testRouter.push.mockClear();
    __testRouter.refresh.mockClear();
    __testSearchParams.forEach((_, k) => __testSearchParams.delete(k));
    __testSearchParams.set("next", "/account");

    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({}) } as any));
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "new@demo.com" } });
    fireEvent.change(screen.getByPlaceholderText("Пароль"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Створити" }));
    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ method: "POST" })
    );
    expect(__testRouter.push).toHaveBeenCalledWith("/account");
  });
});
