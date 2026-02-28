"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EventStatus } from "@prisma/client";
import { encodeFieldErrors, zodToFieldErrors } from "@/lib/validation";
import { requireOrganizerOrAdmin } from "@/server/guards";
import { eventUpsertSchema, ticketCreateSchema, ticketUpdateSchema } from "@/server/schemas";
import { deleteEventImage, isFileValue, saveEventImageFromFile, saveEventImageFromUrl, validateImageFile } from "@/server/uploads";
import { eventService, ticketService } from "@/server/services";

function buildRedirect(path: string, input: { error?: string; fieldErrors?: Record<string, string> }) {
  const params = new URLSearchParams();
  if (input.error) params.set("error", input.error);
  if (input.fieldErrors && Object.keys(input.fieldErrors).length) {
    params.set("fe", encodeFieldErrors(input.fieldErrors));
  }
  const qs = params.toString();
  redirect(qs ? `${path}?${qs}` : path);
}

export async function saveEventAction(eventId: string | null, formData: FormData) {
  const path = eventId ? `/panel/events/${eventId}/edit` : "/panel/events/new";
  const me = await requireOrganizerOrAdmin(path);

  const parsed = eventUpsertSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    venueId: formData.get("venueId"),
    imageUrl: formData.get("imageUrl"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
  });

  if (!parsed.success) {
    buildRedirect(path, { fieldErrors: zodToFieldErrors(parsed.error) });
  }

  const removeImage = formData.get("removeImage") === "on";

  const fileEntry = formData.get("image");
  const imageFile = isFileValue(fileEntry) ? fileEntry : null;
  const hasFile = !!imageFile && imageFile.size > 0;

  const startAt = new Date(parsed.data.startAt);
  const endAtStr = (parsed.data.endAt ? String(parsed.data.endAt) : "").trim();
  const endAt = endAtStr ? new Date(endAtStr) : null;

  const fieldErrors: Record<string, string> = {};

  if (endAt && endAt.getTime() <= startAt.getTime()) {
    fieldErrors.endAt = "Кінець має бути після початку";
  }

  const imageUrlInput = (parsed.data.imageUrl ? String(parsed.data.imageUrl) : "").trim();

  if (imageFile && imageFile.size > 0) {
    const check = validateImageFile(imageFile);
    if (!check.ok) fieldErrors.image = check.error;
  }

  if (Object.keys(fieldErrors).length) {
    buildRedirect(path, { fieldErrors });
  }

  const res = await eventService.upsertEvent({
    organizerId: me.sub,
    isAdmin: me.role === "ADMIN",
    eventId: eventId || undefined,
    title: parsed.data.title,
    description: parsed.data.description,
    categoryId: parsed.data.categoryId,
    venueId: parsed.data.venueId,
    startAt,
    endAt,
  });

  if (!res.ok) buildRedirect(path, { error: res.error });

  if (removeImage) {
    await deleteEventImage(res.event.id).catch(() => undefined);
  }

  if (!removeImage && imageFile && imageFile.size > 0) {
    const saved = await saveEventImageFromFile({ eventId: res.event.id, file: imageFile });
    if (!saved.ok) buildRedirect(`/panel/events/${res.event.id}/edit`, { fieldErrors: { image: saved.error } });
  }

  if (!removeImage && (!imageFile || imageFile.size === 0) && imageUrlInput) {
    const saved = await saveEventImageFromUrl({ eventId: res.event.id, url: imageUrlInput });
    if (!saved.ok) buildRedirect(`/panel/events/${res.event.id}/edit`, { fieldErrors: { imageUrl: saved.error } });
  }

  revalidatePath("/panel/events");
  revalidatePath(`/panel/events/${res.event.id}`);
  revalidatePath(`/events/${res.event.id}`);
  redirect(`/panel/events/${res.event.id}/edit?saved=1`);
}

export async function setEventStatusAction(eventId: string, status: EventStatus) {
  const me = await requireOrganizerOrAdmin(`/panel/events/${eventId}/edit`);
  const res = await eventService.setEventStatus({
    eventId,
    actorId: me.sub,
    isAdmin: me.role === "ADMIN",
    status,
  });

  if (!res.ok) redirect(`/panel/events/${eventId}/edit?error=${encodeURIComponent(res.error)}`);

  revalidatePath("/panel/events");
  revalidatePath(`/panel/events/${eventId}`);
  revalidatePath(`/events/${eventId}`);
}

export async function createTicketTypeAction(eventId: string, formData: FormData) {
  const me = await requireOrganizerOrAdmin(`/panel/events/${eventId}/tickets`);

  const parsed = ticketCreateSchema.safeParse({
    name: formData.get("name"),
    priceUah: formData.get("priceUah"),
    quantityTotal: formData.get("quantityTotal"),
  });

  if (!parsed.success) {
    const fe = zodToFieldErrors(parsed.error);
    const msg = fe._form || fe.name || fe.priceUah || fe.quantityTotal || "Некоректні дані";
    redirect(`/panel/events/${eventId}/tickets?error=${encodeURIComponent(msg)}`);
  }

  const res = await ticketService.createTicketType({
    eventId,
    actorId: me.sub,
    isAdmin: me.role === "ADMIN",
    name: parsed.data.name,
    priceUah: parsed.data.priceUah,
    quantityTotal: parsed.data.quantityTotal,
  });

  if (!res.ok) redirect(`/panel/events/${eventId}/tickets?error=${encodeURIComponent(res.error)}`);

  revalidatePath(`/panel/events/${eventId}/tickets`);
  revalidatePath(`/events/${eventId}`);
}

export async function updateTicketTypeAction(ticketTypeId: string, eventId: string, formData: FormData) {
  const me = await requireOrganizerOrAdmin(`/panel/events/${eventId}/tickets`);

  const isActive = formData.get("isActive") === "on";

  const parsed = ticketUpdateSchema.safeParse({
    name: formData.get("name"),
    priceUah: formData.get("priceUah"),
    quantityTotal: formData.get("quantityTotal"),
    isActive: isActive ? "true" : "false",
  });

  if (!parsed.success) {
    const fe = zodToFieldErrors(parsed.error);
    const msg = fe._form || fe.name || fe.priceUah || fe.quantityTotal || "Некоректні дані";
    redirect(`/panel/events/${eventId}/tickets?error=${encodeURIComponent(msg)}`);
  }

  const res = await ticketService.updateTicketType({
    ticketTypeId,
    actorId: me.sub,
    isAdmin: me.role === "ADMIN",
    name: parsed.data.name,
    priceUah: parsed.data.priceUah,
    quantityTotal: parsed.data.quantityTotal,
    isActive,
  });

  if (!res.ok) redirect(`/panel/events/${eventId}/tickets?error=${encodeURIComponent(res.error)}`);

  revalidatePath(`/panel/events/${eventId}/tickets`);
  revalidatePath(`/events/${eventId}`);
}

export async function deleteEventAction(eventId: string) {
  const me = await requireOrganizerOrAdmin(`/panel/events/${eventId}/edit`);
  const res = await eventService.deleteEventIfAllowed({
    eventId,
    actorId: me.sub,
    isAdmin: me.role === "ADMIN",
  });

  if (!res.ok) redirect(`/panel/events?error=${encodeURIComponent(res.error)}`);

  await deleteEventImage(eventId).catch(() => undefined);

  revalidatePath("/panel/events");
  revalidatePath("/events");
  redirect("/panel/events");
}
