import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

export async function listUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
}

export async function setUserRole(input: { userId: string; role: Role }) {
  return await prisma.user.update({ where: { id: input.userId }, data: { role: input.role } });
}
