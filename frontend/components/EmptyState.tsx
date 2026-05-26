"use client";

import { useRouter } from "next/navigation";
import { Plus, FileSearch } from "lucide-react";

export function EmptyState() {
  const router = useRouter();
  return (
    <div className="flex h-full min-h-[calc(100vh-9rem)] items-center justify-center p-6">
      <div className="card flex w-full max-w-3xl flex-col items-center gap-6 rounded-2xl border-border bg-surface-muted px-6 py-16 text-center">
        <div className="relative">
          <div
            className="flex h-32 w-32 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #ffffff 0%, #e5e7eb 100%)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
            }}
          >
            <FileSearch
              className="h-14 w-14 text-[color:var(--foreground-subtle)]"
              strokeWidth={1.4}
            />
            <span
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-white text-base"
              style={{ background: "var(--accent)" }}
              aria-hidden
            >
              ×
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            No assignments yet
          </h2>
          <p className="max-w-md text-sm text-[color:var(--foreground-muted)]">
            Create your first assignment to start collecting and grading student
            submissions. You can set up rubrics, define marking criteria, and let
            AI assist with grading.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/assignments/new")}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" strokeWidth={2.4} />
          Create Your First Assignment
        </button>
      </div>
    </div>
  );
}
