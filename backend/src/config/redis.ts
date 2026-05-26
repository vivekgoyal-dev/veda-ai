import IORedis from "ioredis";
import { env } from "./env";

export const redisConnection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on("connect", () => console.log("[redis] connected"));
redisConnection.on("error", (err) => console.error("[redis] error", err.message));
