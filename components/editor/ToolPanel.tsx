"use client";

import { useDraggable } from "@dnd-kit/core";
import { useSelectionStore } from "@/stores/selectionStore";
import type { TileType, EntityType } from "@/types/level";

const tileOptions: TileType[] = ["ground", "spike"];
const entityOptions: EntityType[] = ["player", "coin", "enemy", "goal"];

const TILE_VISUAL: Record<TileType, { bg: string; label: string }> = {
  ground: { bg: "bg-amber-700", label: "Suelo" },
  spike: { bg: "bg-rose-600", label: "Pinchos" },
};

const ENTITY_VISUAL: Record<EntityType, { bg: string; symbol: string; label: string }> = {
  player: { bg: "bg-blue-500", symbol: "P", label: "Jugador" },
  coin: { bg: "bg-yellow-400", symbol: "C", label: "Moneda" },
  enemy: { bg: "bg-red-600", symbol: "E", label: "Enemigo" },
  goal: { bg: "bg-green-500", symbol: "G", label: "Meta" },
};

function Preview({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} shadow-inner`}>
      {children}
    </div>
  );
}

function DragHandle({ children, listeners, attributes }: { children: React.ReactNode; listeners: ReturnType<typeof useDraggable>["listeners"]; attributes: ReturnType<typeof useDraggable>["attributes"] }) {
  return (
    <div {...listeners} {...attributes} className="cursor-grab">
      {children}
    </div>
  );
}

function TileRow({ tile }: { tile: TileType }) {
  const { selectedTile, setSelectedTile } = useSelectionStore();
  const v = TILE_VISUAL[tile];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tile-${tile}`,
    data: { type: "tile", tileType: tile },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${isDragging ? "opacity-50" : ""} ${selectedTile === tile ? "border-slate-600 bg-slate-700 text-white" : "border-slate-800/80 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
    >
      <DragHandle listeners={listeners} attributes={attributes}>
        <Preview bg={v.bg}>
          {tile === "spike" ? <span className="text-[10px] font-bold text-white">^</span> : null}
        </Preview>
      </DragHandle>
      <button type="button" onClick={() => setSelectedTile(tile)} className="flex-1 text-left">
        <div className="font-medium">{v.label}</div>
        <div className="text-[10px] text-slate-500">{tile}</div>
      </button>
    </div>
  );
}

function EntityRow({ entity }: { entity: EntityType }) {
  const { selectedEntity, setSelectedEntity } = useSelectionStore();
  const v = ENTITY_VISUAL[entity];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `entity-${entity}`,
    data: { type: "entity", entityType: entity },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${isDragging ? "opacity-50" : ""} ${selectedEntity === entity ? "border-slate-600 bg-slate-700 text-white" : "border-slate-800/80 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
    >
      <DragHandle listeners={listeners} attributes={attributes}>
        <Preview bg={v.bg}>
          <span className="text-xs font-bold text-white drop-shadow">{v.symbol}</span>
        </Preview>
      </DragHandle>
      <button type="button" onClick={() => setSelectedEntity(entity)} className="flex-1 text-left">
        <div className="font-medium">{v.label}</div>
        <div className="text-[10px] text-slate-500">{entity}</div>
      </button>
    </div>
  );
}

export function ToolPanel() {
  const { activeTool, setActiveTool } = useSelectionStore();

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div>
        <button
          type="button"
          onClick={() => setActiveTool("erase")}
          className={`w-full rounded-2xl px-3 py-2 text-sm transition ${activeTool === "erase" ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          Borrar
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Tiles</h3>
        <div className="mt-3 flex flex-col gap-2">
          {tileOptions.map((tile) => <TileRow key={tile} tile={tile} />)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Entidades</h3>
        <div className="mt-3 flex flex-col gap-2">
          {entityOptions.map((entity) => <EntityRow key={entity} entity={entity} />)}
        </div>
      </div>
    </aside>
  );
}
