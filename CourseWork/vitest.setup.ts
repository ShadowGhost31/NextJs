import "@testing-library/jest-dom/vitest";
import { webcrypto } from "node:crypto";
import React from "react";
import { vi } from "vitest";

const g = globalThis as any;

if (!g.crypto) {
  g.crypto = webcrypto;
} else {
  if (!g.crypto.subtle && webcrypto.subtle) {
    try { g.crypto.subtle = webcrypto.subtle; } catch {}
  }
  if (!g.crypto.getRandomValues && webcrypto.getRandomValues) {
    try { g.crypto.getRandomValues = webcrypto.getRandomValues.bind(webcrypto); } catch {}
  }
}

vi.mock("next/link", () => {
  return {
    default: ({ href, children, ...props }: any) => React.createElement("a", { href, ...props }, children),
  };
});

vi.mock("next/image", () => {
  return {
    default: ({ alt, ...props }: any) => React.createElement("img", { alt, ...props }),
  };
});

const router = {
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
};

const sp = new URLSearchParams();

vi.mock("next/navigation", async () => {
  return {
    useRouter: () => router,
    usePathname: () => "/",
    useSearchParams: () => sp,
    redirect: (to: string) => {
      const err: any = new Error(`REDIRECT:${to}`);
      err.__redirect = to;
      throw err;
    },
  };
});

const cookieStore = new Map<string, string>();

vi.mock("next/headers", async () => {
  return {
    cookies: () => ({
      get: (name: string) => {
        const v = cookieStore.get(name);
        return v ? { name, value: v } : undefined;
      },
      set: (name: string, value: string) => {
        cookieStore.set(name, value);
      },
    }),
  };
});

export const __testRouter = router;
export const __testSearchParams = sp;
export const __testCookies = cookieStore;
