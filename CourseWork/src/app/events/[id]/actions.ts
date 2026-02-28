"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/guards";
import { deleteReview } from "@/server/services/reviews";

export async function deleteReviewAction(reviewId: string, eventId: string) {
  await requireAdmin(`/events/${eventId}`);
  await deleteReview(reviewId);
  revalidatePath(`/events/${eventId}`);
}
