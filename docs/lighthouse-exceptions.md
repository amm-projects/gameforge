# Excepciones Lighthouse

> Documentación obligatoria según AGENTS.md: si una restricción técnica impide el 100, documentar la excepción con plan de mitigación.

## Resultados actuales

| Categoría | Escritorio | Tablet | Móvil |
|---|---|---|---|
| Rendimiento | 100 | 0 (error de ejecución) | 56 |
| Accesibilidad | 100 | 100 | 100 |
| Buenas prácticas | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |

## Excepciones

### Rendimiento en móvil (56/100)

**Causa:** El servidor de desarrollo (`next dev`) no aplica optimizaciones de producción:
- Sin minificación ni tree-shaking.
- Sin code splitting avanzado.
- JavaScript de desarrollo (source maps, React DevTools, hot reloading).
- Sin compresión HTTP (gzip/brotli).
- Sin optimización de imágenes.
- Sin long-term caching.

**Plan de mitigación:**
1. Auditar siempre en producción: `npm run build && npm start` antes de cada release.
2. Habilitar compresión en Next.js o en el reverse proxy.
3. Optimizar imágenes en `public/` con `next/image`.
4. Implementar lazy loading en componentes pesados (Phaser runtime).
5. Verificar con Lighthouse CI en pipelines.

**Estado:** Pendiente de verificación en producción.

### Rendimiento en tablet (0/100)

**Causa:** Error de ejecución de Lighthouse en el formfactor tablet (probable timeout o interrupción). No es una puntuación real.

**Plan de mitigación:**
1. Re-ejecutar auditoría tablet en producción.
2. Si persiste, verificar manualmente con DevTools de Edge en modo tablet.

**Estado:** Pendiente de re-ejecución.

## Notas adicionales

- Lighthouse CLI tiene un error conocido en Windows (EPERM) al limpiar directorios temporales. Esto no afecta los resultados de la auditoría.
- La auditoría se realizó con Microsoft Edge (Chromium v148) y Lighthouse v13.3.0.

## Historial

| Fecha | Versión | Escritorio | Tablet | Móvil |
|---|---|---|---|---|
| 2026-06-04 | 0.9.1-dev | 100/100/100/100 | 0/100/100/100 | 56/100/100/100 |
