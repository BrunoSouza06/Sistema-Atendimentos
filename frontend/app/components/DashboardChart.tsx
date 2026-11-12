"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { FaturamentoMensal } from "../types";

type Props = {
  dados: FaturamentoMensal[];
};

const MESES = [
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

export default function DashboardChart({ dados }: Props) {
  const dadosGrafico = dados.map((d) => ({
    ...d,
    mesNome: MESES[d.mes],
  }));

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-card)] p-6 shadow-sm">
      <h2 className="mb-6 font-display text-2xl italic text-[var(--teal-900)]">
        Faturamento anual
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={dadosGrafico}>
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis dataKey="mesNome" />

          <YAxis domain={[0, "dataMax + 100"]} />

          <Tooltip
            formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Receita"]}
          />

          <Line
            type="monotone"
            dataKey="receita"
            stroke="#0F766E"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
