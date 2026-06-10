import type Phaser from "phaser";
import type { LevelData, Tile, Entity, BackgroundTheme } from "@/types/level";
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
    declare coinCount: number;
    declare coinText: Phaser.GameObjects.Text;
    declare coinIcon: Phaser.GameObjects.Image;
    declare hasKey: boolean;
    declare keyIcon: Phaser.GameObjects.Image;
    declare lives: number;
    declare livesText: Phaser.GameObjects.Text;
    declare spawnX: number;
    declare spawnY: number;
    declare gameOver: boolean;
    declare ridingPlatform: Phaser.Physics.Arcade.Sprite | null;

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
    }

    private createRuntimeTextures() {
      this.createTexture("runtime-ground", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x5d432f);
        g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        g.fillStyle(0x7a5a3e);
        g.fillRect(0, 0, 16, 16);
        g.fillRect(16, 16, 16, 16);
        g.fillStyle(0x6d4e34);
        g.fillRect(16, 0, 16, 16);
        g.fillRect(0, 16, 16, 16);
        g.lineStyle(1, 0x4a3520);
        g.beginPath();
        g.moveTo(0, 16); g.lineTo(32, 16);
        g.moveTo(16, 0); g.lineTo(16, 32);
        g.strokePath();
      });

      this.createTexture("runtime-spike", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xdc2626);
        g.fillTriangle(16, 0, 0, 32, 32, 32);
        g.fillStyle(0xef4444);
        g.fillTriangle(16, 4, 4, 32, 28, 32);
      });

      this.createTexture("runtime-player", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x3b82f6);
        g.fillCircle(16, 9, 7);
        g.fillRect(9, 16, 14, 8);
        g.fillRect(9, 24, 5, 6);
        g.fillRect(18, 24, 5, 6);
        g.fillStyle(0xffffff);
        g.fillCircle(13, 8, 1.5);
        g.fillCircle(19, 8, 1.5);
      });

      this.createTexture("runtime-coin", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xf59e0b);
        g.fillCircle(16, 16, 14);
        g.fillStyle(0xfbbf24);
        g.fillCircle(16, 16, 10);
      });

      this.createTexture("runtime-enemy", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xea580c);
        g.fillCircle(16, 16, 14);
        g.fillStyle(0xf97316);
        g.fillCircle(16, 16, 11);
        g.fillStyle(0xffffff);
        g.fillCircle(11, 12, 2.5);
        g.fillCircle(21, 12, 2.5);
        g.fillStyle(0x000000);
        g.fillCircle(11, 13, 1.2);
        g.fillCircle(21, 13, 1.2);
        g.fillStyle(0xffffff);
        g.fillRect(10, 21, 12, 3);
      });

      this.createTexture("runtime-goal", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x16a34a);
        g.fillRect(6, 2, 4, 28);
        g.fillStyle(0x22c55e);
        g.fillRect(10, 2, 18, 14);
        g.lineStyle(1, 0x15803d);
        g.strokeRect(10, 2, 18, 14);
        g.fillStyle(0x4ade80);
        g.fillRect(13, 6, 12, 3);
      });

      this.createTexture("runtime-brick", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xb45309);
        g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        g.fillStyle(0xd97706);
        g.fillRect(0, 0, 16, 16);
        g.fillRect(16, 16, 16, 16);
        g.fillStyle(0x92400e);
        g.fillRect(16, 0, 16, 16);
        g.fillRect(0, 16, 16, 16);
        g.lineStyle(1, 0x78350f);
        g.moveTo(0, 16); g.lineTo(32, 16);
        g.moveTo(16, 0); g.lineTo(16, 32);
        g.strokePath();
      });

      this.createTexture("runtime-platform", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x64748b);
        g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        g.fillStyle(0x475569);
        g.fillRect(0, 24, TILE_SIZE, 8);
        g.lineStyle(2, 0x94a3b8);
        g.moveTo(4, 12); g.lineTo(4, 24);
        g.moveTo(16, 8); g.lineTo(16, 24);
        g.moveTo(28, 12); g.lineTo(28, 24);
        g.strokePath();
      });

      this.createTexture("runtime-checkpoint", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x92400e);
        g.fillRect(13, 2, 6, 28);
        g.fillStyle(0xfbbf24);
        g.fillTriangle(19, 6, 19, 22, 30, 14);
        g.fillStyle(0xfef08a);
        g.fillTriangle(19, 8, 19, 20, 28, 14);
      });

      this.createTexture("runtime-door", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0x7c2d12);
        g.fillRect(2, 2, 28, 28);
        g.fillStyle(0x92400e);
        g.fillRect(4, 4, 24, 24);
        g.fillStyle(0x451a03);
        g.fillRect(6, 6, 8, 10);
        g.fillRect(18, 6, 8, 10);
        g.fillRect(6, 18, 8, 8);
        g.fillRect(18, 18, 8, 8);
        g.fillStyle(0xfbbf24);
        g.fillCircle(26, 16, 2);
      });

      this.createTexture("runtime-key", TILE_SIZE, TILE_SIZE, (g) => {
        g.fillStyle(0xfbbf24);
        g.fillCircle(22, 10, 6);
        g.fillStyle(0xd97706);
        g.lineStyle(2, 0xd97706);
        g.fillRect(10, 16, 12, 4);
        g.fillStyle(0xf59e0b);
        g.fillRect(10, 12, 4, 16);
        g.fillStyle(0xfef08a);
        g.fillCircle(22, 10, 2.5);
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

      this.movingPlatforms = [];
      this.ridingPlatform = null;
      this.soundJump = this.sound.add("sfx-jump", { volume: 0.5 });
      this.soundCoin = this.sound.add("sfx-coin", { volume: 0.6 });
      this.soundHit = this.sound.add("sfx-hit", { volume: 0.7 });
      this.soundGoal = this.sound.add("sfx-goal", { volume: 0.6 });

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
        const isSolid = tile.solid ?? true;
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
          this.player = player;
          this.spawnX = x;
          this.spawnY = y;
        }

        if (entity.type === "coin") {
          const coin = coinLayer
            .create(x, y, "runtime-coin")
            .setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          (coin.body as Phaser.Physics.Arcade.StaticBody).setSize(18, 18);
          coin.refreshBody();
        }

        if (entity.type === "goal") {
          const goal = goalLayer
            .create(x, y, "runtime-goal")
            .setOrigin(0.5) as Phaser.Physics.Arcade.Sprite;
          (goal.body as Phaser.Physics.Arcade.StaticBody).setSize(22, 28);
          goal.refreshBody();
        }

        if (entity.type === "enemy") {
          const enemy = this.physics.add.sprite(x, y, "runtime-enemy").setOrigin(0.5);
          enemy.setVelocityX(80);
          const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
          enemyBody.setSize(22, 26, true);
          enemyBody.setAllowGravity(true);
          enemyBody.setCollideWorldBounds(true);
          enemyLayer.add(enemy);
          this.enemies.push(enemy);
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
        this.cameras.main.centerOn(this.player.x, this.player.y);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.input.keyboard?.addCapture(["LEFT", "RIGHT", "UP"]);
      }

      this.physics.add.collider(enemyLayer, solidLayer);
      this.physics.add.collider(enemyLayer, doorLayer);
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

      this.hasKey = false;
      const keyIconX = coinX - 55;
      this.keyIcon = this.add
        .image(keyIconX, coinY, "runtime-key")
        .setOrigin(1, 0.5)
        .setScale(0.5)
        .setScrollFactor(0)
        .setDepth(100)
        .setVisible(false);

      this.lives = 3;
      this.gameOver = false;
      this.livesText = this.add
        .text(16, 16, this.t("runtimeScene.lives", { count: 3 }), {
          fontSize: "16px",
          color: "#ef4444",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setScrollFactor(0)
        .setDepth(100);

      this.cursors = this.input.keyboard!.createCursorKeys();
      this.statusText = this.add
        .text(16, worldHeight + 16, "", { fontSize: "16px", color: "#ffffff" })
        .setScrollFactor(0);
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
        const speed = 80;

        if (body.velocity.x === 0) {
          enemy.setVelocityX(speed);
        }

        if (body.blocked.left) {
          enemy.setVelocityX(speed);
        } else if (body.blocked.right) {
          enemy.setVelocityX(-speed);
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
      this.hasKey = true;
      this.keyIcon.setVisible(true);
      this.soundCoin.play();
      if ("gameObject" in key) {
        key.gameObject.destroy();
        return;
      }

      if ("destroy" in key) {
        key.destroy();
      }
    }

    private onReachCheckpoint(cp: ArcadePhysicsObject) {
      if (!this.player) return;
      const cpX = "gameObject" in cp ? (cp.gameObject as unknown as { x: number }).x : (cp as unknown as { x: number }).x;
      const cpY = "gameObject" in cp ? (cp.gameObject as unknown as { y: number }).y : (cp as unknown as { y: number }).y;
      this.player.setData("checkpointX", cpX);
      this.player.setData("checkpointY", cpY);
      if (this.statusText) {
        this.statusText.setText(this.t("runtimeScene.checkpoint"));
      }
    }

    private onTryDoor(door: ArcadePhysicsObject) {
      if (!this.hasKey) {
        if (this.statusText) {
          this.statusText.setText(this.t("runtimeScene.needKey"));
        }
        return;
      }
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
      if (cpX !== undefined && cpY !== undefined) {
        this.player.setPosition(cpX, cpY);
      } else {
        this.player.setPosition(this.spawnX, this.spawnY);
      }
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      if (this.statusText) {
        this.statusText.setText(this.t("runtimeScene.respawn"));
      }
    }

    private showGameOver() {
      if (this.gameOver) return;
      this.gameOver = true;
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
