import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTileBrush } from './useTileBrush';
import { useEditorStore } from '@/stores/editorStore';
import { useSelectionStore } from '@/stores/selectionStore';
import { CELL_SIZE } from '@/assets';

beforeEach(() => {
  useEditorStore.setState({
    width: 64,
    height: 64,
    tiles: [],
    entities: [],
  });
  useSelectionStore.setState({
    activeTool: 'tile',
    selectedTile: 'ground',
    selectedEntity: null,
    selectedEntityId: null,
  });
});

describe('useTileBrush', () => {
  it('returns expected hook properties', () => {
    const { result } = renderHook(() => useTileBrush());
    expect(result.current).toHaveProperty('makeAction');
    expect(result.current).toHaveProperty('scheduleFlush');
    expect(result.current).toHaveProperty('getCellFromEvent');
    expect(result.current).toHaveProperty('startBrush');
    expect(result.current).toHaveProperty('endBrush');
    expect(result.current).toHaveProperty('setGridRect');
  });

  it('makeAction returns tile action when tool is tile', () => {
    useSelectionStore.setState({ activeTool: 'tile', selectedTile: 'ground', selectedEntity: null });
    const { result } = renderHook(() => useTileBrush());
    const action = result.current.makeAction(5, 10);
    expect(action).toEqual({ kind: 'tile', x: 5, y: 10, tileType: 'ground' });
  });

  it('makeAction returns erase action when tool is erase', () => {
    useSelectionStore.setState({ activeTool: 'erase', selectedTile: null, selectedEntity: null });
    const { result } = renderHook(() => useTileBrush());
    const action = result.current.makeAction(3, 7);
    expect(action).toEqual({ kind: 'erase', x: 3, y: 7 });
  });

  it('makeAction returns entity action when tool is entity', () => {
    useSelectionStore.setState({ activeTool: 'entity', selectedEntity: 'player', selectedTile: null });
    const { result } = renderHook(() => useTileBrush());
    const action = result.current.makeAction(0, 0);
    expect(action).not.toBeNull();
    expect(action!.kind).toBe('entity');
    if (action && 'entityType' in action) {
      expect(action.entityType).toBe('player');
      expect(action.x).toBe(0);
      expect(action.y).toBe(0);
    }
  });

  it('makeAction returns null when no tool or selection', () => {
    useSelectionStore.setState({ activeTool: 'tile', selectedTile: null, selectedEntity: null });
    const { result } = renderHook(() => useTileBrush());
    const action = result.current.makeAction(0, 0);
    expect(action).toBeNull();
  });

  it('getCellFromEvent returns null when gridRect is not set', () => {
    const { result } = renderHook(() => useTileBrush());
    const cell = result.current.getCellFromEvent(100, 100);
    expect(cell).toBeNull();
  });

  it('getCellFromEvent returns correct cell coordinates', () => {
    const { result } = renderHook(() => useTileBrush());
    const rect = { left: 0, top: 0, right: 640, bottom: 640, width: 640, height: 640, x: 0, y: 0, toJSON: () => '' };
    result.current.setGridRect(rect);
    const cell = result.current.getCellFromEvent(160, 96);
    expect(cell).toEqual({ x: 16, y: 9 });
  });

  it('getCellFromEvent returns null for out-of-bounds coordinates', () => {
    const { result } = renderHook(() => useTileBrush());
    const rect = { left: 0, top: 0, right: 640, bottom: 640, width: 640, height: 640, x: 0, y: 0, toJSON: () => '' };
    result.current.setGridRect(rect);
    const cell = result.current.getCellFromEvent(9999, 9999);
    expect(cell).toBeNull();
  });

  it('startBrush and endBrush manage painting state', () => {
    const { result } = renderHook(() => useTileBrush());
    expect(result.current.isPainting.current).toBe(false);
    result.current.startBrush(5, 5, null);
    expect(result.current.isPainting.current).toBe(true);
    expect(result.current.startCell.current).toEqual({ x: 5, y: 5 });
    result.current.endBrush();
    expect(result.current.isPainting.current).toBe(false);
    expect(result.current.startCell.current).toBeNull();
  });

  it('getCellFromEvent accounts for zoom factor', () => {
    const { result } = renderHook(() => useTileBrush());
    const rect = { left: 0, top: 0, right: 1280, bottom: 1280, width: 1280, height: 1280, x: 0, y: 0, toJSON: () => '' };
    result.current.setGridRect(rect);
    const cell = result.current.getCellFromEvent(64, 64, 2);
    expect(cell).toEqual({ x: 3, y: 3 });
  });
});
