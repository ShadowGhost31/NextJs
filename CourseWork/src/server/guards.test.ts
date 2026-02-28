import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => {
  return {
    getCurrentUserFromCookie: vi.fn(async () => null),
  };
});

import { hasRole, requireAuth } from "./guards";

describe("server/guards", () => {
  it("hasRole checks allowed roles", () => {
    expect(hasRole({ sub: "1", email: "x", role: "ADMIN" } as any, ["ADMIN"]) ).toBe(true);
    expect(hasRole({ sub: "1", email: "x", role: "USER" } as any, ["ADMIN"]) ).toBe(false);
  });

  it("requireAuth redirects when not authenticated", async () => {
    await expect(requireAuth("/account")).rejects.toMatchObject({ __redirect: "/login?next=%2Faccount" });
  });
});
