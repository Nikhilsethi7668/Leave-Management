// src/stores/useDepartmentStore.js
import { create } from 'zustand';
import api from '../axiosInstance';

export const useDepartmentStore = create((set, get) => ({
  departments: [],
  isAddModalOpen: false,
  isConfirmModalOpen: false,
  departmentToDelete: null,

  load: async () => {
    const res = await api.get('/departments');
    set({ departments: res.data || res });
  },

  create: async (payload) => {
    await api.post('/departments', payload);
    await api
      .get('/departments')
      .then((r) => set({ departments: r.data || r }));
    set({ isAddModalOpen: false });
  },

  remove: async (id) => {
    await api.delete(`/departments/${id}`);
    set((s) => ({ departments: s.departments.filter((d) => d._id !== id) }));
  },

  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),

  openConfirmModal: (id) => set({ isConfirmModalOpen: true, departmentToDelete: id }),
  closeConfirmModal: () => set({ isConfirmModalOpen: false, departmentToDelete: null }),

  confirmDelete: () => {
    const { departmentToDelete, remove, closeConfirmModal } = get();
    if (departmentToDelete) {
      remove(departmentToDelete);
    }
    closeConfirmModal();
  },
}));
