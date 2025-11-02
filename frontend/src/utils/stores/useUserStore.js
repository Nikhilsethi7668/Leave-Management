import { create } from "zustand";
import api from "../axiosInstance";

export const useUserStore = create((set) => ({
  users: { docs: [], totalPages: 1, page: 1 },
  getUsers: async (page = 1, limit = 20) => {
    try {
      const { data } = await api.get(
        `/users/getAllUsers?page=${page}&limit=${limit}`
      );
      // Handle both paginated and array response
      if (Array.isArray(data.users)) {
        set({ users: { docs: data.users, totalPages: 1, page: 1 } });
      } else {
        set({ users: data });
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      set({ users: { docs: [], totalPages: 1, page: 1 } });
    }
  },
  approve: async (userId) => {
    await api.patch(`/users/approve/${userId}`);
    set((s) => ({
      users: {
        ...s.users,
        docs: s.users.docs.map((u) =>
          u._id === userId ? { ...u, isActive: true } : u
        ),
      },
    }));
  },
  deactivate: async (userId) => {
    await api.patch(`/users/deactivate/${userId}`);
    set((s) => ({
      users: {
        ...s.users,
        docs: s.users.docs.map((u) =>
          u._id === userId ? { ...u, isActive: false } : u
        ),
      },
    }));
  },
}));
