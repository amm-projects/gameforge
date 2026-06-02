import { create } from "zustand";
import { TileType, EntityType } from "@/types/level";

export type ToolMode = "tile" | "entity" | "erase";

interface SelectionState {
  activeTool: ToolMode;
  selectedTile: TileType;
  selectedEntity: EntityType;
  setActiveTool: (tool: ToolMode) => void;
  setSelectedTile: (tile: TileType) => void;
  setSelectedEntity: (entity: EntityType) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  activeTool: "tile",
  selectedTile: "ground",
  selectedEntity: "player",
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedTile: (tile) => set({ selectedTile: tile }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
}));
