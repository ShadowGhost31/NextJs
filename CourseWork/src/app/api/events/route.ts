import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { eventUpsertSchema } from "@/server/schemas";
import { eventService } from "@/server/services";
import { saveEventImageFromUrl } from "@/server/uploads";

export async function POST(req: Request) {
  const me = await getCurrentUserFromCookie();
  if (!me || (me.role !== "ORGANIZER" && me.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = eventUpsertSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });

  const startAt = new Date(parsed.data.startAt);
  const endAt = parsed.data.endAt ? new Date(parsed.data.endAt) : null;

  if (Number.isNaN(startAt.getTime()) || (endAt && Number.isNaN(endAt.getTime()))) {
    return NextResponse.json({ error: "Некоректні дати" }, { status: 400 });
  }

  const res = await eventService.upsertEvent({
    organizerId: me.sub,
    isAdmin: me.role === "ADMIN",
    title: parsed.data.title,
    description: parsed.data.description,
    categoryId: parsed.data.categoryId,
    venueId: parsed.data.venueId,
    startAt,
    endAt,
  });

  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });

  const imageUrl = parsed.data.imageUrl ? String(parsed.data.imageUrl).trim() : "";
  if (imageUrl) {
    const saved = await saveEventImageFromUrl({ eventId: res.event.id, url: imageUrl });
    if (!saved.ok) return NextResponse.json({ error: saved.error }, { status: 400 });
  }

  return NextResponse.json(res.event);
}
