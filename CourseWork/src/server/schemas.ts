import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
  password: z.string().min(6),
  name: z.string().trim().min(2).max(60).optional().or(z.literal("")),
});

export const orderCreateSchema = z.object({
  ticketTypeId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(3).max(800),
});

export const eventUpsertSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(4000),
  categoryId: z.string().min(1),
  venueId: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
  startAt: z.string().min(1),
  endAt: z.string().optional().or(z.literal("")),
});

export const ticketCreateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  priceUah: z.string().trim().min(1),
  quantityTotal: z.string().trim().min(1),
});

export const ticketUpdateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  priceUah: z.string().trim().min(1),
  quantityTotal: z.string().trim().min(1),
  isActive: z.enum(["true", "false"]).optional(),
});

export const roleUpdateSchema = z.object({
  role: z.enum(["USER", "ORGANIZER", "ADMIN"]),
});

export const reviewModerationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectReason: z.string().trim().max(200).optional().or(z.literal("")),
});

export const catalogQuerySchema = z.object({
  q: z.string().optional().default(""),
  category: z.string().optional().default(""),
  venue: z.string().optional().default(""),
  dateFrom: z.string().optional().default(""),
  dateTo: z.string().optional().default(""),
  priceMin: z.string().optional().default(""),
  priceMax: z.string().optional().default(""),
  free: z.string().optional().default(""),
  withTickets: z.string().optional().default(""),
  sort: z.enum(["soon", "new", "price_asc", "price_desc", "rating"]).optional().default("soon"),
  page: z.string().optional().default("1"),
});
