"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import { registerSchema } from "@/server/schemas";
import { zodToFieldErrors } from "@/lib/validation";

export default function RegisterPage() {
  const r = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg(null);
    setFieldErrors({});
    setLoading(true);

    const parsed = registerSchema.safeParse({ email, password, name });
    if (!parsed.success) {
      const fe = zodToFieldErrors(parsed.error);
      setFieldErrors(fe);
      setMsg(fe._form || "Перевірте введені дані");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      if (data?.fieldErrors && typeof data.fieldErrors === "object") {
        setFieldErrors(data.fieldErrors);
      }
      setMsg(data.error || "Помилка");
      return;
    }

    r.push(next);
    r.refresh();
  }

  const inputBase =
    "w-full rounded-2xl border bg-white px-4 py-2 text-sm outline-none focus:border-brand-blue";

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Реєстрація</h1>
        <p className="text-sm text-slate-600 mt-1">Створи акаунт, щоб купувати квитки та залишати відгуки.</p>
      </div>

      <Card>
        <div className="p-5 space-y-3">
          <div>
            <input
              className={`${inputBase} ${fieldErrors.email ? "border-rose-400" : "border-slate-300"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              inputMode="email"
              autoComplete="email"
            />
            {fieldErrors.email && <div className="mt-1 text-xs text-rose-600">{fieldErrors.email}</div>}
          </div>

          <div>
            <input
              className={`${inputBase} ${fieldErrors.name ? "border-rose-400" : "border-slate-300"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Імʼя (необовʼязково)"
              autoComplete="name"
            />
            {fieldErrors.name && <div className="mt-1 text-xs text-rose-600">{fieldErrors.name}</div>}
          </div>

          <div>
            <input
              className={`${inputBase} ${fieldErrors.password ? "border-rose-400" : "border-slate-300"}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль (мін. 6 символів)"
              autoComplete="new-password"
            />
            {fieldErrors.password && <div className="mt-1 text-xs text-rose-600">{fieldErrors.password}</div>}
          </div>

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
