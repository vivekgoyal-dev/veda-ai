import IORedis from "ioredis";
import { env } from "./env";

export const redisConnection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => Math.min(times * 200, 5000),
  reconnectOnError: () => true,
});

let connectedOnce = false;
redisConnection.on("connect", () => {
  if (!connectedOnce) {
    console.log("[redis] connected");
    connectedOnce = true;
  }
});
redisConnection.on("error", (err) => {
  const msg = err.message || "";
  if (msg.includes("ETIMEDOUT") || msg.includes("EADDRNOTAVAIL")) {
    return;
  }
  console.error("[redis] error", msg);
});
