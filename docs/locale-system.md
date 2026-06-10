# Locale / i18n System

## [0.39.0] - 2026-06-10

### Added

- **Translation dictionary**: `src/lib/i18n.ts` with 84 keys covering 14 UI sections, two locales (`en`/`es`), and `{{param}}` interpolation. Sections: editor shell, tool panel, tile labels, entity labels, level canvas, inspector, background picker, edit target inspector, entity properties, sample levels, game runtime UI, camera controls, grid cell a11y, and Phaser runtime scene.

- **Locale store**: `src/stores/localeStore.ts` — Zustand store exposing `locale` and `setLocale()`. Default: `"en"`.

- **`useT()` hook**: `src/hooks/useTranslate.ts` — React hook returning a `t(key, params?)` function. Reads from Zustand store reactively, looks up `translations[key]?.[locale]`, falls back to the raw key, replaces `{{var}}` placeholders.

- **`LangSetter` component**: `src/components/LangSetter.tsx` — client component that syncs `document.documentElement.lang` with the locale store. Mounted in root `layout.tsx`.

- **Phaser runtime i18n**: `RuntimeScene.ts` has a private `t(key, params?)` method backed by the same `translations` dictionary. Locale is captured once at init time (passed via `game.scene.start("runtime", { level, locale })`) and frozen for the session — the runtime does not reactively update on locale switch; user must stop and replay.

### Changed

- **Default locale**: changed from `"es"` to `"en"` in `localeStore.ts`. Page metadata (`layout.tsx`) updated to English. `<html lang>` defaults to `"en"`.
- `GameRuntime.tsx` reads locale from Zustand and passes it to the Phaser scene context and `scene.start()` data.
- `createRuntimeScene()` signature includes `locale` in `RuntimeSceneContext`.

### Fixed

- **Sample level translation keys**: 16 keys in `i18n.ts` used camelCase (`firstSteps`) but level IDs in `data/sampleLevels.ts` use kebab-case (`first-steps`). Changed to kebab-case so sample level names/descriptions translate correctly.
- **Spanish typo**: "estrella" → "estrecha" in the Underground level description.
- **Dead code**: removed `BACKGROUND_LABELS` from `types/level.ts` and `SPRITE_LABELS` from `assets/index.ts` (hardcoded Spanish strings not used anywhere).

## Architecture

### Two translation mechanisms

| Layer | Mechanism | Reactive |
|---|---|---|
| React components | `useT()` hook → Zustand subscription | Yes |
| Phaser runtime | Private `t()` method → locale captured at init | No |

### Adding a new locale

1. Add the locale string literal to `Locale` type in `src/lib/i18n.ts`.
2. Add `{ en: "...", es: "...", xx: "..." }` entries to every key in the translations dict.
3. Add the locale option to the locale toggle in `EditorShell.tsx`.

### Adding a new translation key

1. Add a `"section.keyName": { en: "...", es: "..." }` entry to `src/lib/i18n.ts`.
2. In React components: use `const t = useT()` then `t("section.keyName")`.
3. In Phaser runtime: use `this.t("section.keyName")` (no `useT()` available — Phaser is not a React component).

## Files

| File | Role |
|---|---|
| `src/lib/i18n.ts` | Translation dictionary (84 keys, en/es) |
| `src/stores/localeStore.ts` | Zustand store (default: en) |
| `src/hooks/useTranslate.ts` | React hook returning `t(key, params?)` |
| `src/components/LangSetter.tsx` | Syncs `<html lang>` attribute |
| `src/components/runtime/GameRuntime.tsx` | Bridges locale from Zustand to Phaser |
| `src/engine/runtime/RuntimeScene.ts` | Phaser scene with private `t()` method |
