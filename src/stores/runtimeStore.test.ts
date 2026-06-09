import { describe, it, expect, beforeEach } from 'vitest';
import { useRuntimeStore } from './runtimeStore';

beforeEach(() => {
  useRuntimeStore.setState({ isPlaying: false });
});

describe('runtimeStore', () => {
  it('starts with isPlaying false', () => {
    expect(useRuntimeStore.getState().isPlaying).toBe(false);
  });

  it('setIsPlaying toggles to true', () => {
    useRuntimeStore.getState().setIsPlaying(true);
    expect(useRuntimeStore.getState().isPlaying).toBe(true);
  });

  it('setIsPlaying toggles back to false', () => {
    useRuntimeStore.setState({ isPlaying: true });
    useRuntimeStore.getState().setIsPlaying(false);
    expect(useRuntimeStore.getState().isPlaying).toBe(false);
  });
});
