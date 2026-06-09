"use client";

import { useMemo, useEffect, useCallback, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { makeId } from "@/lib/utils";
import { CELL_SIZE } from "@/assets";
import { useEditorStore, type PaintAction } from "@/stores/editorStore";
import { useSelectionStore } from "@/stores/selectionStore";
import { useEditorCamera } from "@/hooks/useEditorCamera";
import { useTileBrush } from "@/hooks/useTileBrush";
import { GridCell } from "@/components/editor/GridCell";
import { CameraControls } from "@/components/editor/CameraControls";
import type { EntityType, TileType, BackgroundTheme } from "@/types/level";
import { BACKGROUND_COLORS } from "@/types/level";

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
  const { setNodeRef } = useDroppable({ id: "grid" });
  const cameraContainerRef = useRef<HTMLDivElement | null>(null);
  const { zoom, panX, panY, zoomIn, zoomOut, resetZoom } = useEditorCamera(cameraContainerRef);

  const brush = useTileBrush();

  const tileMap = useMemo(
    () => new Map(tiles.map((tile) => [`${tile.x}-${tile.y}`, tile.type])),
    [tiles]
  );

  const entityLookup = useMemo(
    () => new Map(entities.map((entity) => [`${entity.position.x}-${entity.position.y}`, entity])),
    [entities]
  );

  const getCellFromEvent = useCallback(
    (e: React.MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-x]");
      if (target) {
        const x = Number(target.getAttribute("data-x"));
        const y = Number(target.getAttribute("data-y"));
        if (!Number.isNaN(x) && !Number.isNaN(y)) return { x, y };
      }
      return brush.getCellFromEvent(e.clientX, e.clientY, zoom);
    },
    [brush, zoom]
  );

  const makeAction = useCallback(
    (x: number, y: number): PaintAction | null => {
      if (activeTool === "erase") return { kind: "erase", x, y };
      if (activeTool === "tile" && selectedTile) return { kind: "tile", x, y, tileType: selectedTile };
      if (activeTool === "entity" && selectedEntity) return { kind: "entity", x, y, entityType: selectedEntity, entityId: makeId() };
      return null;
    },
    [activeTool, selectedTile, selectedEntity]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const gridEl = document.getElementById("grid");
      if (!gridEl) return;
      brush.setGridRect(gridEl.getBoundingClientRect());
      const cell = getCellFromEvent(e);
      if (!cell) { brush.setGridRect(null); return; }

      if (useSelectionStore.getState().activeTool === "edit") {
        brush.startBrush(cell.x, cell.y, null);
        return;
      }

      brush.startBrush(cell.x, cell.y, entityLookup.get(`${cell.x}-${cell.y}`)?.id ?? null);
    },
    [getCellFromEvent, entityLookup, brush]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!brush.isPainting.current) return;
      if (useSelectionStore.getState().activeTool === "edit") return;
      const cell = getCellFromEvent(e);
      if (!cell) return;

      const key = `${cell.x}-${cell.y}`;
      if (brush.painted.current.has(key)) return;
      brush.painted.current.add(key);

      if (brush.painted.current.size === 1 && brush.startCell.current) {
        const startKey = `${brush.startCell.current.x}-${brush.startCell.current.y}`;
        brush.painted.current.add(startKey);
        const action = makeAction(brush.startCell.current.x, brush.startCell.current.y);
        if (action) brush.pendingActions.current.push(action);
      }

      const action = makeAction(cell.x, cell.y);
      if (action) brush.pendingActions.current.push(action);
      brush.scheduleFlush();
    },
    [getCellFromEvent, makeAction, brush]
  );

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

  useEffect(() => {
    const handleMouseUp = () => {
      if (!brush.isPainting.current) return;
      brush.isPainting.current = false;

      if (brush.painted.current.size > 0) {
        if (brush.flushRaf.current !== null) {
          cancelAnimationFrame(brush.flushRaf.current);
          brush.flushRaf.current = null;
        }
        if (brush.pendingActions.current.length > 0) {
          batchPaint(brush.pendingActions.current);
          brush.pendingActions.current = [];
        }
      } else if (brush.startCell.current) {
        const { x, y } = brush.startCell.current;
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
          commitCellAction(x, y, brush.startEntityId.current);
        }
      }

      brush.startCell.current = null;
      brush.startEntityId.current = null;
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
  }, [selectedEntityId, removeEntity, setSelectedEntityId, batchPaint, commitCellAction, setSelectedEditTarget, brush]);

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
    <section className="rounded-3xl border border-slate-800/90 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10 min-h-[200px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Canvas del nivel</h2>
          <p className="text-sm text-slate-400">Haz clic o arrastra un objeto para colocar elementos.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CameraControls zoom={zoom} zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />
          </div>
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
