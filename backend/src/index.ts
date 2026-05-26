import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { env } from "./config/env";
import { connectMongo } from "./config/db";
import assignmentsRouter from "./routes/assignments";
import { errorHandler } from "./middleware/error";
import { initSocket } from "./sockets";
import { startGenerationWorker } from "./workers/generation.worker";

async function main() {
  await connectMongo();

  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin.split(",").map((s) => s.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("tiny"));

  app.get("/health", (_req, res) => res.json({ ok: true, env: env.nodeEnv }));
  app.use("/api/assignments", assignmentsRouter);

  app.use(errorHandler);

  const httpServer = createServer(app);
  initSocket(httpServer);

  // Run the BullMQ worker in-process unless explicitly disabled
  // (set WORKER_DISABLED=true if running a dedicated worker service)
  if (process.env.WORKER_DISABLED !== "true") {
    startGenerationWorker();
  }

  httpServer.listen(env.port, () => {
    console.log(`[api] listening on :${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
