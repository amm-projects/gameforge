import { describe, it, expect, beforeEach } from "vitest";
import { useLayerStore } from "./layerStore";
import { LAYERS } from "@/types/level";

describe("layerStore", () => {
  beforeEach(() => {
    useLayerStore.setState({
      activeLayer: LAYERS.SOLID,
      visibleLayers: new Set([LAYERS.BACKGROUND, LAYERS.DECORATION, LAYERS.SOLID, LAYERS.ENEMIES, LAYERS.OBJECTS, LAYERS.PLAYER]),
    });
  });

  it("starts with SOLID as active layer", () => {
    const state = useLayerStore.getState();
    expect(state.activeLayer).toBe(LAYERS.SOLID);
  });

  it("sets active layer", () => {
    useLayerStore.getState().setActiveLayer(LAYERS.BACKGROUND);
    expect(useLayerStore.getState().activeLayer).toBe(LAYERS.BACKGROUND);
  });

  it("all layers are visible by default", () => {
    const state = useLayerStore.getState();
    const allLayers = [0, 1, 2, 3, 4, 5];
    for (const layer of allLayers) {
      expect(state.visibleLayers.has(layer as typeof LAYERS[keyof typeof LAYERS])).toBe(true);
    }
  });

  it("toggles layer visibility off then on", () => {
    useLayerStore.getState().toggleLayerVisibility(LAYERS.SOLID);
    expect(useLayerStore.getState().visibleLayers.has(LAYERS.SOLID)).toBe(false);

    useLayerStore.getState().toggleLayerVisibility(LAYERS.SOLID);
    expect(useLayerStore.getState().visibleLayers.has(LAYERS.SOLID)).toBe(true);
  });

  it("toggling does not affect other layers", () => {
    useLayerStore.getState().toggleLayerVisibility(LAYERS.SOLID);
    expect(useLayerStore.getState().visibleLayers.has(LAYERS.BACKGROUND)).toBe(true);
    expect(useLayerStore.getState().visibleLayers.has(LAYERS.PLAYER)).toBe(true);
  });

  it("showAllLayers restores all layers", () => {
    useLayerStore.getState().toggleLayerVisibility(LAYERS.SOLID);
    useLayerStore.getState().toggleLayerVisibility(LAYERS.BACKGROUND);
    useLayerStore.getState().showAllLayers();
    const allLayers = [0, 1, 2, 3, 4, 5];
    for (const layer of allLayers) {
      expect(useLayerStore.getState().visibleLayers.has(layer as typeof LAYERS[keyof typeof LAYERS])).toBe(true);
    }
  });
});
