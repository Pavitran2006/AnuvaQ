import { create } from 'zustand';
import { UserProfile } from '../types/quantum';
import { api } from '../services/api';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('aetherq_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('aetherq_token'),

  setAuth: (token, user) => {
    localStorage.setItem('aetherq_token', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('aetherq_token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('aetherq_token');
    if (!token) return;

    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('aetherq_token');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));
