"use client";

import { useEffect, useState } from "react";
import { Atendimento } from "../types";
import { getAtendimentos } from "../api";

export function useAtendimentos(mes: number, ano: number, refreshKey: number) {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setLoading(true);

      try {
        const dados = await getAtendimentos(mes, ano);

        if (!cancelado) setAtendimentos(dados);
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
    atendimentos,
    loading,
    setAtendimentos,
  };
}
