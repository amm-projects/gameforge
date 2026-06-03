import { create } from "zustand";
import { TileType, EntityType } from "@/types/level";

export type ToolMode = "tile" | "entity" | "erase";

interface SelectionState {
  activeTool: ToolMode;
  selectedTile: TileType;
  selectedEntity: EntityType;
  selectedEntityId: string | null;
  setActiveTool: (tool: ToolMode) => void;
  setSelectedTile: (tile: TileType) => void;
  setSelectedEntity: (entity: EntityType) => void;
  setSelectedEntityId: (id: string | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  activeTool: "tile",
  selectedTile: "ground",
  selectedEntity: "player",
  selectedEntityId: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedTile: (tile) => set({ selectedTile: tile }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
  setSelectedEntityId: (id) => set({ selectedEntityId: id }),
}));
