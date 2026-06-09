import { create } from "zustand";

interface CameraState {
  zoom: number;
  panX: number;
  panY: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPan: (x: number, y: number) => void;
  fitToMap: (mapWidth: number, mapHeight: number, containerWidth: number, containerHeight: number) => void;
  centerView: () => void;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 1;

export const useCameraStore = create<CameraState>((set, get) => ({
  zoom: DEFAULT_ZOOM,
  panX: 0,
  panY: 0,
  zoomIn: () =>
    set((state) => ({ zoom: Math.min(MAX_ZOOM, +(state.zoom + ZOOM_STEP).toFixed(2)) })),
  zoomOut: () =>
    set((state) => ({ zoom: Math.max(MIN_ZOOM, +(state.zoom - ZOOM_STEP).toFixed(2)) })),
  resetZoom: () => set({ zoom: DEFAULT_ZOOM, panX: 0, panY: 0 }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  fitToMap: (mapWidth, mapHeight, containerWidth, containerHeight) => {
    const zoom = Math.min(containerWidth / mapWidth, containerHeight / mapHeight, DEFAULT_ZOOM);
    const panX = (containerWidth - mapWidth * zoom) / 2;
    const panY = (containerHeight - mapHeight * zoom) / 2;
    set({ zoom, panX, panY });
  },
  centerView: () => {
    const { fitToMap: fit } = get();
    const gridEl = typeof document !== "undefined" && document.getElementById("grid");
    if (!gridEl) return;
    const parent = gridEl.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const gridRect = gridEl.getBoundingClientRect();
    fit(gridRect.width, gridRect.height, parentRect.width, parentRect.height);
  },
}));
