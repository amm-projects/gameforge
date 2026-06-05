import { describe, it, expect } from 'vitest';
import type { TileType, EntityType, Tile, Entity, LevelData, Layer } from './level';
import { LAYERS, LAYER_NAMES } from './level';

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
    const types: EntityType[] = ['player', 'coin', 'enemy', 'goal', 'checkpoint', 'door', 'key'];
    expect(types).toHaveLength(7);
  });
});

describe('Layer system', () => {
  it('defines layers 0-5', () => {
    expect(LAYERS.BACKGROUND).toBe(0);
    expect(LAYERS.DECORATION).toBe(1);
    expect(LAYERS.SOLID).toBe(2);
    expect(LAYERS.ENEMIES).toBe(3);
    expect(LAYERS.OBJECTS).toBe(4);
    expect(LAYERS.PLAYER).toBe(5);
  });

  it('provides names for all layers', () => {
    const layers: Layer[] = [0, 1, 2, 3, 4, 5];
    for (const layer of layers) {
      expect(LAYER_NAMES[layer]).toBeDefined();
    }
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

  it('creates a Tile with optional layer', () => {
    const tile: Tile = { x: 0, y: 0, type: 'ground', layer: 2 };
    expect(tile.layer).toBe(2);
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
      { id: '3', type: 'enemy', position: { x: 2, y: 0 }, properties: {} },
      { id: '4', type: 'goal', position: { x: 3, y: 0 }, properties: {} },
      { id: '5', type: 'checkpoint', position: { x: 4, y: 0 }, properties: {} },
      { id: '6', type: 'door', position: { x: 5, y: 0 }, properties: {} },
      { id: '7', type: 'key', position: { x: 6, y: 0 }, properties: {} },
    ];
    expect(entities).toHaveLength(7);
  });
});
