import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/server/schemas";
import { zodToFieldErrors } from "@/lib/validation";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Перевірте введені дані", fieldErrors: zodToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const { email, password, name } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email вже використовується", fieldErrors: { email: "Email вже використовується" } }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      name: name ? String(name).trim() || null : null,
      passwordHash,
    },
  });

  return NextResponse.json({ ok: true });
}
