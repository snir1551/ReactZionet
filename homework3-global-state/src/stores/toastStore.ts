import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const newToast: Toast = {
      ...toast,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== newToast.id),
      }));
    }, 5000);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  clearAll: () => {
    set({ toasts: [] });
  },
}));
