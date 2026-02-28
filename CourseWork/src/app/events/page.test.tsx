import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import EventsCatalogPage from "./page";

vi.mock("@/server/services", () => ({
  metaService: {
    listCatalogMeta: async () => ({
      categories: [{ id: "c1", title: "Концерти" }],
      venues: [{ id: "v1", title: "Філармонія" }],
    }),
  },
  eventService: {
    parseDateOnly: () => null,
    parseOptionalPrice: () => null,
    listCatalog: async () => ({ total: 1, events: [] }),
  },
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUserFromCookie: async () => null,
}));

describe("EventsCatalogPage", () => {
  it("renders catalog heading", async () => {
    const el = await EventsCatalogPage({ searchParams: {} });
    render(el as any);

    expect(document.body.textContent).toContain("Події в Житомирі");
  });
});
