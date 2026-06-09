import { useCallback, useRef, useEffect } from "react";
import { useCameraStore } from "@/stores/cameraStore";

export function useEditorCamera(containerRef: React.RefObject<HTMLDivElement | null>) {
  const { zoom, panX, panY, zoomIn, zoomOut, resetZoom, setPan, fitToMap, centerView } = useCameraStore();
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    },
    [zoomIn, zoomOut]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 1 || e.button === 2) {
      isPanning.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      setPan(panX + dx, panY + dy);
    },
    [panX, panY, setPan]
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleContextMenu = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("contextmenu", handleContextMenu);
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [containerRef, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, handleContextMenu]);

  return { zoom, panX, panY, zoomIn, zoomOut, resetZoom, setPan, fitToMap, centerView };
}
