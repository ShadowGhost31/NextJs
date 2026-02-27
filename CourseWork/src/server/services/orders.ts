import { prisma } from "@/lib/db";
import { EventStatus, OrderStatus } from "@prisma/client";

export async function createOrder(input: { userId: string; ticketTypeId: string; quantity: number }) {
  return await prisma.$transaction(async (tx) => {
    const tt = await tx.ticketType.findUnique({ where: { id: input.ticketTypeId }, include: { event: true } });
    if (!tt) return { ok: false as const, error: "Квиток не знайдено", status: 404 };
    if (!tt.isActive) return { ok: false as const, error: "Квиток недоступний", status: 409 };
    if (tt.event.status !== EventStatus.PUBLISHED) return { ok: false as const, error: "Подія недоступна", status: 409 };

    const available = tt.quantityTotal - tt.quantitySold;
    if (input.quantity > available) return { ok: false as const, error: "Недостатньо квитків", status: 409 };

    const unitPrice = tt.price;
    const total = unitPrice * input.quantity;

    const order = await tx.order.create({
      data: {
        userId: input.userId,
        status: OrderStatus.PENDING_PAYMENT,
        total,
        items: { create: [{ ticketTypeId: tt.id, quantity: input.quantity, unitPrice }] },
      },
    });

    await tx.ticketType.update({
      where: { id: tt.id },
      data: { quantitySold: { increment: input.quantity } },
    });

    return { ok: true as const, orderId: order.id, total: order.total, eventId: tt.eventId };
  });
}

export async function payOrder(input: { orderId: string; userId: string }) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: input.orderId, userId: input.userId },
      select: { id: true, status: true },
    });

    if (!order) return { ok: false as const, error: "Замовлення не знайдено" };

    if (order.status === OrderStatus.PAID) return { ok: true as const };
    if (order.status === OrderStatus.CANCELED) return { ok: false as const, error: "Замовлення скасовано" };

    await tx.order.update({ where: { id: order.id }, data: { status: OrderStatus.PAID } });
    return { ok: true as const };
  });
}

export async function cancelOrder(input: { orderId: string; userId: string }) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: input.orderId, userId: input.userId },
      include: { items: { select: { ticketTypeId: true, quantity: true } } },
    });

    if (!order) return { ok: false as const, error: "Замовлення не знайдено" };

    if (order.status === OrderStatus.CANCELED) return { ok: true as const };
    if (order.status === OrderStatus.PAID) return { ok: false as const, error: "Неможливо скасувати оплачений квиток" };

    await tx.order.update({ where: { id: order.id }, data: { status: OrderStatus.CANCELED } });

    for (const it of order.items) {
      await tx.ticketType.update({
        where: { id: it.ticketTypeId },
        data: { quantitySold: { decrement: it.quantity } },
      });
    }

    return { ok: true as const };
  });
}

export async function listUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          ticketType: {
            include: {
              event: { include: { venue: true, category: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listOrganizerOrders(input: { organizerId: string; isAdmin: boolean }) {
  const items = await prisma.orderItem.findMany({
    where: input.isAdmin ? {} : { ticketType: { event: { organizerId: input.organizerId } } },
    include: {
      order: { include: { user: { select: { email: true, name: true } } } },
      ticketType: { include: { event: { include: { venue: true } } } },
    },
    orderBy: { order: { createdAt: "desc" } },
  });

  return items;
}
