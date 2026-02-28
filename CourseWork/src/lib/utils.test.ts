import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime, ym } from "./utils";

describe("lib/utils", () => {
  it("formats date", () => {
    const d = new Date("2026-02-28T10:05:00.000Z");
    expect(formatDate(d)).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });

  it("formats date time", () => {
    const d = new Date("2026-02-28T10:05:00.000Z");
    const s = formatDateTime(d);
    expect(s).toContain("2026");
  });

  it("formats year-month", () => {
    const d = new Date("2026-02-01T00:00:00.000Z");
    expect(ym(d)).toBe("2026-02");
  });
});
