"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cliente } from "../types";

interface ClienteComboboxProps {
  clientes: Cliente[];
  value: string;
  onChange: (clientId: string) => void;
}

export function ClienteCombobox({
  clientes,
  value,
  onChange,
}: ClienteComboboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [texto, setTexto] = useState("");
  const [aberto, setAberto] = useState(false);
  const [indiceSelecionado, setIndiceSelecionado] = useState(-1);

  const clienteSelecionado = useMemo(
    () => clientes.find((c) => c.id === value),
    [clientes, value],
  );

  // Atualiza o texto quando o cliente selecionado mudar
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTexto(clienteSelecionado?.name ?? "");
    });

    return () => cancelAnimationFrame(id);
  }, [clienteSelecionado]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setAberto(false);
        setIndiceSelecionado(-1);
        setTexto(clienteSelecionado?.name ?? "");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clienteSelecionado]);

  const filtrados = useMemo(() => {
    const termo = texto.trim().toLowerCase();

    if (!termo) return clientes;

    return clientes.filter((c) => c.name.toLowerCase().includes(termo));
  }, [clientes, texto]);

  function selecionar(cliente: Cliente) {
    onChange(cliente.id);
    setTexto(cliente.name);
    setAberto(false);
    setIndiceSelecionado(-1);
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        required
        value={texto}
        placeholder="Digite o nome do cliente..."
        className="mt-1 w-full rounded-lg border border-[var(--line)] bg-white p-2.5 text-sm text-[var(--ink-900)] outline-none transition focus:border-[var(--teal-600)] focus:ring-2 focus:ring-[var(--teal-400)]/30"
        onFocus={() => setAberto(true)}
        onChange={(e) => {
          setTexto(e.target.value);
          setAberto(true);
          setIndiceSelecionado(-1);

          if (e.target.value === "") {
            onChange("");
          }
        }}
        onKeyDown={(e) => {
          if (!aberto) return;

          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              setIndiceSelecionado((i) =>
                Math.min(i + 1, filtrados.length - 1),
              );
              break;

            case "ArrowUp":
              e.preventDefault();
              setIndiceSelecionado((i) => Math.max(i - 1, 0));
              break;

            case "Enter":
              if (indiceSelecionado >= 0) {
                e.preventDefault();
                selecionar(filtrados[indiceSelecionado]);
              }
              break;

            case "Escape":
              setAberto(false);
              setIndiceSelecionado(-1);
              setTexto(clienteSelecionado?.name ?? "");
              break;
          }
        }}
      />

      {aberto && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[var(--line)] bg-white shadow-lg">
          {filtrados.length === 0 && (
            <li className="p-3 text-sm text-[var(--ink-500)]">
              Nenhum cliente encontrado
            </li>
          )}

          {filtrados.map((cliente, index) => (
            <li
              key={cliente.id}
              onMouseDown={() => selecionar(cliente)}
              className={`cursor-pointer p-2.5 text-sm ${
                index === indiceSelecionado
                  ? "bg-[var(--teal-600)] text-white"
                  : "text-[var(--ink-900)] hover:bg-[var(--sage-100)]/60"
              }`}
            >
              {cliente.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
