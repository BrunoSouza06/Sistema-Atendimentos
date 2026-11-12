"use client";

import { useEffect, useState } from "react";
import { Dashboard, FaturamentoMensal } from "../types";
import { getDashboard, getFaturamentoAno } from "../api";

export function useDashboard(mes: number, ano: number, refreshKey: number) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  const [grafico, setGrafico] = useState<FaturamentoMensal[]>([]);

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setLoading(true);

      try {
        const [resumo, faturamento] = await Promise.all([
          getDashboard(mes, ano),
          getFaturamentoAno(ano),
        ]);

        console.log("Dashboard:", resumo);
        console.log("Faturamento:", faturamento);

        if (!cancelado) {
          setDashboard(resumo);
          setGrafico(faturamento);
        }
      } catch {
        if (!cancelado) setErro("Erro ao carregar dashboard.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();

    return () => {
      cancelado = true;
    };
  }, [mes, ano, refreshKey]);

  return {
    dashboard,
    grafico,
    loading,
    erro,
  };
}
