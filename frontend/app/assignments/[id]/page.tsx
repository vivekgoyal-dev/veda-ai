"use client";

import { use, useCallback, useEffect, useState } from "react";
import { Download, RefreshCw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { QuestionPaper } from "@/components/QuestionPaper";
import { GeneratingState } from "@/components/GeneratingState";
import { api } from "@/lib/api";
import { subscribeToAssignment } from "@/lib/socket";
import { downloadElementAsPdf } from "@/lib/pdf";
import type { Assignment, GeneratedPaper } from "@/lib/types";

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("queued");
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const a = await api.getAssignment(id);
      setAssignment(a);
      setStatus(a.status);
      setProgress(a.progress ?? 0);
      if (a.paper) setPaper(a.paper);
      if (a.error) setError(a.error);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const unsub = subscribeToAssignment(id, (payload) => {
      if (payload.status) setStatus(payload.status);
      if (typeof payload.progress === "number") setProgress(payload.progress);
      if (payload.paper) setPaper(payload.paper as GeneratedPaper);
      if (payload.error) setError(payload.error);
    });
    return unsub;
  }, [id]);

  const isLoading = !assignment;
  const isGenerating =
    status === "queued" || status === "generating" || status === "pending";
  const isFailed = status === "failed";

  const onRegenerate = async () => {
    setRegenerating(true);
    setPaper(null);
    setError(null);
    setProgress(0);
    setStatus("queued");
    try {
      await api.regenerate(id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRegenerating(false);
    }
  };

  const onDownload = () => {
    downloadElementAsPdf("question-paper", `${assignment?.title ?? "paper"}.pdf`);
  };

  return (
    <AppShell title="Assignment" showBack backHref="/assignments">
      <div className="mx-auto max-w-5xl p-6 pb-10">
        {assignment && (
          <div className="mb-6 flex items-start gap-3">
            <span
              className="mt-1.5 inline-flex h-2 w-2 rounded-full"
              style={{
                background:
                  status === "completed"
                    ? "#10b981"
                    : status === "failed"
                      ? "#ef4444"
                      : "#f59e0b",
              }}
            />
            <div className="flex flex-1 flex-col">
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
                {assignment.title}
              </h1>
              <p className="text-[13px] text-[color:var(--foreground-muted)]">
                {assignment.subject ?? "—"} • {assignment.className ?? "—"}
              </p>
            </div>
            {status === "completed" && paper && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onRegenerate}
                  disabled={regenerating}
                  className="btn-ghost"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`}
                    strokeWidth={2}
                  />
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={onDownload}
                  className="btn-primary"
                >
                  <Download className="h-4 w-4" strokeWidth={2.2} />
                  Download as PDF
                </button>
              </div>
            )}
          </div>
        )}

        {assignment && paper && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
            <Sparkles
              className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent)]"
              strokeWidth={1.8}
            />
            <p className="text-[14px] text-foreground">
              <span className="font-semibold">Certainly, John!</span> Here is the
              customized Question Paper for your{" "}
              <span className="font-semibold">
                {assignment.className ?? "class"} {assignment.subject ?? ""}
              </span>{" "}
              assignment{assignment.uploadedMaterial ? " based on the source material you provided." : "."}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="card h-64 animate-pulse" />
        )}

        {isFailed && error && (
          <div className="card flex flex-col items-center gap-4 p-8 text-center">
            <h2 className="text-[18px] font-semibold text-red-700">
              Generation failed
            </h2>
            <p className="max-w-md text-sm text-[color:var(--foreground-muted)]">
              {error}
            </p>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="btn-primary"
            >
              <RefreshCw
                className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`}
                strokeWidth={2.2}
              />
              Try Again
            </button>
          </div>
        )}

        {isGenerating && !paper && !isFailed && (
          <GeneratingState progress={progress} status={status} />
        )}

        {paper && <QuestionPaper paper={paper} />}
      </div>
    </AppShell>
  );
}
