import { create } from "zustand";
import { Layer, LAYERS } from "@/types/level";

interface LayerState {
  activeLayer: Layer;
  visibleLayers: Set<Layer>;
  setActiveLayer: (layer: Layer) => void;
  toggleLayerVisibility: (layer: Layer) => void;
  showAllLayers: () => void;
}

export const useLayerStore = create<LayerState>((set) => ({
  activeLayer: LAYERS.SOLID,
  visibleLayers: new Set([LAYERS.BACKGROUND, LAYERS.DECORATION, LAYERS.SOLID, LAYERS.ENEMIES, LAYERS.OBJECTS, LAYERS.PLAYER]),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  toggleLayerVisibility: (layer) =>
    set((state) => {
      const next = new Set(state.visibleLayers);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return { visibleLayers: next };
    }),
  showAllLayers: () =>
    set({
      visibleLayers: new Set([LAYERS.BACKGROUND, LAYERS.DECORATION, LAYERS.SOLID, LAYERS.ENEMIES, LAYERS.OBJECTS, LAYERS.PLAYER]),
    }),
}));
