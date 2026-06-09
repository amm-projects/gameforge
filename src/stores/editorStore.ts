import { create } from "zustand";
import type { LevelData, Tile, EntityType, BackgroundTheme } from "@/types/level";
import { makeId, applyPaintActions, isUniqueEntity } from "@/engine/editor";
import type { PaintAction } from "@/engine/editor";

interface EditorState extends LevelData {
  setTile: (tile: Tile) => void;
  removeTile: (x: number, y: number) => void;
  addEntity: (type: EntityType, x: number, y: number) => void;
  removeEntity: (id: string) => void;
  updateEntityProperty: (id: string, key: string, value: unknown) => void;
  updateTileSolid: (x: number, y: number, solid: boolean) => void;
  updateTileProperty: (x: number, y: number, key: string, value: unknown) => void;
  setBackground: (background: BackgroundTheme) => void;
  loadLevel: (level: LevelData) => void;
  resetLevel: () => void;
  batchPaint: (actions: PaintAction[]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  width: 64,
  height: 64,
  tiles: [],
  entities: [],
  background: "dark",

  setTile: (tile) =>
    set((state) => {
      const tiles = state.tiles.filter((item) => item.x !== tile.x || item.y !== tile.y);
      const entities = state.entities.filter((e) => e.position.x !== tile.x || e.position.y !== tile.y);
      return { tiles: [...tiles, tile], entities };
    }),

  removeTile: (x, y) =>
    set((state) => ({
      tiles: state.tiles.filter((item) => item.x !== x || item.y !== y),
    })),

  addEntity: (type, x, y) =>
    set((state) => {
      if (!isUniqueEntity(type)) {
        const alreadyExists = state.entities.some((e) => e.type === type);
        if (alreadyExists) return state;
      }
      const entities = state.entities.filter((entity) => entity.position.x !== x || entity.position.y !== y);
      const tiles = state.tiles.filter((t) => t.x !== x || t.y !== y);
      return {
        tiles,
        entities: [
          ...entities,
          {
            id: makeId(),
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

  setBackground: (background) => set({ background }),

  batchPaint: (actions) =>
    set((state) => {
      const { tiles, entities } = applyPaintActions(state.tiles, state.entities, actions);
      return { tiles, entities };
    }),

  loadLevel: (level) =>
    set(() => ({
      width: level.width,
      height: level.height,
      tiles: [...level.tiles],
      entities: [...level.entities],
      background: level.background ?? "dark",
    })),

  resetLevel: () =>
    set(() => ({
      width: 64,
      height: 64,
      tiles: [],
      entities: [],
      background: "dark",
    })),
}));

export type { PaintAction };
