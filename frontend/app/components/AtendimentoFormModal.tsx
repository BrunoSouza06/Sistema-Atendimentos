"use client";

import { useState } from "react";
import { Atendimento, AtendimentoCreateDto, Cliente } from "../types";
import { ClienteCombobox } from "../clientes/ClienteCombobox";

const TIPOS_SESSAO = ["Medicina Germânica", "Reiki"];

export default function AtendimentoFormModal({
  atendimento,
  clientes,
  onSalvar,
  onFechar,
}: {
  atendimento: Atendimento | null;
  clientes: Cliente[];
  onSalvar: (dto: AtendimentoCreateDto) => Promise<void>;
  onFechar: () => void;
}) {
  const [data, setData] = useState(
    atendimento?.data ?? new Date().toISOString().slice(0, 10),
  );

  const [clientId, setClientId] = useState(atendimento?.clientId ?? "");

  const [tipoSessao, setTipoSessao] = useState(
    atendimento?.tipoSessao ?? TIPOS_SESSAO[0],
  );

  const [valorSessao, setValorSessao] = useState(
    atendimento?.valorSessao?.toString() ?? "",
  );

  const [percentualRepasse, setPercentualRepasse] = useState(
    atendimento?.percentualRepasse?.toString() ?? "20",
  );

  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSalvando(true);

    try {
      await onSalvar({
        data,
        clientId,
        tipoSessao,
        valorSessao: parseFloat(valorSessao),
        percentualRepasse: parseFloat(percentualRepasse),
      });
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
          {atendimento ? "Editar" : "Novo"}
        </span>

        <h2 className="font-display text-2xl italic text-[var(--teal-900)]">
          Atendimento
        </h2>

        <label className={labelClass}>Data</label>

        <input
          type="date"
          required
          value={data}
          onChange={(e) => setData(e.target.value)}
          className={inputClass}
        />

        <label className={labelClass}>Cliente</label>

        <ClienteCombobox
          clientes={clientes}
          value={clientId}
          onChange={setClientId}
        />

        <label className={labelClass}>Tipo de sessão</label>

        <select
          value={tipoSessao}
          onChange={(e) => setTipoSessao(e.target.value)}
          className={inputClass}
        >
          {TIPOS_SESSAO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        <label className={labelClass}>Valor da sessão (R$)</label>

        <input
          type="number"
          step="0.01"
          required
          value={valorSessao}
          onChange={(e) => setValorSessao(e.target.value)}
          className={inputClass}
        />

        <label className={labelClass}>Repasse (%)</label>

        <input
          type="number"
          step="0.01"
          required
          value={percentualRepasse}
          onChange={(e) => setPercentualRepasse(e.target.value)}
          className={inputClass}
        />

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
