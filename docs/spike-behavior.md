# Comportamiento de los pinchos

## [0.23.0] - 2026-06-08

### Changed

- Los pinchos (`spike-up`, `spike-down`, `spike-left`, `spike-right`) matan al jugador **instantáneamente** al contactar con el tile, sin importar el lado.
- Eliminado el "lado seguro" (base plana del pincho) que permitía tocar sin morir.

### Technical details

- En `RuntimeScene.ts`, la colisión `player vs spikeLayer` usaba un `processCallback` que verificaba el ángulo del sprite. Ahora el callback es `undefined` (sin filtro), por lo que toda colisión dispara `onHitSpike()`.
