import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUserFromCookie } from "@/lib/auth";
import AuthButtons from "@/components/AuthButtons";
import { site } from "./metadata";

export const metadata = {
  title: site.name,
  description: site.description,
  icons: { icon: "/favicon.png" },
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm text-slate-800 hover:bg-white/60 transition"
    >
      {children}
    </Link>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUserFromCookie();
  const canPanel = !!me && (me.role === "ORGANIZER" || me.role === "ADMIN");
  const canAdmin = !!me && me.role === "ADMIN";

  return (
    <html lang="uk">
      <body className="min-h-screen bg-white text-slate-900">
        <header className="sticky top-0 z-50 border-b border-yellow-200 bg-brand-yellow">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2">
                <span className="relative h-8 w-8 overflow-hidden rounded-xl border border-yellow-200 bg-white">
                  <Image src="/logo.png" alt="Житомир" fill className="object-cover" />
                </span>
                <div className="leading-tight">
                  <div className="font-semibold tracking-tight">{site.name}</div>
                  <div className="text-[11px] text-slate-700">у твоєму місті</div>
                </div>
              </Link>

              <div className="md:hidden text-xs text-slate-700 rounded-full border border-yellow-200 bg-white/70 px-3 py-1">
                Житомир
              </div>
            </div>

            <form action="/events" method="get" className="flex flex-1 gap-2">
              <input
                name="q"
                placeholder="Пошук подій"
                className="w-full rounded-2xl border border-yellow-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
              />
              <button className="rounded-2xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
                Пошук
              </button>
            </form>

            <div className="flex items-center justify-between gap-2 md:justify-end">
              <nav className="hidden lg:flex items-center gap-1">
                <NavLink href="/events">Події</NavLink>
                <NavLink href="/events?calendar=1#calendar">Календар</NavLink>
                {me && <NavLink href="/account">Кабінет</NavLink>}
                {canPanel && <NavLink href="/panel">Панель</NavLink>}
                {canAdmin && <NavLink href="/admin">Адмін</NavLink>}
              </nav>

              <div className="flex items-center gap-2">
                {me ? (
                  <div className="hidden sm:flex items-center gap-2 text-sm text-slate-700">
                    <span className="rounded-full border border-yellow-200 bg-white/70 px-3 py-1.5">
                      {me.email} • {me.role}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/register"
                      className="rounded-2xl border border-yellow-200 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-white/70 transition"
                    >
                      Реєстрація
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-2xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                    >
                      Увійти
                    </Link>
                  </div>
                )}

                <AuthButtons isAuthed={!!me} />
              </div>
            </div>
          </div>

          <div className="hidden md:block border-t border-yellow-200">
            <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="rounded-full border border-yellow-200 bg-white/70 px-3 py-1">Житомир</span>
                <span className="text-slate-600">•</span>
                <Link href="/events" className="text-slate-700 hover:text-brand-deep underline underline-offset-4">
                  Усі події
                </Link>
              </div>
              <div className="text-xs text-slate-600">Карти • Фільтри • Квитки • Відгуки</div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

        <footer className="border-t border-slate-200 py-8">
          <div className="mx-auto max-w-6xl px-4 text-sm text-slate-600 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              © {new Date().getFullYear()} {site.name}
            </div>
            <div className="text-slate-500">Next.js • Prisma • PostgreSQL • RBAC</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
