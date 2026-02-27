import Link from "next/link";
import { requireAuth } from "@/server/guards";
import Card from "@/components/Card";

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

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireAuth("/account");

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Особистий кабінет</h1>
          <p className="text-sm text-slate-300 mt-1">Профіль, замовлення, відгуки та обране</p>
        </div>
      </div>

      <Card>
        <div className="p-4 md:p-5 flex flex-wrap gap-2">
          <Tab href="/account" label="Профіль" />
          <Tab href="/account/orders" label="Мої замовлення" />
          <Tab href="/account/reviews" label="Мої відгуки" />
          <Tab href="/account/favorites" label="Обране" />
        </div>
      </Card>

      {children}
    </div>
  );
}
