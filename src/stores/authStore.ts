import { create } from 'zustand';

interface AuthState {
  user: any | null;
  loading: boolean;
  isAdmin: boolean;
  profileCompleted: boolean;
  setUser: (user: any | null) => void;
  setLoading: (loading: boolean) => void;
  setAdmin: (isAdmin: boolean) => void;
  setProfileCompleted: (completed: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAdmin: false,
  profileCompleted: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setAdmin: (isAdmin) => set({ isAdmin }),
  setProfileCompleted: (profileCompleted) => set({ profileCompleted }),
  reset: () => set({ user: null, loading: false, isAdmin: false, profileCompleted: false }),
}));
