"use client";

"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import type { Usuario } from "../types";
import { getUsuarios, createUsuario, deleteUsuario } from "../api";
import { supabase } from "../lib/supabaseClient";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setMeuId(data.session?.user.id ?? null));
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function run() {
      setLoading(true);
      setErro(null);
      try {
        const lista = await getUsuarios();
        if (!cancelado) setUsuarios(lista);
      } catch {
        if (!cancelado) setErro("Não foi possível carregar os usuários.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    queueMicrotask(run);
    return () => {
      cancelado = true;
    };
  }, [refreshKey]);

  async function handleExcluir(u: Usuario) {
    if (!confirm(`Excluir o usuário ${u.email}?`)) return;
    try {
      await deleteUsuario(u.id);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao excluir usuário");
    }
  }

  function formatar(data?: string) {
    return data ? new Date(data).toLocaleDateString("pt-BR") : "—";
  }

  return (
    <main className="texture-bg flex min-h-screen flex-col bg-[var(--bg)] px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--wine-700)]">
              Adriana Souza - Terapeuta
            </span>
            <h1 className="font-display text-gradient mt-1 text-4xl italic sm:text-5xl">
              Usuários
            </h1>
            <p className="mt-2 text-sm text-[var(--ink-500)]">
              Quem tem acesso ao sistema.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--teal-900)] shadow-sm transition hover:border-[var(--teal-600)] hover:bg-[var(--sage-100)]/60"
          >
            ← Atendimentos
          </Link>
        </header>

        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setMostrarModal(true)}
            className="rounded-full bg-[var(--teal-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--teal-900)]"
          >
            + Novo usuário
          </button>
          {loading && <span className="text-sm text-[var(--ink-500)]">Carregando…</span>}
        </div>

        {erro && (
          <div className="mb-4 rounded-xl border border-[var(--wine-500)]/30 bg-[var(--wine-700)]/5 p-3 text-sm text-[var(--wine-700)]">
            {erro}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-card)] shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[var(--teal-900)] text-left text-white">
              <tr>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Criado em</th>
                <th className="p-4 font-medium">Último acesso</th>
                <th className="p-4 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="p-10 text-center">
                    <span className="font-display italic text-[var(--ink-500)]">
                      Nenhum usuário encontrado
                    </span>
                  </td>
                </tr>
              )}
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-[var(--line)] transition hover:bg-[var(--sage-100)]/60"
                >
                  <td className="p-4 font-medium text-[var(--ink-900)]">
                    {u.email}
                    {u.id === meuId && (
                      <span className="ml-2 rounded-full bg-[var(--sage-100)] px-2 py-0.5 text-xs font-medium text-[var(--teal-900)]">
                        você
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-[var(--ink-900)]">{formatar(u.createdAt)}</td>
                  <td className="p-4 text-[var(--ink-900)]">{formatar(u.lastSignInAt)}</td>
                  <td className="p-4 text-right">
                    {u.id !== meuId && (
                      <button
                        onClick={() => handleExcluir(u)}
                        className="text-[var(--wine-500)] hover:underline"
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarModal && (
        <UsuarioFormModal
          onFechar={() => setMostrarModal(false)}
          onCriado={() => {
            setMostrarModal(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </main>
  );
}

function UsuarioFormModal({
  onFechar,
  onCriado,
}: {
  onFechar: () => void;
  onCriado: () => void;
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await createUsuario(email, senha);
      onCriado();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar usuário");
    } finally {
      setSalvando(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-[var(--line)] bg-white p-2.5 text-sm text-[var(--ink-900)] outline-none transition focus:border-[var(--teal-600)] focus:ring-2 focus:ring-[var(--teal-400)]/30";
  const labelClass = "mt-4 block text-sm font-medium text-[var(--ink-900)]";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--ink-900)]/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--bg-card)] p-6 shadow-xl"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--wine-700)]">
          Novo
        </span>
        <h2 className="font-display text-2xl italic text-[var(--teal-900)]">Usuário</h2>

        <label className={labelClass}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        <label className={labelClass}>Senha (mínimo 6 caracteres)</label>
        <input
          type="password"
          required
          minLength={6}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={inputClass}
        />

        {erro && <p className="mt-3 text-sm text-[var(--wine-700)]">{erro}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-full px-4 py-2 text-sm font-medium text-[var(--ink-500)] hover:bg-[var(--sage-100)]/60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="rounded-full bg-[var(--teal-600)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--teal-900)] disabled:opacity-50"
          >
            {salvando ? "Criando…" : "Criar usuário"}
          </button>
        </div>
      </form>
    </div>
  );
}