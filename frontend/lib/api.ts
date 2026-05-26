import type { Assignment } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listAssignments: () =>
    request<{ items: Assignment[] }>("/api/assignments"),
  getAssignment: (id: string) =>
    request<Assignment>(`/api/assignments/${id}`),
  createAssignment: (
    payload: Omit<
      Assignment,
      | "_id"
      | "status"
      | "progress"
      | "paper"
      | "error"
      | "createdAt"
      | "updatedAt"
    >
  ) =>
    request<Assignment>("/api/assignments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  regenerate: (id: string) =>
    request<Assignment>(`/api/assignments/${id}/regenerate`, {
      method: "POST",
    }),
  delete: (id: string) =>
    request<{ ok: true }>(`/api/assignments/${id}`, {
      method: "DELETE",
    }),
};
