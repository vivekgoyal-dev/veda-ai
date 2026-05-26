"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AppShell } from "./AppShell";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AppShell title={title} showBack>
      <div className="flex h-[calc(100vh-9rem)] items-center justify-center p-6">
        <div className="card flex w-full max-w-2xl flex-col items-center gap-5 rounded-2xl bg-surface-muted px-8 py-16 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "var(--accent-soft)" }}
          >
            <Sparkles
              className="h-7 w-7 text-[color:var(--accent)]"
              strokeWidth={1.6}
            />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold text-foreground">
              {title}
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-[color:var(--foreground-muted)]">
              {description}
            </p>
          </div>
          <Link href="/assignments" className="btn-primary mt-2">
            Back to Assignments
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
