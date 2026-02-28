import Card from "@/components/Card";
import Link from "next/link";
import { metaService } from "@/server/services";

type FieldErrors = Record<string, string>;

type Initial = {
  title?: string;
  description?: string;
  categoryId?: string;
  venueId?: string;
  imageUrl?: string | null;
  startAt?: Date;
  endAt?: Date | null;
};

export default async function EventForm({
  title,
  action,
  initial,
  fieldErrors,
  formError,
}: {
  title: string;
  action: (formData: FormData) => Promise<void>;
  initial?: Initial;
  fieldErrors?: FieldErrors;
  formError?: string | null;
}) {
  const { categories, venues } = await metaService.listCatalogMeta();

  const fmt = (d: Date) => {
    const p2 = (n: number) => String(n).padStart(2, "0");
    const x = new Date(d);
    return `${x.getFullYear()}-${p2(x.getMonth() + 1)}-${p2(x.getDate())}T${p2(x.getHours())}:${p2(x.getMinutes())}`;
  };

  const startVal = initial?.startAt ? fmt(initial.startAt) : "";
  const endVal = initial?.endAt ? fmt(initial.endAt) : "";

  const remoteImageVal = initial?.imageUrl && /^https?:\/\//.test(initial.imageUrl) ? initial.imageUrl : "";

  const e = fieldErrors || {};

  const inputBase = "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue";

  return (
    <Card>
      <div className="p-5 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="text-sm text-slate-600 mt-1">
              Поля відповідають вимогам курсового проєкту: опис, дата/час, локація, категорія.
            </div>
            {formError && <div className="text-sm text-rose-600 mt-2">{formError}</div>}
          </div>
          <Link
            href="/panel/events"
            className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition"
          >
            До списку
          </Link>
        </div>

        <form action={action} encType="multipart/form-data" className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <input
              name="title"
              defaultValue={initial?.title || ""}
              placeholder="Назва події"
              className={`${inputBase} ${e.title ? "border-rose-400" : "border-slate-200"}`}
            />
            {e.title && <div className="mt-1 text-xs text-rose-600">{e.title}</div>}
          </div>

          <div className="md:col-span-2">
            <textarea
              name="description"
              defaultValue={initial?.description || ""}
              placeholder="Опис"
              rows={6}
              className={`${inputBase} ${e.description ? "border-rose-400" : "border-slate-200"}`}
            />
            {e.description && <div className="mt-1 text-xs text-rose-600">{e.description}</div>}
          </div>

          <div>
            <select
              name="categoryId"
              defaultValue={initial?.categoryId || ""}
              className={`${inputBase} ${e.categoryId ? "border-rose-400" : "border-slate-200"}`}
            >
              <option value="">Категорія</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {e.categoryId && <div className="mt-1 text-xs text-rose-600">{e.categoryId}</div>}
          </div>

          <div>
            <select
              name="venueId"
              defaultValue={initial?.venueId || ""}
              className={`${inputBase} ${e.venueId ? "border-rose-400" : "border-slate-200"}`}
            >
              <option value="">Локація</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title}
                </option>
              ))}
            </select>
            {e.venueId && <div className="mt-1 text-xs text-rose-600">{e.venueId}</div>}
          </div>

          <div className="md:col-span-2 space-y-2">
            {initial?.imageUrl && (
              <div className="space-y-2">
                <div className="text-xs text-slate-500">Поточне зображення</div>
                <img
                  src={initial.imageUrl}
                  alt=""
                  className="w-full max-h-56 object-cover rounded-2xl border border-slate-200"
                />
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" name="removeImage" className="h-4 w-4" />
                  Видалити поточне зображення
                </label>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-500">Зображення з ПК (опційно)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className={`${inputBase} mt-1 px-3 py-[9px] ${e.image ? "border-rose-400" : "border-slate-200"}`}
              />
              {e.image && <div className="mt-1 text-xs text-rose-600">{e.image}</div>}
            </div>

            <div>
              <input
                name="imageUrl"
                defaultValue={remoteImageVal}
                placeholder="URL зображення (опційно)"
                className={`${inputBase} ${e.imageUrl ? "border-rose-400" : "border-slate-200"}`}
              />
              {e.imageUrl && <div className="mt-1 text-xs text-rose-600">{e.imageUrl}</div>}
              <div className="mt-1 text-xs text-slate-500">Якщо обрано файл — посилання ігнорується.</div>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">Початок</label>
            <input
              type="datetime-local"
              name="startAt"
              defaultValue={startVal}
              className={`${inputBase} mt-1 ${e.startAt ? "border-rose-400" : "border-slate-200"}`}
            />
            {e.startAt && <div className="mt-1 text-xs text-rose-600">{e.startAt}</div>}
          </div>

          <div>
            <label className="text-xs text-slate-500">Завершення (опційно)</label>
            <input
              type="datetime-local"
              name="endAt"
              defaultValue={endVal}
              className={`${inputBase} mt-1 ${e.endAt ? "border-rose-400" : "border-slate-200"}`}
            />
            {e.endAt && <div className="mt-1 text-xs text-rose-600">{e.endAt}</div>}
          </div>

          <button className="md:col-span-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            Зберегти
          </button>
        </form>

        <div className="text-xs text-slate-500">
          Подія створюється як "Чернетка". Після додавання квитків її можна опублікувати.
        </div>
      </div>
    </Card>
  );
}
