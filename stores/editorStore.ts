import { create } from "zustand";
import { LevelData, Tile, TileType, Entity, EntityType } from "@/types/level";

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
