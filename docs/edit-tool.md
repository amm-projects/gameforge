# Edit Tool

## [0.22.0] - 2026-06-08

### Added

- **Edit** tool in the tool panel (next to the Erase button).
- Allows inspecting and modifying properties of tiles and entities in the level.
- When activated, the button highlights in amber.

### Changed

- Clicking a tile or entity with the Edit tool active highlights the element with an amber border.
- The Inspector panel shows the selected element's properties.

### Properties

- **Name**: element name (read-only). E.g. "Ground", "Player", "Door"
- **Position**: grid coordinates (x, y) (read-only)
- **Collision**: enable/disable physical collision for the element

### Technical details

- When a tile's collision is disabled, it becomes decorative.
- For entities, the property is saved but runtime behavior depends on the type.
- Switching to another tool (Erase, tile, entity) deactivates Edit mode.
