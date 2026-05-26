"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Users,
  FileText,
  Sparkles,
  Library,
  Settings,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAssignmentStore } from "@/store/useAssignmentStore";

const NAV = [
  { href: "/home", label: "Home", icon: LayoutGrid },
  { href: "/groups", label: "My Groups", icon: Users },
  { href: "/assignments", label: "Assignments", icon: FileText },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: Sparkles },
  { href: "/library", label: "My Library", icon: Library },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/home") return pathname === "/home";
  if (href === "/assignments") return pathname.startsWith("/assignments");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const assignmentCount = useAssignmentStore((s) => s.items.length);

  return (
    <div className="flex h-full flex-col gap-5 px-4 py-5">
      <div className="px-2">
        <Logo />
      </div>

      <button
        type="button"
        onClick={() => {
          router.push("/assignments/new");
          onNavigate?.();
        }}
        className="btn-primary w-full"
      >
        <Plus className="h-4 w-4" strokeWidth={2.4} />
        Create Assignment
      </button>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          const badge = href === "/assignments" && assignmentCount > 0
            ? assignmentCount
            : null;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[color:var(--foreground-muted)] hover:bg-[color:var(--surface-muted)] hover:text-foreground"
              }`}
            >
              <Icon
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span className="flex-1 font-medium">{label}</span>
              {badge !== null && (
                <span
                  className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-[color:var(--accent)] text-white"
                  }`}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <Link
          href="/settings"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-[#1a1a1a] text-white"
              : "text-[color:var(--foreground-muted)] hover:bg-[color:var(--surface-muted)] hover:text-foreground"
          }`}
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
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <aside className="hidden md:flex md:w-[260px] md:shrink-0 md:flex-col md:border-r md:border-border md:bg-surface">
        <SidebarContent />
      </aside>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3.5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-md md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" strokeWidth={2} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute inset-y-0 left-0 w-[280px] bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-muted"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
