import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { requireOrganizerOrAdmin } from "@/server/guards";
import { eventService, orderService, formatUahFromCents } from "@/server/services";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EventOrdersPage({ params }: { params: { id: string } }) {
  const me = await requireOrganizerOrAdmin(`/panel/events/${params.id}/orders`);
  const event = await eventService.getOrganizerEvent(params.id, me.sub, me.role === "ADMIN");

  if (!event) {
    return (
      <Card>
        <div className="p-5">
          <div className="text-slate-200">Подію не знайдено або недостатньо прав.</div>
          <Link href="/panel/events" className="inline-block mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
            До списку подій
          </Link>
        </div>
      </Card>
    );
  }

  const all = await orderService.listOrganizerOrders({ organizerId: me.sub, isAdmin: me.role === "ADMIN" });
  const items = all.filter((it: any) => it.ticketType.eventId === event.id);

  const totalQty = items.reduce((s: number, it: any) => s + it.quantity, 0);
  const totalSum = items.reduce((s: number, it: any) => s + it.quantity * it.unitPrice, 0);

  return (
    <div className="space-y-5">
      <Card>
        <div className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Замовлення: {event.title}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>позицій: {items.length}</Badge>
              <Badge>квитків: {totalQty}</Badge>
              <Badge>сума: {formatUahFromCents(totalSum)} грн</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/panel/events/${event.id}/tickets`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
              Квитки
            </Link>
            <Link href={`/panel/orders?eventId=${encodeURIComponent(event.id)}`} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
              Усі замовлення
            </Link>
          </div>
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
                  <th className="py-2 pr-4">Покупець</th>
                  <th className="py-2 pr-4">Квиток</th>
                  <th className="py-2 pr-4">К-сть</th>
                  <th className="py-2 pr-4">Сума</th>
                  <th className="py-2 pr-4">Статус</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it: any) => (
                  <tr key={it.id} className="border-t border-white/10">
                    <td className="py-2 pr-4 whitespace-nowrap">{formatDateTime(new Date(it.order.createdAt))}</td>
                    <td className="py-2 pr-4">
                      {(it.order.user.name || "Користувач")}
                      <div className="text-xs text-slate-400">{it.order.user.email}</div>
                    </td>
                    <td className="py-2 pr-4">{it.ticketType.name}</td>
                    <td className="py-2 pr-4">{it.quantity}</td>
                    <td className="py-2 pr-4">{formatUahFromCents(it.quantity * it.unitPrice)} грн</td>
                    <td className="py-2 pr-4"><Badge>{it.order.status}</Badge></td>
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
