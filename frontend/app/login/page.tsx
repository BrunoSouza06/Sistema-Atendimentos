"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEntrando(true);
    setErro(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setEntrando(false);
    if (error) {
      setErro("Email ou senha inválidos.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="texture-bg flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--bg-card)] p-8 shadow-xl"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--wine-700)]">
          Alegra Café
        </span>
        <h1 className="font-display text-gradient mt-1 text-3xl italic">
          Entrar
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-500)]">
          Acesso ao sistema de atendimentos.
        </p>

        <label className="mt-6 block text-sm font-medium text-[var(--ink-900)]">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--line)] bg-white p-2.5 text-sm outline-none focus:border-[var(--teal-600)] focus:ring-2 focus:ring-[var(--teal-400)]/30"
        />

        <label className="mt-4 block text-sm font-medium text-[var(--ink-900)]">
          Senha
        </label>
        <input
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--line)] bg-white p-2.5 text-sm outline-none focus:border-[var(--teal-600)] focus:ring-2 focus:ring-[var(--teal-400)]/30"
        />

        {erro && <p className="mt-3 text-sm text-[var(--wine-700)]">{erro}</p>}

        <button
          type="submit"
          disabled={entrando}
          className="mt-6 w-full rounded-full bg-[var(--teal-600)] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--teal-900)] disabled:opacity-50"
        >
          {entrando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
