# Plataformas móviles

## ¿Qué es?

Las plataformas (tipo `platform`) pueden configurarse para moverse automáticamente en el runtime, ya sea de arriba a abajo o de izquierda a derecha.

Esto permite crear niveles con plataformas que el jugador debe alcanzar saltando, y que pueden transportarlo mientras se mueven.

## Cómo usar

1. Coloca una plataforma en el canvas.
2. Activa la herramienta **Editar** (botón ámbar en el panel de herramientas).
3. Haz clic en la plataforma para abrir sus propiedades en el inspector.
4. En la sección **Movement**:
   - **Direction**: elige `Up-Down` (vertical) o `Left-Right` (horizontal).
   - **Speed**: velocidad en píxeles por segundo (por defecto 100).
   - **Range**: distancia en píxeles antes de invertir la dirección (por defecto 96, equivalente a 3 celdas).

## Comportamiento en runtime

- La plataforma se mueve desde su posición inicial hacia una dirección, y al alcanzar el rango configurado invierte el sentido (va y vuelve).
- El jugador puede pararse sobre la plataforma y será transportado junto con ella.
- Las plataformas móviles colisionan con el jugador (como cualquier tile sólido) y también afectan a enemigos (colisionan con ellos).

## Propiedades técnicas

| Propiedad | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `moveAxis` | `"none"` \| `"vertical"` \| `"horizontal"` | `"none"` | Dirección del movimiento |
| `moveSpeed` | `number` | `100` | Velocidad en píxeles/segundo |
| `moveRange` | `number` | `96` | Distancia máxima antes de invertir (píxeles) |

Estas propiedades se almacenan en `tile.properties` dentro del JSON del nivel.
