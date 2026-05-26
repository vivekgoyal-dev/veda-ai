"use client";

import { create } from "zustand";
import type { Assignment } from "@/lib/types";
import { api } from "@/lib/api";

interface AssignmentState {
  items: Assignment[];
  loading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  upsert: (item: Assignment) => void;
  remove: (id: string) => void;
  patch: (id: string, partial: Partial<Assignment>) => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  items: [],
  loading: false,
  hasFetched: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.listAssignments();
      set({ items: res.items, loading: false, hasFetched: true });
    } catch (e) {
      const err = e as Error;
      set({ error: err.message, loading: false, hasFetched: true });
    }
  },
  upsert: (item) =>
    set((s) => {
      const idx = s.items.findIndex((a) => a._id === item._id);
      if (idx === -1) return { items: [item, ...s.items] };
      const next = s.items.slice();
      next[idx] = item;
      return { items: next };
    }),
  remove: (id) =>
    set((s) => ({ items: s.items.filter((a) => a._id !== id) })),
  patch: (id, partial) =>
    set((s) => {
      const idx = s.items.findIndex((a) => a._id === id);
      if (idx === -1) return s;
      const next = s.items.slice();
      next[idx] = { ...next[idx], ...partial };
      return { items: next };
    }),
}));
