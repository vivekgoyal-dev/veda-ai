"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Users,
  FileText,
  Sparkles,
  Library,
  Settings,
  Plus,
} from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/groups", label: "My Groups", icon: Users },
  { href: "/assignments", label: "Assignments", icon: FileText },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: Sparkles },
  { href: "/library", label: "My Library", icon: Library },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden md:flex md:w-[260px] md:flex-col md:gap-5 md:border-r md:border-border md:bg-surface md:px-4 md:py-5">
      <div className="px-2">
        <Logo />
      </div>

      <button
        type="button"
        onClick={() => router.push("/assignments/new")}
        className="btn-primary w-full"
      >
        <Plus className="h-4 w-4" strokeWidth={2.4} />
        Create Assignment
      </button>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(
            pathname,
            href === "/assignments" || href === "/" ? href : href
          ) || (href === "/assignments" && pathname.startsWith("/assignments"));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[color:var(--foreground-muted)] hover:bg-[color:var(--surface-muted)] hover:text-foreground"
              }`}
            >
              <Icon
                className="h-[18px] w-[18px]"
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[color:var(--foreground-muted)] hover:bg-[color:var(--surface-muted)] hover:text-foreground"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="font-medium">Settings</span>
        </Link>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-3 py-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-semibold"
            style={{
              background:
                "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #c2410c 100%)",
            }}
            aria-hidden
          >
            DP
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-foreground">
              Delhi Public School
            </div>
            <div className="truncate text-[11px] text-[color:var(--foreground-subtle)]">
              Bokaro Steel City
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
