import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SampleLevels } from './SampleLevels';
import { useEditorStore } from '@/stores/editorStore';
import { sampleLevels } from '@/data/sampleLevels';
import { translations } from '@/lib/i18n';
import { useLocaleStore } from '@/stores/localeStore';

function renderLevels() {
  return render(<SampleLevels />);
}

const t = (key: string) => translations[key]?.es ?? key;

beforeEach(() => {
  useEditorStore.setState({
    width: 64,
    height: 64,
    tiles: [],
    entities: [],
    background: 'dark',
  });
  useLocaleStore.setState({ locale: 'es' });
});

describe('SampleLevels', () => {
  it('renders section title', () => {
    renderLevels();
    expect(screen.getByText('Sample Levels')).toBeInTheDocument();
  });

  it('renders all sample level buttons', () => {
    renderLevels();
    for (const sl of sampleLevels) {
      const name = t(`sampleLevel.${sl.id}.name`);
      expect(screen.getByRole('button', { name: `Load level: ${name}` })).toBeInTheDocument();
    }
  });

  it('renders level names and descriptions', () => {
    renderLevels();
    for (const sl of sampleLevels) {
      expect(screen.getByText(t(`sampleLevel.${sl.id}.name`))).toBeInTheDocument();
      expect(screen.getByText(t(`sampleLevel.${sl.id}.description`))).toBeInTheDocument();
    }
  });

  it('loads level data on button click', async () => {
    const user = userEvent.setup();
    renderLevels();
    const target = sampleLevels[1];
    const name = t(`sampleLevel.${target.id}.name`);
    await user.click(screen.getByRole('button', { name: `Load level: ${name}` }));
    const state = useEditorStore.getState();
    expect(state.width).toBe(target.level.width);
    expect(state.height).toBe(target.level.height);
    expect(state.background).toBe(target.level.background);
  });

  it('loads tiles and entities on button click', async () => {
    const user = userEvent.setup();
    renderLevels();
    const target = sampleLevels[2];
    const name = t(`sampleLevel.${target.id}.name`);
    await user.click(screen.getByRole('button', { name: `Load level: ${name}` }));
    const state = useEditorStore.getState();
    expect(state.tiles).toEqual(target.level.tiles);
    expect(state.entities.map((e) => ({ type: e.type, position: e.position, properties: e.properties }))).toEqual(
      target.level.entities.map((e) => ({ type: e.type, position: e.position, properties: e.properties }))
    );
  });

  it('loads empty level on empty button click', async () => {
    const user = userEvent.setup();
    useEditorStore.setState({
      width: 30,
      height: 20,
      tiles: [{ x: 0, y: 19, type: 'ground' }],
      entities: [{ id: 'test', type: 'player', position: { x: 1, y: 18 }, properties: {} }],
      background: 'sky',
    });
    renderLevels();
    await user.click(screen.getByRole('button', { name: 'Load level: Vacío' }));
    const state = useEditorStore.getState();
    expect(state.width).toBe(64);
    expect(state.height).toBe(64);
    expect(state.tiles).toEqual([]);
    expect(state.entities).toEqual([]);
    expect(state.background).toBe('dark');
  });
});
