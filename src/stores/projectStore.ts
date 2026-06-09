import { create } from "zustand";

interface ProjectState {
  jsonText: string;
  setJsonText: (value: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  jsonText: "",
  setJsonText: (value) => set({ jsonText: value }),
}));
