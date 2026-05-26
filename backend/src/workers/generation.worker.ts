import { Worker } from "bullmq";
import mongoose from "mongoose";
import { redisConnection } from "../config/redis";
import { env } from "../config/env";
import { GENERATION_QUEUE, type GenerationJobData } from "../queues/generation.queue";
import { Assignment } from "../models/Assignment";
import { buildGenerationPrompt } from "../services/prompt.service";
import { generatePaper } from "../services/gemini.service";
import { emitAssignmentUpdate } from "../sockets";

export function startGenerationWorker() {
  const worker = new Worker<GenerationJobData>(
    GENERATION_QUEUE,
    async (job) => {
      const { assignmentId } = job.data;
      const doc = await Assignment.findById(assignmentId);
      if (!doc) throw new Error(`Assignment ${assignmentId} not found`);

      doc.status = "generating";
      doc.progress = 10;
      await doc.save();
      emitAssignmentUpdate(assignmentId, { status: "generating", progress: 10 });

      const prompt = buildGenerationPrompt({
        title: doc.title,
        subject: doc.subject ?? undefined,
        className: doc.className ?? undefined,
        dueDate: doc.dueDate,
        questionTypes: doc.questionTypes.toObject() as any,
        additionalInstructions: doc.additionalInstructions ?? undefined,
        uploadedMaterial: doc.uploadedMaterial ?? undefined,
      });

      doc.progress = 35;
      await doc.save();
      emitAssignmentUpdate(assignmentId, { status: "generating", progress: 35 });

      const paper = await generatePaper(prompt);

      doc.paper = paper as any;
      doc.status = "completed";
      doc.progress = 100;
      doc.error = undefined;
      await doc.save();

      emitAssignmentUpdate(assignmentId, {
        status: "completed",
        progress: 100,
        paper,
      });

      return { ok: true };
    },
    {
      connection: redisConnection,
      concurrency: 2,
    }
  );

  worker.on("failed", async (job, err) => {
    console.error("[worker] failed", job?.id, err.message);
    if (job?.data?.assignmentId) {
      await Assignment.findByIdAndUpdate(job.data.assignmentId, {
        status: "failed",
        error: err.message,
      });
      emitAssignmentUpdate(job.data.assignmentId, {
        status: "failed",
        error: err.message,
      });
    }
  });

  worker.on("completed", (job) => {
    console.log("[worker] completed", job.id);
  });

  console.log("[worker] generation worker started");
  return worker;
}

if (require.main === module) {
  (async () => {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.mongoUri);
    console.log("[worker] mongo connected");
    startGenerationWorker();
  })().catch((err) => {
    console.error("[worker] fatal", err);
    process.exit(1);
  });
}
