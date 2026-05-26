"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from "lucide-react";

interface TopbarProps {
  title?: string;
  backHref?: string;
  showBack?: boolean;
}

export function Topbar({ title = "Assignment", backHref, showBack = true }: TopbarProps) {
  const router = useRouter();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-6">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
        <div className="flex items-center gap-2 text-[15px] font-medium text-foreground">
          <LayoutGrid className="h-4 w-4 text-[color:var(--foreground-subtle)]" strokeWidth={1.8} />
          {title}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-muted"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </button>

        <div className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-surface-muted">
          <div
            className="h-8 w-8 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, #fcd34d 0%, #f59e0b 60%, #b45309 100%)",
            }}
            aria-hidden
          />
          <span className="text-sm font-medium text-foreground">John Doe</span>
          <ChevronDown className="h-3.5 w-3.5 text-[color:var(--foreground-muted)]" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
}
