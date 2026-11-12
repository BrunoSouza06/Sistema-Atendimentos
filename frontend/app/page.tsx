"use client";

import { useState } from "react";

import Header from "./components/Header";
import DashboardCard from "./components/DashboardCard";
import DashboardChart from "./components/DashboardChart";
import AtendimentoTable from "./components/AtendimentoTable";

console.log("AtendimentoTable =", AtendimentoTable);

import AtendimentoFormModal from "./components/AtendimentoFormModal";

import { Atendimento, AtendimentoCreateDto } from "./types";

import { createAtendimento, updateAtendimento, deleteAtendimento } from "./api";

import { useAtendimentos } from "./hooks/useAtendimentos";
import { useClientes } from "./hooks/useClientes";
import { useDashboard } from "./hooks/useDashboard";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const hoje = new Date();

export default function Home() {
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  const [refreshKey, setRefreshKey] = useState(0);

  const [editando, setEditando] = useState<Atendimento | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const { atendimentos, loading: loadingAtendimentos } = useAtendimentos(
    mes,
    ano,
    refreshKey,
  );

  const clientes = useClientes();

  const {
    dashboard,
    grafico,
    loading: loadingDashboard,
    erro,
  } = useDashboard(mes, ano, refreshKey);

  const loading = loadingAtendimentos || loadingDashboard;

  async function handleSalvar(dto: AtendimentoCreateDto) {
    if (editando) {
      await updateAtendimento(editando.id, dto);
    } else {
      await createAtendimento(dto);
    }

    setMostrarForm(false);
    setEditando(null);
    setRefreshKey((k) => k + 1);
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir esse atendimento?")) return;

    await deleteAtendimento(id);

    setRefreshKey((k) => k + 1);
  }

  console.log(grafico);

  return (
    <main className="texture-bg flex min-h-screen flex-col bg-[var(--bg)] px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Header />
        {/* Ano */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setAno((a) => a - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border"
          >
            ‹
          </button>

          <span className="font-display text-xl italic">{ano}</span>

          <button
            onClick={() => setAno((a) => a + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border"
          >
            ›
          </button>
        </div>
        {/* Meses */}
        <div className="mb-6 flex gap-1 overflow-x-auto">
          {MESES.map((nome, index) => (
            <button
              key={nome}
              onClick={() => setMes(index + 1)}
              className={`px-3 py-2 ${mes === index + 1 ? "font-bold" : ""}`}
            >
              {nome}
            </button>
          ))}
        </div>
        {/* Novo atendimento */}
        <div className="mb-6 flex justify-between">
          <button
            onClick={() => {
              setEditando(null);
              setMostrarForm(true);
            }}
            className="rounded-full bg-[var(--teal-600)] px-5 py-2 text-white"
          >
            + Novo atendimento
          </button>

          {loading && <span>Carregando...</span>}
        </div>
        {erro && (
          <div className="mb-6 rounded-xl border border-red-400 bg-red-50 p-4">
            {erro}
          </div>
        )}
        {/* Cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DashboardCard
            label="Receita"
            value={`R$ ${dashboard?.receita.toFixed(2) ?? "0,00"}`}
          />

          <DashboardCard
            label="Repasse"
            value={`R$ ${dashboard?.repasse.toFixed(2) ?? "0,00"}`}
            destaque
          />

          <DashboardCard
            label="Lucro"
            value={`R$ ${dashboard?.lucro.toFixed(2) ?? "0,00"}`}
          />

          <DashboardCard
            label="Atendimentos"
            value={(dashboard?.quantidadeAtendimentos ?? 0).toString()}
          />
        </div>
        {/* Gráfico */}
        <div className="mb-8">
          <DashboardChart dados={grafico} />
        </div>

        {/* Tabela */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow">
          <AtendimentoTable
            atendimentos={atendimentos}
            loading={loading}
            mes={mes}
            ano={ano}
            onEditar={(a) => {
              setEditando(a);
              setMostrarForm(true);
            }}
            onExcluir={handleExcluir}
          />
        </div>
        {mostrarForm && (
          <AtendimentoFormModal
            atendimento={editando}
            clientes={clientes}
            onSalvar={handleSalvar}
            onFechar={() => {
              setMostrarForm(false);
              setEditando(null);
            }}
          />
        )}
      </div>
    </main>
  );
}
