"use client";

import { useEffect, useRef, useState } from "react";
import type { Game, GameObjects, Physics, Sound, Tilemaps, Types } from "phaser";
import type { LevelData, Tile, Entity } from "@/types/level";

const TILE_SIZE = 32;

type ArcadePhysicsObject =
  | Physics.Arcade.Body
  | Physics.Arcade.StaticBody
  | Types.Physics.Arcade.GameObjectWithBody
  | Tilemaps.Tile;

export function GameRuntime({ level, onStop }: { level: LevelData; onStop: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showHitboxes, setShowHitboxes] = useState(false);
  const toggleDebugRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    let game: Game | null = null;
    let isDisposed = false;

    const initializeGame = async () => {
      setRuntimeError(null);
      setIsReady(false);

      const PhaserLib = await import("phaser");
      if (isDisposed || !containerRef.current) {
        return;
      }

      class RuntimeScene extends PhaserLib.Scene {
        declare level: LevelData;
        declare cursors: Types.Input.Keyboard.CursorKeys;
        declare player?: Physics.Arcade.Sprite;
        declare statusText?: GameObjects.Text;
        declare enemies: Physics.Arcade.Sprite[];
        declare worldHeight: number;
        declare soundJump: Sound.BaseSound;
        declare soundCoin: Sound.BaseSound;
        declare soundHit: Sound.BaseSound;
        declare soundGoal: Sound.BaseSound;
        declare coinCount: number;
        declare coinText: GameObjects.Text;
        declare coinIcon: GameObjects.Image;
        declare hasKey: boolean;
        declare keyIcon: GameObjects.Image;

        constructor() {
          super({ key: "runtime" });
        }

        init(data: { level: LevelData }) {
          this.level = data.level;
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
          draw: (g: GameObjects.Graphics) => void
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

          this.soundJump = this.sound.add("sfx-jump", { volume: 0.5 });
          this.soundCoin = this.sound.add("sfx-coin", { volume: 0.6 });
          this.soundHit = this.sound.add("sfx-hit", { volume: 0.7 });
          this.soundGoal = this.sound.add("sfx-goal", { volume: 0.6 });

          this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
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

          tiles.forEach((tile: Tile) => {
            const x = tile.x * TILE_SIZE + TILE_SIZE / 2;
            const y = tile.y * TILE_SIZE + TILE_SIZE / 2;
            if (tile.type === "ground" || tile.type === "brick" || tile.type === "platform") {
              const texKey = tile.type === "ground" ? "runtime-ground" : tile.type === "brick" ? "runtime-brick" : "runtime-platform";
              const tileSprite = solidLayer.create(x, y, texKey) as Physics.Arcade.Sprite;
              tileSprite.setOrigin(0.5);
              const body = tileSprite.body as Physics.Arcade.StaticBody;
              body.setSize(TILE_SIZE, TILE_SIZE);
              body.x = x - TILE_SIZE / 2;
              body.y = y - TILE_SIZE / 2;
              body.updateCenter();
            }
            if (tile.type.startsWith("spike")) {
              const spike = spikeLayer.create(x, y, "runtime-spike") as Physics.Arcade.Sprite;
              spike.setOrigin(0.5);
              spike.setAngle(SPIKE_ANGLE[tile.type] ?? 0);
              const body = spike.body as Physics.Arcade.StaticBody;
              body.setSize(TILE_SIZE, TILE_SIZE);
              body.x = x - TILE_SIZE / 2;
              body.y = y - TILE_SIZE / 2;
              body.updateCenter();
            }
          });

          entities.forEach((entity: Entity) => {
            const x = entity.position.x * TILE_SIZE + TILE_SIZE / 2;
            const y = entity.position.y * TILE_SIZE + TILE_SIZE / 2;

            if (entity.type === "player") {
              const player = this.physics.add.sprite(x, y, "runtime-player").setOrigin(0.5) as Physics.Arcade.Sprite;
              player.setBounce(0.1);
              const body = player.body as Physics.Arcade.Body;
              body.setSize(20, 28, true);
              body.setAllowGravity(true);
              body.setDrag(0.99, 0);
              player.setDepth(10);
              this.player = player;
            }

            if (entity.type === "coin") {
              const coin = coinLayer
                .create(x, y, "runtime-coin")
                .setOrigin(0.5) as Physics.Arcade.Sprite;
              (coin.body as Physics.Arcade.StaticBody).setSize(18, 18);
              coin.refreshBody();
            }

            if (entity.type === "goal") {
              const goal = goalLayer
                .create(x, y, "runtime-goal")
                .setOrigin(0.5) as Physics.Arcade.Sprite;
              (goal.body as Physics.Arcade.StaticBody).setSize(22, 28);
              goal.refreshBody();
            }

            if (entity.type === "enemy") {
              const enemy = this.physics.add.sprite(x, y, "runtime-enemy").setOrigin(0.5);
              enemy.setVelocityX(80);
              const enemyBody = enemy.body as Physics.Arcade.Body;
              enemyBody.setSize(22, 26, true);
              enemyBody.setAllowGravity(true);
              enemyBody.setCollideWorldBounds(true);
              enemyLayer.add(enemy);
              this.enemies.push(enemy);
            }

            if (entity.type === "checkpoint") {
              const cp = checkpointLayer
                .create(x, y, "runtime-checkpoint")
                .setOrigin(0.5) as Physics.Arcade.Sprite;
              (cp.body as Physics.Arcade.StaticBody).setSize(20, 28);
              cp.refreshBody();
            }

            if (entity.type === "door") {
              const door = doorLayer
                .create(x, y, "runtime-door")
                .setOrigin(0.5) as Physics.Arcade.Sprite;
              (door.body as Physics.Arcade.StaticBody).setSize(24, 28);
              door.refreshBody();
            }

            if (entity.type === "key") {
              const key = keyLayer
                .create(x, y, "runtime-key")
                .setOrigin(0.5) as Physics.Arcade.Sprite;
              (key.body as Physics.Arcade.StaticBody).setSize(18, 18);
              key.refreshBody();
            }
          });

          const world = this.physics.world;
          toggleDebugRef.current = () => {
            if (world.drawDebug) {
              world.drawDebug = false;
              if (world.debugGraphic) world.debugGraphic.clear();
              setShowHitboxes(false);
            } else {
              if (!world.debugGraphic) world.createDebugGraphic();
              world.drawDebug = true;
              setShowHitboxes(true);
            }
          };
          this.physics.world.drawDebug = false;

          if (!this.player) {
            this.add.text(16, 16, "Place a player to start", { fontSize: "18px", color: "#ffffff" });
          }

          if (this.player) {
            this.physics.add.collider(this.player, solidLayer);
            this.physics.add.collider(
              this.player,
              spikeLayer,
              () => { this.onHitSpike(); },
              (player: ArcadePhysicsObject, spike: ArcadePhysicsObject) => {
                const pSprite = player as unknown as Physics.Arcade.Sprite;
                const sSprite = spike as unknown as Physics.Arcade.Sprite;
                const pBody = pSprite.body as Physics.Arcade.Body;
                const sBody = sSprite.body as Physics.Arcade.StaticBody;
                const angle = sSprite.angle;

                const playerCx = pBody.x + pBody.width / 2;
                const playerCy = pBody.y + pBody.height / 2;

                if (angle === 180) return playerCy >= sBody.y + sBody.height / 2;
                if (angle === 0) return playerCy <= sBody.y + sBody.height / 2;
                if (angle === 90) return playerCx >= sBody.x + sBody.width / 2;
                if (angle === -90) return playerCx <= sBody.x + sBody.width / 2;
                return true;
              },
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
              this.onReachGoal();
            }, undefined, this);
            this.physics.add.overlap(
              this.player,
              checkpointLayer,
              () => {
                this.onReachCheckpoint();
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
            this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
            this.input.keyboard?.addCapture(["LEFT", "RIGHT", "UP"]);
          }

          this.physics.add.collider(enemyLayer, solidLayer);
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

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.statusText = this.add
            .text(16, worldHeight + 16, "", { fontSize: "16px", color: "#ffffff" })
            .setScrollFactor(0);
        }

        update() {
          for (const enemy of this.enemies) {
            const body = enemy.body as Physics.Arcade.Body;
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

          if (!this.player) {
            return;
          }

          if (this.cursors.left?.isDown) {
            this.player.setVelocityX(-300);
          } else if (this.cursors.right?.isDown) {
            this.player.setVelocityX(300);
          } else {
            this.player.setVelocityX(0);
          }

          if (this.cursors.up?.isDown && (this.player.body as Physics.Arcade.Body).blocked.down) {
            this.player.setVelocityY(-800);
            this.soundJump.play();
          }

          if (this.player.y > this.worldHeight + 64) {
            const cpX = this.player.getData("checkpointX") as number | undefined;
            const cpY = this.player.getData("checkpointY") as number | undefined;
            if (cpX !== undefined && cpY !== undefined) {
              this.player.setPosition(cpX, cpY);
              const body = this.player.body as Physics.Arcade.Body;
              body.setVelocity(0, 0);
            } else {
              this.onHitSpike();
            }
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

        private onReachCheckpoint() {
          if (!this.player) return;
          this.player.setData("checkpointX", this.player.x);
          this.player.setData("checkpointY", this.player.y);
          if (this.statusText) {
            this.statusText.setText("Checkpoint!");
          }
        }

        private onTryDoor(door: ArcadePhysicsObject) {
          if (!this.hasKey) {
            if (this.statusText) {
              this.statusText.setText("Need a key!");
            }
            return;
          }
          if (this.statusText) {
            this.statusText.setText("Door opened!");
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
          this.soundHit.play();
          if (this.player) {
            const cpX = this.player.getData("checkpointX") as number | undefined;
            const cpY = this.player.getData("checkpointY") as number | undefined;
            if (cpX !== undefined && cpY !== undefined) {
              this.player.setPosition(cpX, cpY);
              const body = this.player.body as Physics.Arcade.Body;
              body.setVelocity(0, 0);
              if (this.statusText) {
                this.statusText.setText("Respawn");
              }
              return;
            }
          }
          if (this.statusText) {
            this.statusText.setText("Game Over");
          }
          this.scene.pause();
        }

        private onReachGoal() {
          this.soundGoal.play();
          if (this.statusText) {
            this.statusText.setText("Nivel completado");
          }
          this.scene.pause();
        }
      }

      const canvasWidth = Math.min(level.width * TILE_SIZE, 1280);
      const canvasHeight = Math.min(level.height * TILE_SIZE, 720);

      game = new PhaserLib.Game({
        type: PhaserLib.CANVAS,
        parent: containerRef.current!,
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: "#0f172a",
        scale: {
          mode: PhaserLib.Scale.NONE,
          autoCenter: PhaserLib.Scale.CENTER_BOTH,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 1800 },
            debug: false,
          },
        },
        scene: [RuntimeScene],
      });

      game.scene.start("runtime", { level });
      if (!isDisposed) {
        setIsReady(true);
      }
    };

    void initializeGame().catch(() => {
      if (isDisposed) {
        return;
      }

      setRuntimeError("Error al inicializar el runtime del juego.");
    });

    return () => {
      isDisposed = true;
      setIsReady(false);
      if (game) {
        game.scene.stop("runtime");
        game.destroy(true);
        game = null;
      }
    };
  }, [level, onStop]);

  useEffect(() => {
    if (isReady && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isReady]);

  return (
    <section className="mx-auto mt-6 max-w-full rounded-3xl border border-slate-800/80 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/10">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Runtime Phaser</h2>
          <p className="text-sm text-slate-400">El motor consume el nivel JSON y usa física arcade simple.</p>
          <p className="mt-2 text-sm text-slate-300">
            {runtimeError
              ? `Error: ${runtimeError}`
              : isReady
              ? "Runtime inicializado correctamente"
              : "Inicializando runtime..."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toggleDebugRef.current?.()}
            aria-label={showHitboxes ? "Ocultar hitboxes" : "Mostrar hitboxes"}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white transition ${
              showHitboxes
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {showHitboxes ? "Hitboxes ON" : "Hitboxes OFF"}
          </button>
          <button
            type="button"
            onClick={onStop}
            aria-label="Detener runtime"
            className="rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
          >
            Detener
          </button>
        </div>
      </div>
      <div
        className="overflow-hidden rounded-3xl border border-slate-900/80 bg-black min-h-[480px] w-full"
        ref={containerRef}
        tabIndex={0}
        onClick={() => containerRef.current?.focus()}
      />
    </section>
  );
}
