# Excepciones Lighthouse

> Documentación obligatoria según AGENTS.md: si una restricción técnica impide el 100, documentar la excepción con plan de mitigación.

## [0.29.0] - 2026-06-09

### Added

- Resultados actuales de Lighthouse documentados.

### Performance

| Categoría | Escritorio | Tablet | Móvil |
|---|---|---|---|
| Rendimiento | 100 | — | 56 |
| Accesibilidad | 100 | — | 100 |
| Buenas prácticas | 100 | — | 100 |
| SEO | 100 | — | 100 |

### Exceptions

- **Escritorio (100/100)**: sin excepciones. Alcanza 100 tras lazy loading, virtual rendering y compresión HTTP.
- **Móvil (56/100)**: TBT 1082ms, CLS 0 (corregido). Prioridad secundaria según AGENTS.md.
- **Tablet**: no ejecutada (Lighthouse CLI error EPERM en Windows).

### Mitigation plan (mobile)

1. ⬜ `React.lazy` + Suspense para ToolPanel e InspectorPanel.
2. ⬜ Dimensiones explícitas en contenedor del canvas.
3. ⬜ Reducir bundle inicial.
4. ⬜ Streaming de server components.

## [0.28.0] - 2026-06-09

### Changed

- Escritorio mejorado de 92 → 100/100/100/100.

## [0.9.1-dev] - 2026-06-04

### Added

- Primeros reportes Lighthouse: escritorio 100/100/100/100, tablet 0/100/100/100, móvil 56/100/100/100.
