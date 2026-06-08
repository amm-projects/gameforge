import { create } from "zustand";
import type { TileType, EntityType } from "@/types/level";

export type ToolMode = "tile" | "entity" | "erase" | "edit";

export type EditTarget =
  | { kind: "tile"; x: number; y: number; type: TileType }
  | { kind: "entity"; id: string; x: number; y: number; type: EntityType };

interface SelectionState {
  activeTool: ToolMode;
  selectedTile: TileType | null;
  selectedEntity: EntityType | null;
  selectedEntityId: string | null;
  selectedEditTarget: EditTarget | null;
  setActiveTool: (tool: ToolMode) => void;
  setSelectedTile: (tile: TileType) => void;
  setSelectedEntity: (entity: EntityType) => void;
  setSelectedEntityId: (id: string | null) => void;
  setSelectedEditTarget: (target: EditTarget | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  activeTool: "tile",
  selectedTile: "ground",
  selectedEntity: null,
  selectedEntityId: null,
  selectedEditTarget: null,
  setActiveTool: (tool) => set({ activeTool: tool, selectedEditTarget: null }),
  setSelectedTile: (tile) => set({ selectedTile: tile, selectedEntity: null, activeTool: "tile", selectedEditTarget: null }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity, selectedTile: null, activeTool: "entity", selectedEditTarget: null }),
  setSelectedEntityId: (id) => set({ selectedEntityId: id }),
  setSelectedEditTarget: (target) => set({ selectedEditTarget: target }),
}));
