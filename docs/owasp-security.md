# OWASP Top 10 Security

## [0.8.0] - 2026-06-04

### Added

- Implemented Zod validation for all level JSON loaded by the user (A03: Injection).
- Zod schema for `LevelData`, `Tile` and `Entity` in `types/level.schema.ts`.
- `handleLoad` in InspectorPanel uses `safeParse()` instead of `JSON.parse` + casting.
- Removed `console.error` with input data on parse errors (A09: Logging).
- Ran `npm audit` (A06: Components).

### Security

- **A03**: strict type validation with Zod. Schema validates: `width`/`height` (integers 1-256), `tiles` (x, y integers ≥ 0), `entities` (id string, type enum).
- **A09**: parse errors silenced with `catch { return }`, no data exposed to logs.
- **A06**: 2 moderate vulnerabilities in `postcss` (transitive from Next.js), not fixable without breaking change.

### Pending (future)

- **A01**: Access control — with APIs.
- **A02**: Encryption — with authentication.
- **A04**: Rate limiting — with public endpoints.
- **A05**: Configuration security — on deploy.
- **A07**: Authentication with NextAuth — with users.
- **A10**: SSRF — with import/export APIs.
