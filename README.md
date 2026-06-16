# GameForge

2D platformer visual editor. Build levels by dragging blocks, enemies, coins and interactive objects. Preview and play the level directly in the browser.

## Stack

- **Next.js** 16 (App Router)
- **React** 19
- **TypeScript** (strict)
- **Tailwind CSS** 4
- **Zustand** (state management)
- **Phaser** 3 (game engine)
- **dnd-kit** (drag & drop)
- **Zod** (validation)

## Requirements

- Node.js 20+

## Development

```bash
npm install
npm run dev        # development server (http://localhost:3000)
npm run build      # production build
npm run test       # unit tests (Vitest, watch mode)
npm run test:run   # unit tests (CI)
npm run test:e2e   # E2E tests (Playwright)
npm run lint       # ESLint
```

## Testing

| Type | Tool | Command |
|---|---|---|
| Unit | Vitest | `npm run test:run` |
| Integration | Testing Library | `npm run test:run` |
| E2E | Playwright | `npm run test:e2e` |

## Architecture

```
src/
├── app/            # App Router
├── components/     # React components
│   ├── editor/     #   Editor UI
│   └── runtime/    #   Runtime wrapper
├── engine/         # Game engine
│   ├── editor/     #   Editor logic
│   └── runtime/    #   Execution logic (Phaser)
├── stores/         # Global state (Zustand)
├── hooks/          # Custom hooks
├── types/          # Shared types
├── lib/            # Utilities
├── assets/         # Constants and assets
└── features/       # Feature modules
```

The editor and runtime are completely separated. The editor does not contain game logic, and the runtime does not contain editing tools.

## License

Free to use.

---

# GameForge — Editor de niveles 2D

## ¿Qué es?

Un **creador de plataformas 2D** inspirado en Mario Maker, completamente web. Los usuarios construyen niveles arrastrando tiles y entidades sobre un grid, y los juegan al instante en el navegador — sin programar.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript (strict) |
| Estilos | Tailwind CSS 4 |
| Estado | Zustand |
| Motor de juego | Phaser 3 |
| Drag & drop | dnd-kit |
| Validación | Zod |
| Testing | Vitest + Testing Library + Playwright |
| i18n | Español / Inglés |

---

## Arquitectura

Dos mundos completamente separados:

**Editor** — UI en React para colocar tiles, entidades, configurar propiedades, guardar/cargar niveles. Sin lógica de juego.

**Runtime** — Escena de Phaser 3 que lee el JSON del nivel y ejecuta el juego: físicas, colisiones, enemigos, monedas, puertas, vidas, música. Sin herramientas de edición.

```text
src/
├── app/             # Páginas de Next.js
├── components/      # Componentes React
│   ├── editor/      #   ToolPanel, LevelCanvas, InspectorPanel
│   └── runtime/     #   GameRuntime, TouchControls
├── engine/
│   ├── editor/      #   Acciones de pintado, transformaciones
│   └── runtime/     #   RuntimeScene de Phaser (1300+ líneas)
├── stores/          # Stores de Zustand por dominio
├── types/           # LevelData, Tile, Entity, esquemas
├── lib/             # i18n, precarga de Phaser, utils
├── assets/          # Rutas de sprites, constantes
└── data/            # JSON de niveles de ejemplo
```

---

## Grid y tiles

- **Grid de 64×64**, celdas de 32×32 px
- 6 tipos de tile: suelo, ladrillo, plataforma, pinchos (4 direcciones)
- Colisión configurable por tile
- Plataformas móviles (horizontal/vertical, velocidad y rango configurables)

## Entidades

| Entidad | Comportamiento |
|---|---|
| Player | Flechas / WASD para moverse y saltar |
| Coin | Coleccionable, 100 monedas = 1 vida extra |
| Walker | Camina hacia adelante, rebota en paredes, cae de bordes |
| Patrol | Patrulla de lado a lado, gira en bordes de plataforma |
| Jumper | Camina y salta periódicamente |
| Goal | Activa fin de nivel |
| Checkpoint | Guarda posición de reaparición |
| Door + Key | Puzzle de llave y puerta |
| 1UP | Otorga una vida extra |

## Funcionalidades del runtime

- Físicas arcade (gravedad, colisiones, plataformas móviles)
- Sistema de 3 vidas con reaparición en checkpoint
- Puzzle de llave/ puerta con contador de llaves en HUD
- 5 temas musicales (archivos WAV generados proceduralmente)
- Efectos de sonido (salto, moneda, puerta, checkpoint, 1UP)
- Pantallas de victoria y game over con reintento
- Modo inmersivo a pantalla completa en móvil/tablet
- Controles táctiles superpuestos para móvil
- Orientación horizontal automática en móvil

---

## Funcionalidades del editor

- Pintar tiles haciendo clic o arrastrando
- Arrastrar entidades desde el panel al canvas (dnd-kit)
- Herramientas de borrar y editar
- Panel inspector con importación/exportación JSON
- Selector de fondo (6 temas)
- Selector de música (5 temas)
- Niveles de ejemplo (6 niveles predefinidos)
- Zoom y paneo de cámara
- Internacionalización (español / inglés)
- Diseño responsive (escritorio, tablet, móvil)

---

## Formato de nivel

JSON portátil, independiente de Phaser:

```json
{
  "width": 64,
  "height": 64,
  "tiles": [{ "x": 0, "y": 62, "type": "ground" }],
  "entities": [{ "id": "abc", "type": "player", "position": { "x": 3, "y": 55 }, "properties": {} }],
  "background": "sky",
  "music": "adventure"
}
```

---

## Testing

| Tipo | Herramienta | Cantidad |
|---|---|---|
| Unit + Integración | Vitest | 206 tests |
| E2E | Playwright | 12 tests |
| Linting | ESLint | — |

---

## Lighthouse

| Categoría | Puntaje |
|---|---|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

---

## Estado del proyecto

- **Versión**: 0.58.1
- **Líneas de código**: ~10,000+
- **Documentación**: 30+ documentos de decisión en `/docs`
- **Sprites**: 11 SVGs en pixel art
- **Audio**: 5 temas musicales + 9 efectos de sonido

---

## Flujo de demostración

1. Abrir el editor → se ve el grid, el panel de herramientas y el inspector
2. Seleccionar un tile (ej. suelo) y pintar en el canvas
3. Seleccionar una entidad (ej. enemigo, moneda) y colocarla
4. Editar una puerta → configurar puzzle de llave/puerta
5. Elegir fondo y tema musical
6. Presionar **Play** → Phaser carga el nivel al instante
7. Controlar al jugador por el nivel, recolectar monedas, evitar enemigos
8. Llegar a la meta → pantalla de victoria con reintentar
9. Presionar Stop → volver al editor
10. Exportar/importar JSON del nivel
