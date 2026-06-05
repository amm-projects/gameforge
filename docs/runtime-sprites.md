# Sprites en el runtime de Phaser

**Fecha:** 2026-06-05  
**Versión:** 0.12.0  
**Decisión técnica:** Reemplazar rectángulos de color sólido por sprites dibujados programáticamente.

## Motivación

El runtime de Phaser generaba texturas de color sólido para todos los tiles y entidades, lo que dificultaba la identificación visual de cada elemento durante el juego. Se decidió dibujar sprites reconocibles usando primitivas de Phaser Graphics.

## Diseño

Cada sprite se dibuja con una combinación de `fillRect`, `fillCircle`, `fillTriangle` y `lineStyle` directamente sobre un objeto `Phaser.GameObjects.Graphics`, que luego se convierte en textura con `generateTexture()`.

### Sprites

| Elemento | Tamaño | Descripción visual |
|---|---|---|---|
| Ground | 32×32 | Ladrillos marrones con variación de tono |
| Spike | 32×32 | Triángulo rojo |
| Player | 32×32 | Cabeza circular + cuerpo + piernas, azul, ojos blancos |
| Coin | 32×32 | Círculo dorado con centro más claro |
| Enemy | 32×32 | Círculo naranja con ojos blancos y pupilas negras |
| Goal | 32×32 | Poste verde con banderín |

### Panel de selección

Los sprites SVG en `public/sprites/` mantienen el mismo diseño visual que los sprites del runtime, asegurando coherencia entre el editor y el juego.

## Implementación

Se eliminó el bucle genérico `textures.forEach()` y la interfaz `RuntimeTexture` en `GameRuntime.tsx`. Se añadió un método auxiliar `createTexture(key, width, height, draw)` que acepta un callback de dibujo, permitiendo definir cada sprite de forma declarativa.

## Archivos modificados

- `components/runtime/GameRuntime.tsx`
- `components/editor/ToolPanel.tsx`
