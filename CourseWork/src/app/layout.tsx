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
      className="rounded-xl px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/10 transition"
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
      <body className="min-h-screen text-slate-100">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <span className="relative h-7 w-7 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image src="/logo.png" alt="Житомир" fill className="object-cover" />
                </span>
                <span className="font-semibold tracking-tight">{site.name}</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <NavLink href="/events">Події</NavLink>
                <NavLink href="/#calendar">Календар</NavLink>
                {me && <NavLink href="/account">Кабінет</NavLink>}
                {canPanel && <NavLink href="/panel">Панель</NavLink>}
                {canAdmin && <NavLink href="/admin">Адмін</NavLink>}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {me ? (
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    {me.email} • {me.role}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/register"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                  >
                    Реєстрація
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl bg-brand-blue px-3 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition"
                  >
                    Увійти
                  </Link>
                </div>
              )}

              <AuthButtons isAuthed={!!me} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

        <footer className="border-t border-white/10 py-8">
          <div className="mx-auto max-w-6xl px-4 text-sm text-slate-400 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} {site.name}</div>
            <div className="text-slate-500">Next.js • Prisma • PostgreSQL • RBAC</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
