"use client";

/* eslint-disable @next/next/no-img-element -- SVG sprite icons, next/image no aporta beneficios para SVGs */

import { useSelectionStore } from "@/stores/selectionStore";
import { useT } from "@/hooks/useTranslate";
import type { TileType, EntityType } from "@/types/level";

const TILE_TYPES: TileType[] = ["ground", "brick", "platform", "spike-up", "spike-down", "spike-left", "spike-right"];
const ENTITY_TYPES: EntityType[] = ["player", "coin", "enemy", "goal", "checkpoint", "door", "key"];

const TILE_SPRITE: Record<TileType, string> = {
  ground: "/sprites/ground.svg",
  brick: "/sprites/brick.svg",
  platform: "/sprites/platform.svg",
  "spike-up": "/sprites/spike.svg",
  "spike-down": "/sprites/spike.svg",
  "spike-left": "/sprites/spike.svg",
  "spike-right": "/sprites/spike.svg",
};

const TILE_ROTATE: Partial<Record<TileType, string>> = {
  "spike-up": "0deg",
  "spike-down": "180deg",
  "spike-left": "270deg",
  "spike-right": "90deg",
};

const ENTITY_SPRITE: Record<EntityType, string> = {
  player: "/sprites/player.svg",
  coin: "/sprites/coin.svg",
  enemy: "/sprites/enemy.svg",
  goal: "/sprites/goal.svg",
  checkpoint: "/sprites/checkpoint.svg",
  door: "/sprites/door.svg",
  key: "/sprites/key.svg",
};

const TILE_LABEL_KEY: Record<TileType, string> = {
  ground: "tile.ground",
  brick: "tile.brick",
  platform: "tile.platform",
  "spike-up": "tile.spikeUp",
  "spike-down": "tile.spikeDown",
  "spike-left": "tile.spikeLeft",
  "spike-right": "tile.spikeRight",
};

const ENTITY_LABEL_KEY: Record<EntityType, string> = {
  player: "entity.player",
  coin: "entity.coin",
  enemy: "entity.enemy",
  goal: "entity.goal",
  checkpoint: "entity.checkpoint",
  door: "entity.door",
  key: "entity.key",
};

export function ToolPanel() {
  const t = useT();
  const { activeTool, setActiveTool, selectedTile, selectedEntity, setSelectedTile, setSelectedEntity } = useSelectionStore();

  return (
    <aside className="rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTool("erase")}
          aria-label={t("toolPanel.eraseAria")}
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
            activeTool === "erase"
              ? "bg-slate-700 text-white"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          {t("toolPanel.erase")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTool("edit")}
          aria-label={t("toolPanel.editAria")}
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
            activeTool === "edit"
              ? "bg-amber-500/20 ring-1 ring-amber-500/50 text-amber-400"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          {t("toolPanel.edit")}
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t("toolPanel.tiles")}
          </h2>
          <div className="grid grid-cols-4 gap-1">
            {TILE_TYPES.map((tile) => {
              const label = t(TILE_LABEL_KEY[tile]);
              const sprite = TILE_SPRITE[tile];
              const rotate = TILE_ROTATE[tile];
              return (
                <button
                  key={tile}
                  type="button"
                  onClick={() => setSelectedTile(tile)}
                  aria-label={t("toolPanel.selectTileAria", { label, type: tile })}
                  className={`flex flex-col items-center gap-0.5 rounded-xl p-1.5 transition ${
                    activeTool === "tile" && selectedTile === tile
                      ? "bg-amber-500/20 ring-1 ring-amber-500/50"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {rotate ? (
                    <div style={{ transform: `rotate(${rotate})` }}>
                      <img src={sprite} alt={label} width={24} height={24} className="h-6 w-6" loading="lazy" style={{ imageRendering: "pixelated" }} />
                    </div>
                  ) : (
                    <img src={sprite} alt={label} width={24} height={24} className="h-6 w-6" loading="lazy" style={{ imageRendering: "pixelated" }} />
                  )}
                  <span className="text-[0.5rem] text-slate-400">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t("toolPanel.entities")}
          </h2>
          <div className="grid grid-cols-4 gap-1">
            {ENTITY_TYPES.map((entity) => {
              const label = t(ENTITY_LABEL_KEY[entity]);
              return (
                <button
                  key={entity}
                  type="button"
                  onClick={() => setSelectedEntity(entity)}
                  aria-label={t("toolPanel.selectEntityAria", { label, type: entity })}
                  className={`flex flex-col items-center gap-0.5 rounded-xl p-1.5 transition ${
                    activeTool === "entity" && selectedEntity === entity
                      ? "bg-amber-500/20 ring-1 ring-amber-500/50"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  <img src={ENTITY_SPRITE[entity]} alt={label} width={24} height={24} className="h-6 w-6" loading="lazy" style={{ imageRendering: "pixelated" }} />
                  <span className="text-[0.5rem] text-slate-400">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
