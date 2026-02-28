import { z } from "zod";

const asString = (v: unknown) => (typeof v === "string" ? v : "");

const emailSchema = z.preprocess(
  (v) => asString(v).trim().toLowerCase(),
  z
    .string()
    .min(1, "Вкажіть email")
    .email("Невірний формат email")
);

const passwordSchema = z.preprocess(
  (v) => asString(v),
  z
    .string()
    .min(1, "Вкажіть пароль")
    .min(6, "Пароль має бути мін. 6 символів")
    .max(100, "Пароль занадто довгий")
);

const optionalNameSchema = z.preprocess(
  (v) => asString(v).trim(),
  z
    .string()
    .max(60, "Імʼя занадто довге")
    .refine((s) => s === "" || s.length >= 2, "Імʼя має бути мін. 2 символи")
);

const dtLocalSchema = z
  .preprocess((v) => asString(v).trim(), z.string().min(1, "Вкажіть дату та час"))
  .refine((s) => !Number.isNaN(new Date(s).getTime()), "Некоректна дата");

const optionalDtLocalSchema = z
  .preprocess((v) => asString(v).trim(), z.string())
  .refine((s) => s === "" || !Number.isNaN(new Date(s).getTime()), "Некоректна дата");


const imageUrlSchema = z.preprocess((v) => asString(v).trim(), z.string()).refine(
  (s) => {
    if (!s) return true;
    return z.string().url().safeParse(s).success;
  },
  "Невірний URL зображення"
);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: optionalNameSchema.optional(),
});

export const orderCreateSchema = z.object({
  ticketTypeId: z.preprocess((v) => asString(v).trim(), z.string().min(1, "Оберіть тип квитка")),
  quantity: z.number().int().min(1, "Мінімум 1") .max(10, "Максимум 10"),
});

export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1, "Оцінка 1–5") .max(5, "Оцінка 1–5"),
  text: z.preprocess(
    (v) => asString(v).trim(),
    z.string().min(3, "Текст має бути мін. 3 символи").max(800, "Текст занадто довгий")
  ),
});

export const eventUpsertSchema = z.object({
  title: z.preprocess(
    (v) => asString(v).trim(),
    z.string().min(3, "Назва має бути мін. 3 символи").max(120, "Назва занадто довга")
  ),
  description: z.preprocess(
    (v) => asString(v).trim(),
    z.string().min(10, "Опис має бути мін. 10 символів").max(4000, "Опис занадто довгий")
  ),
  categoryId: z.preprocess((v) => asString(v).trim(), z.string().min(1, "Оберіть категорію")),
  venueId: z.preprocess((v) => asString(v).trim(), z.string().min(1, "Оберіть локацію")),
  imageUrl: imageUrlSchema.optional(),
  startAt: dtLocalSchema,
  endAt: optionalDtLocalSchema.optional(),
});

export const ticketCreateSchema = z.object({
  name: z.preprocess(
    (v) => asString(v).trim(),
    z.string().min(2, "Назва має бути мін. 2 символи").max(60, "Назва занадто довга")
  ),
  priceUah: z.preprocess(
    (v) => asString(v).trim(),
    z
      .string()
      .min(1, "Вкажіть ціну")
      .refine((s) => /^\d+(?:[.,]\d{1,2})?$/.test(s), "Некоректна ціна")
  ),
  quantityTotal: z.preprocess(
    (v) => asString(v).trim(),
    z
      .string()
      .min(1, "Вкажіть кількість")
      .refine((s) => /^\d+$/.test(s), "Кількість має бути цілим числом")
  ),
});

export const ticketUpdateSchema = z.object({
  name: z.preprocess(
    (v) => asString(v).trim(),
    z.string().min(2, "Назва має бути мін. 2 символи").max(60, "Назва занадто довга")
  ),
  priceUah: z.preprocess(
    (v) => asString(v).trim(),
    z
      .string()
      .min(1, "Вкажіть ціну")
      .refine((s) => /^\d+(?:[.,]\d{1,2})?$/.test(s), "Некоректна ціна")
  ),
  quantityTotal: z.preprocess(
    (v) => asString(v).trim(),
    z
      .string()
      .min(1, "Вкажіть кількість")
      .refine((s) => /^\d+$/.test(s), "Кількість має бути цілим числом")
  ),
  isActive: z.enum(["true", "false"]).optional(),
});

export const roleUpdateSchema = z.object({
  role: z.enum(["USER", "ORGANIZER", "ADMIN"]),
});

export const reviewModerationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectReason: z.preprocess(
    (v) => asString(v).trim(),
    z.string().max(200, "Причина занадто довга")
  ).optional(),
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
