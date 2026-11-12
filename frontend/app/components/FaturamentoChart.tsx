"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { FaturamentoMensal } from "../types";

const meses = [
  "",
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function FaturamentoChart({
  dados,
}: {
  dados: FaturamentoMensal[];
}) {
  const completo = Array.from({ length: 12 }, (_, i) => ({
    mes: meses[i + 1],
    receita: dados.find((x) => x.mes === i + 1)?.receita ?? 0,
  }));

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-semibold">Faturamento Mensal</h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={completo}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="mes" />

          <Tooltip />

          <Line dataKey="receita" stroke="#0f766e" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
