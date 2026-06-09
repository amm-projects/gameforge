"use client";

import type { Layer } from "@/types/level";
import { LAYER_NAMES } from "@/types/level";

export function LayerBar({
  activeLayer,
  visibleLayers,
  setActiveLayer,
  toggleLayerVisibility,
}: {
  activeLayer: Layer;
  visibleLayers: Set<Layer>;
  setActiveLayer: (layer: Layer) => void;
  toggleLayerVisibility: (layer: Layer) => void;
}) {
  return (
    <div className="flex gap-1" role="group" aria-label="Selector de capas">
      {([0, 1, 2, 3, 4, 5] as Layer[]).map((layer) => (
        <button
          key={layer}
          type="button"
          onClick={() => toggleLayerVisibility(layer)}
          onContextMenu={(e) => {
            e.preventDefault();
            setActiveLayer(layer);
          }}
          aria-label={`Capa ${layer} (${LAYER_NAMES[layer]}): ${visibleLayers.has(layer) ? "visible" : "oculta"}. Clic derecho para activar.`}
          aria-pressed={layer === activeLayer}
          className={`rounded-md px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider transition ${
            visibleLayers.has(layer)
              ? layer === activeLayer
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
              : "bg-slate-900/50 text-slate-700 line-through"
          }`}
        >
          {layer}
        </button>
      ))}
    </div>
  );
}
