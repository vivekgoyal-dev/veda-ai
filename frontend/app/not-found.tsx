"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function NotFound() {
  return (
    <AppShell title="Not Found" showBack>
      <div className="flex h-[calc(100vh-9rem)] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-[64px] font-bold leading-none text-[color:var(--accent)]">
          404
        </div>
        <h1 className="text-[20px] font-semibold text-foreground">
          Page not found
        </h1>
        <p className="max-w-md text-sm text-[color:var(--foreground-muted)]">
          This area isn&apos;t built out yet. Head back to your assignments to
          continue.
        </p>
        <Link href="/assignments" className="btn-primary mt-2">
          Back to Assignments
        </Link>
      </div>
    </AppShell>
  );
}
