# Seguridad OWASP Top 10

## Fecha
2026-06-04

## Cambios aplicados

### A03:2021 – Injection

Se implementó validación estricta de tipos con Zod para todo JSON de nivel cargado por el usuario.

**Archivos:**
- `types/level.schema.ts` — Schema Zod para `LevelData`, `Tile` y `Entity`
- `components/editor/InspectorPanel.tsx` — `handleLoad` usa `safeParse()` en lugar de `JSON.parse` + casteo

El schema valida:
- `width`/`height`: enteros entre 1 y 256
- `tiles`: array con `x`, `y` (enteros ≥ 0) y `type` (`"ground"` | `"spike"`)
- `entities`: array con `id` (string), `type` (`"player"` | `"coin"` | `"enemy"` | `"goal"`), `x`, `y` (enteros ≥ 0)

### A09:2021 – Security Logging and Monitoring Failures

Se eliminó `console.error("Error al cargar JSON:", error)` de `handleLoad`. Ahora los errores de parseo se silencian (`catch { return }`), sin exponer datos del input al log.

### A06:2021 – Vulnerable and Outdated Components

Ejecutado `npm audit`. Se detectaron 2 vulnerabilidades moderadas en `postcss` (dependencia transitiva de Next.js). No se puede corregir sin breaking change en Next.js.

## Pendiente para futuro

- **A01**: Control de acceso — cuando se implementen APIs
- **A02**: Cifrado — cuando se implemente autenticación
- **A04**: Rate limiting — cuando se implementen endpoints públicos
- **A05**: Seguridad de configuración — al hacer deploy
- **A07**: Autenticación con NextAuth — cuando se implementen usuarios
- **A10**: SSRF — cuando se implementen APIs de importación/exportación
