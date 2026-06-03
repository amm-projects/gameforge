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

function DraggableItem({ id, data, visual }: { id: string; data: object; visual: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab items-center gap-2 rounded-lg border px-2 py-1.5 text-xs transition ${isDragging ? "bg-slate-700/80" : "bg-slate-800 hover:bg-slate-700"}`}
    >
      {visual}
      <span className="text-slate-400">Arrastrar</span>
    </div>
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
        <div className="mt-3 flex flex-col gap-2">
          {tileOptions.map((tile) => {
            const v = TILE_VISUAL[tile];
            return (
              <button
                key={tile}
                type="button"
                onClick={() => setSelectedTile(tile)}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${selectedTile === tile ? "border-slate-600 bg-slate-700 text-white" : "border-slate-800/80 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
              >
                <Preview bg={v.bg}>
                  {tile === "spike" ? <span className="text-[10px] font-bold text-white">^</span> : null}
                </Preview>
                <div className="flex-1 text-left">
                  <div className="font-medium">{v.label}</div>
                  <div className="text-[10px] text-slate-500">{tile}</div>
                </div>
                <DraggableItem
                  id={`tile-${tile}`}
                  data={{ type: "tile", tileType: tile }}
                  visual={<Preview bg={v.bg}>
                    {tile === "spike" ? <span className="text-[10px] font-bold text-white">^</span> : null}
                  </Preview>}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Entidades</h3>
        <div className="mt-3 flex flex-col gap-2">
          {entityOptions.map((entity) => {
            const v = ENTITY_VISUAL[entity];
            return (
              <button
                key={entity}
                type="button"
                onClick={() => {
                  setSelectedEntity(entity);
                  setActiveTool("entity");
                }}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${selectedEntity === entity && activeTool === "entity" ? "border-slate-600 bg-slate-700 text-white" : "border-slate-800/80 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
              >
                <Preview bg={v.bg}>
                  <span className="text-xs font-bold text-white drop-shadow">{v.symbol}</span>
                </Preview>
                <div className="flex-1 text-left">
                  <div className="font-medium">{v.label}</div>
                  <div className="text-[10px] text-slate-500">{entity}</div>
                </div>
                <DraggableItem
                  id={`entity-${entity}`}
                  data={{ type: "entity", entityType: entity }}
                  visual={<Preview bg={v.bg}>
                    <span className="text-xs font-bold text-white drop-shadow">{v.symbol}</span>
                  </Preview>}
                />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
