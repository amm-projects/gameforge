"use client";

import { getTileDefinition } from "@/types/tile-definitions";
import { useT } from "@/hooks/useTranslate";
import type { EditTarget } from "@/stores/selectionStore";
import type { TileProperties } from "@/types/level";

const ENTITY_LABEL_KEY: Record<string, string> = {
  player: "entity.player",
  coin: "entity.coin",
  walker: "entity.walker",
  patrol: "entity.patrol",
  jumper: "entity.jumper",
  goal: "entity.goal",
  checkpoint: "entity.checkpoint",
  door: "entity.door",
  key: "entity.key",
  "1up": "entity.1up",
};

const TILE_LABEL_KEY: Record<string, string> = {
  ground: "tile.ground",
  brick: "tile.brick",
  platform: "tile.platform",
  "spike-up": "tile.spikeUp",
  "spike-down": "tile.spikeDown",
  "spike-left": "tile.spikeLeft",
  "spike-right": "tile.spikeRight",
};

export function EditTargetInspector({
  editTarget,
  tiles,
  updateTileSolid,
  updateTileProperty,
  setSelectedEditTarget,
}: {
  editTarget: EditTarget;
  tiles: { x: number; y: number; type: string; solid?: boolean; collision?: boolean; properties?: TileProperties }[];
  updateTileSolid: (x: number, y: number, solid: boolean) => void;
  updateTileProperty: (x: number, y: number, key: string, value: unknown) => void;
  setSelectedEditTarget: (target: EditTarget | null) => void;
}) {
  const t = useT();
  return (
    <div className="space-y-2 rounded-2xl border border-amber-500/40 bg-slate-900 p-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
        {editTarget.kind === "tile" ? t("editTarget.tile") : t("editTarget.entity")}
      </h3>

      {editTarget.kind === "tile" && (() => {
        const tile = tiles.find((t) => t.x === editTarget.x && t.y === editTarget.y);
        const def = getTileDefinition(editTarget.type);
        const defaultSolid = def?.solido ?? true;
        const currentSolid = tile?.collision ?? tile?.solid ?? defaultSolid;
        const tileName = t(TILE_LABEL_KEY[editTarget.type] ?? "tile.ground");
        return (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t("editTarget.name")}</span>
              <span className="text-slate-200">{tileName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t("editTarget.position")}</span>
              <span className="text-slate-200">({editTarget.x}, {editTarget.y})</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t("editTarget.collision")}</span>
              <button
                type="button"
                onClick={() => updateTileSolid(editTarget.x, editTarget.y, !currentSolid)}
                aria-label={t("editTarget.toggleCollisionAria", { state: currentSolid ? "off" : "on" })}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition ${
                  currentSolid
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {currentSolid ? t("editTarget.on") : t("editTarget.off")}
              </button>
            </div>

            {editTarget.type === "platform" && (
              <div className="mt-2 space-y-2 border-t border-slate-700/50 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{t("editTarget.movement")}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{t("editTarget.direction")}</span>
                  <select
                    value={String(tile?.properties?.moveAxis ?? "none")}
                    onChange={(e) => updateTileProperty(editTarget.x, editTarget.y, "moveAxis", e.target.value)}
                    aria-label={t("editTarget.moveDirAria")}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 outline-none focus:border-amber-500"
                  >
                    <option value="none">{t("editTarget.none")}</option>
                    <option value="vertical">{t("editTarget.upDown")}</option>
                    <option value="horizontal">{t("editTarget.leftRight")}</option>
                  </select>
                </div>
                {(tile?.properties?.moveAxis ?? "none") !== "none" && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{t("editTarget.speed")}</span>
                      <input
                        type="number"
                        value={Number(tile?.properties?.moveSpeed) || 100}
                        onChange={(e) => updateTileProperty(editTarget.x, editTarget.y, "moveSpeed", Number(e.target.value))}
                        aria-label={t("editTarget.moveSpeedAria")}
                        className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-right text-slate-200 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{t("editTarget.range")}</span>
                      <input
                        type="number"
                        value={Number(tile?.properties?.moveRange) || 96}
                        onChange={(e) => updateTileProperty(editTarget.x, editTarget.y, "moveRange", Number(e.target.value))}
                        aria-label={t("editTarget.moveRangeAria")}
                        className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-right text-slate-200 outline-none focus:border-amber-500"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        );
      })()}

      {editTarget.kind === "entity" && (() => {
        const entityName = t(ENTITY_LABEL_KEY[editTarget.type] ?? "entity.player");
        return (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t("editTarget.name")}</span>
              <span className="text-slate-200">{entityName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t("editTarget.position")}</span>
              <span className="text-slate-200">({editTarget.x}, {editTarget.y})</span>
            </div>
          </>
        );
      })()}

      <button
        type="button"
        onClick={() => setSelectedEditTarget(null)}
        aria-label={t("editTarget.closeAria")}
        className="w-full rounded-lg bg-slate-800 py-1 text-xs text-slate-400 transition hover:bg-slate-700"
      >
        {t("editTarget.close")}
      </button>
    </div>
  );
}
