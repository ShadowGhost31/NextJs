import Link from "next/link";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrganizerPage({ params }: { params: { id: string } }) {
  const organizer = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, name: true },
  });

  if (!organizer) {
    return (
      <Card>
        <div className="p-5">
          <div className="text-slate-200">Організатора не знайдено.</div>
          <Link href="/" className="inline-block mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
            На головну
          </Link>
        </div>
      </Card>
    );
  }

  const events = await prisma.event.findMany({
    where: { organizerId: organizer.id, status: "PUBLISHED", city: "Житомир" },
    include: { venue: true, category: true, ticketTypes: { where: { isActive: true } }, reviews: { where: { status: "APPROVED" } } },
    orderBy: { startAt: "asc" },
  });

  return (
    <div className="space-y-5">
      <Card>
        <div className="p-5">
          <h1 className="text-2xl font-semibold tracking-tight">Організатор</h1>
          <div className="text-slate-200 mt-1">{organizer.name || "Організатор"}</div>
          <div className="text-sm text-slate-300 mt-2">Опубліковані події цього організатора</div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e) => {
          const avg = e.reviews.length ? e.reviews.reduce((s, r) => s + r.rating, 0) / e.reviews.length : 0;
          const minPrice = e.ticketTypes.length ? Math.min(...e.ticketTypes.map((t) => t.price)) : null;
          return (
            <Card key={e.id}>
              <div className="p-5 space-y-3">
                <Link href={`/events/${e.id}`} className="text-lg font-semibold hover:text-brand-blue transition">
                  {e.title}
                </Link>
                <div className="flex flex-wrap gap-2">
                  <Badge>{formatDateTime(new Date(e.startAt))}</Badge>
                  <Badge>{e.venue.title}</Badge>
                  <Badge>{e.category.title}</Badge>
                  <Badge>Рейтинг: {Number(avg.toFixed(2))}</Badge>
                  {minPrice != null ? <Badge>від {(minPrice / 100).toFixed(2)} грн</Badge> : <Badge>квитків немає</Badge>}
                </div>
                <div className="text-sm text-slate-300">{e.description}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {events.length === 0 && <div className="text-slate-300">Подій поки немає.</div>}
    </div>
  );
}
