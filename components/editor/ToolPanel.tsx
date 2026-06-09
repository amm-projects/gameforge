"use client";

import Image from "next/image";
import { useSelectionStore } from "@/stores/selectionStore";
import type { TileType, EntityType } from "@/types/level";

const tileOptions: TileType[] = ["ground", "brick", "platform", "spike-up", "spike-down", "spike-left", "spike-right"];
const entityOptions: EntityType[] = ["player", "coin", "enemy", "goal", "checkpoint", "door", "key"];

const TILE_VISUAL: Record<TileType, { sprite: string; label: string; rotate?: string }> = {
  ground: { sprite: "/sprites/ground.svg", label: "Suelo" },
  brick: { sprite: "/sprites/brick.svg", label: "Ladrillo" },
  platform: { sprite: "/sprites/platform.svg", label: "Plataforma" },
  "spike-up": { sprite: "/sprites/spike.svg", label: "Pinchos ↑" },
  "spike-down": { sprite: "/sprites/spike.svg", label: "Pinchos ↓", rotate: "180deg" },
  "spike-left": { sprite: "/sprites/spike.svg", label: "Pinchos ←", rotate: "270deg" },
  "spike-right": { sprite: "/sprites/spike.svg", label: "Pinchos →", rotate: "90deg" },
};

const ENTITY_VISUAL: Record<EntityType, { sprite: string; label: string }> = {
  player: { sprite: "/sprites/player.svg", label: "Jugador" },
  coin: { sprite: "/sprites/coin.svg", label: "Moneda" },
  enemy: { sprite: "/sprites/enemy.svg", label: "Enemigo" },
  goal: { sprite: "/sprites/goal.svg", label: "Meta" },
  checkpoint: { sprite: "/sprites/checkpoint.svg", label: "Checkpoint" },
  door: { sprite: "/sprites/door.svg", label: "Puerta" },
  key: { sprite: "/sprites/key.svg", label: "Llave" },
};

export function ToolPanel() {
  const { activeTool, setActiveTool, selectedTile, selectedEntity, setSelectedTile, setSelectedEntity } = useSelectionStore();

  return (
    <aside className="rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTool("erase")}
          aria-label="Borrar: herramienta de borrado"
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
            activeTool === "erase"
              ? "bg-slate-700 text-white"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          Borrar
        </button>
        <button
          type="button"
          onClick={() => setActiveTool("edit")}
          aria-label="Editar: seleccionar elemento para editar propiedades"
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
            activeTool === "edit"
              ? "bg-amber-500/20 ring-1 ring-amber-500/50 text-amber-400"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          Editar
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Tiles
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {tileOptions.map((tile) => {
              const v = TILE_VISUAL[tile];
              return (
                <button
                  key={tile}
                  type="button"
                  onClick={() => setSelectedTile(tile)}
                  aria-label={`${v.label}: seleccionar tile ${tile}`}
                  className={`flex flex-col items-center gap-0.5 rounded-xl p-1.5 transition ${
                    activeTool === "tile" && selectedTile === tile
                      ? "bg-amber-500/20 ring-1 ring-amber-500/50"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {v.rotate ? (
                    <div style={{ transform: `rotate(${v.rotate})` }}>
                      <Image src={v.sprite} alt={v.label} width={24} height={24} className="h-6 w-6" />
                    </div>
                  ) : (
                    <Image src={v.sprite} alt={v.label} width={24} height={24} className="h-6 w-6" />
                  )}
                  <span className="text-[8px] text-slate-500">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Entidades
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {entityOptions.map((entity) => {
              const v = ENTITY_VISUAL[entity];
              return (
                <button
                  key={entity}
                  type="button"
                  onClick={() => setSelectedEntity(entity)}
                  aria-label={`${v.label}: seleccionar entidad ${entity}`}
                  className={`flex flex-col items-center gap-0.5 rounded-xl p-1.5 transition ${
                    activeTool === "entity" && selectedEntity === entity
                      ? "bg-amber-500/20 ring-1 ring-amber-500/50"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  <Image src={v.sprite} alt={v.label} width={24} height={24} className="h-6 w-6" />
                  <span className="text-[8px] text-slate-500">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
