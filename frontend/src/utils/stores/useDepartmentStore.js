// src/stores/useDepartmentStore.js
import { create } from "zustand";
import api from "../axiosInstance";

export const useDepartmentStore = create((set) => ({
  departments: [],
  load: async () => {
    const res = await api.get("/departments");
    set({ departments: res.data || res });
  },
  create: async (payload) => {
    await api.post("/departments", payload);
    await api
      .get("/departments")
      .then((r) => set({ departments: r.data || r }));
  },
  remove: async (id) => {
    await api.delete(`/departments/${id}`);
    set((s) => ({ departments: s.departments.filter((d) => d._id !== id) }));
  },
}));
