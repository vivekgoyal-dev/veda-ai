import type { GeneratedPaper } from "@/lib/types";
import { DifficultyBadge } from "./DifficultyBadge";

interface QuestionPaperProps {
  paper: GeneratedPaper;
}

export function QuestionPaper({ paper }: QuestionPaperProps) {
  return (
    <article
      id="question-paper"
      className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-white px-8 py-10 text-[14px] leading-relaxed text-foreground shadow-sm print:rounded-none print:border-0 print:shadow-none"
    >
      <header className="mb-6 text-center">
        <h1 className="text-[20px] font-bold tracking-tight">
          {paper.schoolName}
        </h1>
        <div className="mt-1 text-[15px] font-semibold">
          Subject: {paper.subject}
        </div>
        <div className="text-[14px]">Class: {paper.className}</div>
      </header>

      <div className="mb-4 flex items-center justify-between text-[13px]">
        <span>
          <span className="font-medium">Time Allowed:</span> {paper.timeAllowed}
        </span>
        <span>
          <span className="font-medium">Maximum Marks:</span>{" "}
          {paper.maximumMarks}
        </span>
      </div>

      <p className="mb-4 text-[12.5px] italic text-[color:var(--foreground-muted)]">
        All questions are compulsory unless stated otherwise.
      </p>

      {/* Student info */}
      <section className="mb-6 grid grid-cols-1 gap-y-1.5 text-[13px] sm:grid-cols-2 sm:gap-x-8">
        <div>
          Name:{" "}
          <span className="inline-block min-w-[180px] border-b border-dotted border-foreground/60">
            &nbsp;
          </span>
        </div>
        <div>
          Roll Number:{" "}
          <span className="inline-block min-w-[140px] border-b border-dotted border-foreground/60">
            &nbsp;
          </span>
        </div>
        <div>
          Class: <span className="font-medium">{paper.className}</span>{" "}
          Section:{" "}
          <span className="inline-block min-w-[80px] border-b border-dotted border-foreground/60">
            &nbsp;
          </span>
        </div>
      </section>

      {/* Sections */}
      {paper.sections.map((section, sIdx) => {
        const startNumber = paper.sections
          .slice(0, sIdx)
          .reduce((s, sec) => s + sec.questions.length, 0);
        return (
          <section key={section.id ?? sIdx} className="mb-7">
            <div className="mb-1 text-center text-[15px] font-bold">
              Section {section.title.replace(/^Section\s+/i, "")}
            </div>
            <div className="mb-3 text-[13px] font-medium text-foreground">
              {section.questions.length > 0 &&
                `${
                  section.title.includes("Section")
                    ? section.title
                    : section.title
                }`}
            </div>
            <p className="mb-3 text-[12.5px] italic text-[color:var(--foreground-muted)]">
              {section.instruction}
            </p>
            <ol
              className="flex flex-col gap-3"
              start={startNumber + 1}
            >
              {section.questions.map((q, qIdx) => (
                <li
                  key={q.id ?? qIdx}
                  className="flex gap-3 text-[13.5px]"
                >
                  <span className="font-medium">{startNumber + qIdx + 1}.</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <DifficultyBadge difficulty={q.difficulty} />
                      <span>{q.text}</span>
                      <span className="text-[12px] font-medium text-[color:var(--foreground-muted)]">
                        [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
                      </span>
                    </div>
                    {q.options && q.options.length > 0 && (
                      <ol className="ml-2 mt-1.5 grid grid-cols-1 gap-1 text-[13px] sm:grid-cols-2">
                        {q.options.map((opt, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="font-medium">
                              {String.fromCharCode(97 + i)})
                            </span>
                            <span>{opt}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      <div className="my-6 text-center text-[13px] font-semibold text-[color:var(--foreground-muted)]">
        End of Question Paper
      </div>

      {paper.answerKey?.length > 0 && (
        <section className="mt-8 border-t border-dashed border-border pt-6">
          <h2 className="mb-3 text-[15px] font-bold">Answer Key:</h2>
          <ol className="flex flex-col gap-2 text-[13px]">
            {paper.answerKey.map((ans, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-medium">{i + 1}.</span>
                <span>{ans}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  );
}
