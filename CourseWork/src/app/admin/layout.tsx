import Link from "next/link";
import Card from "@/components/Card";
import { requireAdmin } from "@/server/guards";

export const dynamic = "force-dynamic";

function Tab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:bg-white transition"
    >
      {label}
    </Link>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireAdmin("/admin");

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Адмін-панель</h1>
          <p className="text-sm text-slate-600 mt-1">Ролі, модерація відгуків та контроль контенту</p>
        </div>
        <div className="text-sm text-slate-600">{me.email} • {me.role}</div>
      </div>

      <Card>
        <div className="p-4 md:p-5 flex flex-wrap gap-2">
          <Tab href="/admin/users" label="Користувачі" />
          <Tab href="/admin/reviews" label="Відгуки" />
          <Tab href="/admin/events" label="Події" />
        </div>
      </Card>

      {children}
    </div>
  );
}
