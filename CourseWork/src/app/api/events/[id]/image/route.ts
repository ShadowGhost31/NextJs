import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const me = await getCurrentUserFromCookie();

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    select: { id: true, status: true, organizerId: true },
  });

  if (!event) return new NextResponse(null, { status: 404 });

  const isOwner = me && (me.role === "ADMIN" || (me.role === "ORGANIZER" && event.organizerId === me.sub));
  if (!isOwner && event.status !== "PUBLISHED") return new NextResponse(null, { status: 404 });

  const img = await prisma.eventImage.findUnique({
    where: { eventId: event.id },
    select: { id: true, mime: true, data: true, updatedAt: true },
  });

  if (!img) return new NextResponse(null, { status: 404 });

  const etag = `W/"${img.id}-${img.updatedAt.getTime()}"`;
  const inm = req.headers.get("if-none-match");
  if (inm && inm === etag) return new NextResponse(null, { status: 304, headers: { ETag: etag } });

  return new NextResponse(img.data, {
    status: 200,
    headers: {
      "Content-Type": img.mime,
      "Cache-Control": "public, max-age=3600",
      ETag: etag,
    },
  });
}
