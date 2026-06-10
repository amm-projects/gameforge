import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToolPanel } from './ToolPanel';
import { useSelectionStore } from '@/stores/selectionStore';

function renderPanel() {
  return render(<ToolPanel />);
}

beforeEach(() => {
  useSelectionStore.setState({
    activeTool: 'tile',
    selectedTile: 'ground',
    selectedEntity: null,
    selectedEntityId: null,
  });
});

describe('ToolPanel', () => {
  it('renders tile and entity sections', () => {
    renderPanel();
    expect(screen.getByText('Tiles')).toBeInTheDocument();
    expect(screen.getByText('Entities')).toBeInTheDocument();
  });

  it('renders all tile types', () => {
    renderPanel();
    expect(screen.getByText('Ground')).toBeInTheDocument();
    expect(screen.getByText('Spikes ↑')).toBeInTheDocument();
    expect(screen.getByText('Spikes ↓')).toBeInTheDocument();
    expect(screen.getByText('Spikes ←')).toBeInTheDocument();
    expect(screen.getByText('Spikes →')).toBeInTheDocument();
  });

  it('renders all entity types', () => {
    renderPanel();
    expect(screen.getByText('Player')).toBeInTheDocument();
    expect(screen.getByText('Coin')).toBeInTheDocument();
    expect(screen.getByText('Enemy')).toBeInTheDocument();
    expect(screen.getByText('Goal')).toBeInTheDocument();
  });

  it('has ground selected by default', () => {
    renderPanel();
    const ground = screen.getByRole('button', { name: /Ground: select tile ground/i });
    expect(ground).toHaveClass('bg-amber-500/20');
  });

  it('selects spike-up tile on click', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Spikes ↑'));
    expect(useSelectionStore.getState().selectedTile).toBe('spike-up');
  });

  it('selects enemy entity on click', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Enemy'));
    const state = useSelectionStore.getState();
    expect(state.selectedEntity).toBe('enemy');
    expect(state.activeTool).toBe('entity');
  });

  it('switches to erase mode on erase button click', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Erase'));
    expect(useSelectionStore.getState().activeTool).toBe('erase');
  });

  it('selecting a tile clears any selected entity', async () => {
    useSelectionStore.setState({ selectedEntity: 'player', activeTool: 'entity' });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Ground'));
    const state = useSelectionStore.getState();
    expect(state.selectedTile).toBe('ground');
    expect(state.selectedEntity).toBeNull();
    expect(state.activeTool).toBe('tile');
  });

  it('selecting an entity clears any selected tile', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Player'));
    const state = useSelectionStore.getState();
    expect(state.selectedEntity).toBe('player');
    expect(state.selectedTile).toBeNull();
    expect(state.activeTool).toBe('entity');
  });
});
