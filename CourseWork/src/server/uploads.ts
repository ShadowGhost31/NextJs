import { prisma } from "@/lib/db";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function isFileValue(v: unknown): v is File {
  return !!v && typeof v === "object" && typeof (v as any).arrayBuffer === "function";
}

export function validateImageFile(file: File) {
  if (!file || file.size === 0) return { ok: false as const, error: "Файл порожній" };
  if (file.size > MAX_BYTES) return { ok: false as const, error: "Файл занадто великий (макс. 5 МБ)" };
  if (!ALLOWED_MIME.has(file.type)) return { ok: false as const, error: "Дозволені формати: JPG, PNG, WEBP, GIF" };
  return { ok: true as const };
}

export async function deleteEventImage(eventId: string) {
  await prisma.eventImage.deleteMany({ where: { eventId } });
}

export async function saveEventImageFromFile(input: { eventId: string; file: File }) {
  const check = validateImageFile(input.file);
  if (!check.ok) return { ok: false as const, error: check.error };

  const buf = Buffer.from(await input.file.arrayBuffer());
  await prisma.eventImage.upsert({
    where: { eventId: input.eventId },
    create: { eventId: input.eventId, mime: input.file.type, data: buf },
    update: { mime: input.file.type, data: buf },
  });

  return { ok: true as const };
}

export async function saveEventImageFromUrl(input: { eventId: string; url: string }) {
  const url = input.url.trim();
  if (!/^https?:\/\//.test(url)) return { ok: false as const, error: "Посилання має починатися з http:// або https://" };

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return { ok: false as const, error: "Не вдалося завантажити зображення за посиланням" };

    const mime = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!ALLOWED_MIME.has(mime)) return { ok: false as const, error: "Дозволені формати: JPG, PNG, WEBP, GIF" };

    const len = res.headers.get("content-length");
    if (len) {
      const n = Number(len);
      if (Number.isFinite(n) && n > MAX_BYTES) return { ok: false as const, error: "Файл занадто великий (макс. 5 МБ)" };
    }

    const ab = await res.arrayBuffer();
    if (ab.byteLength > MAX_BYTES) return { ok: false as const, error: "Файл занадто великий (макс. 5 МБ)" };

    const buf = Buffer.from(ab);
    await prisma.eventImage.upsert({
      where: { eventId: input.eventId },
      create: { eventId: input.eventId, mime, data: buf },
      update: { mime, data: buf },
    });

    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Не вдалося завантажити зображення за посиланням" };
  } finally {
    clearTimeout(t);
  }
}
