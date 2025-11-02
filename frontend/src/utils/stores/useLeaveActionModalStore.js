import { create } from 'zustand';

export const useLeaveActionModalStore = create((set) => ({
  note: '',
  reason: '',
  isPaid: false,

  setNote: (note) => set({ note }),
  setReason: (reason) => set({ reason }),
  setIsPaid: (isPaid) => set({ isPaid }),
  reset: () => set({ note: '', reason: '', isPaid: false }),
}));
