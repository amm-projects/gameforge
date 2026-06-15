import { describe, it, expect } from 'vitest';
import type { TileType, EntityType, Tile, Entity, LevelData, MusicTheme } from './level';

describe('TileType', () => {
  it('accepts valid tile types', () => {
    const ground: TileType = 'ground';
    const brick: TileType = 'brick';
    const platform: TileType = 'platform';
    const spikeUp: TileType = 'spike-up';
    const spikeDown: TileType = 'spike-down';
    const spikeLeft: TileType = 'spike-left';
    const spikeRight: TileType = 'spike-right';
    expect(ground).toBe('ground');
    expect(brick).toBe('brick');
    expect(platform).toBe('platform');
    expect(spikeUp).toBe('spike-up');
    expect(spikeDown).toBe('spike-down');
    expect(spikeLeft).toBe('spike-left');
    expect(spikeRight).toBe('spike-right');
  });
});

describe('EntityType', () => {
  it('accepts all entity types', () => {
    const types: EntityType[] = ['player', 'coin', 'walker', 'goal', 'checkpoint', 'door', 'key', 'patrol', 'jumper', '1up'];
    expect(types).toHaveLength(10);
  });
});

describe('MusicTheme', () => {
  it('accepts valid music themes', () => {
    const themes: MusicTheme[] = ['calm', 'adventure', 'retro', 'mystery', 'boss'];
    expect(themes).toHaveLength(5);
  });
});

describe('LevelData structure', () => {
  it('creates a valid LevelData object', () => {
    const tile: Tile = { x: 0, y: 0, type: 'ground' };
    const entity: Entity = { id: 'abc', type: 'player', position: { x: 1, y: 1 }, properties: {} };
    const level: LevelData = {
      width: 64,
      height: 64,
      tiles: [tile],
      entities: [entity],
    };
    expect(level.width).toBe(64);
    expect(level.height).toBe(64);
    expect(level.tiles).toHaveLength(1);
    expect(level.entities).toHaveLength(1);
  });

  it('includes optional music field', () => {
    const level: LevelData = {
      width: 64,
      height: 64,
      tiles: [],
      entities: [],
      music: 'adventure',
    };
    expect(level.music).toBe('adventure');
  });

  it('serializes and deserializes LevelData to JSON', () => {
    const level: LevelData = {
      width: 16,
      height: 12,
      tiles: [{ x: 5, y: 3, type: 'spike-up' }],
      entities: [{ id: 'xyz', type: 'coin', position: { x: 2, y: 4 }, properties: {} }],
    };
    const json = JSON.stringify(level);
    const parsed = JSON.parse(json) as LevelData;
    expect(parsed.width).toBe(16);
    expect(parsed.height).toBe(12);
    expect(parsed.tiles).toEqual([{ x: 5, y: 3, type: 'spike-up' }]);
    expect(parsed.entities).toEqual([{ id: 'xyz', type: 'coin', position: { x: 2, y: 4 }, properties: {} }]);
  });

  it('handles empty level data', () => {
    const level: LevelData = { width: 64, height: 64, tiles: [], entities: [] };
    const json = JSON.stringify(level);
    const parsed = JSON.parse(json) as LevelData;
    expect(parsed.tiles).toHaveLength(0);
    expect(parsed.entities).toHaveLength(0);
  });

  it('Tile can include all entity types', () => {
    const entities: Entity[] = [
      { id: '1', type: 'player', position: { x: 0, y: 0 }, properties: {} },
      { id: '2', type: 'coin', position: { x: 1, y: 0 }, properties: {} },
      { id: '3', type: 'walker', position: { x: 2, y: 0 }, properties: {} },
      { id: '4', type: 'goal', position: { x: 3, y: 0 }, properties: {} },
      { id: '5', type: 'checkpoint', position: { x: 4, y: 0 }, properties: {} },
      { id: '6', type: 'door', position: { x: 5, y: 0 }, properties: {} },
      { id: '7', type: 'key', position: { x: 6, y: 0 }, properties: {} },
      { id: '8', type: 'patrol', position: { x: 7, y: 0 }, properties: {} },
      { id: '9', type: 'jumper', position: { x: 8, y: 0 }, properties: {} },
      { id: '10', type: '1up', position: { x: 9, y: 0 }, properties: {} },
    ];
    expect(entities).toHaveLength(10);
  });
});
