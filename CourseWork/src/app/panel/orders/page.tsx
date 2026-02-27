import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { requireOrganizerOrAdmin } from "@/server/guards";
import { orderService, formatUahFromCents } from "@/server/services";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PanelOrdersPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const me = await requireOrganizerOrAdmin("/panel/orders");
  const all = await orderService.listOrganizerOrders({ organizerId: me.sub, isAdmin: me.role === "ADMIN" });

  const filterEventId = (searchParams?.eventId || "").trim();
  const items = filterEventId ? all.filter((it: any) => it.ticketType.eventId === filterEventId) : all;

  const totalQty = items.reduce((s: number, it: any) => s + it.quantity, 0);
  const totalSum = items.reduce((s: number, it: any) => s + it.quantity * it.unitPrice, 0);

  return (
    <div className="space-y-5">
      <Card>
        <div className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Замовлення</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>позицій: {items.length}</Badge>
              <Badge>квитків: {totalQty}</Badge>
              <Badge>сума: {formatUahFromCents(totalSum)} грн</Badge>
            </div>
          </div>

          {filterEventId ? (
            <Link
              href="/panel/orders"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              Скинути фільтр
            </Link>
          ) : (
            <Link
              href="/panel/events"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              До подій
            </Link>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-5">
          <h3 className="text-lg font-semibold">Список</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="py-2 pr-4">Дата</th>
                  <th className="py-2 pr-4">Подія</th>
                  <th className="py-2 pr-4">Покупець</th>
                  <th className="py-2 pr-4">Квиток</th>
                  <th className="py-2 pr-4">К-сть</th>
                  <th className="py-2 pr-4">Сума</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it: any) => (
                  <tr key={it.id} className="border-t border-white/10">
                    <td className="py-2 pr-4 whitespace-nowrap">{formatDateTime(new Date(it.order.createdAt))}</td>
                    <td className="py-2 pr-4">
                      <Link href={`/panel/events/${it.ticketType.eventId}/orders`} className="hover:text-brand-blue transition">
                        {it.ticketType.event.title}
                      </Link>
                      <div className="text-xs text-slate-400">{it.ticketType.event.venue.title}</div>
                    </td>
                    <td className="py-2 pr-4">
                      {(it.order.user.name || "Користувач")}
                      <div className="text-xs text-slate-400">{it.order.user.email}</div>
                    </td>
                    <td className="py-2 pr-4">{it.ticketType.name}</td>
                    <td className="py-2 pr-4">{it.quantity}</td>
                    <td className="py-2 pr-4">{formatUahFromCents(it.quantity * it.unitPrice)} грн</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <div className="text-slate-300">Замовлень ще немає.</div>}
          </div>
        </div>
      </Card>
    </div>
  );
}
