"use client";

import { useMemo, useEffect, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useEditorStore } from "@/stores/editorStore";
import { useSelectionStore } from "@/stores/selectionStore";
import type { EntityType, TileType } from "@/types/level";

// Visual configuration for each entity type
const ENTITY_VISUAL: Record<EntityType, { color: string; symbol: string; label: string }> = {
  player: { color: "bg-blue-500", symbol: "P", label: "Player" },
  coin: { color: "bg-yellow-400", symbol: "C", label: "Coin" },
  enemy: { color: "bg-red-600", symbol: "E", label: "Enemy" },
  goal: { color: "bg-green-500", symbol: "G", label: "Goal" },
};

function GridCell({
  x,
  y,
  tileType,
  entityType,
  isSelected,
  onClick,
}: {
  x: number;
  y: number;
  tileType?: TileType;
  entityType?: EntityType;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { setNodeRef } = useDroppable({ id: `cell-${x}-${y}` });
  const entityVisual = entityType ? ENTITY_VISUAL[entityType] : null;

  return (
    <button
      type="button"
      ref={setNodeRef}
      onClick={onClick}
      className={`relative h-10 w-10 rounded border bg-slate-950 transition ${
        isSelected
          ? "border-cyan-400 ring-2 ring-cyan-400/50"
          : tileType
            ? "border-slate-600"
            : "border-slate-900/70"
      }`}
    >
      {tileType && (
        <span className={`absolute inset-0 block rounded ${tileType === "ground" ? "bg-amber-600" : "bg-rose-500/90"}`} />
      )}
      {entityVisual && (
        <span
          className={`absolute inset-0 flex items-center justify-center rounded ${entityVisual.color} text-[9px] font-bold text-white drop-shadow-lg`}
          title={entityVisual.label}
        >
          {entityVisual.symbol}
        </span>
      )}
    </button>
  );
}

export function LevelCanvas() {
  const { width, height, tiles, entities, setTile, removeTile, addEntity, removeEntity } =
    useEditorStore();
  const { activeTool, selectedTile, selectedEntity, selectedEntityId, setSelectedEntityId } =
    useSelectionStore();

  const tileMap = useMemo(
    () => new Map(tiles.map((tile) => [`${tile.x}-${tile.y}`, tile.type])),
    [tiles]
  );

  const entityMap = useMemo(
    () => new Map(entities.map((entity) => [`${entity.x}-${entity.y}`, entity.type])),
    [entities]
  );

  const entityLookup = useMemo(
    () => new Map(entities.map((entity) => [`${entity.x}-${entity.y}`, entity])),
    [entities]
  );

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      const entityAtCell = entityLookup.get(`${x}-${y}`);

      if (activeTool === "erase") {
        removeTile(x, y);
        if (entityAtCell) {
          removeEntity(entityAtCell.id);
        }
        setSelectedEntityId(null);
        return;
      }

      if (entityAtCell) {
        setSelectedEntityId(entityAtCell.id);
      } else {
        setSelectedEntityId(null);
      }

      if (activeTool === "tile") {
        setTile({ x, y, type: selectedTile });
        return;
      }

      if (activeTool === "entity") {
        addEntity(selectedEntity, x, y);
      }
    },
    [activeTool, selectedTile, selectedEntity, entityLookup, removeTile, removeEntity, setSelectedEntityId, setTile, addEntity]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedEntityId) {
        removeEntity(selectedEntityId);
        setSelectedEntityId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEntityId, removeEntity, setSelectedEntityId]);

  return (
    <section className="rounded-3xl border border-slate-800/90 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Canvas del nivel</h2>
          <p className="text-sm text-slate-400">Haz clic o arrastra un objeto para colocar elementos.</p>
        </div>
        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">32x32 grid</div>
      </div>
      <div className="overflow-auto rounded-3xl border border-slate-900/80 bg-slate-950 p-2">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
            width: `${width * 40}px`,
            height: `${height * 40}px`,
          }}
        >
          {Array.from({ length: height }).flatMap((_, row) =>
            Array.from({ length: width }).map((_, col) => {
              const entityAtCell = entityLookup.get(`${col}-${row}`);
              return (
                <GridCell
                  key={`${col}-${row}`}
                  x={col}
                  y={row}
                  tileType={tileMap.get(`${col}-${row}`) as TileType | undefined}
                  entityType={entityAtCell?.type as EntityType | undefined}
                  isSelected={entityAtCell?.id === selectedEntityId}
                  onClick={() => handleCellClick(col, row)}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
