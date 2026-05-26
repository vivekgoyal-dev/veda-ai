import type { Difficulty } from "@/lib/types";

const STYLES: Record<
  Difficulty,
  { label: string; color: string; background: string; border: string }
> = {
  easy: {
    label: "Easy",
    color: "var(--difficulty-easy)",
    background: "var(--difficulty-easy-bg)",
    border: "rgba(22, 163, 74, 0.2)",
  },
  moderate: {
    label: "Moderate",
    color: "var(--difficulty-moderate)",
    background: "var(--difficulty-moderate-bg)",
    border: "rgba(217, 119, 6, 0.2)",
  },
  hard: {
    label: "Challenging",
    color: "var(--difficulty-hard)",
    background: "var(--difficulty-hard-bg)",
    border: "rgba(220, 38, 38, 0.2)",
  },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const s = STYLES[difficulty] ?? STYLES.moderate;
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ color: s.color, background: s.background, borderColor: s.border }}
    >
      {s.label}
    </span>
  );
}
