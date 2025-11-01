// src/stores/useUserStore.js
import { create } from "zustand";
import api from "../utils/axiosInstance";

export const useUserStore = create((set) => ({
  approve: async (userId) => {
    await api.post(`/users/${userId}/approve`);
  },
  deactivate: async (userId) => {
    await api.post(`/users/${userId}/deactivate`);
  },
}));
