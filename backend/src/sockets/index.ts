import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { env } from "../config/env";

let io: IOServer | null = null;

export function initSocket(httpServer: HttpServer): IOServer {
  io = new IOServer(httpServer, {
    cors: {
      origin: env.corsOrigin.split(",").map((s) => s.trim()),
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("subscribe", (assignmentId: string) => {
      if (typeof assignmentId === "string" && assignmentId.length > 0) {
        socket.join(`assignment:${assignmentId}`);
      }
    });
    socket.on("unsubscribe", (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });
  });

  console.log("[socket.io] initialized");
  return io;
}

export function getIO(): IOServer {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}

export function emitAssignmentUpdate(
  assignmentId: string,
  payload: Record<string, unknown>
): void {
  if (!io) return;
  io.to(`assignment:${assignmentId}`).emit("assignment:update", {
    assignmentId,
    ...payload,
  });
}
