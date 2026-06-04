import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InspectorPanel } from './InspectorPanel';
import { useEditorStore } from '@/stores/editorStore';
import { useProjectStore } from '@/stores/projectStore';

beforeEach(() => {
  useEditorStore.setState({
    width: 64,
    height: 64,
    tiles: [],
    entities: [],
  });
  useProjectStore.setState({ jsonText: '' });
});

describe('InspectorPanel', () => {
  it('renders dimensions, tiles and entities count', () => {
    render(<InspectorPanel />);
    expect(screen.getByText(/64 × 64/)).toBeInTheDocument();
    expect(screen.getByText(/Tiles: 0/)).toBeInTheDocument();
    expect(screen.getByText(/Entidades: 0/)).toBeInTheDocument();
  });

  it('shows correct tile count when tiles exist', () => {
    useEditorStore.setState({ tiles: [{ x: 0, y: 0, type: 'ground' }] });
    render(<InspectorPanel />);
    expect(screen.getByText(/Tiles: 1/)).toBeInTheDocument();
  });

  it('shows correct entity count when entities exist', () => {
    useEditorStore.setState({
      entities: [{ id: '1', type: 'player', x: 5, y: 5 }],
    });
    render(<InspectorPanel />);
    expect(screen.getByText(/Entidades: 1/)).toBeInTheDocument();
  });

  it('exports level JSON on save button click', async () => {
    useEditorStore.setState({
      width: 16,
      height: 12,
      tiles: [{ x: 0, y: 0, type: 'ground' }],
      entities: [{ id: 'abc', type: 'player', x: 1, y: 1 }],
    });
    const user = userEvent.setup();
    render(<InspectorPanel />);
    await user.click(screen.getByText('Exportar JSON'));
    const jsonText = useProjectStore.getState().jsonText;
    const parsed = JSON.parse(jsonText);
    expect(parsed.width).toBe(16);
    expect(parsed.height).toBe(12);
    expect(parsed.tiles).toHaveLength(1);
    expect(parsed.entities).toHaveLength(1);
  });

  it('loads level JSON and updates editor state', async () => {
    const user = userEvent.setup();
    render(<InspectorPanel />);
    const textarea = screen.getByPlaceholderText('JSON del nivel aquí...');
    const level = JSON.stringify({ width: 10, height: 8, tiles: [{ x: 2, y: 3, type: 'spike' }], entities: [] });
    await user.clear(textarea);
    await user.paste(level);
    await user.click(screen.getByText('Cargar JSON'));
    const editorState = useEditorStore.getState();
    expect(editorState.width).toBe(10);
    expect(editorState.height).toBe(8);
    expect(editorState.tiles).toHaveLength(1);
  });

  it('resets level on reset button click', async () => {
    useEditorStore.setState({
      width: 10,
      height: 10,
      tiles: [{ x: 0, y: 0, type: 'ground' }],
      entities: [{ id: 'x', type: 'player', x: 0, y: 0 }],
    });
    const user = userEvent.setup();
    render(<InspectorPanel />);
    await user.click(screen.getByText('Limpiar nivel'));
    const state = useEditorStore.getState();
    expect(state.width).toBe(64);
    expect(state.height).toBe(64);
    expect(state.tiles).toHaveLength(0);
    expect(state.entities).toHaveLength(0);
  });

  it('updates textarea when jsonText changes', async () => {
    const user = userEvent.setup();
    render(<InspectorPanel />);
    const textarea = screen.getByPlaceholderText('JSON del nivel aquí...');
    await user.clear(textarea);
    await user.paste('{"test":true}');
    expect(useProjectStore.getState().jsonText).toBe('{"test":true}');
  });
});
