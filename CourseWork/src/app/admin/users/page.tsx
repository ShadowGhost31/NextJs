import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { requireAdmin } from "@/server/guards";
import { userService } from "@/server/services";
import { formatDateTime } from "@/lib/utils";
import { setUserRoleAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: { searchParams: any }) {
  await requireAdmin("/admin/users");
  const users = await userService.listUsers();
  const error = String(searchParams?.error || "");

  return (
    <Card>
      <div className="p-5 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Користувачі та ролі</h2>
          <div className="text-sm text-slate-300 mt-1">
            Адміністратор може змінювати ролі користувачів: USER/ORGANIZER/ADMIN.
          </div>
          {error && <div className="text-sm text-rose-200 mt-2">Некоректні дані</div>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Імʼя</th>
                <th className="py-2 pr-4">Роль</th>
                <th className="py-2 pr-4">Створено</th>
                <th className="py-2 pr-4">Дія</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/10">
                  <td className="py-2 pr-4 whitespace-nowrap">{u.email}</td>
                  <td className="py-2 pr-4">{u.name || "—"}</td>
                  <td className="py-2 pr-4"><Badge>{u.role}</Badge></td>
                  <td className="py-2 pr-4 whitespace-nowrap">{formatDateTime(new Date(u.createdAt))}</td>
                  <td className="py-2 pr-4">
                    <form action={setUserRoleAction.bind(null, u.id)} className="flex items-center gap-2">
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
                      >
                        <option value="USER">USER</option>
                        <option value="ORGANIZER">ORGANIZER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition">
                        Зберегти
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
