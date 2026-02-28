import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/server/guards", () => ({
  requireAdmin: vi.fn(async () => ({ sub: "a1", email: "admin", role: "ADMIN" })),
}));

vi.mock("@/server/services", () => ({
  userService: {
    listUsers: vi.fn(async () => [
      { id: "u1", email: "user@demo.com", name: "User", role: "USER", createdAt: new Date("2026-02-01") },
    ]),
  },
}));

vi.mock("../actions", () => ({
  setUserRoleAction: vi.fn(async () => undefined),
}));

import AdminUsersPage from "./page";

describe("AdminUsersPage", () => {
  it("renders users list", async () => {
    const ui = await AdminUsersPage({ searchParams: {} });
    render(ui as any);
    expect(screen.getByText(/Користувачі та ролі/)).toBeInTheDocument();
    expect(screen.getByText("user@demo.com")).toBeInTheDocument();
  });
});
