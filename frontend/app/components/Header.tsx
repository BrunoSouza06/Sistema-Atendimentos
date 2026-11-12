import Link from "next/link";

export default function Header() {
  return (
    <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--wine-700)]">
          Adriana Souza - Terapeuta
        </span>
        <h1 className="font-display text-gradient mt-1 text-4xl italic sm:text-5xl">
          Atendimentos
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-500)]">
          Sessões de Medicina Germânica e Reiki, mês a mês.
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          href="/clientes"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--teal-900)] shadow-sm transition hover:border-[var(--teal-600)] hover:bg-[var(--sage-100)]/60"
        >
          Clientes →
        </Link>

        <Link
          href="/usuarios"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--teal-900)] shadow-sm transition hover:border-[var(--teal-600)] hover:bg-[var(--sage-100)]/60"
        >
          Usuários →
        </Link>
      </div>
    </header>
  );
}
