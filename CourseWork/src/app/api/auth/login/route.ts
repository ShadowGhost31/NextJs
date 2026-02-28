import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { setAuthCookie, signToken } from "@/lib/auth";
import { loginSchema } from "@/server/schemas";
import { zodToFieldErrors } from "@/lib/validation";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Перевірте введені дані", fieldErrors: zodToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });

  const token = await signToken({ sub: user.id, email: user.email, role: user.role, name: user.name });
  setAuthCookie(token);

  return NextResponse.json({ ok: true, role: user.role });
}
