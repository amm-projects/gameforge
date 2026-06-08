# Comportamiento de los pinchos

## Cómo funcionan

Los pinchos (`spike-up`, `spike-down`, `spike-left`, `spike-right`) matan al jugador instantáneamente al entrar en contacto con ellos, sin importar por qué lado los toque.

Anteriormente existía un "lado seguro" (la base plana del pincho) donde el jugador podía tocar el tile sin morir. Esto fue eliminado porque resultaba confuso y difícil de percibir visualmente.

## Cambio de comportamiento

| Versión | Comportamiento |
|---|---|
| ≤ 0.22.x | El jugador solo moría al tocar la punta del pincho. Podía estar sobre la base del `spike-up` sin peligro. |
| ≥ 0.23.0 | Cualquier contacto con el tile del pincho mata al jugador. |

## Detalle técnico

En `GameRuntime.tsx`, la colisión entre el jugador y `spikeLayer` usaba un `processCallback` que verificaba qué lado del pincho tocaba el jugador según el ángulo del sprite:

```ts
// Eliminado:
(player, spike) => {
  const angle = spike.angle;
  const playerCy = pBody.y + pBody.height / 2;
  if (angle === 0) return playerCy <= sBody.y + sBody.height / 2;
  // ... más direcciones
}
```

Ahora el callback es `undefined` (sin filtro), por lo que toda colisión dispara `onHitSpike()`.
