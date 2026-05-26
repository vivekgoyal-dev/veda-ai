"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { AssignmentCard } from "@/components/AssignmentCard";
import { useAssignmentStore } from "@/store/useAssignmentStore";

export default function AssignmentsPage() {
  const router = useRouter();
  const { items, loading, hasFetched, error, fetch } = useAssignmentStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch();
  }, [fetch]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.subject?.toLowerCase().includes(q) ||
        a.className?.toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  const isInitialLoading = !hasFetched && loading;
  const isEmpty = hasFetched && items.length === 0 && !error;

  return (
    <AppShell title="Assignment" showBack={false}>
      {isInitialLoading ? (
        <div className="flex h-[calc(100vh-9rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-[color:var(--accent)]" />
        </div>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <div className="relative p-6 pb-24">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            <div className="flex flex-col">
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
                Assignments
              </h1>
              <p className="text-[13px] text-[color:var(--foreground-muted)]">
                Manage and create assignments for your classes.
              </p>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--foreground-subtle)]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input pl-9 pr-8 appearance-none w-44"
              >
                <option value="all">Filter By</option>
                <option value="queued">Queued</option>
                <option value="generating">Generating</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--foreground-subtle)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Assignment"
                className="input pl-9"
              />
            </div>
          </div>

          {loading && items.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="card h-[140px] animate-pulse bg-surface-muted"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((a) => (
                <AssignmentCard key={a._id} a={a} />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="pointer-events-none fixed bottom-6 left-0 right-0 z-20 flex justify-center md:left-[260px]">
            <button
              type="button"
              onClick={() => router.push("/assignments/new")}
              className="btn-primary pointer-events-auto shadow-lg"
            >
              <Plus className="h-4 w-4" strokeWidth={2.4} />
              Create Assignment
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
