import { prisma } from "@/lib/db";
import { toCentsFromUahString } from "./money";

export async function createTicketType(input: {
  eventId: string;
  actorId: string;
  isAdmin: boolean;
  name: string;
  priceUah: string;
  quantityTotal: string;
}) {
  const event = await prisma.event.findUnique({ where: { id: input.eventId } });
  if (!event) return { ok: false as const, error: "Подію не знайдено" };
  if (!input.isAdmin && event.organizerId !== input.actorId) return { ok: false as const, error: "Forbidden" };

  const price = toCentsFromUahString(input.priceUah);
  const quantityTotal = Number(input.quantityTotal);

  if (price == null || !Number.isInteger(quantityTotal) || quantityTotal < 0) {
    return { ok: false as const, error: "Некоректні дані" };
  }

  const tt = await prisma.ticketType.create({
    data: {
      eventId: input.eventId,
      name: input.name,
      price,
      quantityTotal,
    },
  });

  return { ok: true as const, ticketType: tt };
}

export async function updateTicketType(input: {
  ticketTypeId: string;
  actorId: string;
  isAdmin: boolean;
  name: string;
  priceUah: string;
  quantityTotal: string;
  isActive: boolean;
}) {
  const tt = await prisma.ticketType.findUnique({ where: { id: input.ticketTypeId }, include: { event: true } });
  if (!tt) return { ok: false as const, error: "Квиток не знайдено" };
  if (!input.isAdmin && tt.event.organizerId !== input.actorId) return { ok: false as const, error: "Forbidden" };

  const price = toCentsFromUahString(input.priceUah);
  const quantityTotal = Number(input.quantityTotal);

  if (price == null || !Number.isInteger(quantityTotal) || quantityTotal < tt.quantitySold) {
    return { ok: false as const, error: "Некоректні дані" };
  }

  const updated = await prisma.ticketType.update({
    where: { id: input.ticketTypeId },
    data: {
      name: input.name,
      price,
      quantityTotal,
      isActive: input.isActive,
    },
  });

  return { ok: true as const, ticketType: updated };
}
