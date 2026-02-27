import { prisma } from "@/lib/db";
import { ReviewStatus } from "@prisma/client";

export async function createReview(input: { eventId: string; userId: string; rating: number; text: string }) {
  try {
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
  } catch {
    return { ok: false as const, error: "Ви вже залишали відгук" };
  }
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
