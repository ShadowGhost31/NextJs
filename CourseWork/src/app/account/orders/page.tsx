import Link from "next/link";
import Card from "@/components/Card";
import ConfirmForm from "@/components/ConfirmForm";
import { formatDateTime } from "@/lib/utils";
import { requireAuth } from "@/server/guards";
import { orderService } from "@/server/services";
import { cancelOrderAction, payOrderAction } from "./actions";

export const dynamic = "force-dynamic";

function statusLabel(s: string) {
  if (s === "PAID") return "Оплачено";
  if (s === "CANCELED") return "Скасовано";
  return "Очікує оплати";
}

function statusClass(s: string) {
  if (s === "PAID") return "border-brand-green/50 bg-brand-green/15 text-brand-green";
  if (s === "CANCELED") return "border-white/15 bg-white/5 text-slate-300";
  return "border-brand-orange/50 bg-brand-orange/15 text-brand-orange";
}

function flash(searchParams: Record<string, string | string[] | undefined>) {
  const msg = typeof searchParams.msg === "string" ? searchParams.msg : "";
  const text = typeof searchParams.text === "string" ? searchParams.text : "";
  if (!msg) return null;

  if (msg === "paid") return { tone: "ok" as const, text: "Замовлення оплачено." };
  if (msg === "canceled") return { tone: "ok" as const, text: "Замовлення скасовано." };
  if (msg === "error") return { tone: "err" as const, text: text || "Сталася помилка." };
  return null;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const me = await requireAuth("/account/orders");
  const orders = await orderService.listUserOrders(me.sub);
  const f = flash(searchParams);

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Мої замовлення</h2>
            <div className="text-sm text-slate-300 mt-1">Оплата симульована (без платіжної інтеграції).</div>
          </div>
          <Link
            href="/events"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
          >
            Каталог
          </Link>
        </div>

        {f && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              f.tone === "ok" ? "border-brand-green/50 bg-brand-green/10 text-slate-100" : "border-brand-orange/50 bg-brand-orange/10 text-slate-100"
            }`}
          >
            {f.text}
          </div>
        )}

        <div className="mt-4 space-y-3">
          {orders.length === 0 && <div className="text-slate-300">Замовлень ще немає.</div>}

          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-300">
                  {formatDateTime(new Date(o.createdAt))} • Сума: {(o.total / 100).toFixed(2)} грн
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(o.status)}`}>
                    {statusLabel(o.status)}
                  </span>

                  {(o.status === "CREATED" || o.status === "PENDING_PAYMENT") && (
                    <>
                      <form action={payOrderAction}>
                        <input type="hidden" name="orderId" value={o.id} />
                        <button className="rounded-xl bg-brand-blue px-3 py-2 text-xs font-semibold text-slate-950 hover:opacity-90 transition">
                          Оплатити
                        </button>
                      </form>

                      <ConfirmForm action={cancelOrderAction} confirmText="Скасувати це замовлення? Кількість квитків повернеться в наявність.">
                        <input type="hidden" name="orderId" value={o.id} />
                        <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 transition">
                          Скасувати
                        </button>
                      </ConfirmForm>
                    </>
                  )}
                </div>
              </div>

              <ul className="mt-3 text-sm text-slate-100 space-y-1">
                {o.items.map((it) => (
                  <li key={it.id}>
                    <Link href={`/events/${it.ticketType.event.id}`} className="hover:text-brand-blue transition">
                      {it.ticketType.event.title}
                    </Link>{" "}
                    — {it.ticketType.name} ×{it.quantity}
                    <span className="text-slate-400"> • {it.ticketType.event.venue.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
