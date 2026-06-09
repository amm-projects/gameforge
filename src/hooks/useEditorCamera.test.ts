import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorCamera } from './useEditorCamera';
import { useCameraStore } from '@/stores/cameraStore';

describe('useEditorCamera', () => {
  beforeEach(() => {
    act(() => { useCameraStore.setState({ zoom: 1, panX: 0, panY: 0 }); });
  });

  it('returns initial zoom, panX, panY', () => {
    const { result } = renderHook(() => useEditorCamera({ current: document.createElement('div') }));
    expect(result.current.zoom).toBe(1);
    expect(result.current.panX).toBe(0);
    expect(result.current.panY).toBe(0);
  });

  it('returns zoomIn, zoomOut, resetZoom, setPan, fitToMap, centerView functions', () => {
    const { result } = renderHook(() => useEditorCamera({ current: document.createElement('div') }));
    expect(typeof result.current.zoomIn).toBe('function');
    expect(typeof result.current.zoomOut).toBe('function');
    expect(typeof result.current.resetZoom).toBe('function');
    expect(typeof result.current.setPan).toBe('function');
    expect(typeof result.current.fitToMap).toBe('function');
    expect(typeof result.current.centerView).toBe('function');
  });

  it('zoomIn updates cameraStore zoom', () => {
    const { result } = renderHook(() => useEditorCamera({ current: document.createElement('div') }));
    act(() => { result.current.zoomIn(); });
    expect(useCameraStore.getState().zoom).toBeGreaterThan(1);
  });

  it('zoomOut updates cameraStore zoom', () => {
    act(() => { useCameraStore.setState({ zoom: 2 }); });
    const { result } = renderHook(() => useEditorCamera({ current: document.createElement('div') }));
    act(() => { result.current.zoomOut(); });
    expect(useCameraStore.getState().zoom).toBeLessThan(2);
  });

  it('resetZoom sets zoom back to 1', () => {
    act(() => { useCameraStore.setState({ zoom: 3 }); });
    const { result } = renderHook(() => useEditorCamera({ current: document.createElement('div') }));
    act(() => { result.current.resetZoom(); });
    expect(useCameraStore.getState().zoom).toBe(1);
  });

  it('setPan updates pan values', () => {
    const { result } = renderHook(() => useEditorCamera({ current: document.createElement('div') }));
    act(() => { result.current.setPan(100, 200); });
    const state = useCameraStore.getState();
    expect(state.panX).toBe(100);
    expect(state.panY).toBe(200);
  });
});
