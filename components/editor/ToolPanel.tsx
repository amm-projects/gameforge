"use client";

import { useDraggable } from "@dnd-kit/core";
import { useSelectionStore } from "@/stores/selectionStore";
import type { TileType, EntityType } from "@/types/level";

const tileOptions: TileType[] = ["ground", "spike"];
const entityOptions: EntityType[] = ["player", "coin", "enemy", "goal"];

function DraggableItem({ id, label, data }: { id: string; label: string; data: object }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      className={`rounded-lg border px-3 py-2 text-left transition ${isDragging ? "bg-slate-700/80" : "bg-slate-800 hover:bg-slate-700"}`}
    >
      {label}
      <span className="ml-2 text-xs text-slate-400">drag</span>
    </button>
  );
}

export function ToolPanel() {
  const { activeTool, selectedTile, selectedEntity, setActiveTool, setSelectedTile, setSelectedEntity } = useSelectionStore();

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Herramientas</h2>
        <div className="mt-3 flex flex-col gap-2">
          {(["tile", "entity", "erase"] as const).map((tool) => (
            <button
              type="button"
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`rounded-2xl px-3 py-2 text-sm transition ${activeTool === tool ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              {tool === "tile" ? "Pincel de tiles" : tool === "entity" ? "Entidad" : "Borrar"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Tiles</h3>
        <div className="mt-3 grid gap-2">
          {tileOptions.map((tile) => (
            <div key={tile} className="grid gap-2 rounded-3xl border border-slate-800/80 bg-slate-900 p-3">
              <button
                type="button"
                onClick={() => setSelectedTile(tile)}
                className={`rounded-2xl px-3 py-2 text-sm text-left ${selectedTile === tile ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
              >
                {tile}
              </button>
              <DraggableItem id={`tile-${tile}`} label={`Arrastrar ${tile}`} data={{ type: "tile", tileType: tile }} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Entidades</h3>
        <div className="mt-3 grid gap-2">
          {entityOptions.map((entity) => (
            <div key={entity} className="grid gap-2 rounded-3xl border border-slate-800/80 bg-slate-900 p-3">
              <button
                type="button"
                onClick={() => setSelectedEntity(entity)}
                className={`rounded-2xl px-3 py-2 text-sm text-left ${selectedEntity === entity ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
              >
                {entity}
              </button>
              <DraggableItem id={`entity-${entity}`} label={`Arrastrar ${entity}`} data={{ type: "entity", entityType: entity }} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
