// src/stores/useAuthStore.js
import { create } from "zustand";
import api from "../axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  loaded: false,
  error: null,

  me: async () => {
    try {
      const { data } = await api.get("/users/me");
      set({ user: data.user, loaded: true });
      return data.user;
    } catch {
      set({ user: null, loaded: true });
      return null;
    }
  },

  login: async (payload) => {
    try {
      await api.post("/users/login", payload);
      await api
        .get("/users/me")
        .then((response) => set({ user: response.data.user }));
    } catch (err) {
      throw err;
    }
  },
  signup: async (payload) => {
    try {
      //It will send request to confirm and approve registration
      await api.post("/users/signup", payload).then((response) => {
        return response.data;
      });
    } catch (err) {
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post("/users/logout");
    } finally {
      set({ user: null });
    }
  },
}));
