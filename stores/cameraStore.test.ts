import { describe, it, expect, beforeEach } from "vitest";
import { useCameraStore } from "./cameraStore";

describe("cameraStore", () => {
  beforeEach(() => {
    useCameraStore.setState({ zoom: 1, panX: 0, panY: 0 });
  });

  it("starts with default zoom and no pan", () => {
    const state = useCameraStore.getState();
    expect(state.zoom).toBe(1);
    expect(state.panX).toBe(0);
    expect(state.panY).toBe(0);
  });

  it("zooms in by ZOOM_STEP", () => {
    useCameraStore.getState().zoomIn();
    expect(useCameraStore.getState().zoom).toBe(1.25);
  });

  it("zooms out by ZOOM_STEP", () => {
    useCameraStore.getState().zoomOut();
    expect(useCameraStore.getState().zoom).toBe(0.75);
  });

  it("does not zoom out below MIN_ZOOM", () => {
    for (let i = 0; i < 10; i++) {
      useCameraStore.getState().zoomOut();
    }
    expect(useCameraStore.getState().zoom).toBe(0.25);
  });

  it("resets zoom and pan", () => {
    useCameraStore.setState({ zoom: 2, panX: 100, panY: 200 });
    useCameraStore.getState().resetZoom();
    const state = useCameraStore.getState();
    expect(state.zoom).toBe(1);
    expect(state.panX).toBe(0);
    expect(state.panY).toBe(0);
  });

  it("sets pan", () => {
    useCameraStore.getState().setPan(50, 100);
    const state = useCameraStore.getState();
    expect(state.panX).toBe(50);
    expect(state.panY).toBe(100);
  });

  it("fitToMap calculates correct zoom", () => {
    useCameraStore.getState().fitToMap(640, 480, 320, 240);
    expect(useCameraStore.getState().zoom).toBe(0.5);
  });

  it("fitToMap does not exceed DEFAULT_ZOOM", () => {
    useCameraStore.getState().fitToMap(100, 100, 1000, 1000);
    expect(useCameraStore.getState().zoom).toBe(1);
  });
});
