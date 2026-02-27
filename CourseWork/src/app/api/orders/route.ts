import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { orderCreateSchema } from "@/server/schemas";
import { orderService } from "@/server/services";

export async function POST(req: Request) {
  const me = await getCurrentUserFromCookie();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = orderCreateSchema.safeParse({
    ticketTypeId: json?.ticketTypeId,
    quantity: Number(json?.quantity),
  });

  if (!parsed.success) return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });

  const res = await orderService.createOrder({
    userId: me.sub,
    ticketTypeId: parsed.data.ticketTypeId,
    quantity: parsed.data.quantity,
  });

  if (!res.ok) return NextResponse.json({ error: res.error }, { status: res.status });

  return NextResponse.json({ ok: true, ...res });
}
