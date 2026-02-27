"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EventStatus, ReviewStatus, Role } from "@prisma/client";
import { requireAdmin } from "@/server/guards";
import { roleUpdateSchema, reviewModerationSchema } from "@/server/schemas";
import { reviewService, userService, eventService } from "@/server/services";

export async function setUserRoleAction(userId: string, formData: FormData) {
  await requireAdmin("/admin/users");

  const parsed = roleUpdateSchema.safeParse({ role: formData.get("role") });
  if (!parsed.success) redirect("/admin/users?error=invalid");

  await userService.setUserRole({ userId, role: parsed.data.role as Role });
  revalidatePath("/admin/users");
}

export async function moderateReviewAction(reviewId: string, formData: FormData) {
  const me = await requireAdmin("/admin/reviews");

  const parsed = reviewModerationSchema.safeParse({
    status: formData.get("status"),
    rejectReason: formData.get("rejectReason"),
  });

  if (!parsed.success) redirect("/admin/reviews?error=invalid");

  await reviewService.moderateReview({
    reviewId,
    moderatorId: me.sub,
    status: parsed.data.status as ReviewStatus.APPROVED | ReviewStatus.REJECTED,
    rejectReason: parsed.data.status === "REJECTED" ? parsed.data.rejectReason || "" : null,
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function setEventStatusAdminAction(eventId: string, status: EventStatus) {
  const me = await requireAdmin("/admin/events");

  await eventService.setEventStatus({
    eventId,
    actorId: me.sub,
    isAdmin: true,
    status,
  });

  revalidatePath("/admin/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");
}
