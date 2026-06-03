import { create } from "zustand";
import { LevelData, Tile, TileType, EntityType } from "@/types/level";

export type PaintAction =
  | { kind: "tile"; x: number; y: number; tileType: TileType }
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
      const existing = state.entities.filter((entity) => entity.x !== x || entity.y !== y);
      return {
        entities: [
          ...existing,
          {
            id: createId(),
            type,
            x,
            y,
          },
        ],
      };
    }),

  removeEntity: (id) =>
    set((state) => ({ entities: state.entities.filter((entity) => entity.id !== id) })),

  batchPaint: (actions) =>
    set((state) => {
      let tiles = state.tiles;
      let entities = state.entities;

      for (const action of actions) {
        if (action.kind === "tile") {
          tiles = tiles.filter((t) => t.x !== action.x || t.y !== action.y);
          tiles = [...tiles, { x: action.x, y: action.y, type: action.tileType }];
        } else if (action.kind === "entity") {
          entities = entities.filter((e) => e.x !== action.x || e.y !== action.y);
          entities = [...entities, { id: action.entityId, type: action.entityType, x: action.x, y: action.y }];
        } else if (action.kind === "erase") {
          tiles = tiles.filter((t) => t.x !== action.x || t.y !== action.y);
          entities = entities.filter((e) => e.x !== action.x || e.y !== action.y);
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
