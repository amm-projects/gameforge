"use client";

import { useSelectionStore } from "@/stores/selectionStore";
import type { TileType, EntityType } from "@/types/level";

const tileOptions: TileType[] = ["ground", "spike"];
const entityOptions: EntityType[] = ["player", "coin", "enemy", "goal"];

const TILE_VISUAL: Record<TileType, { sprite: string; label: string }> = {
  ground: { sprite: "/sprites/ground.svg", label: "Suelo" },
  spike: { sprite: "/sprites/spike.svg", label: "Pinchos" },
};

const ENTITY_VISUAL: Record<EntityType, { sprite: string; label: string }> = {
  player: { sprite: "/sprites/player.svg", label: "Jugador" },
  coin: { sprite: "/sprites/coin.svg", label: "Moneda" },
  enemy: { sprite: "/sprites/enemy.svg", label: "Enemigo" },
  goal: { sprite: "/sprites/goal.svg", label: "Meta" },
};

function SpritePreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-slate-950 ring-1 ring-slate-700/50">
      <img src={src} alt={alt} className="h-full w-full object-contain" />
    </div>
  );
}

function TileRow({ tile }: { tile: TileType }) {
  const { selectedTile, setSelectedTile } = useSelectionStore();
  const v = TILE_VISUAL[tile];

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${selectedTile === tile ? "border-slate-600 bg-slate-700 text-white" : "border-slate-800/80 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
      onClick={() => setSelectedTile(tile)}
      role="button"
      tabIndex={0}
      aria-label={`${v.label}: seleccionar tile ${tile}`}
    >
      <SpritePreview src={v.sprite} alt={v.label} />
      <div className="flex-1">
        <div className="font-medium">{v.label}</div>
        <div className="text-[0.625rem] text-slate-300">{tile}</div>
      </div>
    </div>
  );
}

function EntityRow({ entity }: { entity: EntityType }) {
  const { selectedEntity, setSelectedEntity } = useSelectionStore();
  const v = ENTITY_VISUAL[entity];

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${selectedEntity === entity ? "border-slate-600 bg-slate-700 text-white" : "border-slate-800/80 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
      onClick={() => setSelectedEntity(entity)}
      role="button"
      tabIndex={0}
      aria-label={`${v.label}: seleccionar entidad ${entity}`}
    >
      <SpritePreview src={v.sprite} alt={v.label} />
      <div className="flex-1">
        <div className="font-medium">{v.label}</div>
        <div className="text-[0.625rem] text-slate-300">{entity}</div>
      </div>
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
          aria-label="Borrar: herramienta de borrado"
          className={`w-full rounded-2xl px-3 py-2 text-sm transition ${activeTool === "erase" ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
        >
          Borrar
        </button>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Tiles</h2>
        <div className="mt-3 flex flex-col gap-2">
          {tileOptions.map((tile) => <TileRow key={tile} tile={tile} />)}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Entidades</h2>
        <div className="mt-3 flex flex-col gap-2">
          {entityOptions.map((entity) => <EntityRow key={entity} entity={entity} />)}
        </div>
      </div>
    </aside>
  );
}
