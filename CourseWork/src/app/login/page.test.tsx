import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";
import { __testRouter, __testSearchParams } from "../../../vitest.setup";

describe("LoginPage", () => {
  it("submits credentials and redirects on success", async () => {
    __testRouter.push.mockClear();
    __testRouter.refresh.mockClear();
    __testSearchParams.forEach((_, k) => __testSearchParams.delete(k));
    __testSearchParams.set("next", "/account");

    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({}) } as any));
    vi.stubGlobal("fetch", fetchMock);

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "user@demo.com" } });
    fireEvent.change(screen.getByPlaceholderText("Пароль"), { target: { value: "user123" } });
    fireEvent.click(screen.getByRole("button", { name: "Увійти" }));

    // wait microtasks
    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalled();
    expect(__testRouter.push).toHaveBeenCalledWith("/account");
    expect(__testRouter.refresh).toHaveBeenCalled();
  });
});
