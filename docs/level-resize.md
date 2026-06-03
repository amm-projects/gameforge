# Level Size Increase

## 2026-06-03

### Context

El nivel del editor y del runtime tenían un tamaño por defecto de 16×12 celdas, lo cual resultaba muy pequeño para crear niveles de plataformas interesantes.

### Cambios realizados

- Tamaño por defecto del nivel: **16×12 → 64×64** celdas
- El reset de nivel (`resetLevel`) también crea un nivel de 64×64
- Tamaño de celda en el editor: **40px → 10px** para mantener el área visual del canvas (~640×640px)
- Viewport del runtime Phaser: **1024×768 → 1280×720**
- Contenedor del runtime: `h-96` → `min-h-[480px]`

### Archivos modificados

- `stores/editorStore.ts` — Default `width`/`height` y `resetLevel`
- `components/editor/LevelCanvas.tsx` — Celda `h-10 w-10` → `h-[10px] w-[10px]`, grid `* 40` → `* 10`
- `components/runtime/GameRuntime.tsx` — Canvas limits y container height
