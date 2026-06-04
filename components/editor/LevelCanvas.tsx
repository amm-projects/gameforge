"use client";

import { useMemo, useEffect, useCallback, memo, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useEditorStore, type PaintAction } from "@/stores/editorStore";
import { useSelectionStore } from "@/stores/selectionStore";
import type { EntityType, TileType } from "@/types/level";

const CELL_SIZE = 10;

const ENTITY_VISUAL: Record<EntityType, { color: string; symbol: string; label: string }> = {
  player: { color: "bg-blue-500", symbol: "P", label: "Player" },
  coin: { color: "bg-yellow-400", symbol: "C", label: "Coin" },
  enemy: { color: "bg-red-600", symbol: "E", label: "Enemy" },
  goal: { color: "bg-green-500", symbol: "G", label: "Goal" },
};

function makeId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);
}

const GridCell = memo(function GridCell({
  x,
  y,
  tileType,
  entityType,
  isSelected,
}: {
  x: number;
  y: number;
  tileType?: TileType;
  entityType?: EntityType;
  isSelected: boolean;
}) {
  const entityVisual = entityType ? ENTITY_VISUAL[entityType] : null;

  return (
    <button
      type="button"
      data-x={x}
      data-y={y}
      aria-label={`Celda ${x},${y}${tileType ? ` ${tileType}` : ""}${entityType ? ` ${entityType}` : ""}`}
      className={`absolute z-10 border ${
        isSelected
          ? "border-cyan-400 bg-slate-950 ring-1 ring-cyan-400/50"
          : tileType
            ? "border-slate-600 bg-slate-950"
            : "border-slate-900/70 bg-slate-950"
      }`}
      style={{
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      {tileType && (
        <span className={`absolute inset-0 block ${tileType === "ground" ? "bg-amber-600" : "bg-rose-500/90"}`} />
      )}
      {entityVisual && (
        <span
          className={`absolute inset-0 flex items-center justify-center ${entityVisual.color} text-[0.3125rem] font-bold text-white leading-none`}
          title={entityVisual.label}
        >
          {entityVisual.symbol}
        </span>
      )}
    </button>
  );
});

export function LevelCanvas() {
  const width = useEditorStore((s) => s.width);
  const height = useEditorStore((s) => s.height);
  const tiles = useEditorStore((s) => s.tiles);
  const entities = useEditorStore((s) => s.entities);
  const setTile = useEditorStore((s) => s.setTile);
  const removeTile = useEditorStore((s) => s.removeTile);
  const addEntity = useEditorStore((s) => s.addEntity);
  const removeEntity = useEditorStore((s) => s.removeEntity);
  const batchPaint = useEditorStore((s) => s.batchPaint);

  const activeTool = useSelectionStore((s) => s.activeTool);
  const selectedTile = useSelectionStore((s) => s.selectedTile);
  const selectedEntity = useSelectionStore((s) => s.selectedEntity);
  const selectedEntityId = useSelectionStore((s) => s.selectedEntityId);
  const setSelectedEntityId = useSelectionStore((s) => s.setSelectedEntityId);

  const { setNodeRef } = useDroppable({ id: "grid" });

  const isPainting = useRef(false);
  const painted = useRef<Set<string>>(new Set());
  const pendingActions = useRef<PaintAction[]>([]);
  const flushRaf = useRef<number | null>(null);
  const startCell = useRef<{ x: number; y: number } | null>(null);
  const startEntityId = useRef<string | null>(null);

  const tileMap = useMemo(
    () => new Map(tiles.map((tile) => [`${tile.x}-${tile.y}`, tile.type])),
    [tiles]
  );

  const entityLookup = useMemo(
    () => new Map(entities.map((entity) => [`${entity.position.x}-${entity.position.y}`, entity])),
    [entities]
  );

  const getCellFromEvent = useCallback((e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest("[data-x]");
    if (target) {
      const x = Number(target.getAttribute("data-x"));
      const y = Number(target.getAttribute("data-y"));
      if (!Number.isNaN(x) && !Number.isNaN(y)) return { x, y };
    }
    const gridEl = document.getElementById("grid");
    if (!gridEl) return null;
    const rect = gridEl.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    if (x >= 0 && x < width && y >= 0 && y < height) return { x, y };
    return null;
  }, [width, height]);

  const makeAction = useCallback(
    (x: number, y: number): PaintAction | null => {
      if (activeTool === "erase") return { kind: "erase", x, y };
      if (activeTool === "tile" && selectedTile) return { kind: "tile", x, y, tileType: selectedTile };
      if (activeTool === "entity" && selectedEntity) return { kind: "entity", x, y, entityType: selectedEntity, entityId: makeId() };
      return null;
    },
    [activeTool, selectedTile, selectedEntity]
  );

  const scheduleFlush = useCallback(() => {
    if (flushRaf.current !== null) return;
    flushRaf.current = requestAnimationFrame(() => {
      flushRaf.current = null;
      if (pendingActions.current.length === 0) return;
      const actions = pendingActions.current;
      pendingActions.current = [];
      batchPaint(actions);
    });
  }, [batchPaint]);

  const commitCellAction = useCallback(
    (x: number, y: number, preEntityId: string | null) => {
      if (activeTool === "erase") {
        removeTile(x, y);
        if (preEntityId) removeEntity(preEntityId);
        setSelectedEntityId(null);
        return;
      }

      if (preEntityId) setSelectedEntityId(preEntityId);
      else setSelectedEntityId(null);

      if (activeTool === "tile" && selectedTile) {
        setTile({ x, y, type: selectedTile });
      } else if (activeTool === "entity" && selectedEntity) {
        addEntity(selectedEntity, x, y);
      }
    },
    [activeTool, selectedTile, selectedEntity, removeTile, removeEntity, setSelectedEntityId, setTile, addEntity]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const cell = getCellFromEvent(e);
      if (!cell) return;

      startCell.current = cell;
      startEntityId.current = entityLookup.get(`${cell.x}-${cell.y}`)?.id ?? null;
      isPainting.current = true;
      painted.current.clear();
      pendingActions.current = [];
    },
    [getCellFromEvent, entityLookup]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPainting.current) return;
      const cell = getCellFromEvent(e);
      if (!cell) return;

      const key = `${cell.x}-${cell.y}`;
      if (painted.current.has(key)) return;
      painted.current.add(key);

      if (painted.current.size === 1 && startCell.current) {
        const startKey = `${startCell.current.x}-${startCell.current.y}`;
        painted.current.add(startKey);
        const action = makeAction(startCell.current.x, startCell.current.y);
        if (action) pendingActions.current.push(action);
      }

      const action = makeAction(cell.x, cell.y);
      if (action) pendingActions.current.push(action);
      scheduleFlush();
    },
    [getCellFromEvent, makeAction, scheduleFlush]
  );

  useEffect(() => {
    const handleMouseUp = () => {
      if (!isPainting.current) return;
      isPainting.current = false;

      if (painted.current.size > 0) {
        if (flushRaf.current !== null) {
          cancelAnimationFrame(flushRaf.current);
          flushRaf.current = null;
        }
        if (pendingActions.current.length > 0) {
          batchPaint(pendingActions.current);
          pendingActions.current = [];
        }
      } else if (startCell.current) {
        const { x, y } = startCell.current;
        commitCellAction(x, y, startEntityId.current);
      }

      startCell.current = null;
      startEntityId.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedEntityId) {
        removeEntity(selectedEntityId);
        setSelectedEntityId(null);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEntityId, removeEntity, setSelectedEntityId, batchPaint, commitCellAction]);

  const gridCells = useMemo(() => {
    if (tileMap.size === 0 && entityLookup.size === 0 && !selectedEntityId) {
      return null;
    }
    const cells: React.ReactElement[] = [];
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const key = `${col}-${row}`;
        const tileAtCell = tileMap.get(key);
        const entityAtCell = entityLookup.get(key);
        const isSelected = entityAtCell?.id === selectedEntityId;
        if (tileAtCell || entityAtCell || isSelected) {
          cells.push(
            <GridCell
              key={key}
              x={col}
              y={row}
              tileType={tileAtCell as TileType | undefined}
              entityType={entityAtCell?.type as EntityType | undefined}
              isSelected={isSelected}
            />
          );
        }
      }
    }
    return cells.length > 0 ? cells : null;
  }, [width, height, tileMap, entityLookup, selectedEntityId]);

  return (
    <section className="rounded-3xl border border-slate-800/90 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Canvas del nivel</h2>
          <p className="text-sm text-slate-400">Haz clic o arrastra un objeto para colocar elementos.</p>
        </div>
        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">{width}x{height} grid</div>
      </div>
      <div className="overflow-auto select-none rounded-3xl border border-slate-900/80 bg-slate-950 p-2" ref={setNodeRef}>
        <div
          id="grid"
          className="relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{
            width: `${width * CELL_SIZE}px`,
            height: `${height * CELL_SIZE}px`,
            backgroundImage: `
              linear-gradient(rgba(100,116,139,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,116,139,0.12) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
        >
          {gridCells}
        </div>
      </div>
    </section>
  );
}
