"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";

export default function LoginPage() {
  const r = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) setMsg(data.error || "Помилка");
    else {
      r.push(next);
      r.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Вхід</h1>
        <p className="text-sm text-slate-600 mt-1">
          Увійди, щоб додавати відгуки, оформлювати квитки та керувати замовленнями.
        </p>
      </div>

      <Card>
        <div className="p-5 space-y-3">
          <input
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          />

          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-2xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Вхід..." : "Увійти"}
          </button>

          {msg && <div className="text-sm text-rose-600">{msg}</div>}

          <div className="flex items-center justify-between text-sm">
            <Link
              href={`/register?next=${encodeURIComponent(next)}`}
              className="text-slate-800 hover:text-brand-blue underline underline-offset-4"
            >
              Створити акаунт
            </Link>
            <Link href="/" className="text-slate-600 hover:text-slate-800">
              На головну
            </Link>
          </div>

          <div className="text-xs text-slate-500">
            Демо: user@demo.com / user123 • organizer@demo.com / organizer123 • admin@demo.com / admin123
          </div>
        </div>
      </Card>
    </div>
  );
}
