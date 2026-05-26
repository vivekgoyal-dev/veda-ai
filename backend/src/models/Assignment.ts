import mongoose, { Schema } from "mongoose";

const questionTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    label: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    id: String,
    text: String,
    difficulty: { type: String, enum: ["easy", "moderate", "hard"] },
    marks: Number,
    answer: String,
    options: [String],
  },
  { _id: false }
);

const sectionSchema = new Schema(
  {
    id: String,
    title: String,
    instruction: String,
    questions: [questionSchema],
  },
  { _id: false }
);

const paperSchema = new Schema(
  {
    heading: String,
    schoolName: String,
    subject: String,
    className: String,
    timeAllowed: String,
    maximumMarks: Number,
    sections: [sectionSchema],
    answerKey: [String],
  },
  { _id: false }
);

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: String,
    className: String,
    dueDate: { type: String, required: true },
    questionTypes: { type: [questionTypeSchema], required: true },
    additionalInstructions: String,
    uploadedMaterial: String,
    status: {
      type: String,
      enum: ["pending", "queued", "generating", "completed", "failed"],
      default: "pending",
      index: true,
    },
    progress: { type: Number, default: 0 },
    paper: paperSchema,
    error: String,
  },
  { timestamps: true }
);

assignmentSchema.index({ createdAt: -1 });

export const Assignment = mongoose.model("Assignment", assignmentSchema);
export type AssignmentModel = typeof Assignment;
