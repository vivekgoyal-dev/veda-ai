import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const e = err as { status?: number; message?: string };
  const status = e.status ?? 500;
  console.error("[api error]", e.message ?? err);
  res.status(status).json({ error: e.message ?? "Internal server error" });
}
