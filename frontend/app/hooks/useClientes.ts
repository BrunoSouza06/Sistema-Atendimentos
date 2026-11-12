"use client";

import { useEffect, useState } from "react";
import { Cliente } from "../types";
import { getClientes } from "../api";

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    async function carregar() {
      const lista = await getClientes();

      setClientes(lista);
    }

    carregar();
  }, []);

  return clientes;
}
