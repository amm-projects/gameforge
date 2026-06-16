# 🎮 GameForge — Web-Based 2D Level Editor

Build, play, and share platformer levels directly in your browser.

GameForge is a **Mario Maker-inspired 2D level editor** that allows users to create complete platformer levels using a visual drag-and-drop interface—no coding required. Levels can be tested instantly using the integrated game engine.

---

## ✨ Features

### 🛠️ Visual Level Editor

* Drag & drop entities onto the canvas
* Paint tiles with click or brush tools
* Erase and edit existing objects
* Zoom and pan controls
* JSON import/export
* Responsive design (desktop, tablet, mobile)

### 🎮 Instant Playtesting

* Launch any level with a single click
* Real-time gameplay powered by Phaser 3
* No compilation or page reload required

### 🌍 Localization

* English 🇺🇸
* Spanish 🇪🇸

---

# 🚀 Technology Stack

| Category             | Technology                          |
| -------------------- | ----------------------------------- |
| Framework            | Next.js 16 (App Router)             |
| Frontend             | React 19 + TypeScript (Strict Mode) |
| Styling              | Tailwind CSS 4                      |
| State Management     | Zustand                             |
| Game Engine          | Phaser 3                            |
| Drag & Drop          | dnd-kit                             |
| Validation           | Zod                                 |
| Testing              | Vitest, Testing Library, Playwright |
| Internationalization | English / Spanish                   |

---

# 📋 Requirements

* Node.js 20+

---

# ⚡ Getting Started

```bash
npm install

# Start development server
npm run dev

# Production build
npm run build

# Unit tests
npm run test

# CI test run
npm run test:run

# End-to-end tests
npm run test:e2e

# Linting
npm run lint
```

Application runs at:

```text
http://localhost:3000
```

---

# 📊 Quality Metrics

## Testing Coverage

| Type               | Tool       | Count     |
| ------------------ | ---------- | --------- |
| Unit & Integration | Vitest     | 206 Tests |
| End-to-End         | Playwright | 12 Tests  |
| Static Analysis    | ESLint     | ✔         |

---

## Lighthouse Scores

| Category         | Score |
| ---------------- | ----- |
| ⚡ Performance    | 100   |
| ♿ Accessibility  | 100   |
| ✅ Best Practices | 100   |
| 🔍 SEO           | 100   |

---

# 📈 Project Statistics

| Metric                 | Value         |
| ---------------------- | ------------- |
| Version                | 0.58.1        |
| Codebase Size          | 10,000+ LOC   |
| Architecture Documents | 30+ ADRs      |
| Pixel-Art Sprites      | 11 SVG Assets |
| Music Tracks           | 5             |
| Sound Effects          | 9             |

---

# 🏗️ Architecture

GameForge is built around two completely independent systems:

## Editor Layer

Responsible for level creation:

* Tile painting
* Entity placement
* Property editing
* Level configuration
* Save/load operations

**No gameplay logic lives here.**

## Runtime Layer

Responsible for gameplay execution:

* Physics
* Collision detection
* Enemy AI
* Collectibles
* Doors & keys
* Lives system
* Audio playback

**No editing tools exist here.**

---

## Project Structure

```text
src/
├── app/                 # Next.js pages
├── components/
│   ├── editor/          # ToolPanel, LevelCanvas, InspectorPanel
│   └── runtime/         # GameRuntime, TouchControls
├── engine/
│   ├── editor/          # Painting actions, transformations
│   └── runtime/         # Phaser RuntimeScene
├── stores/              # Zustand stores
├── types/               # Schemas and shared types
├── lib/                 # Utilities, i18n, Phaser preload
├── assets/              # Sprites and constants
└── data/                # Example levels
```

---

# 🧱 Grid & Tile System

### World Size

* 64 × 64 tile grid
* 32 × 32 pixel cells

### Available Tiles

* Ground
* Brick
* Platform
* Spikes (4 directions)

### Advanced Features

* Configurable tile collision
* Horizontal moving platforms
* Vertical moving platforms
* Adjustable speed and travel range

---

# 👾 Entities

| Entity     | Behavior                                           |
| ---------- | -------------------------------------------------- |
| Player     | Move and jump using Arrow Keys or WASD             |
| Coin       | Collectible, 100 coins = extra life                |
| Walker     | Moves forward, bounces off walls, falls from edges |
| Patrol     | Patrols platforms and turns at edges               |
| Jumper     | Walks and jumps periodically                       |
| Goal       | Completes the level                                |
| Checkpoint | Saves respawn position                             |
| Door       | Requires a matching key                            |
| Key        | Unlocks doors                                      |
| 1UP        | Grants an extra life                               |

---

# 🎮 Runtime Features

### Physics & Gameplay

* Arcade physics
* Gravity system
* Collision handling
* Moving platforms

### Progression Systems

* 3-life system
* Checkpoint respawning
* Key & door puzzles
* HUD key counter

### Audio

* 5 procedural WAV music tracks
* Jump effects
* Coin pickup sounds
* Door interactions
* Checkpoint activation
* Extra-life sound effects

### Mobile Support

* Fullscreen immersive mode
* Touch controls overlay
* Automatic landscape orientation

### End States

* Victory screen
* Game Over screen
* Instant retry

---

# 🛠️ Editor Features

### Building Tools

* Tile painting
* Brush painting
* Entity placement
* Eraser tool
* Property editing

### Customization

* 6 background themes
* 5 music themes

### Workflow

* JSON import/export
* Example levels included
* Camera zoom & pan
* Responsive layout

---

# 📦 Level Format

Levels are stored as portable JSON and remain completely independent from Phaser.

```json
{
  "width": 64,
  "height": 64,
  "tiles": [
    {
      "x": 0,
      "y": 62,
      "type": "ground"
    }
  ],
  "entities": [
    {
      "id": "abc",
      "type": "player",
      "position": {
        "x": 3,
        "y": 55
      },
      "properties": {}
    }
  ],
  "background": "sky",
  "music": "adventure"
}
```

---

# 🎬 Demo Flow

1. Open the editor
2. Select a tile and paint the level
3. Drag entities onto the canvas
4. Configure doors and key puzzles
5. Choose a background and soundtrack
6. Press **Play**
7. Test the level instantly
8. Collect coins and avoid enemies
9. Reach the goal
10. Export or import the level JSON

---

# 📄 License

Free to use.
