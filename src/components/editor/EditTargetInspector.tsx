"use client";

import { getTileDefinition } from "@/types/tile-definitions";
import type { EntityType } from "@/types/level";
import type { EditTarget } from "@/stores/selectionStore";

const ENTITY_NAMES: Record<EntityType, string> = {
  player: "Jugador",
  coin: "Moneda",
  enemy: "Enemigo",
  goal: "Meta",
  checkpoint: "Checkpoint",
  door: "Puerta",
  key: "Llave",
};

export function EditTargetInspector({
  editTarget,
  tiles,
  updateTileSolid,
  updateTileProperty,
  setSelectedEditTarget,
}: {
  editTarget: EditTarget;
  tiles: { x: number; y: number; type: string; solid?: boolean; properties?: Record<string, unknown> }[];
  updateTileSolid: (x: number, y: number, solid: boolean) => void;
  updateTileProperty: (x: number, y: number, key: string, value: unknown) => void;
  setSelectedEditTarget: (target: EditTarget | null) => void;
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-amber-500/40 bg-slate-900 p-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
        {editTarget.kind === "tile" ? "Tile" : "Entity"}
      </h3>

      {editTarget.kind === "tile" && (() => {
        const def = getTileDefinition(editTarget.type);
        const tile = tiles.find((t) => t.x === editTarget.x && t.y === editTarget.y);
        const defaultSolid = def?.solido ?? true;
        const currentSolid = tile?.solid ?? defaultSolid;
        return (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Name</span>
              <span className="text-slate-200">{def?.nombre ?? editTarget.type}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Position</span>
              <span className="text-slate-200">({editTarget.x}, {editTarget.y})</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Collision</span>
              <button
                type="button"
                onClick={() => updateTileSolid(editTarget.x, editTarget.y, !currentSolid)}
                aria-label={`Toggle collision ${currentSolid ? "off" : "on"}`}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition ${
                  currentSolid
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {currentSolid ? "ON" : "OFF"}
              </button>
            </div>

            {editTarget.type === "platform" && (
              <div className="mt-2 space-y-2 border-t border-slate-700/50 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Movement</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Direction</span>
                  <select
                    value={String(tile?.properties?.moveAxis ?? "none")}
                    onChange={(e) => updateTileProperty(editTarget.x, editTarget.y, "moveAxis", e.target.value)}
                    aria-label="Movement direction"
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-slate-200 outline-none focus:border-amber-500"
                  >
                    <option value="none">None</option>
                    <option value="vertical">Up-Down</option>
                    <option value="horizontal">Left-Right</option>
                  </select>
                </div>
                {(tile?.properties?.moveAxis ?? "none") !== "none" && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Speed</span>
                      <input
                        type="number"
                        value={Number(tile?.properties?.moveSpeed) || 100}
                        onChange={(e) => updateTileProperty(editTarget.x, editTarget.y, "moveSpeed", Number(e.target.value))}
                        aria-label="Movement speed"
                        className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-right text-slate-200 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Range</span>
                      <input
                        type="number"
                        value={Number(tile?.properties?.moveRange) || 96}
                        onChange={(e) => updateTileProperty(editTarget.x, editTarget.y, "moveRange", Number(e.target.value))}
                        aria-label="Movement range"
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
        return (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Name</span>
              <span className="text-slate-200">{ENTITY_NAMES[editTarget.type]}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Position</span>
              <span className="text-slate-200">({editTarget.x}, {editTarget.y})</span>
            </div>
          </>
        );
      })()}

      <button
        type="button"
        onClick={() => setSelectedEditTarget(null)}
        aria-label="Close element editor"
        className="w-full rounded-lg bg-slate-800 py-1 text-xs text-slate-400 transition hover:bg-slate-700"
      >
        Close
      </button>
    </div>
  );
}
