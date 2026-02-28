import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isOnboarded: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (token: string, userId: string, isOnboarded: boolean) => void;
  markHydrated: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  isOnboarded: false,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (token, userId, isOnboarded) =>
    set({
      accessToken: token,
      userId,
      isOnboarded,
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
