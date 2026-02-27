import Card from "@/components/Card";
import { requireAuth } from "@/server/guards";

export const dynamic = "force-dynamic";

export default async function AccountHomePage() {
  const me = await requireAuth("/account");

  return (
    <Card>
      <div className="p-5 space-y-2">
        <div className="text-sm text-slate-400">Email</div>
        <div className="text-lg font-semibold">{me.email}</div>
        <div className="text-sm text-slate-400 mt-4">Роль</div>
        <div className="text-lg font-semibold">{me.role}</div>
        <div className="text-sm text-slate-400 mt-4">Імʼя</div>
        <div className="text-lg font-semibold">{me.name || "—"}</div>
      </div>
    </Card>
  );
}
