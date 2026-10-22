# Trazabilidad SRS → implementación

| Área del SRS | Implementación | Verificación |
|---|---|---|
| RF-MOV (movimiento, cámara, correr, indicador de objetivo) | `entities/player.js`, `game.js` (cámara y HUD) | Recorrido automático |
| RF-INT (interacción ≤ 3 m, mantener E) | `core/geom.js` `inRange`, `game.js` `updateInteraction` | CP-03, hackeo en navegador |
| RF-EVA (amenaza, centinelas, esconderse, hackear, atajos) | `core/threat.js`, `entities/sentinel.js` | CP-05, CP-06, persecución real sin capturas |
| RF-DIA (diálogos externos, 3 opciones, confianza, banderas, variantes) | `core/dialogue.js`, `core/trust.js`, `data/dialogs/*` | Pruebas unitarias + validación de datos |
| RF-DEC (3 decisiones, efectos, cadena de rastro SHA-256, certificado) | `core/decisions.js`, `core/chain.js` | Pruebas unitarias; 3 finales en navegador |
| RF-EDU (borrar ≠ destruir, FTL, método y evidencia) | `world/sector2.js`, `data/texts.es.js` (`edu`) | Ramas firmware y sobrescribir en navegador |
| RF-NIV (3 sectores, checkpoints, transiciones) | `world/sector1..3.js`, `game.js` | Recorrido completo |
| RF-UI (HUD, pausa, árbol, cadena, final, créditos) | `ui/ui.js`, `styles.css` | Capturas revisadas |
| Ayuda y control de sonido (petición posterior) | `index.html` `#tools`, `ui.js` `_bindTools`, `game.js` `openHelp`/`toggleMute`, `audio.js` `setMuted` | Probado en navegador (clic y teclas H/M) |
| Voces de los diálogos (petición posterior) | `voice.js`, `game.js` (`_showView`, `dialogueChoose`), `ui.js`, `data/texts.es.js` (`voiceFix`) | Pruebas unitarias + navegador con sintetizador simulado; no se oyó voz real |
| RF-AUD (2 pistas, silencio en el juicio, efectos) | `audio.js` | Sin errores; no se evaluó la calidad auditiva |
| RF-MET / RNF-SEG (telemetría local) | `telemetry.js` | Sin errores |
| RNF-MAN (configuración externa, módulos) | `data/config.js`, estructura de carpetas | — |
