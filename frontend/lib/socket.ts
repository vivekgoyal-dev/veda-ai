"use client";

import { io, Socket } from "socket.io-client";
import { API_BASE } from "./api";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }
  return socket;
}

export function subscribeToAssignment(
  assignmentId: string,
  handler: (data: { status?: string; progress?: number; paper?: unknown; error?: string }) => void
): () => void {
  const s = getSocket();
  s.emit("subscribe", assignmentId);
  const wrapped = (payload: { assignmentId: string; status?: string; progress?: number; paper?: unknown; error?: string }) => {
    if (payload.assignmentId === assignmentId) handler(payload);
  };
  s.on("assignment:update", wrapped);
  return () => {
    s.off("assignment:update", wrapped);
    s.emit("unsubscribe", assignmentId);
  };
}
