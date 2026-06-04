import { describe, it, expect } from 'vitest';
import type { TileType, EntityType, Tile, Entity, LevelData } from './level';

describe('TileType', () => {
  it('accepts valid tile types', () => {
    const ground: TileType = 'ground';
    const spike: TileType = 'spike';
    expect(ground).toBe('ground');
    expect(spike).toBe('spike');
  });
});

describe('EntityType', () => {
  it('accepts valid entity types', () => {
    const player: EntityType = 'player';
    const coin: EntityType = 'coin';
    const enemy: EntityType = 'enemy';
    const goal: EntityType = 'goal';
    expect([player, coin, enemy, goal]).toHaveLength(4);
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

  it('serializes and deserializes LevelData to JSON', () => {
    const level: LevelData = {
      width: 16,
      height: 12,
      tiles: [{ x: 5, y: 3, type: 'spike' }],
      entities: [{ id: 'xyz', type: 'coin', position: { x: 2, y: 4 }, properties: {} }],
    };
    const json = JSON.stringify(level);
    const parsed = JSON.parse(json) as LevelData;
    expect(parsed.width).toBe(16);
    expect(parsed.height).toBe(12);
    expect(parsed.tiles).toEqual([{ x: 5, y: 3, type: 'spike' }]);
    expect(parsed.entities).toEqual([{ id: 'xyz', type: 'coin', position: { x: 2, y: 4 }, properties: {} }]);
  });

  it('handles empty level data', () => {
    const level: LevelData = { width: 64, height: 64, tiles: [], entities: [] };
    const json = JSON.stringify(level);
    const parsed = JSON.parse(json) as LevelData;
    expect(parsed.tiles).toHaveLength(0);
    expect(parsed.entities).toHaveLength(0);
  });
});
