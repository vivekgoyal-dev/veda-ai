import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  backHref?: string;
}

export function AppShell({ children, title, showBack, backHref }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} showBack={showBack} backHref={backHref} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
