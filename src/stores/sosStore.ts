import { create } from 'zustand';
import type { Coordinates } from '@/types/report';

interface SOSState {
  isActive: boolean;
  location: Coordinates | null;
  reportId: string | null;
  setSOSActive: (active: boolean, location: Coordinates | null, reportId: string | null) => void;
  resetSOS: () => void;
}

export const useSOSStore = create<SOSState>((set) => ({
  isActive: false,
  location: null,
  reportId: null,
  setSOSActive: (isActive, location, reportId) => set({ isActive, location, reportId }),
  resetSOS: () => set({ isActive: false, location: null, reportId: null }),
}));
