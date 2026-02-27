import { prisma } from "@/lib/db";

export async function toggleFavorite(input: { userId: string; eventId: string }) {
  const existing = await prisma.favorite.findUnique({
    where: { userId_eventId: { userId: input.userId, eventId: input.eventId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { ok: true as const, isFavorite: false };
  }

  await prisma.favorite.create({ data: { userId: input.userId, eventId: input.eventId } });
  return { ok: true as const, isFavorite: true };
}

export async function listUserFavorites(userId: string) {
  return await prisma.favorite.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          venue: true,
          category: true,
          ticketTypes: { where: { isActive: true } },
          reviews: { where: { status: "APPROVED" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
