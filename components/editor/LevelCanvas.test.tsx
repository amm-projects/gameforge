import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import { LevelCanvas } from './LevelCanvas';
import { useEditorStore } from '@/stores/editorStore';
import { useSelectionStore } from '@/stores/selectionStore';

function renderWithDnd() {
  return render(
    <DndContext>
      <LevelCanvas />
    </DndContext>
  );
}

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

describe('LevelCanvas', () => {
  it('renders the canvas section with title', () => {
    renderWithDnd();
    expect(screen.getByText('Canvas del nivel')).toBeInTheDocument();
  });

  it('shows grid dimensions badge', () => {
    renderWithDnd();
    expect(screen.getByText('64x64 grid')).toBeInTheDocument();
  });

  it('renders the grid element', () => {
    renderWithDnd();
    const grid = document.getElementById('grid');
    expect(grid).toBeInTheDocument();
  });

  it('renders grid cells when tiles exist', () => {
    useEditorStore.setState({
      tiles: [{ x: 5, y: 10, type: 'ground' }],
      width: 64,
      height: 64,
    });
    renderWithDnd();
    const cells = document.querySelectorAll('[data-x]');
    expect(cells.length).toBeGreaterThanOrEqual(1);
  });

  it('renders multiple cells with tiles and entities', () => {
    useEditorStore.setState({
      tiles: [
        { x: 0, y: 0, type: 'ground' },
        { x: 1, y: 0, type: 'spike' },
      ],
      entities: [
        { id: 'p1', type: 'player', position: { x: 2, y: 0 }, properties: {} },
        { id: 'c1', type: 'coin', position: { x: 3, y: 0 }, properties: {} },
      ],
    });
    renderWithDnd();
    const cells = document.querySelectorAll('[data-x]');
    expect(cells.length).toBeGreaterThanOrEqual(4);
  });

  it('renders selected entity with cyan ring', () => {
    useEditorStore.setState({
      entities: [{ id: 'selected-id', type: 'player', position: { x: 0, y: 0 }, properties: {} }],
    });
    useSelectionStore.setState({ selectedEntityId: 'selected-id' });
    renderWithDnd();
    const selected = document.querySelector('[class*="border-cyan-400"]');
    expect(selected).toBeInTheDocument();
  });

  it('does not render cells for empty grid', () => {
    renderWithDnd();
    const cells = document.querySelectorAll('[data-x]');
    expect(cells.length).toBe(0);
  });
});
