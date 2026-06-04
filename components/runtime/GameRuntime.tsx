"use client";

import { useEffect, useRef, useState } from "react";
import type { Game, GameObjects, Physics, Tilemaps, Types } from "phaser";
import type { LevelData, Tile, Entity } from "@/types/level";

const TILE_SIZE = 32;
const PLAYER_SIZE = 28;
const COIN_SIZE = 18;
const ENTITY_SIZE = 26;

type ArcadePhysicsObject =
  | Physics.Arcade.Body
  | Physics.Arcade.StaticBody
  | Types.Physics.Arcade.GameObjectWithBody
  | Tilemaps.Tile;

interface RuntimeTexture {
  key: string;
  width: number;
  height: number;
  color: number;
}

export function GameRuntime({ level, onStop }: { level: LevelData; onStop: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

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
        declare playerLabel?: GameObjects.Text;
        declare statusText?: GameObjects.Text;
        declare enemies: Physics.Arcade.Sprite[];
        declare worldHeight: number;

        constructor() {
          super({ key: "runtime" });
        }

        init(data: { level: LevelData }) {
          this.level = data.level;
        }

        private createRuntimeTextures() {
          const textures: RuntimeTexture[] = [
            { key: "runtime-ground", width: TILE_SIZE, height: TILE_SIZE, color: 0x5d432f },
            { key: "runtime-spike", width: TILE_SIZE, height: TILE_SIZE, color: 0xdc2626 },
            { key: "runtime-player", width: PLAYER_SIZE, height: PLAYER_SIZE, color: 0xffffff },
            { key: "runtime-coin", width: COIN_SIZE, height: COIN_SIZE, color: 0xf59e0b },
            { key: "runtime-goal", width: ENTITY_SIZE, height: ENTITY_SIZE, color: 0x22c55e },
            { key: "runtime-enemy", width: ENTITY_SIZE, height: ENTITY_SIZE, color: 0xea580c },
          ];

          textures.forEach((texture) => {
            if (this.textures.exists(texture.key)) {
              return;
            }

            const graphics = this.add.graphics();
            graphics.fillStyle(texture.color, 1);
            graphics.fillRect(0, 0, texture.width, texture.height);
            graphics.generateTexture(texture.key, texture.width, texture.height);
            graphics.destroy();
          });
        }

        create() {
          const { width, height, tiles, entities } = this.level;
          const worldWidth = width * TILE_SIZE;
          const worldHeight = height * TILE_SIZE;
          this.worldHeight = worldHeight;

          this.createRuntimeTextures();

          this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
          this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

          const solidLayer = this.physics.add.staticGroup();
          const spikeLayer = this.physics.add.staticGroup();
          const goalLayer = this.physics.add.staticGroup();
          const coinLayer = this.physics.add.staticGroup();
          const enemyLayer = this.physics.add.group({ collideWorldBounds: true });
          this.enemies = [];

          tiles.forEach((tile: Tile) => {
            const x = tile.x * TILE_SIZE + TILE_SIZE / 2;
            const y = tile.y * TILE_SIZE + TILE_SIZE / 2;
            if (tile.type === "ground") {
              const ground = solidLayer.create(x, y, "runtime-ground") as Physics.Arcade.Sprite;
              ground.setOrigin(0.5);
              const body = ground.body as Physics.Arcade.StaticBody;
              body.setSize(TILE_SIZE, TILE_SIZE);
              ground.refreshBody();
            }
            if (tile.type === "spike") {
              const spike = spikeLayer.create(x, y, "runtime-spike") as Physics.Arcade.Sprite;
              spike.setOrigin(0.5);
              const body = spike.body as Physics.Arcade.StaticBody;
              body.setSize(TILE_SIZE, TILE_SIZE);
              spike.refreshBody();
            }
          });

          entities.forEach((entity: Entity) => {
            const x = entity.position.x * TILE_SIZE + TILE_SIZE / 2;
            const y = entity.position.y * TILE_SIZE + TILE_SIZE / 2;

            if (entity.type === "player") {
              const player = this.physics.add.sprite(x, y, "runtime-player").setOrigin(0.5) as Physics.Arcade.Sprite;
              player.setBounce(0.1);
              const body = player.body as Physics.Arcade.Body;
              body.setSize(PLAYER_SIZE, PLAYER_SIZE, true);
              body.setAllowGravity(true);
              body.setDrag(0.99, 0);
              player.setDepth(10);
              this.player = player;
              this.playerLabel = this.add
                .text(player.x, player.y - 20, "P", { fontSize: "14px", color: "#000000", backgroundColor: "#ffffff" })
                .setOrigin(0.5)
                .setDepth(20);
            }

            if (entity.type === "coin") {
              const coin = coinLayer
                .create(x, y, "runtime-coin")
                .setOrigin(0.5) as Physics.Arcade.Sprite;
              (coin.body as Physics.Arcade.StaticBody).setSize(COIN_SIZE, COIN_SIZE);
              coin.refreshBody();
            }

            if (entity.type === "goal") {
              const goal = goalLayer
                .create(x, y, "runtime-goal")
                .setOrigin(0.5) as Physics.Arcade.Sprite;
              (goal.body as Physics.Arcade.StaticBody).setSize(ENTITY_SIZE, ENTITY_SIZE);
              goal.refreshBody();
            }

            if (entity.type === "enemy") {
              const enemy = this.physics.add.sprite(x, y, "runtime-enemy").setOrigin(0.5);
              enemy.setVelocityX(80);
              const enemyBody = enemy.body as Physics.Arcade.Body;
              enemyBody.setSize(ENTITY_SIZE, ENTITY_SIZE, true);
              enemyBody.setAllowGravity(true);
              enemyBody.setCollideWorldBounds(true);
              enemyLayer.add(enemy);
              this.enemies.push(enemy);
            }
          });

          if (!this.player) {
            this.add.text(16, 16, "Place a player to start", { fontSize: "18px", color: "#ffffff" });
          }

          if (this.player) {
            this.physics.add.collider(this.player, solidLayer);
            this.physics.add.collider(this.player, spikeLayer, () => {
              this.onHitSpike();
            });
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
            this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
            this.input.keyboard?.addCapture(["LEFT", "RIGHT", "UP"]);
          }

          this.physics.add.collider(enemyLayer, solidLayer);
          if (this.player) {
            this.physics.add.collider(this.player, enemyLayer, () => this.onHitSpike(), undefined, this);
          }

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.statusText = this.add
            .text(16, worldHeight + 16, "", { fontSize: "16px", color: "#ffffff" })
            .setScrollFactor(0);
        }

        update(_time: number, delta: number) {
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
            this.player.setVelocityX(-160);
          } else if (this.cursors.right?.isDown) {
            this.player.setVelocityX(160);
          } else {
            this.player.setVelocityX(0);
          }

          if (this.cursors.up?.isDown && (this.player.body as Physics.Arcade.Body).blocked.down) {
            this.player.setVelocityY(-320);
          }

          if (this.playerLabel) {
            this.playerLabel.setPosition(this.player.x, this.player.y - 22);
          }

          if (this.player.y > this.worldHeight + 64) {
            this.onHitSpike();
          }
        }

        private onCollectCoin(coin: ArcadePhysicsObject) {
          if ("gameObject" in coin) {
            coin.gameObject.destroy();
            return;
          }

          if ("destroy" in coin) {
            coin.destroy();
          }
        }

        private onHitSpike() {
          if (this.statusText) {
            this.statusText.setText("Game Over");
          }
          this.scene.pause();
        }

        private onReachGoal() {
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
            gravity: { x: 0, y: 300 },
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

    void initializeGame().catch((error) => {
      if (isDisposed) {
        return;
      }

      setRuntimeError(String(error));
      console.error("Error inicializando Phaser runtime:", error);
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
        <button
          type="button"
          onClick={onStop}
          aria-label="Detener runtime"
          className="rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
        >
          Detener
        </button>
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
