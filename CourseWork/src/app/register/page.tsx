"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";

export default function RegisterPage() {
  const r = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
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
        <h1 className="text-2xl font-semibold tracking-tight">Реєстрація</h1>
        <p className="text-sm text-slate-600 mt-1">Створи акаунт, щоб купувати квитки та залишати відгуки.</p>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Імʼя (необовʼязково)"
          />
          <input
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль (мін. 6 символів)"
          />

          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-2xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Реєстрація..." : "Зареєструватися"}
          </button>

          {msg && <div className="text-sm text-rose-600">{msg}</div>}

          <div className="flex items-center justify-between text-sm">
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="text-slate-800 hover:text-brand-blue underline underline-offset-4"
            >
              Вже є акаунт
            </Link>
            <Link href="/" className="text-slate-600 hover:text-slate-800">
              На головну
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
