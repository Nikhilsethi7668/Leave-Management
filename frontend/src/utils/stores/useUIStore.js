// src/stores/useUIStore.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
