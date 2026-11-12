"use client";

type Props = {
  label: string;
  value: string;
  destaque?: boolean;
};

export default function DashboardCard({
  label,
  value,
  destaque = false,
}: Props) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        destaque
          ? "border-[var(--wine-700)]/20 bg-[var(--wine-700)] text-white"
          : "border-[var(--line)] bg-[var(--bg-card)] text-[var(--ink-900)]"
      }`}
    >
      <span
        className={`text-xs uppercase tracking-wide ${
          destaque ? "text-white/75" : "text-[var(--ink-500)]"
        }`}
      >
        {label}
      </span>

      <p className="font-display mt-1 text-2xl italic">{value}</p>
    </div>
  );
}
