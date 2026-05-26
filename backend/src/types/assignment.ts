export type QuestionTypeKey =
  | "mcq"
  | "short"
  | "diagram"
  | "numerical"
  | "long";

export interface QuestionTypeConfig {
  type: QuestionTypeKey;
  label: string;
  count: number;
  marks: number;
}

export type AssignmentStatus =
  | "pending"
  | "queued"
  | "generating"
  | "completed"
  | "failed";

export type Difficulty = "easy" | "moderate" | "hard";

export interface GeneratedQuestion {
  id: string;
  text: string;
  difficulty: Difficulty;
  marks: number;
  answer?: string;
  options?: string[];
}

export interface QuestionSection {
  id: string;
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  heading: string;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  sections: QuestionSection[];
  answerKey: string[];
}

export interface AssignmentDoc {
  _id: string;
  title: string;
  subject?: string;
  className?: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions?: string;
  uploadedMaterial?: string;
  status: AssignmentStatus;
  progress: number;
  paper?: GeneratedPaper;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
