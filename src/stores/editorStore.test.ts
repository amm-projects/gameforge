import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from './editorStore';

const initialWidth = 64;
const initialHeight = 64;

beforeEach(() => {
  useEditorStore.setState({
    width: initialWidth,
    height: initialHeight,
    tiles: [],
    entities: [],
    music: "calm",
  });
});

describe('editorStore', () => {
  it('starts with default 64x64 grid and empty collections', () => {
    const state = useEditorStore.getState();
    expect(state.width).toBe(64);
    expect(state.height).toBe(64);
    expect(state.tiles).toHaveLength(0);
    expect(state.entities).toHaveLength(0);
    expect(state.music).toBe('calm');
  });

  describe('setMusic', () => {
    it('changes the music theme', () => {
      useEditorStore.getState().setMusic('adventure');
      expect(useEditorStore.getState().music).toBe('adventure');
    });

    it('can change to any valid theme', () => {
      useEditorStore.getState().setMusic('retro');
      expect(useEditorStore.getState().music).toBe('retro');
      useEditorStore.getState().setMusic('mystery');
      expect(useEditorStore.getState().music).toBe('mystery');
      useEditorStore.getState().setMusic('boss');
      expect(useEditorStore.getState().music).toBe('boss');
      useEditorStore.getState().setMusic('calm');
      expect(useEditorStore.getState().music).toBe('calm');
    });
  });

  describe('setTile', () => {
    it('adds a tile', () => {
      useEditorStore.getState().setTile({ x: 5, y: 10, type: 'ground' });
      const { tiles } = useEditorStore.getState();
      expect(tiles).toHaveLength(1);
      expect(tiles[0]).toEqual({ x: 5, y: 10, type: 'ground' });
    });

    it('replaces existing tile at same position', () => {
      useEditorStore.getState().setTile({ x: 5, y: 10, type: 'ground' });
      useEditorStore.getState().setTile({ x: 5, y: 10, type: 'spike-up' });
      const { tiles } = useEditorStore.getState();
      expect(tiles).toHaveLength(1);
      expect(tiles[0].type).toBe('spike-up');
    });

    it('keeps tiles at different positions', () => {
      useEditorStore.getState().setTile({ x: 0, y: 0, type: 'ground' });
      useEditorStore.getState().setTile({ x: 1, y: 1, type: 'spike-up' });
      const { tiles } = useEditorStore.getState();
      expect(tiles).toHaveLength(2);
    });
  });

  describe('removeTile', () => {
    it('removes a tile at given coordinates', () => {
      useEditorStore.getState().setTile({ x: 3, y: 7, type: 'ground' });
      useEditorStore.getState().removeTile(3, 7);
      expect(useEditorStore.getState().tiles).toHaveLength(0);
    });

    it('does nothing when removing from empty grid', () => {
      useEditorStore.getState().removeTile(0, 0);
      expect(useEditorStore.getState().tiles).toHaveLength(0);
    });

    it('only removes the tile at exact coordinates', () => {
      useEditorStore.getState().setTile({ x: 0, y: 0, type: 'ground' });
      useEditorStore.getState().setTile({ x: 1, y: 1, type: 'spike-up' });
      useEditorStore.getState().removeTile(0, 0);
      const { tiles } = useEditorStore.getState();
      expect(tiles).toHaveLength(1);
      expect(tiles[0]).toEqual({ x: 1, y: 1, type: 'spike-up' });
    });
  });

  describe('addEntity', () => {
    it('adds an entity with an id', () => {
      useEditorStore.getState().addEntity('player', 10, 5);
      const { entities } = useEditorStore.getState();
      expect(entities).toHaveLength(1);
      expect(entities[0].type).toBe('player');
      expect(entities[0].position.x).toBe(10);
      expect(entities[0].position.y).toBe(5);
      expect(entities[0].id).toBeTruthy();
    });

    it('replaces existing entity at same position', () => {
      useEditorStore.getState().addEntity('coin', 2, 3);
      const firstId = useEditorStore.getState().entities[0].id;
      useEditorStore.getState().addEntity('enemy', 2, 3);
      const { entities } = useEditorStore.getState();
      expect(entities).toHaveLength(1);
      expect(entities[0].type).toBe('enemy');
      expect(entities[0].id).not.toBe(firstId);
    });

    it('generates unique ids for each entity', () => {
      useEditorStore.getState().addEntity('player', 0, 0);
      useEditorStore.getState().addEntity('coin', 1, 0);
      useEditorStore.getState().addEntity('enemy', 2, 0);
      const ids = useEditorStore.getState().entities.map((e) => e.id);
      expect(new Set(ids).size).toBe(3);
    });
  });

  describe('removeEntity', () => {
    it('removes an entity by id', () => {
      useEditorStore.getState().addEntity('player', 5, 5);
      const id = useEditorStore.getState().entities[0].id;
      useEditorStore.getState().removeEntity(id);
      expect(useEditorStore.getState().entities).toHaveLength(0);
    });

    it('does nothing when id does not exist', () => {
      useEditorStore.getState().addEntity('player', 0, 0);
      useEditorStore.getState().removeEntity('nonexistent');
      expect(useEditorStore.getState().entities).toHaveLength(1);
    });
  });

  describe('batchPaint', () => {
    it('paints multiple tiles in one batch', () => {
      useEditorStore.getState().batchPaint([
        { kind: 'tile', x: 0, y: 0, tileType: 'ground' },
        { kind: 'tile', x: 1, y: 0, tileType: 'ground' },
        { kind: 'tile', x: 2, y: 0, tileType: 'spike-up' },
      ]);
      expect(useEditorStore.getState().tiles).toHaveLength(3);
    });

    it('paints multiple entities in one batch', () => {
      useEditorStore.getState().batchPaint([
        { kind: 'entity', x: 0, y: 0, entityType: 'player', entityId: 'p1' },
        { kind: 'entity', x: 1, y: 0, entityType: 'coin', entityId: 'c1' },
      ]);
      expect(useEditorStore.getState().entities).toHaveLength(2);
    });

    it('erases tiles and entities in one batch', () => {
      useEditorStore.getState().setTile({ x: 0, y: 0, type: 'ground' });
      useEditorStore.getState().addEntity('player', 1, 1);
      useEditorStore.getState().batchPaint([
        { kind: 'erase', x: 0, y: 0 },
        { kind: 'erase', x: 1, y: 1 },
      ]);
      expect(useEditorStore.getState().tiles).toHaveLength(0);
      expect(useEditorStore.getState().entities).toHaveLength(0);
    });

    it('replaces existing content at same cell during batch', () => {
      useEditorStore.getState().setTile({ x: 5, y: 5, type: 'ground' });
      useEditorStore.getState().batchPaint([
        { kind: 'tile', x: 5, y: 5, tileType: 'spike-up' },
      ]);
      const { tiles } = useEditorStore.getState();
      expect(tiles).toHaveLength(1);
      expect(tiles[0].type).toBe('spike-up');
    });

    it('handles empty batch', () => {
      useEditorStore.getState().batchPaint([]);
      expect(useEditorStore.getState().tiles).toHaveLength(0);
      expect(useEditorStore.getState().entities).toHaveLength(0);
    });

    it('handles mixed batch of tiles, entities, and erases', () => {
      useEditorStore.getState().setTile({ x: 0, y: 0, type: 'ground' });
      useEditorStore.getState().addEntity('coin', 1, 0);
      useEditorStore.getState().batchPaint([
        { kind: 'tile', x: 0, y: 0, tileType: 'spike-up' },
        { kind: 'erase', x: 1, y: 0 },
        { kind: 'entity', x: 2, y: 0, entityType: 'enemy', entityId: 'e1' },
      ]);
      const { tiles, entities } = useEditorStore.getState();
      expect(tiles).toHaveLength(1);
      expect(tiles[0].type).toBe('spike-up');
      expect(entities).toHaveLength(1);
      expect(entities[0].type).toBe('enemy');
    });
  });

  describe('loadLevel', () => {
    it('replaces entire state with loaded level', () => {
      useEditorStore.getState().loadLevel({
        width: 10,
        height: 10,
        tiles: [{ x: 0, y: 0, type: 'ground' }],
        entities: [{ id: 'test', type: 'player', position: { x: 5, y: 5 }, properties: {} }],
      });
      const state = useEditorStore.getState();
      expect(state.width).toBe(10);
      expect(state.height).toBe(10);
      expect(state.tiles).toHaveLength(1);
      expect(state.entities).toHaveLength(1);
    });

    it('loads an empty level', () => {
      useEditorStore.getState().loadLevel({ width: 64, height: 64, tiles: [], entities: [] });
      const state = useEditorStore.getState();
      expect(state.tiles).toHaveLength(0);
      expect(state.entities).toHaveLength(0);
    });

    it('loads level with music theme', () => {
      useEditorStore.getState().loadLevel({
        width: 10,
        height: 10,
        tiles: [],
        entities: [],
        music: 'boss',
      });
      expect(useEditorStore.getState().music).toBe('boss');
    });

    it('defaults music to calm when not provided', () => {
      useEditorStore.getState().loadLevel({
        width: 64,
        height: 64,
        tiles: [],
        entities: [],
      });
      expect(useEditorStore.getState().music).toBe('calm');
    });

    it('preserves calm after reset', () => {
      useEditorStore.getState().loadLevel({
        width: 64,
        height: 64,
        tiles: [],
        entities: [],
        music: 'adventure',
      });
      expect(useEditorStore.getState().music).toBe('adventure');
    });
  });

  describe('resetLevel', () => {
    it('restores default grid and clears content', () => {
      useEditorStore.getState().loadLevel({
        width: 10,
        height: 10,
        tiles: [{ x: 0, y: 0, type: 'ground' }],
        entities: [{ id: 'x', type: 'player', position: { x: 0, y: 0 }, properties: {} }],
      });
      useEditorStore.getState().resetLevel();
      const state = useEditorStore.getState();
      expect(state.width).toBe(64);
      expect(state.height).toBe(64);
      expect(state.tiles).toHaveLength(0);
      expect(state.entities).toHaveLength(0);
    });
  });
});
