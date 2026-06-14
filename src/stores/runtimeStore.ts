import { create } from "zustand";

interface RuntimeState {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  isImmersive: boolean;
  setImmersive: (value: boolean) => void;
}

export const useRuntimeStore = create<RuntimeState>((set) => ({
  isPlaying: false,
  setIsPlaying: (value) => set({ isPlaying: value }),
  isImmersive: false,
  setImmersive: (value) => set({ isImmersive: value }),
}));
