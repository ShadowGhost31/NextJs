import Link from "next/link";
import Card from "@/components/Card";
import { requireOrganizerOrAdmin } from "@/server/guards";

export const dynamic = "force-dynamic";

function Tab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
    >
      {label}
    </Link>
  );
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await requireOrganizerOrAdmin("/panel");

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Панель керування</h1>
          <p className="text-sm text-slate-300 mt-1">
            Події, квитки та замовлення організатора
          </p>
        </div>
        <div className="text-sm text-slate-300">{me.email} • {me.role}</div>
      </div>

      <Card>
        <div className="p-4 md:p-5 flex flex-wrap gap-2">
          <Tab href="/panel" label="Огляд" />
          <Tab href="/panel/events" label="Події" />
          <Tab href="/panel/orders" label="Замовлення" />
        </div>
      </Card>

      {children}
    </div>
  );
}
