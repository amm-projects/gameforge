# AGENTS.md

## Proyecto

GameForge (nombre provisional)

Editor visual de juegos de plataformas 2D desarrollado con Next.js.

Los usuarios pueden crear niveles colocando bloques, enemigos, monedas, decoraciones y objetos interactivos mediante una interfaz drag & drop, sin necesidad de programar.

El sistema debe permitir previsualizar y jugar el nivel directamente desde el navegador.

---

# Objetivo principal

Construir un creador de juegos de plataformas 2D similar a Mario Maker, pero completamente web.

El editor debe generar una estructura de datos serializable (JSON) que posteriormente será interpretada por el motor del juego.

La prioridad es la simplicidad, mantenibilidad y escalabilidad.

---

# Stack tecnológico

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Estado global

- Zustand

## Motor de juego

- Phaser 3

## Drag & Drop

- dnd-kit

## Validación

- Zod

## Base de datos futura

- PostgreSQL
- Prisma

---

# Reglas generales

## SIEMPRE

- Utilizar TypeScript estricto.
- Utilizar componentes funcionales.
- Mantener componentes pequeños.
- Separar lógica de presentación.
- Crear tipos reutilizables.
- Utilizar nombres descriptivos.
- Mantener el código simple.
- Priorizar claridad sobre optimización prematura.
- Seguir principios SOLID cuando sea razonable.

## NUNCA

- Usar JavaScript sin tipado.
- Usar `any` salvo justificación explícita.
- Duplicar lógica.
- Crear componentes gigantes.
- Mezclar lógica del editor con lógica del runtime.
- Introducir dependencias sin necesidad.
- Modificar arquitectura existente sin explicar el motivo.

---

# Filosofía de arquitectura

El proyecto se divide en dos mundos completamente separados.

## Editor

Permite construir niveles.

### Responsabilidades

- Dibujar tiles.
- Colocar entidades.
- Configurar propiedades.
- Guardar niveles.
- Cargar niveles.

El editor NO contiene lógica del juego.

---

## Runtime

Ejecuta niveles.

### Responsabilidades

- Física.
- Colisiones.
- Movimiento.
- IA de enemigos.
- Recolección de monedas.
- Condiciones de victoria.

El runtime NO contiene herramientas de edición.

---

# Estructura de carpetas

```text
src/
├── app/
├── components/
├── features/
├── engine/
│   ├── editor/
│   └── runtime/
├── store/
├── hooks/
├── lib/
├── types/
└── assets/
```

---

# Sistema de Tiles

Los tiles son la base del escenario.

Cada tile tiene:

- id
- nombre
- categoría
- sprite
- sólido (boolean)

Ejemplos:

- Ground
- Brick
- Platform
- Spike

Los tiles se colocan sobre una cuadrícula.

Tamaño inicial:

```text
32x32 px
```

---

# Sistema de Entidades

Las entidades son objetos con comportamiento.

Ejemplos:

- Player
- Coin
- Enemy
- Checkpoint
- Goal
- Door
- Key

Todas las entidades deben compartir una estructura base.

```ts
interface Entity {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  properties: Record<string, unknown>;
}
```

---

# Formato de nivel

Los niveles deben ser serializables a JSON.

El formato debe ser independiente de Phaser.

Nunca almacenar objetos Phaser dentro de los datos.

---

# Gestión del estado

Utilizar Zustand.

Separar stores por dominio:

- editorStore
- projectStore
- selectionStore
- runtimeStore

Evitar stores monolíticos.

---

# Rendimiento

- Evitar renderizados innecesarios.
- Utilizar memoización únicamente cuando exista una necesidad demostrable.
- Mantener el editor fluido con mapas grandes.
- Evitar cálculos pesados durante el render.

---

# Lighthouse

El proyecto debe mantener puntuación **100 en todas las categorías** de Lighthouse:

| Categoría | Objetivo |
|---|---|
| Rendimiento | 100 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 100 |

## Reglas

- Auditar con Lighthouse en **escritorio**, **tablet** y **móvil** antes de cada release.
- No introducir cambios que degraden ninguna puntuación por debajo de 100.
- Si una restricción técnica impide el 100, documentar la excepción en `/docs` con plan de mitigación.
- Priorizar etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<button>`) y roles ARIA donde aplique.
- Asegurar contraste de color suficiente en todos los temas.
- Proporcionar textos alternativos (`alt`, `aria-label`) en todos los elementos interactivos y decorativos.
- Usar tamaños de fuente relativos (`rem`/`em`) y media queries para adaptarse a tablet y móvil.
- Optimizar imágenes y assets para cada viewport.

---

# Seguridad (OWASP Top 10)

## A01:2021 – Broken Access Control

- No exponer rutas de API internas sin validación.
- Si se implementan roles (admin/editor/viewer), verificar permisos en cada operación.
- No confiar en datos del cliente para decidir autorización.

## A02:2021 – Cryptographic Failures

- No transmitir ni almacenar contraseñas sin cifrado (bcrypt/Argon2).
- Usar HTTPS en producción.
- No inventar algoritmos criptográficos propios.

## A03:2021 – Injection

- Validar y sanitizar todo JSON de nivel cargado por el usuario antes de parsearlo.
- Nunca usar `eval()`, `new Function()` ni templates peligrosas.
- Todo input del usuario (textareas, imports) debe pasar por validación estricta de tipos (Zod).

## A04:2021 – Insecure Design

- Modelar amenazas antes de implementar features críticas (autenticación, pagos, APIs).
- Establecer límites de tasa (rate limiting) en endpoints públicos futuros.
- No asumir que el cliente es confiable; validar siempre en el servidor.

## A05:2021 – Security Misconfiguration

- No exponer información sensible en el lado del cliente (claves, URLs internas).
- Mantener dependencias actualizadas.
- Deshabilitar características innecesarias de Phaser/Next.js en producción.

## A06:2021 – Vulnerable and Outdated Components

- Revisar dependencias periódicamente con `npm audit`.
- No introducir dependencias sin necesidad (ver reglas NUNCA).

## A07:2021 – Identification and Authentication Failures

- Si se implementa autenticación en el futuro, usar sesiones seguras (NextAuth).
- No almacenar tokens ni credenciales en Zustand o localStorage sin cifrado.

## A08:2021 – Software and Data Integrity Failures

- Validar que los assets (sprites, JSON) cargados no contengan código malicioso.
- Verificar integridad de niveles importados antes de cargarlos en el runtime.

## A09:2021 – Security Logging and Monitoring Failures

- No imprimir datos sensibles en `console.log` / `console.error`.
- Capturar errores de parseo JSON sin exponer el contenido completo.

## A10:2021 – Server-Side Request Forgery (SSRF)

- Si se implementan APIs de importación/exportación, validar y restringir URLs.
- No permitir fetch a destinos arbitrarios desde el servidor.

---

# UI

Diseño inspirado en herramientas profesionales.

Paneles principales:

- Explorador de assets
- Canvas central
- Inspector
- Toolbar superior

La interfaz debe estar optimizada para escritorio.

Mobile será una prioridad secundaria.

---

# Testing

## Stack de testing

| Tipo | Herramienta | Propósito |
|---|---|---|
| Unitario | Vitest | Lógica crítica, stores, utilidades, serialización |
| Integración | Testing Library | Componentes React, interacciones de usuario |
| E2E | Playwright | Flujos completos (editor, runtime, exportar/cargar) |

## Vitest (unitario)

- Los tests deben ubicarse junto al archivo que prueban con sufijo `.test.ts` o `.test.tsx`.
- Cubrir: stores de Zustand, serialización/deserialización de niveles, lógica de pintado, herramientas del editor.
- No mockear Phaser. Separar la lógica pura (tipos, transformaciones) para testearla sin Phaser.

```ts
// ejemplo: editorStore.test.ts
import { describe, it, expect } from 'vitest';
```

## Testing Library (integración)

- Tests en archivos `.test.tsx` junto al componente.
- Probar: renderizado de componentes, clics, drag & drop con dnd-kit simulado, selección de tiles/entidades, interacción con el canvas.
- Usar `@testing-library/react`, `@testing-library/user-event`.

```ts
// ejemplo: ToolPanel.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

## Playwright (E2E)

- Tests en `e2e/` con sufijo `.spec.ts`.
- Cubrir: carga de la página, pintar tiles en el canvas, colocar entidades, borrar, exportar JSON, cargar JSON, abrir runtime y ver el juego funcionando.
- Usar `@playwright/test`.

```ts
// ejemplo: e2e/editor.spec.ts
import { test, expect } from '@playwright/test';
```

## Comandos

```text
npm run test        → Vitest (unitario + integración)
npm run test:e2e    → Playwright
npm run test:run    → Vitest en modo CI (sin watch)
```

## Reglas

- Seguir metodología TDD (Test Driven Development):
  1. Escribir el test que falla primero.
  2. Implementar el código mínimo para que pase.
  3. Refactorizar manteniendo los tests verdes.
- No commitea código sin test si la funcionalidad es testeable.
- Mantener los tests rápidos (< 100ms por test unitario).
- No testear implementación interna de Phaser. Testear solo lógica de la aplicación.

## Verificación continua

- Después de cada feature: `npm run test:run && npm run build`
- Después de cambios en flujos críticos: agregar `npm run test:e2e`
- Al final: `npm run lint && npm run test:run && npm run build`

---

# Convenciones

## Componentes

PascalCase

```text
TilePalette.tsx
EntityInspector.tsx
LevelCanvas.tsx
```

## Hooks

```text
useEditorCamera.ts
useTileBrush.ts
```

## Stores

```text
editorStore.ts
projectStore.ts
```

## Tipos

Todos los tipos compartidos deben ubicarse en:

```text
src/types
```

---

# Sistema de Capas

El editor trabajará inicialmente con las siguientes capas:

```text
Layer 0 → Fondo
Layer 1 → Decoración
Layer 2 → Tiles sólidos
Layer 3 → Enemigos
Layer 4 → Objetos
Layer 5 → Jugador
```

Las capas deben ser independientes y editables.

---

# Sistema de Cámara

La cámara del editor debe soportar:

- Zoom
- Pan
- Centrado automático
- Ajuste al mapa

El estado de cámara debe estar separado del estado del nivel.

---

# Documentación obligatoria (MUY IMPORTANTE)

Cada acción relevante realizada por el asistente de IA debe ser documentada.

## Regla principal

- Todo cambio funcional, arquitectónico o de feature debe generar documentación.

## Carpeta de documentación

```text
/docs
```

## Formato de documentación

Los archivos deben ser Markdown (.md) y seguir la estructura definida en Keep a Changelog:
https://keepachangelog.com/en/1.0.0/

## Qué se debe documentar

El asistente debe documentar siempre:

- Nuevas features
- Cambios en arquitectura
- Nuevos sistemas
- Decisiones técnicas importantes
- Integraciones externas
- Cambios en el formato JSON de niveles
- Bugs relevantes y soluciones

---

# Versionado obligatorio

Cada vez que el asistente realice un cambio en el código:

## 1. Versionado en package.json

- Incrementar la versión siguiendo SemVer:
  - patch → bugfix
  - minor → nuevas features compatibles
  - major → cambios incompatibles

## 2. CHANGELOG.md obligatorio

Cada cambio debe reflejarse en:

```text
/CHANGELOG.md
```

Debe seguir estrictamente el formato de:

https://keepachangelog.com/en/1.0.0/

### Reglas del changelog

- Usar secciones:
  - Added
  - Changed
  - Fixed
  - Removed
  - Security
- Cada entrada debe ser clara y técnica
- Debe incluir fecha de cambio
- Debe ser actualizado en cada modificación relevante

---

# Decisiones importantes

Si existen varias soluciones posibles:

1. Elegir la más simple.
2. Elegir la más mantenible.
3. Elegir la más fácil de entender.
4. Documentar la decisión.

---

# Regla para asistentes IA

Antes de generar código:

1. Analizar la arquitectura existente.
2. Reutilizar componentes existentes.
3. Reutilizar tipos existentes.
4. No crear archivos duplicados.
5. Explicar brevemente decisiones importantes.
6. Mantener consistencia con este documento.

Si una petición contradice AGENTS.md:

- No implementar inmediatamente.
- Explicar primero el conflicto.
- Proponer alternativas compatibles.

---

# Alcance del MVP

La primera versión debe permitir:

- Crear un nivel.
- Dibujar tiles.
- Colocar jugador.
- Colocar enemigos.
- Colocar monedas.
- Guardar el nivel.
- Cargar el nivel.
- Probar el nivel en tiempo real.

Todo lo demás se considera funcionalidad futura.
```