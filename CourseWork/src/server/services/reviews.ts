import { prisma } from "@/lib/db";
import { OrderStatus, ReviewStatus } from "@prisma/client";

export async function getReviewEligibility(input: { eventId: string; userId: string }): Promise<{ canReview: boolean; reason: string | null }> {
  const existing = await prisma.review.findUnique({
    where: { eventId_userId: { eventId: input.eventId, userId: input.userId } },
    select: { id: true },
  });

  if (existing) {
    return { canReview: false, reason: "Ви вже залишали відгук" };
  }

  const paid = await prisma.order.count({
    where: {
      userId: input.userId,
      status: OrderStatus.PAID,
      items: { some: { ticketType: { eventId: input.eventId } } },
    },
  });

  if (paid === 0) {
    return { canReview: false, reason: "Відгук доступний після покупки та оплати квитка" };
  }

  return { canReview: true, reason: null };
}

export async function createReview(input: { eventId: string; userId: string; rating: number; text: string }) {
  const eligibility = await getReviewEligibility({ eventId: input.eventId, userId: input.userId });
  if (!eligibility.canReview) return { ok: false as const, error: eligibility.reason || "Недоступно" };

  const review = await prisma.review.create({
    data: {
      eventId: input.eventId,
      userId: input.userId,
      rating: input.rating,
      text: input.text,
      status: ReviewStatus.PENDING,
    },
  });

  return { ok: true as const, review };
}

export async function listUserReviews(userId: string) {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      event: { include: { venue: true } },
      moderatedBy: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listPendingReviews() {
  return await prisma.review.findMany({
    where: { status: ReviewStatus.PENDING },
    include: {
      user: { select: { email: true, name: true } },
      event: { include: { venue: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function moderateReview(input: {
  reviewId: string;
  moderatorId: string;
  status: ReviewStatus.APPROVED | ReviewStatus.REJECTED;
  rejectReason?: string | null;
}) {
  const updated = await prisma.review.update({
    where: { id: input.reviewId },
    data: {
      status: input.status,
      rejectReason: input.status === ReviewStatus.REJECTED ? input.rejectReason || "" : null,
      moderatedAt: new Date(),
      moderatedById: input.moderatorId,
    },
  });

  return updated;
}
