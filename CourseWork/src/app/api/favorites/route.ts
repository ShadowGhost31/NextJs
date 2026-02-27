import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { favoriteService } from "@/server/services";

const schema = z.object({ eventId: z.string().min(1) });

export async function POST(req: Request) {
  const me = await getCurrentUserFromCookie();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });

  const res = await favoriteService.toggleFavorite({ userId: me.sub, eventId: parsed.data.eventId });
  return NextResponse.json(res);
}
