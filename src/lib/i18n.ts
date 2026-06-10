export type Locale = "en" | "es";

export type TranslationDict = Record<string, Record<Locale, string>>;

export const translations: TranslationDict = {
  /* EditorShell */
  "editor.title": { en: "2D Level Editor", es: "Editor de niveles 2D" },
  "editor.play": { en: "Play", es: "Play" },
  "editor.stop": { en: "Stop", es: "Stop" },
  "editor.statusRuntime": { en: "Runtime active", es: "Runtime activo" },
  "editor.statusEditor": { en: "Editor active", es: "Editor activo" },
  "editor.playAria": { en: "Play: start level runtime", es: "Play: iniciar runtime del nivel" },
  "editor.stopAria": { en: "Stop: stop level runtime", es: "Stop: detener runtime del nivel" },

  /* ToolPanel */
  "toolPanel.erase": { en: "Erase", es: "Borrar" },
  "toolPanel.edit": { en: "Edit", es: "Editar" },
  "toolPanel.eraseAria": { en: "Erase: eraser tool", es: "Borrar: herramienta de borrado" },
  "toolPanel.editAria": { en: "Edit: select element to edit properties", es: "Editar: seleccionar elemento para editar propiedades" },
  "toolPanel.tiles": { en: "Tiles", es: "Tiles" },
  "toolPanel.entities": { en: "Entities", es: "Entidades" },
  "toolPanel.selectTileAria": { en: "{{label}}: select tile {{type}}", es: "{{label}}: seleccionar tile {{type}}" },
  "toolPanel.selectEntityAria": { en: "{{label}}: select entity {{type}}", es: "{{label}}: seleccionar entidad {{type}}" },

  /* Tile names */
  "tile.ground": { en: "Ground", es: "Suelo" },
  "tile.brick": { en: "Brick", es: "Ladrillo" },
  "tile.platform": { en: "Platform", es: "Plataforma" },
  "tile.spikeUp": { en: "Spikes ↑", es: "Pinchos ↑" },
  "tile.spikeDown": { en: "Spikes ↓", es: "Pinchos ↓" },
  "tile.spikeLeft": { en: "Spikes ←", es: "Pinchos ←" },
  "tile.spikeRight": { en: "Spikes →", es: "Pinchos →" },

  /* Entity names */
  "entity.player": { en: "Player", es: "Jugador" },
  "entity.coin": { en: "Coin", es: "Moneda" },
  "entity.enemy": { en: "Enemy", es: "Enemigo" },
  "entity.goal": { en: "Goal", es: "Meta" },
  "entity.checkpoint": { en: "Checkpoint", es: "Checkpoint" },
  "entity.door": { en: "Door", es: "Puerta" },
  "entity.key": { en: "Key", es: "Llave" },

  /* LevelCanvas */
  "levelCanvas.title": { en: "Level Canvas", es: "Canvas del nivel" },
  "levelCanvas.description": { en: "Click or drag an object to place elements.", es: "Haz clic o arrastra un objeto para colocar elementos." },

  /* InspectorPanel */
  "inspector.title": { en: "Inspector", es: "Inspector" },
  "inspector.dimensions": { en: "Dimensions: {{width}} × {{height}}", es: "Dimensiones: {{width}} × {{height}}" },
  "inspector.tileCount": { en: "Tiles: {{count}}", es: "Tiles: {{count}}" },
  "inspector.entityCount": { en: "Entities: {{count}}", es: "Entidades: {{count}}" },
  "inspector.exportJson": { en: "Export JSON", es: "Exportar JSON" },
  "inspector.loadJson": { en: "Load JSON", es: "Cargar JSON" },
  "inspector.clearLevel": { en: "Clear Level", es: "Limpiar nivel" },
  "inspector.jsonPlaceholder": { en: "Paste level JSON here...", es: "JSON del nivel aquí..." },
  "inspector.jsonEditorAria": { en: "Level JSON editor", es: "Editor de JSON del nivel" },

  /* BackgroundPicker */
  "background.title": { en: "Background", es: "Background" },
  "background.dark": { en: "Dark", es: "Oscuro" },
  "background.sky": { en: "Sky", es: "Cielo" },
  "background.forest": { en: "Forest", es: "Bosque" },
  "background.desert": { en: "Desert", es: "Desierto" },
  "background.sunset": { en: "Sunset", es: "Atardecer" },
  "background.purple": { en: "Purple", es: "Púrpura" },
  "background.setAria": { en: "Set background to {{label}}", es: "Set background to {{label}}" },

  /* MusicPicker */
  "music.title": { en: "Music", es: "Música" },
  "music.calm": { en: "Calm", es: "Tranquila" },
  "music.adventure": { en: "Adventure", es: "Aventura" },
  "music.retro": { en: "Retro", es: "Retro" },
  "music.mystery": { en: "Mystery", es: "Misterio" },
  "music.boss": { en: "Boss", es: "Jefe" },
  "music.setAria": { en: "Set music to {{label}}", es: "Establecer música a {{label}}" },

  /* EditTargetInspector */
  "editTarget.tile": { en: "Tile", es: "Tile" },
  "editTarget.entity": { en: "Entity", es: "Entity" },
  "editTarget.name": { en: "Name", es: "Name" },
  "editTarget.position": { en: "Position", es: "Position" },
  "editTarget.collision": { en: "Collision", es: "Collision" },
  "editTarget.on": { en: "ON", es: "ON" },
  "editTarget.off": { en: "OFF", es: "OFF" },
  "editTarget.toggleCollisionAria": { en: "Toggle collision {{state}}", es: "Toggle collision {{state}}" },
  "editTarget.movement": { en: "Movement", es: "Movement" },
  "editTarget.direction": { en: "Direction", es: "Direction" },
  "editTarget.speed": { en: "Speed", es: "Speed" },
  "editTarget.range": { en: "Range", es: "Range" },
  "editTarget.none": { en: "None", es: "None" },
  "editTarget.upDown": { en: "Up-Down", es: "Up-Down" },
  "editTarget.leftRight": { en: "Left-Right", es: "Left-Right" },
  "editTarget.moveDirAria": { en: "Movement direction", es: "Movement direction" },
  "editTarget.moveSpeedAria": { en: "Movement speed", es: "Movement speed" },
  "editTarget.moveRangeAria": { en: "Movement range", es: "Movement range" },
  "editTarget.close": { en: "Close", es: "Close" },
  "editTarget.closeAria": { en: "Close element editor", es: "Close element editor" },

  /* EntityProperties */
  "entityProperties.title": { en: "{{type}} Properties", es: "{{type}} Properties" },
  "entityProperties.noProperties": { en: "No properties", es: "No properties" },
  "entityProperties.keyPlaceholder": { en: "key", es: "key" },
  "entityProperties.valuePlaceholder": { en: "value", es: "value" },
  "entityProperties.propertyAria": { en: "Property {{key}}", es: "Property {{key}}" },
  "entityProperties.newKeyAria": { en: "New property key", es: "New property key" },
  "entityProperties.newValueAria": { en: "New property value", es: "New property value" },
  "entityProperties.addAria": { en: "Add property", es: "Add property" },

  /* SampleLevels */
  "sampleLevels.title": { en: "Sample Levels", es: "Sample Levels" },
  "sampleLevels.loadAria": { en: "Load level: {{name}}", es: "Load level: {{name}}" },
  "sampleLevel.empty.name": { en: "Empty", es: "Vacío" },
  "sampleLevel.empty.description": { en: "Start from scratch", es: "Empezar desde cero" },
  "sampleLevel.first-steps.name": { en: "First Steps", es: "Primeros Pasos" },
  "sampleLevel.first-steps.description": { en: "A simple platform to get started", es: "Una plataforma simple para comenzar" },
  "sampleLevel.coin-run.name": { en: "Coin Run", es: "Carrera de Monedas" },
  "sampleLevel.coin-run.description": { en: "Collect coins while avoiding enemies", es: "Colecciona monedas mientras evitas enemigos" },
  "sampleLevel.danger-pass.name": { en: "Danger Pass", es: "Paso Peligroso" },
  "sampleLevel.danger-pass.description": { en: "Navigate through spikes and enemies", es: "Navega entre pinchos y enemigos" },
  "sampleLevel.sky-fortress.name": { en: "Sky Fortress", es: "Fortaleza Celestial" },
  "sampleLevel.sky-fortress.description": { en: "Ascend through floating platforms to reach the goal", es: "Asciende por plataformas flotantes hasta la meta" },
  "sampleLevel.underground.name": { en: "Underground", es: "Subterráneo" },
  "sampleLevel.underground.description": { en: "Navigate a tight cave with low ceilings and enemies", es: "Navega una cueva estrecha con techos bajos y enemigos" },
  "sampleLevel.speed-run.name": { en: "Speed Run", es: "Carrera de Velocidad" },
  "sampleLevel.speed-run.description": { en: "A flat sprint with enemies and obstacles in your way", es: "Un sprint plano con enemigos y obstáculos en tu camino" },
  "sampleLevel.treasure-tower.name": { en: "Treasure Tower", es: "Torre del Tesoro" },
  "sampleLevel.treasure-tower.description": { en: "Climb the tower and collect all the treasure", es: "Escala la torre y recoge todo el tesoro" },
  "sampleLevel.bridge-of-spikes.name": { en: "Bridge of Spikes", es: "Puente de Pinchos" },
  "sampleLevel.bridge-of-spikes.description": { en: "Cross the narrow bridge while spikes line the pit below", es: "Cruza el puente estrecho mientras los pinchos bordean el foso" },
  "sampleLevel.vertical-descent.name": { en: "Vertical Descent", es: "Descenso Vertical" },
  "sampleLevel.vertical-descent.description": { en: "Drop down a narrow shaft filled with platforms and danger", es: "Desciende por un pozo estrecho lleno de plataformas y peligro" },

  /* GameRuntime */
  "runtime.title": { en: "Phaser Runtime", es: "Runtime Phaser" },
  "runtime.description": { en: "The engine consumes the level JSON and uses simple arcade physics.", es: "El motor consume el nivel JSON y usa física arcade simple." },
  "runtime.ready": { en: "Runtime initialized successfully", es: "Runtime inicializado correctamente" },
  "runtime.initializing": { en: "Initializing runtime...", es: "Inicializando runtime..." },
  "runtime.errorLabel": { en: "Error: {{message}}", es: "Error: {{message}}" },
  "runtime.errorInit": { en: "Error initializing the game runtime.", es: "Error al inicializar el runtime del juego." },
  "runtime.hitboxesOn": { en: "Hitboxes ON", es: "Hitboxes ON" },
  "runtime.hitboxesOff": { en: "Hitboxes OFF", es: "Hitboxes OFF" },
  "runtime.showHitboxesAria": { en: "Show hitboxes", es: "Mostrar hitboxes" },
  "runtime.hideHitboxesAria": { en: "Hide hitboxes", es: "Ocultar hitboxes" },
  "runtime.stop": { en: "Stop", es: "Detener" },
  "runtime.stopAria": { en: "Stop runtime", es: "Detener runtime" },

  /* CameraControls */
  "camera.zoomInAria": { en: "Zoom in", es: "Zoom in" },
  "camera.zoomOutAria": { en: "Zoom out", es: "Zoom out" },
  "camera.resetZoomAria": { en: "Reset zoom", es: "Reset zoom" },

  /* GridCell */
  "gridCell.ariaLabel": { en: "Cell {{x}},{{y}}{{tile}}{{entity}}", es: "Celda {{x}},{{y}}{{tile}}{{entity}}" },

  /* RuntimeScene (Phaser game) */
  "runtimeScene.placePlayer": { en: "Place a player to start", es: "Coloca un jugador para empezar" },
  "runtimeScene.lives": { en: "♥ x {{count}}", es: "♥ x {{count}}" },
  "runtimeScene.checkpoint": { en: "Checkpoint!", es: "¡Checkpoint!" },
  "runtimeScene.needKey": { en: "Need a key!", es: "¡Necesitas una llave!" },
  "runtimeScene.doorOpened": { en: "Door opened!", es: "¡Puerta abierta!" },
  "runtimeScene.respawn": { en: "Respawn", es: "Reaparecer" },
  "runtimeScene.gameOver": { en: "GAME OVER", es: "GAME OVER" },
  "runtimeScene.levelComplete": { en: "LEVEL COMPLETE", es: "NIVEL COMPLETADO" },
  "runtimeScene.retry": { en: "Retry", es: "Reintentar" },
  "runtimeScene.stop": { en: "Stop", es: "Detener" },
};
