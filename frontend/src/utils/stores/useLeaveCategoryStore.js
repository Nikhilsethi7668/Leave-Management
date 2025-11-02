import { create } from 'zustand';
import api from '../axiosInstance';

export const useLeaveCategoryStore = create((set, get) => ({
  name: '',
  description: '',

  setState: (newState) => set(newState),

  createCategory: async () => {
    const { name, description } = get();
    await api.post('/leaves/categories', { name, description });
  },
}));
