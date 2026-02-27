import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserFromCookie } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const me = await getCurrentUserFromCookie();

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    select: { id: true, status: true, organizerId: true, title: true, description: true, startAt: true },
  });

  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = me && (me.role === "ADMIN" || (me.role === "ORGANIZER" && event.organizerId === me.sub));
  if (!isOwner && event.status !== "PUBLISHED") return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(event);
}
