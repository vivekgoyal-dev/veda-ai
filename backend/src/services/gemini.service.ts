import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";
import type { GeneratedPaper } from "../types/assignment";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

function stripCodeFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  return t.trim();
}

function safeParse<T>(text: string): T {
  const cleaned = stripCodeFences(text);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1)) as T;
    }
    throw new Error("Gemini did not return valid JSON");
  }
}

export async function generatePaper(prompt: string): Promise<GeneratedPaper> {
  const model = genAI.getGenerativeModel({
    model: env.geminiModel,
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const paper = safeParse<GeneratedPaper>(text);

  if (!paper.sections || !Array.isArray(paper.sections)) {
    throw new Error("Gemini response missing sections array");
  }
  paper.sections.forEach((section, sIdx) => {
    if (!section.questions || !Array.isArray(section.questions)) {
      throw new Error(`Section ${sIdx} missing questions`);
    }
  });

  return paper;
}
