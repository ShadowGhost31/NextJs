import Link from "next/link";
import Card from "@/components/Card";
import { formatDateTime } from "@/lib/utils";
import { requireAuth } from "@/server/guards";
import { orderService } from "@/server/services";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const me = await requireAuth("/account/orders");
  const orders = await orderService.listUserOrders(me.sub);

  return (
    <Card>
      <div className="p-5">
        <h2 className="text-lg font-semibold">Мої замовлення</h2>
        <div className="mt-3 space-y-3">
          {orders.length === 0 && <div className="text-slate-300">Замовлень ще немає.</div>}

          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-300">
                {formatDateTime(new Date(o.createdAt))} • Статус: {o.status} • Сума: {(o.total / 100).toFixed(2)} грн
              </div>
              <ul className="mt-2 text-sm text-slate-100 space-y-1">
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
