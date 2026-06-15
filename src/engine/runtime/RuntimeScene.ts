import type Phaser from "phaser";
import type { LevelData, Tile, Entity, BackgroundTheme, MusicTheme } from "@/types/level";
import { BACKGROUND_COLORS } from "@/types/level";
import { translations } from "@/lib/i18n";


const TILE_SIZE = 32;

type Locale = "en" | "es";

type ArcadePhysicsObject =
  | Phaser.Physics.Arcade.Body
  | Phaser.Physics.Arcade.StaticBody
  | Phaser.Types.Physics.Arcade.GameObjectWithBody
  | Phaser.Tilemaps.Tile;

export interface RuntimeSceneContext {
  onStop: () => void;
  setShowHitboxes: (visible: boolean) => void;
  locale: Locale;
}

export interface ToggleDebugRef {
  current: (() => void) | null;
}

export function createRuntimeScene(PhaserLib: typeof Phaser, ctx: RuntimeSceneContext, toggleDebugRef: ToggleDebugRef) {
  return class RuntimeScene extends PhaserLib.Scene {
    declare level: LevelData;
    declare locale: Locale;
    declare cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    declare player?: Phaser.Physics.Arcade.Sprite;
    declare statusText?: Phaser.GameObjects.Text;
    declare enemies: Phaser.Physics.Arcade.Sprite[];
    declare movingPlatforms: { sprite: Phaser.Physics.Arcade.Sprite; startX: number; startY: number; axis: "vertical" | "horizontal"; speed: number; range: number; direction: number }[];
    declare worldHeight: number;
    declare soundJump: Phaser.Sound.BaseSound;
    declare soundCoin: Phaser.Sound.BaseSound;
    declare soundHit: Phaser.Sound.BaseSound;
    declare soundGoal: Phaser.Sound.BaseSound;
    declare soundKey: Phaser.Sound.BaseSound;
    declare soundDoor: Phaser.Sound.BaseSound;
    declare soundLocked: Phaser.Sound.BaseSound;
    declare sound1up: Phaser.Sound.BaseSound;
    declare soundCheckpoint: Phaser.Sound.BaseSound;
    declare coinCount: number;
    declare coinText: Phaser.GameObjects.Text;
    declare coinIcon: Phaser.GameObjects.Image;
    declare keys: number;
    declare keyIcon: Phaser.GameObjects.Image;
    declare keyText: Phaser.GameObjects.Text;
    declare lives: number;
    declare livesIcon: Phaser.GameObjects.Image;
    declare livesText: Phaser.GameObjects.Text;
    declare spawnX: number;
    declare spawnY: number;
    declare gameOver: boolean;
    declare ridingPlatform: Phaser.Physics.Arcade.Sprite | null;
    declare musicSource: Phaser.Sound.BaseSound | null;
    declare reachedCheckpoints: Set<string>;

    constructor() {
      super({ key: "runtime" });
    }

    private t(key: string, params?: Record<string, string | number>): string {
      let text = translations[key]?.[this.locale];
      if (text === undefined) return key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{{${k}}}`, String(v));
        }
      }
      return text;
    }

    init(data: { level: LevelData; locale: Locale }) {
      this.level = data.level;
      this.locale = data.locale;
    }

    preload() {
      this.load.audio("sfx-jump", "/sounds/jump.wav");
      this.load.audio("sfx-coin", "/sounds/coin.wav");
      this.load.audio("sfx-hit", "/sounds/hit.wav");
      this.load.audio("sfx-goal", "/sounds/goal.wav");
      this.load.audio("sfx-key", "/sounds/key.wav");
      this.load.audio("sfx-door", "/sounds/door.wav");
      this.load.audio("sfx-locked", "/sounds/locked.wav");
      this.load.audio("sfx-1up", "/sounds/1up.wav");
      this.load.audio("sfx-checkpoint", "/sounds/checkpoint.wav");
      this.load.audio("music-calm", "/sounds/music/calm.wav");
      this.load.audio("music-adventure", "/sounds/music/adventure.wav");
      this.load.audio("music-retro", "/sounds/music/retro.wav");
      this.load.audio("music-mystery", "/sounds/music/mystery.wav");
      this.load.audio("music-boss", "/sounds/music/boss.wav");
    }

    private createRuntimeTextures() {
      this.createTexture("runtime-ground", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x7C5A3D);
        g.fillRect(0, 0, 32, 32);
        g.fillStyle(0x5E3F27);
        g.fillRect(0, 4, 32, 4);
        g.fillRect(0, 12, 32, 4);
        g.fillRect(0, 20, 32, 4);
        g.fillRect(0, 28, 32, 4);
        g.fillStyle(0x3A2313);
        g.fillRect(0, 8, 32, 4);
        g.fillRect(0, 24, 32, 4);
        g.fillRect(4, 4, 4, 4);
        g.fillRect(24, 12, 4, 4);
        g.fillRect(8, 28, 4, 4);
        g.fillRect(20, 20, 4, 4);
        g.fillRect(12, 16, 4, 4);
        g.fillRect(0, 0, 4, 4);
      });

      this.createTexture("runtime-spike", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x6B7280);
        g.fillRect(0, 24, 32, 8);
        g.fillStyle(0x4B5563);
        g.fillRect(0, 24, 16, 4);
        g.fillRect(16, 28, 16, 4);
        g.fillStyle(0x374151);
        g.fillRect(4, 28, 8, 4);
        g.fillRect(0, 20, 32, 4);
        g.fillStyle(0x9CA3AF);
        g.fillRect(12, 0, 8, 4);
        g.fillRect(8, 4, 16, 4);
        g.fillRect(4, 8, 24, 4);
        g.fillRect(0, 12, 32, 8);
        g.fillStyle(0x6B7280);
        g.fillRect(16, 0, 4, 4);
        g.fillRect(16, 4, 8, 4);
        g.fillRect(16, 8, 12, 4);
        g.fillRect(16, 12, 16, 8);
      });

      if (!this.textures.exists("runtime-player")) {
        const g = this.add.graphics();
        g.fillStyle(0xE53935);
        g.fillRect(8, 0, 16, 4);
        g.fillRect(4, 4, 24, 8);
        g.fillStyle(0x1565C0);
        g.fillRect(0, 12, 4, 8);
        g.fillRect(28, 12, 4, 8);
        g.fillStyle(0xFFCC80);
        g.fillRect(8, 12, 16, 8);
        g.fillStyle(0xFFFFFF);
        g.fillRect(8, 12, 4, 4);
        g.fillRect(20, 12, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(8, 16, 4, 4);
        g.fillRect(20, 16, 4, 4);
        g.fillStyle(0x5D4037);
        g.fillRect(12, 16, 8, 4);
        g.fillStyle(0x1565C0);
        g.fillRect(4, 20, 24, 4);
        g.fillRect(0, 24, 8, 4);
        g.fillRect(8, 24, 16, 4);
        g.fillStyle(0x1E88E5);
        g.fillRect(24, 24, 8, 4);
        g.fillStyle(0x0D47A1);
        g.fillRect(28, 28, 4, 4);
        g.fillStyle(0xFDD835);
        g.fillRect(8, 28, 16, 4);
        g.fillStyle(0xF9A825);
        g.fillRect(12, 28, 8, 4);
        g.fillStyle(0x6D4C41);
        g.fillRect(4, 28, 8, 4);
        g.fillRect(20, 28, 8, 4);
        const dy = -4;
        const fx = 32;
        g.fillStyle(0xE53935);
        g.fillRect(fx + 8, dy + 0, 16, 4);
        g.fillRect(fx + 4, dy + 4, 24, 8);
        g.fillStyle(0x1565C0);
        g.fillRect(fx + 0, dy + 12, 4, 8);
        g.fillRect(fx + 28, dy + 12, 4, 8);
        g.fillStyle(0xFFCC80);
        g.fillRect(fx + 8, dy + 12, 16, 8);
        g.fillStyle(0xFFFFFF);
        g.fillRect(fx + 8, dy + 12, 4, 4);
        g.fillRect(fx + 20, dy + 12, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(fx + 8, dy + 16, 4, 4);
        g.fillRect(fx + 20, dy + 16, 4, 4);
        g.fillStyle(0x5D4037);
        g.fillRect(fx + 12, dy + 16, 8, 4);
        g.fillStyle(0x1565C0);
        g.fillRect(fx + 4, dy + 20, 24, 4);
        g.fillRect(fx + 0, dy + 24, 8, 4);
        g.fillRect(fx + 8, dy + 24, 16, 4);
        g.fillStyle(0x1E88E5);
        g.fillRect(fx + 24, dy + 24, 8, 4);
        g.fillStyle(0x0D47A1);
        g.fillRect(fx + 28, dy + 28, 4, 4);
        g.fillStyle(0xFDD835);
        g.fillRect(fx + 8, dy + 28, 16, 4);
        g.fillStyle(0xF9A825);
        g.fillRect(fx + 12, dy + 28, 8, 4);
        g.fillStyle(0x6D4C41);
        g.fillRect(fx + 4, dy + 28, 8, 4);
        g.fillRect(fx + 20, dy + 28, 8, 4);
        g.generateTexture("runtime-player", 64, 32);
        g.destroy();
        const tex = this.textures.get("runtime-player");
        tex.add("0", 0, 0, 0, 32, 32);
        tex.add("1", 0, 32, 0, 32, 32);
      }

      this.createTexture("runtime-coin", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xD97706);
        g.fillRect(12, 4, 8, 4);
        g.fillRect(8, 8, 16, 4);
        g.fillRect(4, 12, 24, 8);
        g.fillRect(8, 20, 16, 4);
        g.fillRect(12, 24, 8, 4);
        g.fillStyle(0xFBBF24);
        g.fillRect(12, 8, 8, 4);
        g.fillRect(8, 12, 16, 8);
        g.fillRect(12, 20, 8, 4);
        g.fillStyle(0xFEF08A);
        g.fillRect(12, 12, 8, 8);
      });

      if (!this.textures.exists("runtime-patrol")) {
        const g = this.add.graphics();
        g.fillStyle(0x0EA5E9);
        g.fillRect(8, 0, 16, 4);
        g.fillStyle(0x0284C7);
        g.fillRect(4, 0, 4, 20);
        g.fillRect(24, 0, 4, 20);
        g.fillStyle(0x0EA5E9);
        g.fillRect(4, 4, 24, 16);
        g.fillStyle(0x0284C7);
        g.fillRect(4, 20, 24, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(8, 8, 4, 4);
        g.fillRect(20, 8, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(8, 12, 4, 4);
        g.fillRect(20, 12, 4, 4);
        g.fillStyle(0x7DD3FC);
        g.fillRect(12, 16, 8, 4);
        g.fillStyle(0x0284C7);
        g.fillRect(0, 24, 8, 8);
        g.fillRect(24, 24, 8, 8);
        g.fillStyle(0x0369A1);
        g.fillRect(0, 28, 8, 4);
        g.fillRect(24, 28, 8, 4);
        g.fillStyle(0x38BDF8);
        g.fillRect(12, 4, 8, 4);
        const dy = -4;
        const fx = 32;
        g.fillStyle(0x0EA5E9);
        g.fillRect(fx + 8, dy + 0, 16, 4);
        g.fillStyle(0x0284C7);
        g.fillRect(fx + 4, dy + 0, 4, 20);
        g.fillRect(fx + 24, dy + 0, 4, 20);
        g.fillStyle(0x0EA5E9);
        g.fillRect(fx + 4, dy + 4, 24, 16);
        g.fillStyle(0x0284C7);
        g.fillRect(fx + 4, dy + 20, 24, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(fx + 8, dy + 8, 4, 4);
        g.fillRect(fx + 20, dy + 8, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(fx + 8, dy + 12, 4, 4);
        g.fillRect(fx + 20, dy + 12, 4, 4);
        g.fillStyle(0x7DD3FC);
        g.fillRect(fx + 12, dy + 16, 8, 4);
        g.fillStyle(0x0284C7);
        g.fillRect(fx + 0, dy + 24, 8, 8);
        g.fillRect(fx + 24, dy + 24, 8, 8);
        g.fillStyle(0x0369A1);
        g.fillRect(fx + 0, dy + 28, 8, 4);
        g.fillRect(fx + 24, dy + 28, 8, 4);
        g.fillStyle(0x38BDF8);
        g.fillRect(fx + 12, dy + 4, 8, 4);
        g.generateTexture("runtime-patrol", 64, 32);
        g.destroy();
        const tex = this.textures.get("runtime-patrol");
        tex.add("0", 0, 0, 0, 32, 32);
        tex.add("1", 0, 32, 0, 32, 32);
      }

      if (!this.textures.exists("runtime-jumper")) {
        const g = this.add.graphics();
        g.fillStyle(0x9333EA);
        g.fillRect(8, 0, 16, 4);
        g.fillStyle(0xA855F7);
        g.fillRect(4, 4, 24, 16);
        g.fillStyle(0x7E22CE);
        g.fillRect(12, 0, 8, 4);
        g.fillRect(4, 20, 24, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(8, 8, 4, 4);
        g.fillRect(20, 8, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(8, 12, 4, 4);
        g.fillRect(20, 12, 4, 4);
        g.fillStyle(0xD8B4FE);
        g.fillRect(12, 16, 8, 4);
        g.fillStyle(0xA855F7);
        g.fillRect(4, 24, 8, 8);
        g.fillRect(20, 24, 8, 8);
        g.fillStyle(0x7E22CE);
        g.fillRect(4, 28, 8, 4);
        g.fillRect(20, 28, 8, 4);
        const dy = -4;
        const fx = 32;
        g.fillStyle(0x9333EA);
        g.fillRect(fx + 8, dy + 0, 16, 4);
        g.fillStyle(0xA855F7);
        g.fillRect(fx + 4, dy + 4, 24, 16);
        g.fillStyle(0x7E22CE);
        g.fillRect(fx + 12, dy + 0, 8, 4);
        g.fillRect(fx + 4, dy + 20, 24, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(fx + 8, dy + 8, 4, 4);
        g.fillRect(fx + 20, dy + 8, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(fx + 8, dy + 12, 4, 4);
        g.fillRect(fx + 20, dy + 12, 4, 4);
        g.fillStyle(0xD8B4FE);
        g.fillRect(fx + 12, dy + 16, 8, 4);
        g.fillStyle(0xA855F7);
        g.fillRect(fx + 4, dy + 24, 8, 8);
        g.fillRect(fx + 20, dy + 24, 8, 8);
        g.fillStyle(0x7E22CE);
        g.fillRect(fx + 4, dy + 28, 8, 4);
        g.fillRect(fx + 20, dy + 28, 8, 4);
        g.generateTexture("runtime-jumper", 64, 32);
        g.destroy();
        const tex = this.textures.get("runtime-jumper");
        tex.add("0", 0, 0, 0, 32, 32);
        tex.add("1", 0, 32, 0, 32, 32);
      }

      if (!this.textures.exists("runtime-walker")) {
        const g = this.add.graphics();
        g.fillStyle(0xEA580C);
        g.fillRect(8, 0, 16, 4);
        g.fillRect(4, 4, 24, 20);
        g.fillStyle(0xC2410C);
        g.fillRect(12, 0, 8, 4);
        g.fillRect(4, 20, 24, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(8, 8, 4, 4);
        g.fillRect(20, 8, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(8, 12, 4, 4);
        g.fillRect(20, 12, 4, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(12, 16, 8, 4);
        g.fillStyle(0xC2410C);
        g.fillRect(0, 24, 8, 8);
        g.fillRect(24, 24, 8, 8);
        g.fillStyle(0x9A3412);
        g.fillRect(0, 28, 8, 4);
        g.fillRect(24, 28, 8, 4);
        const dy = -4;
        const fx = 32;
        g.fillStyle(0xEA580C);
        g.fillRect(fx + 8, dy + 0, 16, 4);
        g.fillRect(fx + 4, dy + 4, 24, 20);
        g.fillStyle(0xC2410C);
        g.fillRect(fx + 12, dy + 0, 8, 4);
        g.fillRect(fx + 4, dy + 20, 24, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(fx + 8, dy + 8, 4, 4);
        g.fillRect(fx + 20, dy + 8, 4, 4);
        g.fillStyle(0x000000);
        g.fillRect(fx + 8, dy + 12, 4, 4);
        g.fillRect(fx + 20, dy + 12, 4, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(fx + 12, dy + 16, 8, 4);
        g.fillStyle(0xC2410C);
        g.fillRect(fx + 0, dy + 24, 8, 8);
        g.fillRect(fx + 24, dy + 24, 8, 8);
        g.fillStyle(0x9A3412);
        g.fillRect(fx + 0, dy + 28, 8, 4);
        g.fillRect(fx + 24, dy + 28, 8, 4);
        g.generateTexture("runtime-walker", 64, 32);
        g.destroy();
        const tex = this.textures.get("runtime-walker");
        tex.add("0", 0, 0, 0, 32, 32);
        tex.add("1", 0, 32, 0, 32, 32);
      }

      this.createTexture("runtime-goal", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x15803D);
        g.fillRect(4, 0, 4, 32);
        g.fillStyle(0x16A34A);
        g.fillRect(4, 0, 4, 4);
        g.fillStyle(0x22C55E);
        g.fillRect(8, 0, 20, 4);
        g.fillRect(8, 8, 20, 4);
        g.fillRect(8, 16, 20, 4);
        g.fillStyle(0x16A34A);
        g.fillRect(8, 4, 16, 4);
        g.fillRect(8, 12, 16, 4);
        g.fillRect(8, 20, 12, 4);
        g.fillStyle(0x4ADE80);
        g.fillRect(8, 0, 4, 4);
        g.fillRect(20, 4, 4, 4);
        g.fillRect(8, 8, 4, 4);
        g.fillRect(20, 12, 4, 4);
        g.fillRect(8, 16, 4, 4);
        g.fillStyle(0x15803D);
        g.fillRect(0, 24, 4, 8);
      });

      this.createTexture("runtime-brick", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x4A1A08);
        g.fillRect(0, 0, 32, 32);
        g.fillStyle(0xB85C2A);
        g.fillRect(0, 0, 12, 8);
        g.fillRect(16, 0, 12, 8);
        g.fillRect(4, 12, 12, 8);
        g.fillRect(20, 12, 12, 8);
        g.fillRect(0, 24, 12, 8);
        g.fillRect(16, 24, 12, 8);
        g.fillStyle(0x8E4019);
        g.fillRect(8, 0, 4, 8);
        g.fillRect(24, 0, 4, 8);
        g.fillRect(12, 12, 4, 8);
        g.fillRect(28, 12, 4, 8);
        g.fillRect(8, 24, 4, 8);
        g.fillRect(24, 24, 4, 8);
        g.fillRect(0, 4, 12, 4);
        g.fillRect(16, 4, 12, 4);
        g.fillRect(4, 16, 12, 4);
        g.fillRect(20, 16, 12, 4);
        g.fillRect(0, 28, 12, 4);
        g.fillRect(16, 28, 12, 4);
        g.fillStyle(0x4A1A08);
        g.fillRect(8, 4, 4, 4);
        g.fillRect(24, 4, 4, 4);
        g.fillRect(12, 16, 4, 4);
        g.fillRect(28, 16, 4, 4);
        g.fillRect(8, 28, 4, 4);
        g.fillRect(24, 28, 4, 4);
      });

      this.createTexture("runtime-platform", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xDC2626);
        g.fillRect(0, 0, 32, 32);
        g.fillStyle(0xEF4444);
        g.fillRect(0, 0, 32, 4);
        g.fillStyle(0xB91C1C);
        g.fillRect(0, 28, 32, 4);
        g.fillRect(4, 8, 4, 16);
        g.fillRect(14, 4, 4, 24);
        g.fillRect(24, 8, 4, 16);
        g.fillStyle(0xEF4444);
        g.fillRect(4, 12, 4, 8);
        g.fillRect(14, 8, 4, 12);
        g.fillRect(24, 12, 4, 8);
        g.fillStyle(0xB91C1C);
        g.fillRect(0, 8, 4, 4);
        g.fillRect(28, 8, 4, 4);
      });

      this.createTexture("runtime-checkpoint", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xB45309);
        g.fillRect(8, 0, 4, 32);
        g.fillStyle(0xD97706);
        g.fillRect(8, 0, 4, 4);
        g.fillStyle(0xFBBF24);
        g.fillRect(12, 0, 16, 4);
        g.fillRect(12, 8, 12, 4);
        g.fillRect(12, 16, 4, 4);
        g.fillStyle(0xF59E0B);
        g.fillRect(12, 4, 16, 4);
        g.fillRect(12, 12, 8, 4);
        g.fillStyle(0xFEF08A);
        g.fillRect(12, 0, 4, 4);
        g.fillRect(24, 4, 4, 4);
        g.fillStyle(0x92400E);
        g.fillRect(4, 8, 4, 8);
        g.fillRect(4, 20, 4, 8);
      });

      this.createTexture("runtime-door", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x7C2D12);
        g.fillRect(0, 0, 32, 32);
        g.fillStyle(0x92400E);
        g.fillRect(4, 4, 24, 24);
        g.fillStyle(0x451A03);
        g.fillRect(8, 8, 8, 8);
        g.fillRect(16, 8, 8, 8);
        g.fillRect(8, 20, 8, 8);
        g.fillRect(16, 20, 8, 8);
        g.fillStyle(0xFBBF24);
        g.fillRect(20, 16, 4, 4);
        g.fillStyle(0x5C1A06);
        g.fillRect(0, 0, 4, 4);
        g.fillRect(28, 0, 4, 4);
        g.fillRect(0, 28, 4, 4);
        g.fillRect(28, 28, 4, 4);
      });

      this.createTexture("runtime-key", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xD97706);
        g.fillRect(8, 0, 16, 4);
        g.fillRect(8, 4, 4, 8);
        g.fillRect(20, 4, 4, 8);
        g.fillRect(8, 12, 16, 4);
        g.fillStyle(0xFBBF24);
        g.fillRect(12, 4, 8, 8);
        g.fillRect(12, 16, 8, 8);
        g.fillStyle(0xD97706);
        g.fillRect(20, 20, 4, 4);
        g.fillRect(24, 24, 4, 4);
        g.fillStyle(0xFEF08A);
        g.fillRect(8, 0, 4, 4);
        g.fillRect(12, 16, 4, 4);
      });

      this.createTexture("runtime-1up", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xE53935);
        g.fillRect(10, 8, 4, 4);
        g.fillRect(18, 8, 4, 4);
        g.fillRect(6, 12, 20, 4);
        g.fillStyle(0xFFCC80);
        g.fillRect(8, 16, 16, 4);
        g.fillStyle(0xFFFFFF);
        g.fillRect(10, 16, 4, 2);
        g.fillRect(18, 16, 4, 2);
        g.fillStyle(0x000000);
        g.fillRect(10, 18, 4, 2);
        g.fillRect(18, 18, 4, 2);
        g.fillStyle(0x1565C0);
        g.fillRect(6, 20, 20, 4);
        g.fillRect(8, 24, 16, 4);
        g.fillStyle(0xFDD835);
        g.fillRect(10, 28, 4, 4);
        g.fillRect(18, 28, 4, 4);
        g.fillStyle(0xEF5350);
        g.fillRect(10, 8, 4, 1);
        g.fillRect(18, 8, 4, 1);
        g.fillRect(6, 12, 4, 1);
        g.fillStyle(0x1E88E5);
        g.fillRect(6, 20, 2, 4);
      });
    }

    private createAnimations() {
      this.anims.create({
        key: "player-idle",
        frames: this.anims.generateFrameNumbers("runtime-player", { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1,
      });
      this.anims.create({
        key: "walker-walk",
        frames: [
          { key: "runtime-walker", frame: "0" },
          { key: "runtime-walker", frame: "1" },
        ],
        frameRate: 3,
        repeat: -1,
      });
      this.anims.create({
        key: "patrol-walk",
        frames: [
          { key: "runtime-patrol", frame: "0" },
          { key: "runtime-patrol", frame: "1" },
        ],
        frameRate: 3,
        repeat: -1,
      });
      this.anims.create({
        key: "jumper-walk",
        frames: [
          { key: "runtime-jumper", frame: "0" },
          { key: "runtime-jumper", frame: "1" },
        ],
        frameRate: 3,
        repeat: -1,
      });
    }

    private createTexture(
      key: string,
      width: number,
      height: number,
      draw: (g: Phaser.GameObjects.Graphics) => void
    ) {
      if (this.textures.exists(key)) return;
      const g = this.add.graphics();
      draw(g);
      g.generateTexture(key, width, height);
      g.destroy();
    }

    create() {
      const { width, height, tiles, entities } = this.level;
      const worldWidth = width * TILE_SIZE;
      const worldHeight = height * TILE_SIZE;
      this.worldHeight = worldHeight;

      this.createRuntimeTextures();
      this.createAnimations();

      this.movingPlatforms = [];
      this.ridingPlatform = null;
      this.soundJump = this.sound.add("sfx-jump", { volume: 0.5 });
      this.soundCoin = this.sound.add("sfx-coin", { volume: 0.6 });
      this.soundHit = this.sound.add("sfx-hit", { volume: 0.7 });
      this.soundGoal = this.sound.add("sfx-goal", { volume: 0.6 });
      this.soundKey = this.sound.add("sfx-key", { volume: 0.6 });
      this.soundDoor = this.sound.add("sfx-door", { volume: 0.6 });
      this.soundLocked = this.sound.add("sfx-locked", { volume: 0.6 });
      this.sound1up = this.sound.add("sfx-1up", { volume: 0.7 });
      this.soundCheckpoint = this.sound.add("sfx-checkpoint", { volume: 0.6 });

      this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
      const bgTheme = (this.level.background ?? "dark") as BackgroundTheme;
      this.cameras.main.setBackgroundColor(BACKGROUND_COLORS[bgTheme]);
      this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

      const solidLayer = this.physics.add.staticGroup();
      const spikeLayer = this.physics.add.staticGroup();
      const goalLayer = this.physics.add.staticGroup();
      const coinLayer = this.physics.add.staticGroup();
      const enemyLayer = this.physics.add.group({ collideWorldBounds: true });
      const checkpointLayer = this.physics.add.staticGroup();
      const doorLayer = this.physics.add.staticGroup();
      const keyLayer = this.physics.add.staticGroup();
      const oneupLayer = this.physics.add.staticGroup();
      this.enemies = [];

      const SPIKE_ANGLE: Record<string, number> = {
        "spike-up": 0,
        "spike-down": 180,
        "spike-left": -90,
        "spike-right": 90,
      };

      const movingPlatformGroup = this.physics.add.group({ allowGravity: false, immovable: true });

      tiles.forEach((tile: Tile) => {
        const x = tile.x * TILE_SIZE + TILE_SIZE / 2;
        const y = tile.y * TILE_SIZE + TILE_SIZE / 2;
        const isSolid = tile.collision ?? tile.solid ?? true;
        if (tile.type === "ground" || tile.type === "brick" || tile.type === "platform") {
          const texKey = tile.type === "ground" ? "runtime-ground" : tile.type === "brick" ? "runtime-brick" : "runtime-platform";
          if (tile.type === "platform" && isSolid && tile.properties?.moveAxis && tile.properties.moveAxis !== "none") {
            const sprite = movingPlatformGroup.create(x, y, texKey) as Phaser.Physics.Arcade.Sprite;
            sprite.setOrigin(0.5);
            const body = sprite.body as Phaser.Physics.Arcade.Body;
            body.setSize(TILE_SIZE, TILE_SIZE);
            body.setImmovable(true);
            body.setAllowGravity(false);
            this.movingPlatforms.push({
              sprite,
              startX: x,
              startY: y,
              axis: tile.properties.moveAxis as "vertical" | "horizontal",
              speed: Number(tile.properties.moveSpeed) || 100,
              range: Number(tile.properties.moveRange) || 96,
              direction: 1,
            });
          } else if (isSolid) {
            const tileSprite = solidLayer.create(x, y, texKey) as Phaser.Physics.Arcade.Sprite;
            tileSprite.setOrigin(0.5);
            const body = tileSprite.body as Phaser.Physics.Arcade.StaticBody;
            body.setSize(TILE_SIZE, TILE_SIZE);
            body.x = x - TILE_SIZE / 2;
            body.y = y - TILE_SIZE / 2;
            body.updateCenter();
          } else {
            this.add.image(x, y, texKey).setOrigin(0.5);
          }
        }
        if (tile.type.startsWith("spike")) {
          if (isSolid) {
            const spike = spikeLayer.create(x, y, "runtime-spike") as Phaser.Physics.Arcade.Sprite;
            spike.setOrigin(0.5);
            spike.setAngle(SPIKE_ANGLE[tile.type] ?? 0);
            const body = spike.body as Phaser.Physics.Arcade.StaticBody;
            body.setSize(TILE_SIZE, TILE_SIZE);
            body.x = x - TILE_SIZE / 2;
            body.y = y - TILE_SIZE / 2;
            body.updateCenter();
          } else {
            this.add.image(x, y, "runtime-spike").setOrigin(0.5).setAngle(SPIKE_ANGLE[tile.type] ?? 0);
          }
        }
      });

      entities.forEach((entity: Entity) => {
        const x = entity.position.x * TILE_SIZE + TILE_SIZE / 2;
        const y = entity.position.y * TILE_SIZE + TILE_SIZE / 2;

        if (entity.type === "player") {
          const player = this.physics.add.sprite(x, y, "runtime-player").setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          player.setBounce(0.1);
          const body = player.body as Phaser.Physics.Arcade.Body;
          body.setSize(20, 28, true);
          body.setAllowGravity(true);
          body.setDrag(0.99, 0);
          player.setDepth(10);
          player.play("player-idle");
          this.player = player;
          this.spawnX = x;
          this.spawnY = y;
        }

        if (entity.type === "coin") {
          const coin = coinLayer
            .create(x, y, "runtime-coin")
            .setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          (coin.body as Phaser.Physics.Arcade.StaticBody).setSize(14, 14);
          coin.refreshBody();
        }

        if (entity.type === "goal") {
          const goal = goalLayer
            .create(x, y, "runtime-goal")
            .setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          (goal.body as Phaser.Physics.Arcade.StaticBody).setSize(22, 28);
          goal.refreshBody();
        }

        if (entity.type === "walker") {
          const walker = this.physics.add.sprite(x, y, "runtime-walker", "0").setOrigin(0.5);
          walker.play("walker-walk");
          walker.setVelocityX(80);
          const walkerBody = walker.body as Phaser.Physics.Arcade.Body;
          walkerBody.setSize(22, 26, true);
          walkerBody.setAllowGravity(true);
          walkerBody.setCollideWorldBounds(true);
          enemyLayer.add(walker);
          this.enemies.push(walker);
        }

        if (entity.type === "patrol") {
          const patrol = this.physics.add.sprite(x, y, "runtime-patrol", "0").setOrigin(0.5);
          patrol.play("patrol-walk");
          patrol.setVelocityX(60);
          patrol.setData("type", "patrol");
          patrol.setData("onGround", true);
          const pb = patrol.body as Phaser.Physics.Arcade.Body;
          pb.setSize(22, 26, true);
          pb.setAllowGravity(true);
          pb.setCollideWorldBounds(false);
          enemyLayer.add(patrol);
          this.enemies.push(patrol);
        }

        if (entity.type === "jumper") {
          const jumper = this.physics.add.sprite(x, y, "runtime-jumper", "0").setOrigin(0.5);
          jumper.play("jumper-walk");
          jumper.setVelocityX(70);
          jumper.setData("type", "jumper");
          const jb = jumper.body as Phaser.Physics.Arcade.Body;
          jb.setSize(22, 26, true);
          jb.setAllowGravity(true);
          jb.setCollideWorldBounds(false);
          enemyLayer.add(jumper);
          this.enemies.push(jumper);
        }

        if (entity.type === "checkpoint") {
          const cp = checkpointLayer
            .create(x, y, "runtime-checkpoint")
            .setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          (cp.body as Phaser.Physics.Arcade.StaticBody).setSize(20, 28);
          cp.refreshBody();
        }

        if (entity.type === "door") {
          const door = doorLayer
            .create(x, y, "runtime-door")
            .setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          (door.body as Phaser.Physics.Arcade.StaticBody).setSize(24, 28);
          door.refreshBody();
        }

        if (entity.type === "key") {
          const key = keyLayer
            .create(x, y, "runtime-key")
            .setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          (key.body as Phaser.Physics.Arcade.StaticBody).setSize(18, 18);
          key.refreshBody();
        }

        if (entity.type === "1up") {
          const oneup = oneupLayer
            .create(x, y, "runtime-1up")
            .setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          (oneup.body as Phaser.Physics.Arcade.StaticBody).setSize(20, 20);
          oneup.refreshBody();
        }
      });

      const world = this.physics.world;
      toggleDebugRef.current = () => {
        if (world.drawDebug) {
          world.drawDebug = false;
          if (world.debugGraphic) world.debugGraphic.clear();
          ctx.setShowHitboxes(false);
        } else {
          if (!world.debugGraphic) world.createDebugGraphic();
          world.drawDebug = true;
          ctx.setShowHitboxes(true);
        }
      };
      this.physics.world.drawDebug = false;

      if (!this.player) {
        this.add.text(16, 16, this.t("runtimeScene.placePlayer"), { fontSize: "18px", color: "#ffffff" });
      }

      if (this.player) {
        this.physics.add.collider(this.player, solidLayer);
        if (movingPlatformGroup.getLength() > 0) {
          this.physics.add.collider(
            this.player,
            movingPlatformGroup,
            (_player, platform) => {
              this.ridingPlatform = platform as Phaser.Physics.Arcade.Sprite;
            },
            undefined,
            this
          );
        }
        this.physics.add.collider(
          this.player,
          spikeLayer,
          () => { this.onHitSpike(); },
          undefined,
          this
        );
        this.physics.add.overlap(
          this.player,
          coinLayer,
          (_player: ArcadePhysicsObject, coin: ArcadePhysicsObject) => {
            this.onCollectCoin(coin);
          },
          undefined,
          this
        );
        this.physics.add.overlap(this.player, goalLayer, () => {
          this.showVictory();
        }, undefined, this);
        this.physics.add.overlap(
          this.player,
          checkpointLayer,
          (_player: ArcadePhysicsObject, cp: ArcadePhysicsObject) => {
            this.onReachCheckpoint(cp);
          },
          undefined,
          this
        );
        this.physics.add.overlap(
          this.player,
          keyLayer,
          (_player: ArcadePhysicsObject, key: ArcadePhysicsObject) => {
            this.onCollectKey(key);
          },
          undefined,
          this
        );
        this.physics.add.collider(
          this.player,
          doorLayer,
          (_player, door) => {
            this.onTryDoor(door);
          },
          undefined,
          this
        );
        this.physics.add.overlap(
          this.player,
          oneupLayer,
          (_player: ArcadePhysicsObject, oneup: ArcadePhysicsObject) => {
            this.onCollect1up(oneup);
          },
          undefined,
          this
        );
        this.cameras.main.centerOn(this.player.x, this.player.y);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.input.keyboard?.addCapture(["LEFT", "RIGHT", "UP"]);
      }

      this.physics.add.collider(enemyLayer, solidLayer);
      this.physics.add.collider(enemyLayer, doorLayer);
      this.physics.add.collider(enemyLayer, spikeLayer);
      if (this.player) {
        this.physics.add.collider(this.player, enemyLayer, () => this.onHitSpike(), undefined, this);
      }

      this.coinCount = 0;
      const coinX = this.cameras.main.width - 10;
      const coinY = 18;
      this.coinIcon = this.add
        .image(coinX, coinY, "runtime-coin")
        .setOrigin(1, 0.5)
        .setScale(0.5)
        .setScrollFactor(0)
        .setDepth(100);
      this.coinText = this.add
        .text(coinX - 20, coinY, "0", {
          fontSize: "16px",
          color: "#fbbf24",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(1, 0.5)
        .setScrollFactor(0)
        .setDepth(100);

      this.keys = 0;
      const keyIconX = coinX - 55;
      this.keyIcon = this.add
        .image(keyIconX, coinY, "runtime-key")
        .setOrigin(1, 0.5)
        .setScale(0.5)
        .setScrollFactor(0)
        .setDepth(100);
      this.keyText = this.add
        .text(keyIconX - 20, coinY, "0", {
          fontSize: "16px",
          color: "#fbbf24",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(1, 0.5)
        .setScrollFactor(0)
        .setDepth(100);

      this.lives = 3;
      this.gameOver = false;
      this.reachedCheckpoints = new Set();
      this.livesIcon = this.add
        .image(16, 16, "runtime-player", 0)
        .setOrigin(0, 0.5)
        .setScale(0.5)
        .setScrollFactor(0)
        .setDepth(100);
      this.livesText = this.add
        .text(36, 16, this.t("runtimeScene.lives", { count: 3 }), {
          fontSize: "16px",
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0, 0.5)
        .setScrollFactor(0)
        .setDepth(100);

      this.cursors = this.input.keyboard!.createCursorKeys();
      this.statusText = this.add
        .text(16, worldHeight + 16, "", { fontSize: "16px", color: "#ffffff" })
        .setScrollFactor(0);

      this.events.on("shutdown", () => { this.stopMusic(); });

      this.setupMusic();
    }

    private setupMusic() {
      const theme = (this.level.music ?? "calm") as MusicTheme;
      const key = `music-${theme}`;
      if (this.cache.audio.exists(key)) {
        this.musicSource = this.sound.add(key, { loop: true, volume: 0.4 });
        this.musicSource.play();
      }
    }

    update() {
      if (this.ridingPlatform && this.player) {
        const body = this.ridingPlatform.body as Phaser.Physics.Arcade.Body;
        this.player.x += body.velocity.x * (this.game.loop.delta / 1000);
        this.player.y += body.velocity.y * (this.game.loop.delta / 1000);
      }
      this.ridingPlatform = null;

      for (const mp of this.movingPlatforms) {
        if (mp.axis === "vertical") {
          mp.sprite.setVelocityY(mp.speed * mp.direction);
          const dy = mp.sprite.y - mp.startY;
          if ((mp.direction > 0 && dy >= mp.range) || (mp.direction < 0 && dy <= -mp.range)) {
            mp.direction *= -1;
          }
        } else {
          mp.sprite.setVelocityX(mp.speed * mp.direction);
          const dx = mp.sprite.x - mp.startX;
          if ((mp.direction > 0 && dx >= mp.range) || (mp.direction < 0 && dx <= -mp.range)) {
            mp.direction *= -1;
          }
        }
      }

      for (const enemy of this.enemies) {
        const body = enemy.body as Phaser.Physics.Arcade.Body;
        const enemyType = enemy.getData("type") as string | undefined;
        const speed = enemyType === "patrol" ? 60 : enemyType === "jumper" ? 70 : 80;

        if (body.velocity.x === 0) {
          enemy.setVelocityX(speed);
        }

        if (body.blocked.left) {
          enemy.setVelocityX(speed);
        } else if (body.blocked.right) {
          enemy.setVelocityX(-speed);
        }

        if (enemyType === "patrol") {
          const wasOnGround = enemy.getData("onGround") ?? false;
          const isOnGround = body.blocked.down;
          if (wasOnGround && !isOnGround && Math.abs(body.velocity.x) > 0) {
            enemy.setVelocityX(-body.velocity.x);
          }
          enemy.setData("onGround", isOnGround);
        }

        if (enemyType === "jumper" && body.blocked.down) {
          body.setVelocityY(-600);
        }
      }

      if (!this.player || this.gameOver) {
        return;
      }

      if (this.cursors.left?.isDown) {
        this.player.setVelocityX(-300);
      } else if (this.cursors.right?.isDown) {
        this.player.setVelocityX(300);
      } else {
        this.player.setVelocityX(0);
      }

      if (this.cursors.up?.isDown && (this.player.body as Phaser.Physics.Arcade.Body).blocked.down) {
        this.player.setVelocityY(-800);
        this.soundJump.play();
      }

      if (this.player.y > this.worldHeight + 64) {
        this.onHitSpike();
      }
    }

    private onCollectCoin(coin: ArcadePhysicsObject) {
      this.coinCount++;
      this.coinText.setText(String(this.coinCount));
      if (this.coinCount % 100 === 0) {
        this.lives++;
        this.livesText.setText(this.t("runtimeScene.lives", { count: this.lives }));
        this.sound1up.play();
        this.show1upText();
      }
      this.soundCoin.play();
      if ("gameObject" in coin) {
        coin.gameObject.destroy();
        return;
      }

      if ("destroy" in coin) {
        coin.destroy();
      }
    }

    private onCollectKey(key: ArcadePhysicsObject) {
      this.keys++;
      this.keyText.setText(String(this.keys));
      this.soundKey.play();
      if ("gameObject" in key) {
        key.gameObject.destroy();
        return;
      }

      if ("destroy" in key) {
        key.destroy();
      }
    }

    private onCollect1up(oneup: ArcadePhysicsObject) {
      this.lives++;
      this.livesText.setText(this.t("runtimeScene.lives", { count: this.lives }));
      this.sound1up.play();
      this.show1upText();
      if ("gameObject" in oneup) {
        oneup.gameObject.destroy();
        return;
      }

      if ("destroy" in oneup) {
        oneup.destroy();
      }
    }

    private show1upText() {
      if (!this.player) return;
      const text = this.add
        .text(this.player.x, this.player.y - 16, "1UP", {
          fontSize: "18px",
          color: "#22c55e",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5)
        .setDepth(50);
      this.tweens.add({
        targets: text,
        y: text.y - 40,
        alpha: 0,
        duration: 1000,
        ease: "Power2",
        onComplete: () => { text.destroy(); },
      });
    }

    private showCheckpointText() {
      if (!this.player) return;
      const text = this.add
        .text(this.player.x, this.player.y - 16, this.t("runtimeScene.checkpoint"), {
          fontSize: "14px",
          color: "#38bdf8",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5)
        .setDepth(50);
      this.tweens.add({
        targets: text,
        y: text.y - 40,
        alpha: 0,
        duration: 1000,
        ease: "Power2",
        onComplete: () => { text.destroy(); },
      });
    }

    private onReachCheckpoint(cp: ArcadePhysicsObject) {
      if (!this.player) return;
      const cpX = "gameObject" in cp ? (cp.gameObject as unknown as { x: number }).x : (cp as unknown as { x: number }).x;
      const cpY = "gameObject" in cp ? (cp.gameObject as unknown as { y: number }).y : (cp as unknown as { y: number }).y;
      const key = `${cpX},${cpY}`;
      if (!this.reachedCheckpoints.has(key)) {
        this.reachedCheckpoints.add(key);
        this.soundCheckpoint.play();
        this.showCheckpointText();
      }
      this.player.setData("checkpointX", cpX);
      this.player.setData("checkpointY", cpY);
    }

    private onTryDoor(door: ArcadePhysicsObject) {
      if (this.keys <= 0) {
        if (!this.soundLocked.isPlaying) {
          this.soundLocked.play();
        }
        if (this.statusText) {
          this.statusText.setText(this.t("runtimeScene.needKey"));
        }
        return;
      }
      this.keys--;
      this.keyText.setText(String(this.keys));
      this.soundDoor.play();
      if (this.statusText) {
        this.statusText.setText(this.t("runtimeScene.doorOpened"));
      }
      if ("gameObject" in door) {
        door.gameObject.destroy();
        return;
      }
      if ("destroy" in door) {
        door.destroy();
      }
    }

    private onHitSpike() {
      this.lives--;
      this.soundHit.play();
      this.livesText.setText(this.t("runtimeScene.lives", { count: this.lives }));

      if (this.lives <= 0) {
        this.showGameOver();
        return;
      }

      if (!this.player) return;
      const cpX = this.player.getData("checkpointX") as number | undefined;
      const cpY = this.player.getData("checkpointY") as number | undefined;
      const offsetY = -TILE_SIZE;
      if (cpX !== undefined && cpY !== undefined) {
        this.player.setPosition(cpX, cpY + offsetY);
      } else {
        this.player.setPosition(this.spawnX, this.spawnY + offsetY);
      }
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      if (this.statusText) {
        this.statusText.setText(this.t("runtimeScene.respawn"));
      }
    }

    private stopMusic() {
      if (this.musicSource) {
        this.musicSource.stop();
        this.musicSource.destroy();
        this.musicSource = null;
      }
    }

    private showGameOver() {
      if (this.gameOver) return;
      this.gameOver = true;
      this.stopMusic();
      this.physics.world.pause();

      const cx = this.cameras.main.centerX;
      const cy = this.cameras.main.centerY;

      this.add.rectangle(cx, cy, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.75)
        .setScrollFactor(0)
        .setDepth(200);

      this.add.text(cx, cy - 80, this.t("runtimeScene.gameOver"), {
        fontSize: "48px",
        color: "#ef4444",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 5,
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(201);

      this.add.text(cx, cy + 10, this.t("runtimeScene.retry"), {
        fontSize: "28px",
        color: "#22c55e",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3,
        backgroundColor: "#1e293b",
        padding: { x: 24, y: 10 },
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(201)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => { this.scene.restart(); });

      this.add.text(cx, cy + 80, this.t("runtimeScene.stop"), {
        fontSize: "28px",
        color: "#94a3b8",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3,
        backgroundColor: "#1e293b",
        padding: { x: 24, y: 10 },
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(201)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => { ctx.onStop(); });
    }

    private showVictory() {
      if (this.gameOver) return;
      this.gameOver = true;
      this.stopMusic();
      this.soundGoal.play();
      this.physics.world.pause();

      const cx = this.cameras.main.centerX;
      const cy = this.cameras.main.centerY;

      this.add.rectangle(cx, cy, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.75)
        .setScrollFactor(0)
        .setDepth(200);

      this.add.text(cx, cy - 80, this.t("runtimeScene.levelComplete"), {
        fontSize: "40px",
        color: "#fbbf24",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 5,
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(201);

      this.add.text(cx, cy + 10, this.t("runtimeScene.retry"), {
        fontSize: "28px",
        color: "#22c55e",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3,
        backgroundColor: "#1e293b",
        padding: { x: 24, y: 10 },
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(201)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => { this.scene.restart(); });

      this.add.text(cx, cy + 80, this.t("runtimeScene.stop"), {
        fontSize: "28px",
        color: "#94a3b8",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3,
        backgroundColor: "#1e293b",
        padding: { x: 24, y: 10 },
      })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(201)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => { ctx.onStop(); });
    }
  };
}
