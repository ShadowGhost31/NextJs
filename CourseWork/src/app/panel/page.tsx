import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { requireOrganizerOrAdmin } from "@/server/guards";
import { prisma } from "@/lib/db";
import { formatUahFromCents } from "@/server/services";

export const dynamic = "force-dynamic";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

export default async function PanelHomePage() {
  const me = await requireOrganizerOrAdmin("/panel");

  const eventWhere = me.role === "ADMIN" ? { city: "Житомир" } : { organizerId: me.sub };

  const events = await prisma.event.findMany({
    where: eventWhere,
    include: { ticketTypes: true },
  });

  const byStatus = events.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const ticketsSold = events.reduce(
    (s, e) => s + e.ticketTypes.reduce((t, tt) => t + tt.quantitySold, 0),
    0
  );

  const orderItems = await prisma.orderItem.findMany({
    where: me.role === "ADMIN"
      ? { ticketType: { event: { city: "Житомир" } } }
      : { ticketType: { event: { organizerId: me.sub } } },
    select: { quantity: true, unitPrice: true },
  });

  const revenue = orderItems.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Подій (усього)" value={String(events.length)} />
        <Stat label="Опубліковано" value={String(byStatus.PUBLISHED || 0)} />
        <Stat label="Чернетки" value={String(byStatus.DRAFT || 0)} />
        <Stat label="Скасовано" value={String(byStatus.CANCELED || 0)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold">Продажі</h2>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Продано квитків</div>
                <Badge>{ticketsSold}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">Сума замовлень</div>
                <Badge>{formatUahFromCents(revenue)} грн</Badge>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Оплата не інтегрована. Сума рахується за створеними замовленнями.
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold">Підказка</h2>
            <div className="text-sm text-slate-600 mt-2 space-y-2">
              <div>
                1) Створи подію у розділі "Події".
              </div>
              <div>
                2) Додай типи квитків та опублікуй подію.
              </div>
              <div>
                3) Перевір замовлення у розділі "Замовлення".
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
