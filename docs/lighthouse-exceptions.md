# Lighthouse Exceptions

> Mandatory documentation per AGENTS.md: if a technical constraint prevents scoring 100, document the exception with a mitigation plan.

## [0.29.0] - 2026-06-09

### Added

- Current Lighthouse results documented.

### Performance

| Category | Desktop | Tablet | Mobile |
|---|---|---|---|
| Performance | 100 | — | 56 |
| Accessibility | 100 | — | 100 |
| Best Practices | 100 | — | 100 |
| SEO | 100 | — | 100 |

### Exceptions

- **Desktop (100/100)**: no exceptions. Achieves 100 after lazy loading, virtual rendering and HTTP compression.
- **Mobile (56/100)**: TBT 1082ms, CLS 0 (fixed). Secondary priority per AGENTS.md.
- **Tablet**: not run (Lighthouse CLI error EPERM on Windows).

### Mitigation plan (mobile)

1. ⬜ `React.lazy` + Suspense for ToolPanel and InspectorPanel.
2. ⬜ Explicit dimensions on canvas container.
3. ⬜ Reduce initial bundle.
4. ⬜ Server component streaming.

## [0.28.0] - 2026-06-09

### Changed

- Desktop improved from 92 → 100/100/100/100.

## [0.9.1-dev] - 2026-06-04

### Added

- First Lighthouse reports: desktop 100/100/100/100, tablet 0/100/100/100, mobile 56/100/100/100.
