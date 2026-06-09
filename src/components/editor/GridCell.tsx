"use client";

import { memo } from "react";
import { SPRITE_PATHS } from "@/assets";
import type { TileType, EntityType } from "@/types/level";

const CELL_SIZE = 10;

const SPIKE_ROTATE: Record<string, string> = {
  "spike-up": "0deg",
  "spike-down": "180deg",
  "spike-left": "270deg",
  "spike-right": "90deg",
};

export const GridCell = memo(function GridCell({
  x,
  y,
  tileType,
  entityType,
  isSelected,
  isEditTarget,
}: {
  x: number;
  y: number;
  tileType?: TileType;
  entityType?: EntityType;
  isSelected: boolean;
  isEditTarget: boolean;
}) {
  const spriteKey = tileType ?? entityType;
  const sprite = spriteKey ? SPRITE_PATHS[spriteKey] : null;
  const rotate = tileType ? SPIKE_ROTATE[tileType] : undefined;

  const border = isSelected
    ? "border-cyan-400 bg-slate-950 ring-1 ring-cyan-400/50"
    : isEditTarget
      ? "border-amber-400 bg-slate-950 ring-1 ring-amber-400/50"
      : tileType || entityType
        ? "border-slate-600 bg-slate-950"
        : "border-slate-900/70 bg-slate-950";

  return (
    <button
      type="button"
      data-x={x}
      data-y={y}
      aria-label={`Celda ${x},${y}${tileType ? ` ${tileType}` : ""}${entityType ? ` ${entityType}` : ""}`}
      className={`absolute z-10 border ${border}`}
      style={{
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
        ...(sprite ? { backgroundImage: `url(${sprite})`, backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat", transform: rotate ? `rotate(${rotate})` : undefined } : {}),
      }}
    />
  );
});
