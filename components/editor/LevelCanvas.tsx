"use client";

import { useMemo, useEffect, useCallback, memo, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useEditorStore, type PaintAction } from "@/stores/editorStore";
import { useSelectionStore } from "@/stores/selectionStore";
import { useLayerStore } from "@/stores/layerStore";
import { useEditorCamera } from "@/hooks/useEditorCamera";
import type { EntityType, TileType, Layer, BackgroundTheme } from "@/types/level";
import { LAYERS, LAYER_NAMES, BACKGROUND_COLORS } from "@/types/level";

const CELL_SIZE = 10;

const SPIKE_SPRITE = "/sprites/spike.svg";

const SPRITE_PATH: Record<string, string> = {
  ground: "/sprites/ground.svg",
  brick: "/sprites/brick.svg",
  platform: "/sprites/platform.svg",
  "spike-up": SPIKE_SPRITE,
  "spike-down": SPIKE_SPRITE,
  "spike-left": SPIKE_SPRITE,
  "spike-right": SPIKE_SPRITE,
  player: "/sprites/player.svg",
  coin: "/sprites/coin.svg",
  enemy: "/sprites/enemy.svg",
  goal: "/sprites/goal.svg",
  checkpoint: "/sprites/checkpoint.svg",
  door: "/sprites/door.svg",
  key: "/sprites/key.svg",
};

const SPIKE_ROTATE: Record<string, string> = {
  "spike-up": "0deg",
  "spike-down": "180deg",
  "spike-left": "270deg",
  "spike-right": "90deg",
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
  const sprite = spriteKey ? SPRITE_PATH[spriteKey] : null;
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
  const selectedEditTarget = useSelectionStore((s) => s.selectedEditTarget);
  const setSelectedEditTarget = useSelectionStore((s) => s.setSelectedEditTarget);
  const background = useEditorStore((s) => s.background);
  const activeLayer = useLayerStore((s) => s.activeLayer);
  const visibleLayers = useLayerStore((s) => s.visibleLayers);
  const setActiveLayer = useLayerStore((s) => s.setActiveLayer);
  const toggleLayerVisibility = useLayerStore((s) => s.toggleLayerVisibility);

  const { setNodeRef } = useDroppable({ id: "grid" });
  const cameraContainerRef = useRef<HTMLDivElement | null>(null);
  const { zoom, panX, panY, zoomIn, zoomOut, resetZoom } = useEditorCamera(cameraContainerRef);

  const isPainting = useRef(false);
  const painted = useRef<Set<string>>(new Set());
  const pendingActions = useRef<PaintAction[]>([]);
  const flushRaf = useRef<number | null>(null);
  const startCell = useRef<{ x: number; y: number } | null>(null);
  const startEntityId = useRef<string | null>(null);

  const tileMap = useMemo(
    () => new Map(tiles.filter((tile) => visibleLayers.has((tile.layer ?? LAYERS.SOLID) as Layer)).map((tile) => [`${tile.x}-${tile.y}`, tile.type])),
    [tiles, visibleLayers]
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
    const x = Math.floor(((e.clientX - rect.left) / zoom) / CELL_SIZE);
    const y = Math.floor(((e.clientY - rect.top) / zoom) / CELL_SIZE);
    if (x >= 0 && x < width && y >= 0 && y < height) return { x, y };
    return null;
  }, [width, height, zoom]);

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
        setTile({ x, y, type: selectedTile, layer: activeLayer });
      } else if (activeTool === "entity" && selectedEntity) {
        addEntity(selectedEntity, x, y);
      }
    },
    [activeTool, selectedTile, selectedEntity, removeTile, removeEntity, setSelectedEntityId, setTile, addEntity, activeLayer]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const cell = getCellFromEvent(e);
      if (!cell) return;

      const tool = useSelectionStore.getState().activeTool;
      if (tool === "edit") {
        startCell.current = cell;
        startEntityId.current = null;
        isPainting.current = true;
        painted.current.clear();
        pendingActions.current = [];
        return;
      }

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
      const tool = useSelectionStore.getState().activeTool;
      if (tool === "edit") return;
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
        const tool = useSelectionStore.getState().activeTool;
        if (tool === "edit") {
          const tMap = useEditorStore.getState().tiles;
          const eList = useEditorStore.getState().entities;
          const tileAtCell = tMap.find((t) => t.x === x && t.y === y);
          if (tileAtCell) {
            setSelectedEditTarget({ kind: "tile", x, y, type: tileAtCell.type });
          } else {
            const entityAtCell = eList.find((e) => e.position.x === x && e.position.y === y);
            if (entityAtCell) {
              setSelectedEditTarget({ kind: "entity", id: entityAtCell.id, x, y, type: entityAtCell.type });
            } else {
              setSelectedEditTarget(null);
            }
          }
        } else {
          commitCellAction(x, y, startEntityId.current);
        }
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
    if (tileMap.size === 0 && entityLookup.size === 0 && !selectedEntityId && !selectedEditTarget) {
      return null;
    }
    const cells: React.ReactElement[] = [];
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const key = `${col}-${row}`;
        const tileAtCell = tileMap.get(key);
        const entityAtCell = entityLookup.get(key);
        const isSelected = entityAtCell?.id === selectedEntityId;
        const isEditTarget = selectedEditTarget !== null
          && ((selectedEditTarget.kind === "tile" && selectedEditTarget.x === col && selectedEditTarget.y === row)
            || (selectedEditTarget.kind === "entity" && entityAtCell?.id === selectedEditTarget.id));
        if (tileAtCell || entityAtCell || isSelected || isEditTarget) {
          cells.push(
            <GridCell
              key={key}
              x={col}
              y={row}
              tileType={tileAtCell as TileType | undefined}
              entityType={entityAtCell?.type as EntityType | undefined}
              isSelected={isSelected}
              isEditTarget={isEditTarget}
            />
          );
        }
      }
    }
    return cells.length > 0 ? cells : null;
  }, [width, height, tileMap, entityLookup, selectedEntityId, selectedEditTarget]);

  return (
    <section className="rounded-3xl border border-slate-800/90 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Canvas del nivel</h2>
          <p className="text-sm text-slate-400">Haz clic o arrastra un objeto para colocar elementos.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={zoomOut}
              aria-label="Zoom out"
              className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 transition hover:bg-slate-700"
            >
              −
            </button>
            <span className="w-8 text-center text-xs text-slate-400">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={zoomIn}
              aria-label="Zoom in"
              className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 transition hover:bg-slate-700"
            >
              +
            </button>
            <button
              type="button"
              onClick={resetZoom}
              aria-label="Reset zoom"
              className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 transition hover:bg-slate-700"
            >
              ⊞
            </button>
            <div className="mx-1 h-4 w-px bg-slate-800" />
            <div className="flex gap-1">
            {([0, 1, 2, 3, 4, 5] as Layer[]).map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => toggleLayerVisibility(layer)}
                aria-label={`Toggle layer ${LAYER_NAMES[layer]}`}
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                  visibleLayers.has(layer)
                    ? layer === activeLayer
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-800 text-slate-300"
                    : "bg-slate-900/50 text-slate-700 line-through"
                }`}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setActiveLayer(layer);
                }}
              >
                {layer}
              </button>
            ))}
            </div>
          </div>
          <div className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-400">{width}x{height} grid</div>
        </div>
      </div>
      <div className="overflow-hidden select-none rounded-3xl border border-slate-900/80 bg-slate-950 p-2" ref={setNodeRef}>
        <div
          id="grid"
          ref={cameraContainerRef}
          className="relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{
            width: `${width * CELL_SIZE}px`,
            height: `${height * CELL_SIZE}px`,
            transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
            transformOrigin: "0 0",
            backgroundColor: BACKGROUND_COLORS[(background ?? "dark") as BackgroundTheme],
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
