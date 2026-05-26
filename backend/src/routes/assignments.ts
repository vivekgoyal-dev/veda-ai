import { Router } from "express";
import { z } from "zod";
import { Assignment } from "../models/Assignment";
import { generationQueue } from "../queues/generation.queue";

const router = Router();

const questionTypeSchema = z.object({
  type: z.enum(["mcq", "short", "diagram", "numerical", "long"]),
  label: z.string().min(1).max(120),
  count: z.number().int().min(1).max(50),
  marks: z.number().int().min(1).max(20),
});

const createSchema = z.object({
  title: z.string().min(1).max(200),
  subject: z.string().max(80).optional(),
  className: z.string().max(40).optional(),
  dueDate: z.string().min(1),
  questionTypes: z.array(questionTypeSchema).min(1).max(10),
  additionalInstructions: z.string().max(2000).optional(),
  uploadedMaterial: z.string().max(20000).optional(),
});

router.get("/", async (_req, res, next) => {
  try {
    const items = await Assignment.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const doc = await Assignment.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Assignment not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
    }

    const doc = await Assignment.create({
      ...parsed.data,
      status: "queued",
      progress: 0,
    });

    await generationQueue.add(
      "generate",
      { assignmentId: doc.id },
      { jobId: doc.id }
    );

    res.status(201).json(doc.toObject());
  } catch (err) {
    next(err);
  }
});

router.post("/:id/regenerate", async (req, res, next) => {
  try {
    const doc = await Assignment.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Assignment not found" });

    doc.status = "queued";
    doc.progress = 0;
    doc.error = undefined;
    doc.paper = undefined;
    await doc.save();

    await generationQueue.add(
      "generate",
      { assignmentId: doc.id },
      { jobId: `${doc.id}-${Date.now()}` }
    );

    res.json(doc.toObject());
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Assignment.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Assignment not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
