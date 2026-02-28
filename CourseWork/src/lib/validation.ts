import type { ZodError } from "zod";

export type FieldErrors = Record<string, string>;

export function zodToFieldErrors(err: ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path?.[0] ? String(issue.path[0]) : "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function encodeFieldErrors(errors: FieldErrors) {
  return encodeURIComponent(JSON.stringify(errors));
}

export function decodeFieldErrors(raw: unknown): FieldErrors {
  if (!raw || typeof raw !== "string") return {};
  try {
    const v = JSON.parse(decodeURIComponent(raw));
    if (!v || typeof v !== "object") return {};
    const out: FieldErrors = {};
    for (const [k, val] of Object.entries(v as any)) {
      if (typeof val === "string") out[k] = val;
    }
    return out;
  } catch {
    return {};
  }
}
