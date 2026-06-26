import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initialize by checking if a token already exists in the browser
  token: localStorage.getItem('jwt_token'),
  isAuthenticated: !!localStorage.getItem('jwt_token'),

  login: (token: string) => {
    localStorage.setItem('jwt_token', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    set({ token: null, isAuthenticated: false });
  },
}));