"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import type { Assignment } from "@/lib/types";
import { api } from "@/lib/api";
import { useAssignmentStore } from "@/store/useAssignmentStore";

function safeFormat(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return format(d, "dd-MM-yyyy");
  } catch {
    return dateStr;
  }
}

const STATUS_DOT: Record<Assignment["status"], string> = {
  pending: "bg-gray-300",
  queued: "bg-yellow-400",
  generating: "bg-amber-500 animate-pulse",
  completed: "bg-emerald-500",
  failed: "bg-red-500",
};

const STATUS_LABEL: Record<Assignment["status"], string> = {
  pending: "Pending",
  queued: "Queued",
  generating: "Generating…",
  completed: "Ready",
  failed: "Failed",
};

export function AssignmentCard({ a }: { a: Assignment }) {
  const router = useRouter();
  const remove = useAssignmentStore((s) => s.remove);
  const [menuOpen, setMenuOpen] = useState(false);

  const onView = () => router.push(`/assignments/${a._id}`);
  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!confirm(`Delete "${a.title}"?`)) return;
    try {
      await api.delete(a._id);
      remove(a._id);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView();
        }
      }}
      className="card flex cursor-pointer flex-col gap-4 p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug text-foreground line-clamp-2">
          {a.title}
        </h3>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-surface-muted"
            aria-label="Card menu"
          >
            <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-9 z-10 w-44 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onView();
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
              >
                View Assignment
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOT[a.status]}`} />
        <span className="text-[color:var(--foreground-muted)]">
          {STATUS_LABEL[a.status]}
          {a.status === "generating" && a.progress > 0 ? ` ${a.progress}%` : ""}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[12px] text-[color:var(--foreground-muted)]">
        <span>
          Assigned on : <span className="font-medium text-foreground">{safeFormat(a.createdAt)}</span>
        </span>
        <span>
          Due : <span className="font-medium text-foreground">{safeFormat(a.dueDate)}</span>
        </span>
      </div>
    </div>
  );
}
