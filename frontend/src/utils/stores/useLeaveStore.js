// src/stores/useLeaveStore.js
import { create } from 'zustand';
import api from '../axiosInstance';

export const useLeaveStore = create((set, get) => ({
  myLeaves: [],
  allLeaves: [],
  pendingLeaves: { docs: [], totalPages: 1 },
  userLeaveAnalytics: {},
  adminAnalytics: {},
  leaveCategories: [],
  isModalOpen: false,
  modalAction: null,
  selectedRequest: null,
  page: 1,
  selectedLeaveType: null,

  getAdminAnalytics: async () => {
    try {
      const { data } = await api.get('/leaves/analytics/admin');
      set({ adminAnalytics: data });
    } catch (error) {
      console.error('Failed to load admin analytics:', error);
      set({ adminAnalytics: {} });
    }
  },

  getPendingLeaves: async (page = 1, limit = 5) => {
    try {
      const { data } = await api.get(
        `/leaves/pending?page=${page}&limit=${limit}`
      );
      set({ pendingLeaves: data, page });
    } catch (error) {
      console.error('Failed to load pending leaves:', error);
      set({ pendingLeaves: { docs: [], totalPages: 1 } });
    }
  },

  apply: async (payload) => {
    await api.post('/leaves/apply', payload);
  },

  loadMyLeaves: async (userId) => {
    const r = await api.get(`/leaves/history/${userId}`);
    set({ myLeaves: r.data || r });
  },

  loadLeaveCategories: async () => {
    const r = await api.get('/leaves/categories');
    set({ leaveCategories: r.data || r });
  },

  loadAnalytics: async (userId) => {
    const r = await api.get(`/leaves/analytics/${userId}`);
    set({ userLeaveAnalytics: r.data || r });
  },

  deleteLeave: async (leaveId) => {
    await api.delete(`/leaves/${leaveId}`);
    set((s) => ({
      myLeaves: s.myLeaves.filter((leave) => leave._id !== leaveId),
    }));
  },

  reviewLeave: async (leaveId, payload) => {
    await api.post(`/leaves/review/${leaveId}`, payload);
    set((s) => ({
      pendingLeaves: {
        ...s.pendingLeaves,
        docs: s.pendingLeaves.docs.filter((l) => l._id !== leaveId),
      },
    }));
  },

  openModal: (request, action) => {
    set({ selectedRequest: request, modalAction: action, isModalOpen: true });
  },

  closeModal: () => {
    set({ isModalOpen: false, selectedRequest: null, modalAction: null });
  },

  setPage: (page) => {
    const { getPendingLeaves } = get();
    getPendingLeaves(page);
  },

  handleReview: async (details) => {
    const { selectedRequest, modalAction, reviewLeave, closeModal } = get();
    if (!selectedRequest) return;
    await reviewLeave(selectedRequest._id, {
      ...details,
      status: modalAction,
    });
    closeModal();
  },

  setSelectedLeaveType: (type) => {
    set({ selectedLeaveType: type });
  },

  handleFormCancel: () => {
    set({ selectedLeaveType: null });
  },

  submitApplication: async (formData, user, navigate) => {
    const { apply, loadMyLeaves } = get();
    try {
      await apply({
        ...formData,
        user: user._id,
      });
      await loadMyLeaves(user._id);
      set({ selectedLeaveType: null });
      alert('Leave application submitted successfully!');
      navigate('/history');
    } catch (error) {
      console.error('Error applying for leave:', error);
      alert('Failed to submit leave application. Please try again.');
    }
  },

  deleteApplication: async (leaveId) => {
    const { deleteLeave } = get();
    if (window.confirm('Are you sure you want to delete this leave application?')) {
      try {
        await deleteLeave(leaveId);
        alert('Leave application deleted successfully!');
      } catch (error) {
        console.error('Error deleting leave:', error);
        alert('Failed to delete leave application. Please try again.');
      }
    }
  },
}));

