"use client";

import { Sparkles } from "lucide-react";

export function GeneratingState({ progress, status }: { progress: number; status: string }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-2xl border border-border bg-white px-8 py-16 text-center shadow-sm">
      <div className="relative">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, var(--accent), #ffd6c1, var(--accent))",
            animation: "spin 2s linear infinite",
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Sparkles className="h-5 w-5 text-[color:var(--accent)]" />
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-[18px] font-semibold text-foreground">
          {status === "queued" ? "Queued for generation…" : "Generating your question paper…"}
        </h2>
        <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">
          Our AI is crafting questions based on your inputs. This typically takes
          15–40 seconds.
        </p>
      </div>
      <div className="mt-2 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.max(8, Math.min(100, progress))}%`,
            background: "var(--accent)",
          }}
        />
      </div>
      <span className="text-xs text-[color:var(--foreground-subtle)]">
        {Math.round(progress)}%
      </span>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
