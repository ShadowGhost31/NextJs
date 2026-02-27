import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { getCurrentUserFromCookie, type TokenPayload } from "@/lib/auth";

export async function requireAuth(nextPath?: string) {
  const me = await getCurrentUserFromCookie();
  if (!me) {
    const q = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${q}`);
  }
  return me;
}

export function hasRole(me: TokenPayload, allowed: Role[]) {
  return allowed.includes(me.role);
}

export async function requireRole(allowed: Role[], nextPath?: string) {
  const me = await requireAuth(nextPath);
  if (!hasRole(me, allowed)) redirect("/");
  return me;
}

export async function requireOrganizerOrAdmin(nextPath?: string) {
  return await requireRole(["ORGANIZER", "ADMIN"], nextPath);
}

export async function requireAdmin(nextPath?: string) {
  return await requireRole(["ADMIN"], nextPath);
}
