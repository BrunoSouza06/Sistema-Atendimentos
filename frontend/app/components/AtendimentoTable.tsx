"use client";

import { Atendimento } from "../types";

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

type Props = {
  atendimentos: Atendimento[];
  loading: boolean;
  mes: number;
  ano: number;
  onEditar: (atendimento: Atendimento) => void;
  onExcluir: (id: string) => void;
};

export default function AtendimentoTable({
  atendimentos,
  loading,
  mes,
  ano,
  onEditar,
  onExcluir,
}: Props) {
  const totalMes = atendimentos.reduce((soma, a) => soma + a.valorSessao, 0);

  const totalRepasse = atendimentos.reduce(
    (soma, a) => soma + a.valorRepasse,
    0,
  );

  return (
    <table className="w-full text-sm">
      <thead className="bg-[var(--teal-900)] text-left text-white">
        <tr>
          <th className="p-4 font-medium">Data</th>
          <th className="p-4 font-medium">Cliente</th>
          <th className="p-4 font-medium">Tipo</th>
          <th className="p-4 text-right font-medium">Valor</th>
          <th className="p-4 text-right font-medium">
            Repasse ({atendimentos[0]?.percentualRepasse ?? 20}%)
          </th>
          <th className="p-4 text-right font-medium">Ações</th>
        </tr>
      </thead>

      <tbody>
        {atendimentos.length === 0 && !loading && (
          <tr>
            <td colSpan={6} className="p-10 text-center">
              <span className="font-display italic text-[var(--ink-500)]">
                Nenhum atendimento em {MESES[mes - 1]}/{ano}
              </span>
            </td>
          </tr>
        )}

        {atendimentos.map((a) => (
          <tr
            key={a.id}
            className="border-t border-[var(--line)] transition hover:bg-[var(--sage-100)]/60"
          >
            <td className="p-4">
              {new Date(a.data + "T00:00:00").toLocaleDateString("pt-BR")}
            </td>

            <td className="p-4 font-medium">{a.clienteNome}</td>

            <td className="p-4">
              <span className="rounded-full bg-[var(--sage-100)] px-2.5 py-1 text-xs font-medium text-[var(--teal-900)]">
                {a.tipoSessao}
              </span>
            </td>

            <td className="p-4 text-right">R$ {a.valorSessao.toFixed(2)}</td>

            <td className="p-4 text-right font-semibold text-[var(--wine-700)]">
              R$ {a.valorRepasse.toFixed(2)}
            </td>

            <td className="p-4 text-right">
              <button
                onClick={() => onEditar(a)}
                className="mr-4 text-[var(--teal-600)] hover:underline"
              >
                Editar
              </button>

              <button
                onClick={() => onExcluir(a.id)}
                className="text-[var(--wine-500)] hover:underline"
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>

      {atendimentos.length > 0 && (
        <tfoot className="bg-[var(--sage-100)]/50 font-semibold">
          <tr>
            <td colSpan={3} className="p-4 text-right">
              Total do mês
            </td>

            <td className="p-4 text-right">R$ {totalMes.toFixed(2)}</td>

            <td className="p-4 text-right text-[var(--wine-700)]">
              R$ {totalRepasse.toFixed(2)}
            </td>

            <td />
          </tr>
        </tfoot>
      )}
    </table>
  );
}
