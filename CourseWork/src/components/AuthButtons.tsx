"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthButtons({ isAuthed }: { isAuthed: boolean }) {
  const r = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    r.push("/login");
    r.refresh();
    setLoading(false);
  }

  if (!isAuthed) return null;

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 transition disabled:opacity-50"
    >
      Вийти
    </button>
  );
}
