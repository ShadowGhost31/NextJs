import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/auth";
import { reviewCreateSchema } from "@/server/schemas";
import { reviewService } from "@/server/services";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const me = await getCurrentUserFromCookie();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = reviewCreateSchema.safeParse({
    rating: Number((json as any)?.rating),
    text: String((json as any)?.text ?? ""),
  });

  if (!parsed.success) return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });

  const res = await reviewService.createReview({
    eventId: params.id,
    userId: me.sub,
    rating: parsed.data.rating,
    text: parsed.data.text,
  });

  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 409 });

  return NextResponse.json({ ok: true, reviewId: res.review.id });
}
