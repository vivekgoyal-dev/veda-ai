import { Queue, QueueEvents } from "bullmq";
import { redisConnection } from "../config/redis";

export const GENERATION_QUEUE = "assignment-generation";

export interface GenerationJobData {
  assignmentId: string;
}

export const generationQueue = new Queue<GenerationJobData>(GENERATION_QUEUE, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: 50,
    removeOnFail: 100,
  },
});

export const generationQueueEvents = new QueueEvents(GENERATION_QUEUE, {
  connection: redisConnection,
});
