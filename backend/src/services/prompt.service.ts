import type { QuestionTypeConfig } from "../types/assignment";

interface PromptInput {
  title: string;
  subject?: string;
  className?: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions?: string;
  uploadedMaterial?: string;
}

const SECTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function buildGenerationPrompt(input: PromptInput): string {
  const totalQuestions = input.questionTypes.reduce((s, q) => s + q.count, 0);
  const totalMarks = input.questionTypes.reduce(
    (s, q) => s + q.count * q.marks,
    0
  );

  const sectionPlan = input.questionTypes
    .map(
      (q, i) =>
        `Section ${SECTION_LETTERS[i] ?? String(i + 1)}: ${q.label} — ${q.count} questions × ${q.marks} marks each`
    )
    .join("\n");

  const subject = input.subject?.trim() || "General";
  const className = input.className?.trim() || "Grade 8";

  return `You are an expert exam paper setter for Indian schools (CBSE/ICSE style). Generate a complete question paper as STRICT JSON only. No markdown fences, no commentary — just the JSON object.

CONTEXT
- Subject: ${subject}
- Class / Grade: ${className}
- Due Date: ${input.dueDate}
- Total Questions: ${totalQuestions}
- Total Marks: ${totalMarks}
- Additional Instructions: ${input.additionalInstructions ?? "None"}
${input.uploadedMaterial ? `- Source Material Reference:\n${input.uploadedMaterial.slice(0, 4000)}` : ""}

SECTION PLAN
${sectionPlan}

RULES
1. Mix difficulty across each section: roughly 40% easy, 40% moderate, 20% hard. Use "easy" | "moderate" | "hard".
2. Each question must include: id (string), text, difficulty, marks. For multiple-choice, also include options as an array of 4 strings.
3. Provide a concise answer for every question in the answerKey, numbered in question order across all sections.
4. Question text should be self-contained, factually correct for the given grade and subject, and free of placeholders.
5. The "heading" should be a single-line line such as "Customized Question Paper for ${className} ${subject}".
6. Use "schoolName": "Delhi Public School, Sector-4, Bokaro" unless the additional instructions specify otherwise.
7. Output ONLY this JSON shape:

{
  "heading": string,
  "schoolName": string,
  "subject": string,
  "className": string,
  "timeAllowed": string,
  "maximumMarks": number,
  "sections": [
    {
      "id": string,
      "title": string,
      "instruction": string,
      "questions": [
        { "id": string, "text": string, "difficulty": "easy"|"moderate"|"hard", "marks": number, "options"?: string[] }
      ]
    }
  ],
  "answerKey": string[]
}`;
}
