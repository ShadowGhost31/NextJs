import Card from "@/components/Card";
import Link from "next/link";
import { metaService } from "@/server/services";

export default async function EventForm({
  title,
  action,
  initial,
}: {
  title: string;
  action: (formData: FormData) => Promise<void>;
  initial?: {
    title?: string;
    description?: string;
    categoryId?: string;
    venueId?: string;
    imageUrl?: string | null;
    startAt?: Date;
    endAt?: Date | null;
  };
}) {
  const { categories, venues } = await metaService.listCatalogMeta();

  const startVal = initial?.startAt ? new Date(initial.startAt).toISOString().slice(0, 16) : "";
  const endVal = initial?.endAt ? new Date(initial.endAt).toISOString().slice(0, 16) : "";

  return (
    <Card>
      <div className="p-5 space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="text-sm text-slate-600 mt-1">
              Поля відповідають вимогам курсового проєкту: опис, дата/час, локація, категорія.
            </div>
          </div>
          <Link
            href="/panel/events"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm hover:bg-white transition"
          >
            До списку
          </Link>
        </div>

        <form action={action} className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            defaultValue={initial?.title || ""}
            placeholder="Назва події"
            className="md:col-span-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />

          <textarea
            name="description"
            defaultValue={initial?.description || ""}
            placeholder="Опис"
            rows={6}
            className="md:col-span-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />

          <select
            name="categoryId"
            defaultValue={initial?.categoryId || ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
          >
            <option value="">Категорія</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            name="venueId"
            defaultValue={initial?.venueId || ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
          >
            <option value="">Локація</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>

          <input
            name="imageUrl"
            defaultValue={initial?.imageUrl || ""}
            placeholder="URL зображення (опційно)"
            className="md:col-span-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />

          <div>
            <label className="text-xs text-slate-500">Початок</label>
            <input
              type="datetime-local"
              name="startAt"
              defaultValue={startVal}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">Завершення (опційно)</label>
            <input
              type="datetime-local"
              name="endAt"
              defaultValue={endVal}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
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
