import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (token: string, userId: string) => void;
  markHydrated: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (token, userId) =>
    set({
      accessToken: token,
      userId,
      isAuthenticated: true,
    }),

  markHydrated: () =>
    set({
      isHydrated: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      userId: null,
      isAuthenticated: false,
      isHydrated: true, 
    }),
}));
