import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditorShell } from './EditorShell';
import { useEditorStore } from '@/stores/editorStore';
import { useRuntimeStore } from '@/stores/runtimeStore';
import { useSelectionStore } from '@/stores/selectionStore';

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
  useEditorStore.setState({
    width: 64,
    height: 64,
    tiles: [],
    entities: [],
    background: "dark",
  });
  useRuntimeStore.setState({ isPlaying: false });
  useSelectionStore.setState({
    activeTool: 'tile',
    selectedTile: 'ground',
    selectedEntity: null,
    selectedEntityId: null,
  });
});

describe('EditorShell', () => {
  it('renders header with brand name and title', () => {
    render(<EditorShell />);
    expect(screen.getByText('GameForge')).toBeInTheDocument();
    expect(screen.getByText('Editor de niveles 2D')).toBeInTheDocument();
  });

  it('shows editor active status by default', () => {
    render(<EditorShell />);
    expect(screen.getByText('Editor activo')).toBeInTheDocument();
  });

  it('shows runtime active status after clicking play', async () => {
    const user = userEvent.setup();
    render(<EditorShell />);
    await user.click(screen.getByRole('button', { name: /^play:/i }));
    expect(screen.getByText('Runtime activo')).toBeInTheDocument();
  });

  it('returns to editor status after stopping', async () => {
    const user = userEvent.setup();
    render(<EditorShell />);
    await user.click(screen.getByRole('button', { name: /^play:/i }));
    await user.click(screen.getByRole('button', { name: /^stop:/i }));
    expect(screen.getByText('Editor activo')).toBeInTheDocument();
  });

  it('renders ToolPanel with tile and entity sections', () => {
    render(<EditorShell />);
    expect(screen.getByText('Tiles')).toBeInTheDocument();
    expect(screen.getByText('Entidades')).toBeInTheDocument();
  });

  it('renders LevelCanvas section', () => {
    render(<EditorShell />);
    expect(screen.getByText('Canvas del nivel')).toBeInTheDocument();
  });

  it('renders InspectorPanel section', () => {
    render(<EditorShell />);
    expect(screen.getByText('Inspector')).toBeInTheDocument();
  });

  it('renders the grid element inside DndContext', () => {
    render(<EditorShell />);
    const grid = document.getElementById('grid');
    expect(grid).toBeInTheDocument();
  });

  it('renders play and stop buttons', () => {
    render(<EditorShell />);
    expect(screen.getByRole('button', { name: /^play:/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^stop:/i })).toBeInTheDocument();
  });

  it('sets isPlaying to false when stop is clicked while playing', async () => {
    const user = userEvent.setup();
    render(<EditorShell />);
    await user.click(screen.getByRole('button', { name: /^play:/i }));
    expect(useRuntimeStore.getState().isPlaying).toBe(true);
    await user.click(screen.getByRole('button', { name: /^stop:/i }));
    expect(useRuntimeStore.getState().isPlaying).toBe(false);
  });
});
