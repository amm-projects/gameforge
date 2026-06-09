# GameForge

Editor visual de juegos de plataformas 2D. Construye niveles arrastrando bloques, enemigos, monedas y objetos interactivos. Previsualiza y juega el nivel directamente desde el navegador.

## Stack

- **Next.js** 16 (App Router)
- **React** 19
- **TypeScript** (strict)
- **Tailwind CSS** 4
- **Zustand** (estado global)
- **Phaser** 3 (motor de juego)
- **dnd-kit** (drag & drop)
- **Zod** (validación)

## Requisitos

- Node.js 20+

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo (http://localhost:3000)
npm run build      # build de producción
npm run test       # tests unitarios (Vitest, watch mode)
npm run test:run   # tests unitarios (CI)
npm run test:e2e   # tests E2E (Playwright)
npm run lint       # ESLint
```

## Testing

| Tipo | Herramienta | Comando |
|---|---|---|
| Unitario | Vitest | `npm run test:run` |
| Integración | Testing Library | `npm run test:run` |
| E2E | Playwright | `npm run test:e2e` |

## Arquitectura

```
src/
├── app/            # App Router
├── components/     # Componentes React
│   ├── editor/     #   Editor UI
│   └── runtime/    #   Runtime wrapper
├── engine/         # Motor del juego
│   ├── editor/     #   Lógica de edición
│   └── runtime/    #   Lógica de ejecución (Phaser)
├── stores/         # Estado global (Zustand)
├── hooks/          # Custom hooks
├── types/          # Tipos compartidos
├── lib/            # Utilidades
├── assets/         # Constantes y assets
└── features/       # Módulos de feature
```

El editor y el runtime están completamente separados. El editor no contiene lógica del juego, y el runtime no contiene herramientas de edición.

## Licencia

Uso privado.
