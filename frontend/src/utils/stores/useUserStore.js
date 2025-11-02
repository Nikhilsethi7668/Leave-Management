import { create } from "zustand";
import api from "../axiosInstance";

export const useUserStore = create((set) => ({
  users: [],
  getUsers: async () => {
    try {
      const { data } = await api.get("/users");
      set({ users: data });
    } catch (error) {
      console.error("Failed to load users:", error);
      set({ users: [] });
    }
  },
  approve: async (userId) => {
    await api.patch(`/users/approve/${userId}`);
    set((s) => ({
      users: s.users.map((u) =>
        u._id === userId ? { ...u, approved: true } : u
      ),
    }));
  },
  deactivate: async (userId) => {
    await api.patch(`/users/deactivate/${userId}`);
    set((s) => ({
      users: s.users.map((u) =>
        u._id === userId ? { ...u, active: false } : u
      ),
    }));
  },
}));
