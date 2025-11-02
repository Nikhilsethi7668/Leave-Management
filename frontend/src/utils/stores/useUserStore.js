import { create } from "zustand";
import api from "../axiosInstance";

/*
This is auth store , It will handle users , approve user and reject user and will be responsible for changing users isActive state and getting user list in the application along with their role .
*/

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
    try {
      await api.patch(`/users/approve/${userId}`);
      set((s) => ({
        users: {
          ...s.users,
          docs: s.users.docs.map((u) =>
            u._id === userId ? { ...u, isActive: true } : u
          ),
        },
      }));
    } catch (error) {
      console.error("Failed to approve user:", error);
    }
  },

  deactivate: async (userId) => {
    try {
      await api.patch(`/users/deactivate/${userId}`);
      set((s) => ({
        users: {
          ...s.users,
          docs: s.users.docs.map((u) =>
            u._id === userId ? { ...u, isActive: false } : u
          ),
        },
      }));
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    }
  },
}));
