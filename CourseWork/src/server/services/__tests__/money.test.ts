import { describe, expect, it } from "vitest";
import { toCentsFromUahString, formatUahFromCents } from "../money";

describe("money", () => {
  it("converts uah strings to cents", () => {
    expect(toCentsFromUahString("0")).toBe(0);
    expect(toCentsFromUahString("10")).toBe(1000);
    expect(toCentsFromUahString("10.25")).toBe(1025);
    expect(toCentsFromUahString("10,25")).toBe(1025);
    expect(toCentsFromUahString("-1")).toBeNull();
    expect(toCentsFromUahString("nope")).toBeNull();
  });

  it("formats cents to uah", () => {
    expect(formatUahFromCents(0)).toBe("0.00");
    expect(formatUahFromCents(1050)).toBe("10.50");
  });
});
