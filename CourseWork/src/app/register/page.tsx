"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";

export default function RegisterPage() {
  const r = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) setMsg(data.error || "Помилка");
    else {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (loginRes.ok) {
        r.push(next);
        r.refresh();
      } else {
        r.push(`/login?next=${encodeURIComponent(next)}`);
      }
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Реєстрація</h1>
        <p className="text-sm text-slate-300 mt-1">Створи акаунт, щоб оформлювати квитки та залишати відгуки.</p>
      </div>

      <Card>
        <div className="p-5 space-y-3">
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Імʼя (необовʼязково)"
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm outline-none focus:border-brand-blue/60"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль (мін. 6 символів)"
          />

          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Створення..." : "Зареєструватися"}
          </button>

          {msg && <div className="text-sm text-rose-200">{msg}</div>}

          <div className="flex items-center justify-between text-sm">
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-slate-200 hover:text-white underline underline-offset-4">
              Вже є акаунт
            </Link>
            <Link href="/" className="text-slate-400 hover:text-slate-200">
              На головну
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
