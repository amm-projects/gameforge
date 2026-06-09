import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from './projectStore';

beforeEach(() => {
  useProjectStore.setState({ jsonText: '' });
});

describe('projectStore', () => {
  it('starts with empty jsonText', () => {
    expect(useProjectStore.getState().jsonText).toBe('');
  });

  it('setJsonText updates the json text', () => {
    const json = JSON.stringify({ width: 64, height: 64, tiles: [], entities: [] });
    useProjectStore.getState().setJsonText(json);
    expect(useProjectStore.getState().jsonText).toBe(json);
  });

  it('setJsonText can set empty string', () => {
    useProjectStore.setState({ jsonText: 'previous' });
    useProjectStore.getState().setJsonText('');
    expect(useProjectStore.getState().jsonText).toBe('');
  });
});
