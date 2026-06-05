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
    expect(screen.getByText('Entidades')).toBeInTheDocument();
  });

  it('renders all tile types', () => {
    renderPanel();
    expect(screen.getByText('Suelo')).toBeInTheDocument();
    expect(screen.getByText('Pinchos')).toBeInTheDocument();
  });

  it('renders all entity types', () => {
    renderPanel();
    expect(screen.getByText('Jugador')).toBeInTheDocument();
    expect(screen.getByText('Moneda')).toBeInTheDocument();
    expect(screen.getByText('Enemigo')).toBeInTheDocument();
    expect(screen.getByText('Meta')).toBeInTheDocument();
  });

  it('has ground selected by default', () => {
    renderPanel();
    const ground = screen.getByRole('button', { name: /suelo: seleccionar tile ground/i });
    expect(ground).toHaveClass('bg-slate-700');
  });

  it('selects spike tile on click', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Pinchos'));
    expect(useSelectionStore.getState().selectedTile).toBe('spike');
  });

  it('selects enemy entity on click', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Enemigo'));
    const state = useSelectionStore.getState();
    expect(state.selectedEntity).toBe('enemy');
    expect(state.activeTool).toBe('entity');
  });

  it('switches to erase mode on erase button click', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Borrar'));
    expect(useSelectionStore.getState().activeTool).toBe('erase');
  });

  it('selecting a tile clears any selected entity', async () => {
    useSelectionStore.setState({ selectedEntity: 'player', activeTool: 'entity' });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Suelo'));
    const state = useSelectionStore.getState();
    expect(state.selectedTile).toBe('ground');
    expect(state.selectedEntity).toBeNull();
    expect(state.activeTool).toBe('tile');
  });

  it('selecting an entity clears any selected tile', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByText('Jugador'));
    const state = useSelectionStore.getState();
    expect(state.selectedEntity).toBe('player');
    expect(state.selectedTile).toBeNull();
    expect(state.activeTool).toBe('entity');
  });
});
