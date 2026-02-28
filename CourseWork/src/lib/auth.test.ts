import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "./auth";

describe("lib/auth", () => {
  it("signs and verifies token", async () => {
    process.env.JWT_SECRET = "test_secret_123456789";
    const token = await signToken({ sub: "u1", email: "a@b.com", role: "USER" });
    const payload = await verifyToken(token);
    expect(payload.sub).toBe("u1");
    expect(payload.email).toBe("a@b.com");
    expect(payload.role).toBe("USER");
  });
});
