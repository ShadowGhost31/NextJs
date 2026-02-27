"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EventStatus } from "@prisma/client";
import { requireOrganizerOrAdmin } from "@/server/guards";
import { eventUpsertSchema, ticketCreateSchema, ticketUpdateSchema } from "@/server/schemas";
import { eventService, ticketService } from "@/server/services";

export async function saveEventAction(eventId: string | null, formData: FormData) {
  const me = await requireOrganizerOrAdmin(eventId ? `/panel/events/${eventId}/edit` : "/panel/events/new");

  const parsed = eventUpsertSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    venueId: formData.get("venueId"),
    imageUrl: formData.get("imageUrl"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
  });

  if (!parsed.success) redirect(`/panel/events${eventId ? `/${eventId}/edit` : "/new"}?error=invalid`);

  const startAt = new Date(parsed.data.startAt);
  const endAt = parsed.data.endAt ? new Date(parsed.data.endAt) : null;

  if (Number.isNaN(startAt.getTime()) || (endAt && Number.isNaN(endAt.getTime()))) {
    redirect(`/panel/events${eventId ? `/${eventId}/edit` : "/new"}?error=date`);
  }

  const res = await eventService.upsertEvent({
    organizerId: me.sub,
    isAdmin: me.role === "ADMIN",
    eventId: eventId || undefined,
    title: parsed.data.title,
    description: parsed.data.description,
    categoryId: parsed.data.categoryId,
    venueId: parsed.data.venueId,
    imageUrl: parsed.data.imageUrl ? String(parsed.data.imageUrl) : null,
    startAt,
    endAt,
  });

  if (!res.ok) redirect(`/panel/events${eventId ? `/${eventId}/edit` : "/new"}?error=${encodeURIComponent(res.error)}`);

  revalidatePath("/panel/events");
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

  if (!parsed.success) redirect(`/panel/events/${eventId}/tickets?error=invalid`);

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

  if (!parsed.success) redirect(`/panel/events/${eventId}/tickets?error=invalid`);

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

  revalidatePath("/panel/events");
  redirect("/panel/events");
}
