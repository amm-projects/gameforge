# Seguridad OWASP Top 10

## [0.8.0] - 2026-06-04

### Added

- Implementada validación Zod para todo JSON de nivel cargado por el usuario (A03: Injection).
- Schema Zod para `LevelData`, `Tile` y `Entity` en `types/level.schema.ts`.
- `handleLoad` en InspectorPanel usa `safeParse()` en lugar de `JSON.parse` + casteo.
- Eliminado `console.error` con datos del input en errores de parseo (A09: Logging).
- Ejecutado `npm audit` (A06: Components).

### Security

- **A03**: validación estricta de tipos con Zod. Schema valida: `width`/`height` (enteros 1-256), `tiles` (x, y enteros ≥ 0), `entities` (id string, type enum).
- **A09**: errores de parseo silenciados con `catch { return }`, sin exponer datos al log.
- **A06**: 2 vulnerabilidades moderadas en `postcss` (transitiva de Next.js), no corregibles sin breaking change.

### Pending (future)

- **A01**: Control de acceso — con APIs.
- **A02**: Cifrado — con autenticación.
- **A04**: Rate limiting — con endpoints públicos.
- **A05**: Seguridad de configuración — al hacer deploy.
- **A07**: Autenticación con NextAuth — con usuarios.
- **A10**: SSRF — con APIs de importación/exportación.
