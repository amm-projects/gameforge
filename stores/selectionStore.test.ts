import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectionStore } from './selectionStore';

beforeEach(() => {
  useSelectionStore.setState({
    activeTool: 'tile',
    selectedTile: 'ground',
    selectedEntity: null,
    selectedEntityId: null,
  });
});

describe('selectionStore', () => {
  it('starts with tile mode and ground selected', () => {
    const state = useSelectionStore.getState();
    expect(state.activeTool).toBe('tile');
    expect(state.selectedTile).toBe('ground');
    expect(state.selectedEntity).toBeNull();
    expect(state.selectedEntityId).toBeNull();
  });

  describe('setSelectedTile', () => {
    it('selects a tile and switches to tile mode', () => {
      useSelectionStore.getState().setSelectedTile('spike-up');
      const state = useSelectionStore.getState();
      expect(state.selectedTile).toBe('spike-up');
      expect(state.activeTool).toBe('tile');
      expect(state.selectedEntity).toBeNull();
    });

    it('clears any selected entity', () => {
      useSelectionStore.setState({ selectedEntity: 'player', activeTool: 'entity' });
      useSelectionStore.getState().setSelectedTile('ground');
      const state = useSelectionStore.getState();
      expect(state.selectedEntity).toBeNull();
      expect(state.activeTool).toBe('tile');
    });
  });

  describe('setSelectedEntity', () => {
    it('selects an entity and switches to entity mode', () => {
      useSelectionStore.getState().setSelectedEntity('player');
      const state = useSelectionStore.getState();
      expect(state.selectedEntity).toBe('player');
      expect(state.activeTool).toBe('entity');
      expect(state.selectedTile).toBeNull();
    });

    it('clears any selected tile', () => {
      useSelectionStore.getState().setSelectedEntity('coin');
      const state = useSelectionStore.getState();
      expect(state.selectedTile).toBeNull();
      expect(state.activeTool).toBe('entity');
    });
  });

  describe('setActiveTool', () => {
    it('sets active tool to erase', () => {
      useSelectionStore.getState().setActiveTool('erase');
      expect(useSelectionStore.getState().activeTool).toBe('erase');
    });

    it('sets active tool to tile', () => {
      useSelectionStore.getState().setActiveTool('tile');
      expect(useSelectionStore.getState().activeTool).toBe('tile');
    });

    it('sets active tool to entity', () => {
      useSelectionStore.getState().setActiveTool('entity');
      expect(useSelectionStore.getState().activeTool).toBe('entity');
    });
  });

  describe('setSelectedEntityId', () => {
    it('sets the selected entity id', () => {
      useSelectionStore.getState().setSelectedEntityId('abc-123');
      expect(useSelectionStore.getState().selectedEntityId).toBe('abc-123');
    });

    it('clears the selected entity id with null', () => {
      useSelectionStore.setState({ selectedEntityId: 'some-id' });
      useSelectionStore.getState().setSelectedEntityId(null);
      expect(useSelectionStore.getState().selectedEntityId).toBeNull();
    });
  });
});
