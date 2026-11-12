"use client";

import { useEffect, useState } from "react";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../api";
import { Cliente, ClienteCreateDto } from "../types";
import Link from "next/link";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function run() {
      setLoading(true);
      setErro(null);
      try {
        const lista = await getClientes();
        if (!cancelado) setClientes(lista);
      } catch {
        if (!cancelado)
          setErro(
            "Não foi possível carregar os clientes. O backend está rodando?",
          );
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    queueMicrotask(run);
    return () => {
      cancelado = true;
    };
  }, [refreshKey]);

  async function handleSalvar(dto: ClienteCreateDto) {
    if (editando) {
      await updateCliente(editando.id, dto);
    } else {
      await createCliente(dto);
    }
    setMostrarModal(false);
    setEditando(null);
    setRefreshKey((k) => k + 1);
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir esse cliente?")) return;
    await deleteCliente(id);
    setRefreshKey((k) => k + 1);
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
              Clientes
            </h1>
            <p className="mt-2 text-sm text-[var(--ink-500)]">
              Cadastro de clientes atendidos nas sessões.
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
            onClick={() => {
              setEditando(null);
              setMostrarModal(true);
            }}
            className="rounded-full bg-[var(--teal-600)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--teal-900)]"
          >
            + Novo cliente
          </button>
          {loading && (
            <span className="text-sm text-[var(--ink-500)]">Carregando…</span>
          )}
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
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">Telefone</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 text-center font-medium">Ativo</th>
                <th className="p-4 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-10 text-center">
                    <span className="font-display italic text-[var(--ink-500)]">
                      Nenhum cliente cadastrado
                    </span>
                  </td>
                </tr>
              )}
              {clientes.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-[var(--line)] transition hover:bg-[var(--sage-100)]/60"
                >
                  <td className="p-4 font-medium text-[var(--ink-900)]">
                    {c.name}
                  </td>
                  <td className="p-4 text-[var(--ink-900)]">{c.phone}</td>
                  <td className="p-4 text-[var(--ink-900)]">{c.email}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        c.active
                          ? "bg-[var(--sage-100)] text-[var(--teal-900)]"
                          : "bg-[var(--wine-700)]/10 text-[var(--wine-700)]"
                      }`}
                    >
                      {c.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setEditando(c);
                        setMostrarModal(true);
                      }}
                      className="mr-4 text-[var(--teal-600)] hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(c.id)}
                      className="text-[var(--wine-500)] hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarModal && (
        <ClienteFormModal
          cliente={editando}
          onSalvar={handleSalvar}
          onFechar={() => {
            setMostrarModal(false);
            setEditando(null);
          }}
        />
      )}
    </main>
  );
}

function ClienteFormModal({
  cliente,
  onSalvar,
  onFechar,
}: {
  cliente: Cliente | null;
  onSalvar: (dto: ClienteCreateDto) => Promise<void>;
  onFechar: () => void;
}) {
  const [name, setName] = useState(cliente?.name ?? "");
  const [phone, setPhone] = useState(cliente?.phone ?? "");
  const [email, setEmail] = useState(cliente?.email ?? "");
  const [active, setActive] = useState(cliente?.active ?? true);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await onSalvar({ name, phone, email, active });
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
          {cliente ? "Editar" : "Novo"}
        </span>
        <h2 className="font-display text-2xl italic text-[var(--teal-900)]">
          Cliente
        </h2>

        <label className={labelClass}>Nome</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />

        <label className={labelClass}>Telefone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          placeholder="(11) 91234-5678"
        />

        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        <label className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--ink-900)]">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--line)] text-[var(--teal-600)] focus:ring-[var(--teal-400)]"
          />
          Cliente ativo
        </label>

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
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
