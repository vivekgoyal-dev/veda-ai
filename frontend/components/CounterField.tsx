"use client";

import { Minus, Plus } from "lucide-react";

interface CounterFieldProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  ariaLabel?: string;
}

export function CounterField({
  value,
  onChange,
  min = 1,
  max = 50,
  ariaLabel,
}: CounterFieldProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted disabled:opacity-30"
        aria-label="Decrease"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.2} />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="flex h-7 w-7 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted disabled:opacity-30"
        aria-label="Increase"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
      </button>
    </div>
  );
}
