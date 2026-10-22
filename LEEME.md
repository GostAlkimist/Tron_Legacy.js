# Tron Legacy · En busca de una nueva realidad

Juego 3D de sigilo y decisiones, construido en JavaScript a partir del SRS (`docs/SRS_Tron_Legacy.md`) y el dosier (`docs/DOSSIER_Tron_Legacy.md`).
**No necesita Unity, instalación ni conexión a internet.** Sin dependencias: motor WebGL propio, audio sintetizado y modelos generados por código.

## Cómo jugar
1. Abre **`index.html`** con doble clic (o usa `JUGAR.bat` en Windows / `jugar.sh` en Linux y macOS).
2. Usa un navegador actual con WebGL: Chrome, Edge o Firefox. Se recomienda pantalla completa (F11).
3. Opcional: con Node.js, `node servidor.js` sirve el juego en `http://127.0.0.1:8080/`.

Duración aproximada: 10–15 minutos (3 sectores, 3 decisiones, 3 finales).

## Controles
| Tecla | Acción |
|---|---|
| W A S D / flechas | Mover |
| Shift | Correr |
| Ratón | Cámara (haz clic en la pantalla para capturarlo; si no, arrastra) |
| E | Interactuar a ≤ 3 m; mantener E 2 s para hackear puertas |
| 1 · 2 · 3 o clic | Elegir opción de diálogo |
| Espacio / Enter | Avanzar texto |
| Esc | Pausa (árbol de decisiones, cadena de rastro, ajustes) |
| H (o botón **?** arriba a la derecha) | Ayuda: lista de controles |
| M (o botón de altavoz) | Silenciar; el botón abre además los volúmenes de música y efectos |
| F3 / F11 | FPS / pantalla completa |

## Voces
Los diálogos, la introducción, los avisos educativos y los finales se leen en voz alta con la **síntesis de voz del navegador** (sin archivos de audio). Cada personaje tiene su propio tono y ritmo (Kernela seria, Bootina animada, el BIOS grave y lento, Elena, Don, el Sistema y el narrador); cuando eliges una opción, Don la dice antes de que responda el otro personaje (Espacio la salta).
- Usa las voces **en español instaladas en tu equipo** y prefiere las locales (funcionan sin conexión) y el español latinoamericano. Windows 10/11 con Chrome o Edge suele traerlas (Sabina, Raúl, Helena, Pablo…); en macOS también. En Linux puede hacer falta instalar voces del sistema.
- Si no hay voces en español, el juego sigue igual en texto y el panel de sonido lo avisa.
- El volumen de las voces se ajusta en el botón de altavoz (o en Ajustes) y **M** las silencia junto con el resto del sonido.

## Estructura
```
index.html, styles.css      Entrada y estilos
data/config.js              Todos los parámetros (velocidades, amenaza, confianza, URL de ArcasShred Pro)
data/texts.es.js            Textos en español (UTF-8)
data/dialogs/s1..s3.js      Árboles de diálogo externos (esquema SRS 3.5.1)
src/core/                   Lógica pura: SHA-256, cadena de rastro, confianza, amenaza, diálogo, decisiones, estado
src/engine/                 Motor WebGL (matemática, lotes, renderizador con bloom)
src/entities/               Jugador, NPC, centinelas, partículas, personajes procedurales
src/world/                  Constructor de niveles y los 3 sectores
src/voice.js                Voces de los personajes (Web Speech API)
src/ui/ui.js, src/game.js   Interfaz y bucle principal
tests/core.test.js          19 pruebas unitarias:  node --test tests/core.test.js
tools/                      Scripts de desarrollo opcionales (requieren Playwright)
```

## Antes de publicar
- **`data/config.js` → `arcasUrl`**: es un marcador (`https://example.com/arcasshred-pro`); cámbialo por la URL real de ArcasShred Pro.
- El título «Tron Legacy» es nombre de trabajo; su verificación marcaria está pendiente (RNF-LEG-02).
- Créditos: no hay assets de terceros; todo el contenido visual y sonoro se genera por código.

## Notas técnicas y decisiones
- Los diálogos son archivos `.js` (con contenido tipo JSON) y no `.json`, porque los navegadores bloquean leer archivos locales con `fetch` al abrir `index.html` directamente.
- La cadena de rastro usa SHA-256 propio en JavaScript puro (no depende de `crypto.subtle`, que no existe en todos los contextos `file://`). Detecta alteraciones dentro de la partida; no protege contra quien modifique el código.
- La telemetría (eventos y caídas de FPS) se guarda solo en `localStorage` y puede descargarse desde Ajustes; no hay red ni datos personales.
- Versión web: no se incluye ejecutable de escritorio.
- Las voces dependen del navegador y del sistema operativo: su calidad y disponibilidad varían, y no se han podido oír en el entorno de desarrollo (se probó la lógica con un sintetizador simulado).
- Pendientes frente al SRS: no se probó en GPU real ni con ratón físico (solo Chromium sin interfaz con render por software), ni se midió el rendimiento en equipos mínimos.
