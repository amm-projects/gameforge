"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useEditorStore } from "@/stores/editorStore";
import { useSelectionStore } from "@/stores/selectionStore";
import type { EntityType, TileType } from "@/types/level";

function GridCell({ x, y, tileType, entityLabel, onClick }: { x: number; y: number; tileType?: TileType; entityLabel?: string; onClick: () => void }) {
  const { setNodeRef } = useDroppable({ id: `cell-${x}-${y}` });
  return (
    <button
      type="button"
      ref={setNodeRef}
      onClick={onClick}
      className={`relative h-10 w-10 rounded border border-slate-800 bg-slate-950 transition ${tileType ? "border-slate-600" : "border-slate-900/70"}`}
    >
      {tileType && (
        <span className={`absolute inset-0 block rounded ${tileType === "ground" ? "bg-amber-600" : "bg-rose-500/90"}`} />
      )}
      {entityLabel && (
        <span className="absolute inset-x-0 bottom-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950">{entityLabel}</span>
      )}
    </button>
  );
}

export function LevelCanvas() {
  const { width, height, tiles, entities, setTile, removeTile, addEntity } = useEditorStore();
  const { activeTool, selectedTile, selectedEntity } = useSelectionStore();

  const tileMap = useMemo(
    () => new Map(tiles.map((tile) => [`${tile.x}-${tile.y}`, tile.type])),
    [tiles]
  );

  const entityMap = useMemo(
    () => new Map(entities.map((entity) => [`${entity.x}-${entity.y}`, entity.type])),
    [entities]
  );

  const handleCellClick = (x: number, y: number) => {
    if (activeTool === "erase") {
      removeTile(x, y);
      return;
    }

    if (activeTool === "tile") {
      setTile({ x, y, type: selectedTile });
      return;
    }

    if (activeTool === "entity") {
      addEntity(selectedEntity, x, y);
    }
  };

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
            Array.from({ length: width }).map((_, col) => (
              <GridCell
                key={`${col}-${row}`}
                x={col}
                y={row}
                tileType={tileMap.get(`${col}-${row}`) as TileType | undefined}
                entityLabel={entityMap.get(`${col}-${row}`)}
                onClick={() => handleCellClick(col, row)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
