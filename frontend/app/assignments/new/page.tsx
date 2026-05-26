"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Mic,
  Plus,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CounterField } from "@/components/CounterField";
import { FileDropzone } from "@/components/FileDropzone";
import {
  QUESTION_TYPE_OPTIONS,
  type QuestionTypeConfig,
  type QuestionTypeKey,
} from "@/lib/types";
import { api } from "@/lib/api";
import { useAssignmentStore } from "@/store/useAssignmentStore";

interface FormState {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  uploadedMaterial: string;
  uploadedMaterialName: string;
  additionalInstructions: string;
  questionTypes: QuestionTypeConfig[];
}

const DEFAULT_ROWS: QuestionTypeConfig[] = [
  { type: "mcq", label: "Multiple Choice Questions", count: 4, marks: 1 },
  { type: "short", label: "Short Questions", count: 3, marks: 2 },
  { type: "diagram", label: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
  { type: "numerical", label: "Numerical Problems", count: 5, marks: 5 },
];

function totals(rows: QuestionTypeConfig[]) {
  return rows.reduce(
    (acc, r) => ({
      totalQuestions: acc.totalQuestions + r.count,
      totalMarks: acc.totalMarks + r.count * r.marks,
    }),
    { totalQuestions: 0, totalMarks: 0 }
  );
}

function validate(form: FormState): string | null {
  if (!form.title.trim()) return "Title is required.";
  if (!form.dueDate.trim()) return "Due date is required.";
  if (form.questionTypes.length === 0)
    return "Add at least one question type.";
  const seen = new Set<string>();
  for (const r of form.questionTypes) {
    if (seen.has(r.type)) return `Duplicate question type: ${r.label}.`;
    seen.add(r.type);
    if (r.count < 1) return `${r.label}: count must be at least 1.`;
    if (r.marks < 1) return `${r.label}: marks must be at least 1.`;
  }
  return null;
}

export default function NewAssignmentPage() {
  const router = useRouter();
  const upsert = useAssignmentStore((s) => s.upsert);

  const [form, setForm] = useState<FormState>({
    title: "Quiz on Electricity",
    subject: "Science",
    className: "Grade 8",
    dueDate: "",
    uploadedMaterial: "",
    uploadedMaterialName: "",
    additionalInstructions: "",
    questionTypes: DEFAULT_ROWS,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { totalQuestions, totalMarks } = useMemo(
    () => totals(form.questionTypes),
    [form.questionTypes]
  );

  const updateRow = (idx: number, partial: Partial<QuestionTypeConfig>) =>
    setForm((f) => ({
      ...f,
      questionTypes: f.questionTypes.map((r, i) =>
        i === idx ? { ...r, ...partial } : r
      ),
    }));

  const removeRow = (idx: number) =>
    setForm((f) => ({
      ...f,
      questionTypes: f.questionTypes.filter((_, i) => i !== idx),
    }));

  const addRow = () => {
    const used = new Set(form.questionTypes.map((r) => r.type));
    const next = QUESTION_TYPE_OPTIONS.find((o) => !used.has(o.value));
    if (!next) return;
    setForm((f) => ({
      ...f,
      questionTypes: [
        ...f.questionTypes,
        { type: next.value, label: next.label, count: 2, marks: 2 },
      ],
    }));
  };

  const onTypeChange = (idx: number, type: QuestionTypeKey) => {
    const label =
      QUESTION_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? "";
    updateRow(idx, { type, label });
  };

  const onSubmit = async () => {
    const err = validate(form);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const created = await api.createAssignment({
        title: form.title.trim(),
        subject: form.subject.trim() || undefined,
        className: form.className.trim() || undefined,
        dueDate: form.dueDate,
        questionTypes: form.questionTypes,
        additionalInstructions:
          form.additionalInstructions.trim() || undefined,
        uploadedMaterial: form.uploadedMaterial || undefined,
      });
      upsert(created);
      router.push(`/assignments/${created._id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Assignment" showBack backHref="/assignments">
      <div className="mx-auto max-w-4xl p-6 pb-10">
        <div className="mb-5 flex items-start gap-3">
          <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Create Assignment
            </h1>
            <p className="text-[13px] text-[color:var(--foreground-muted)]">
              Set up a new assignment for your students
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-6 flex items-center gap-1">
          <span className="h-1 flex-1 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="h-1 flex-1 rounded-full bg-border" />
          <span className="h-1 flex-1 rounded-full bg-border" />
        </div>

        <div className="card p-6 sm:p-8">
          <div className="mb-1 text-[15px] font-semibold text-foreground">
            Assignment Details
          </div>
          <p className="mb-6 text-[13px] text-[color:var(--foreground-muted)]">
            Basic information about your assignment
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground-muted">
                Title
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Quiz on Electricity"
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted">
                  Subject
                </label>
                <input
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  placeholder="Science"
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted">
                  Class
                </label>
                <input
                  value={form.className}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, className: e.target.value }))
                  }
                  placeholder="Grade 8"
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <FileDropzone
              onText={(text, filename) =>
                setForm((f) => ({
                  ...f,
                  uploadedMaterial: text,
                  uploadedMaterialName: filename,
                }))
              }
              onClear={() =>
                setForm((f) => ({
                  ...f,
                  uploadedMaterial: "",
                  uploadedMaterialName: "",
                }))
              }
              fileName={form.uploadedMaterialName}
            />
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-xs font-medium text-foreground-muted">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                className="input pr-10"
              />
              <CalendarDays
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--foreground-subtle)]"
                strokeWidth={1.8}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 hidden grid-cols-[1fr_auto_auto] gap-4 px-1 text-[11px] font-medium uppercase tracking-wide text-[color:var(--foreground-subtle)] sm:grid">
              <span>Question Type</span>
              <span className="text-right">No. of Questions</span>
              <span className="text-right">Marks</span>
            </div>

            <div className="flex flex-col gap-3">
              {form.questionTypes.map((row, idx) => (
                <div
                  key={`${row.type}-${idx}`}
                  className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
                >
                  <div className="relative">
                    <select
                      value={row.type}
                      onChange={(e) =>
                        onTypeChange(idx, e.target.value as QuestionTypeKey)
                      }
                      className="input appearance-none pr-9"
                    >
                      {QUESTION_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--foreground-subtle)]" />
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="text-[11px] uppercase tracking-wide text-[color:var(--foreground-subtle)] sm:hidden">
                      Questions
                    </span>
                    <CounterField
                      value={row.count}
                      onChange={(n) => updateRow(idx, { count: n })}
                      ariaLabel={`${row.label} count`}
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <span className="text-[11px] uppercase tracking-wide text-[color:var(--foreground-subtle)] sm:hidden">
                      Marks
                    </span>
                    <CounterField
                      value={row.marks}
                      onChange={(n) => updateRow(idx, { marks: n })}
                      max={20}
                      ariaLabel={`${row.label} marks`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    disabled={form.questionTypes.length === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--foreground-muted)] hover:bg-surface-muted disabled:opacity-30"
                    aria-label="Remove row"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              disabled={form.questionTypes.length >= QUESTION_TYPE_OPTIONS.length}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-80 disabled:opacity-40"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a1a] text-white">
                <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
              </span>
              Add Question Type
            </button>

            <div className="mt-6 flex flex-col items-end gap-1 text-[13px] text-[color:var(--foreground-muted)]">
              <div>
                Total Questions :{" "}
                <span className="font-semibold text-foreground">{totalQuestions}</span>
              </div>
              <div>
                Total Marks :{" "}
                <span className="font-semibold text-foreground">{totalMarks}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-1.5 block text-xs font-medium text-foreground-muted">
              Additional Information (For better output)
            </label>
            <div className="relative">
              <textarea
                value={form.additionalInstructions}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    additionalInstructions: e.target.value,
                  }))
                }
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                rows={3}
                className="input resize-none pr-10"
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-[color:var(--foreground-muted)] hover:bg-border"
                aria-label="Voice input (not implemented)"
                title="Voice input not implemented in this prototype"
              >
                <Mic className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/assignments")}
            className="btn-ghost"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Previous
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? "Creating…" : "Next"}
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
