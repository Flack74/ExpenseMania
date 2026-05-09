import { create } from "zustand";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  updateUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  login: async (email, password) => {
    const { user } = await api.login(email, password);
    set({ user });
  },
  register: async (payload) => {
    const { user } = await api.register(payload);
    set({ user });
  },
  logout: async () => {
    await api.logout();
    set({ user: null });
  },
  hydrate: async () => {
    try {
      const user = await api.me();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
  updateUser: (user) => set({ user }),
}));
