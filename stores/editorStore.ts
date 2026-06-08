import { create } from "zustand";
import { Layer, LevelData, Tile, TileType, EntityType } from "@/types/level";

export type PaintAction =
  | { kind: "tile"; x: number; y: number; tileType: TileType; layer?: Layer }
  | { kind: "entity"; x: number; y: number; entityType: EntityType; entityId: string }
  | { kind: "erase"; x: number; y: number };

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 10);
}

interface EditorState extends LevelData {
  setTile: (tile: Tile) => void;
  removeTile: (x: number, y: number) => void;
  addEntity: (type: EntityType, x: number, y: number) => void;
  removeEntity: (id: string) => void;
  updateEntityProperty: (id: string, key: string, value: unknown) => void;
  updateTileSolid: (x: number, y: number, solid: boolean) => void;
  updateTileProperty: (x: number, y: number, key: string, value: unknown) => void;
  loadLevel: (level: LevelData) => void;
  resetLevel: () => void;
  batchPaint: (actions: PaintAction[]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  width: 64,
  height: 64,
  tiles: [],
  entities: [],

  setTile: (tile) =>
    set((state) => {
      const filtered = state.tiles.filter((item) => item.x !== tile.x || item.y !== tile.y);
      return { tiles: [...filtered, tile] };
    }),

  removeTile: (x, y) =>
    set((state) => ({
      tiles: state.tiles.filter((item) => item.x !== x || item.y !== y),
    })),

  addEntity: (type, x, y) =>
    set((state) => {
      const isUnique = type !== "player" && type !== "goal";
      const alreadyExists = state.entities.some((e) => e.type === type);
      if (!isUnique && alreadyExists) return state;
      const existing = state.entities.filter((entity) => entity.position.x !== x || entity.position.y !== y);
      return {
        entities: [
          ...existing,
          {
            id: createId(),
            type,
            position: { x, y },
            properties: {},
          },
        ],
      };
    }),

  removeEntity: (id) =>
    set((state) => ({ entities: state.entities.filter((entity) => entity.id !== id) })),

  updateEntityProperty: (id, key, value) =>
    set((state) => ({
      entities: state.entities.map((entity) =>
        entity.id === id
          ? { ...entity, properties: { ...entity.properties, [key]: value } }
          : entity
      ),
    })),

  updateTileSolid: (x, y, solid) =>
    set((state) => ({
      tiles: state.tiles.map((tile) =>
        tile.x === x && tile.y === y ? { ...tile, solid } : tile
      ),
    })),

  updateTileProperty: (x, y, key, value) =>
    set((state) => ({
      tiles: state.tiles.map((tile) =>
        tile.x === x && tile.y === y
          ? { ...tile, properties: { ...tile.properties, [key]: value } }
          : tile
      ),
    })),

  batchPaint: (actions) =>
    set((state) => {
      let tiles = state.tiles;
      let entities = state.entities;
      const seenTypes = new Set(entities.map((e) => e.type));

      for (const action of actions) {
        if (action.kind === "tile") {
          tiles = tiles.filter((t) => t.x !== action.x || t.y !== action.y);
          tiles = [...tiles, { x: action.x, y: action.y, type: action.tileType, layer: action.layer }];
        } else if (action.kind === "entity") {
          const isUnique = action.entityType !== "player" && action.entityType !== "goal";
          if (!isUnique && seenTypes.has(action.entityType)) continue;
          seenTypes.add(action.entityType);
          entities = entities.filter((e) => e.position.x !== action.x || e.position.y !== action.y);
          entities = [...entities, { id: action.entityId, type: action.entityType, position: { x: action.x, y: action.y }, properties: {} }];
        } else if (action.kind === "erase") {
          tiles = tiles.filter((t) => t.x !== action.x || t.y !== action.y);
          const removed = entities.find((e) => e.position.x === action.x && e.position.y === action.y);
          if (removed) seenTypes.delete(removed.type);
          entities = entities.filter((e) => e.position.x !== action.x || e.position.y !== action.y);
        }
      }

      return { tiles, entities };
    }),

  loadLevel: (level) =>
    set(() => ({
      width: level.width,
      height: level.height,
      tiles: [...level.tiles],
      entities: [...level.entities],
    })),

  resetLevel: () =>
    set(() => ({
      width: 64,
      height: 64,
      tiles: [],
      entities: [],
    })),
}));
