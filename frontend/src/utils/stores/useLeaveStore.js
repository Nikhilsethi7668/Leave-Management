// src/stores/useLeaveStore.js
import { create } from "zustand";
import api from "../axiosInstance";

export const useLeaveStore = create((set) => ({
  myLeaves: [],
  allLeaves: [],
  userLeaveAnalytics: {},
  leaveCategories: [],

  apply: async (payload) => {
    await api.post("/leaves/apply", payload);
  },

  loadMyLeaves: async (userId) => {
    const r = await api.get(`/leaves/history/${userId}`);
    set({ myLeaves: r.data || r });
  },

  loadLeaveCategories: async () => {
    const r = await api.get("/leaves/categories");
    set({ leaveCategories: r.data || r });
  },

  loadAnalytics: async (userId) => {
    const r = await api.get(`/leaves/analytics/${userId}`);
    set({ userLeaveAnalytics: r.data || r });
  },

  // Delete leave application
  deleteLeave: async (leaveId) => {
    await api.delete(`/leaves/${leaveId}`);
    set((s) => ({
      myLeaves: s.myLeaves.filter((leave) => leave._id !== leaveId),
    }));
  },

  // Admin only
  review: async (leaveId, payload) => {
    await api.patch(`/leaves/${leaveId}/review`, payload);
    set((s) => ({
      allLeaves: s.allLeaves.map((l) =>
        l._id === leaveId ? { ...l, status: payload.status } : l
      ),
    }));
  },
}));
