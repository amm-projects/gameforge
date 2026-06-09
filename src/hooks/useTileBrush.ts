import { useCallback, useRef } from "react";
import { makeId } from "@/lib/utils";
import { CELL_SIZE } from "@/assets";
import { useEditorStore, type PaintAction } from "@/stores/editorStore";
import { useSelectionStore } from "@/stores/selectionStore";

export function useTileBrush() {
  const width = useEditorStore((s) => s.width);
  const height = useEditorStore((s) => s.height);
  const batchPaint = useEditorStore((s) => s.batchPaint);

  const activeTool = useSelectionStore((s) => s.activeTool);
  const selectedTile = useSelectionStore((s) => s.selectedTile);
  const selectedEntity = useSelectionStore((s) => s.selectedEntity);

  const isPainting = useRef(false);
  const painted = useRef<Set<string>>(new Set());
  const pendingActions = useRef<PaintAction[]>([]);
  const flushRaf = useRef<number | null>(null);
  const startCell = useRef<{ x: number; y: number } | null>(null);
  const startEntityId = useRef<string | null>(null);
  const gridRect = useRef<DOMRect | null>(null);

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

  const getCellFromEvent = useCallback(
    (clientX: number, clientY: number, zoom = 1): { x: number; y: number } | null => {
      const rect = gridRect.current;
      if (!rect) return null;
      const x = Math.floor(((clientX - rect.left) / zoom) / CELL_SIZE);
      const y = Math.floor(((clientY - rect.top) / zoom) / CELL_SIZE);
      if (x >= 0 && x < width && y >= 0 && y < height) return { x, y };
      return null;
    },
    [width, height]
  );

  const startBrush = useCallback((x: number, y: number, entityId: string | null) => {
    startCell.current = { x, y };
    startEntityId.current = entityId;
    isPainting.current = true;
    painted.current.clear();
    pendingActions.current = [];
  }, []);

  const endBrush = useCallback(() => {
    isPainting.current = false;
    startCell.current = null;
    startEntityId.current = null;
    gridRect.current = null;
  }, []);

  const setGridRect = useCallback((rect: DOMRect | null) => {
    gridRect.current = rect;
  }, []);

  return {
    isPainting,
    painted,
    pendingActions,
    flushRaf,
    startCell,
    startEntityId,
    makeAction,
    scheduleFlush,
    getCellFromEvent,
    startBrush,
    endBrush,
    setGridRect,
  };
}
