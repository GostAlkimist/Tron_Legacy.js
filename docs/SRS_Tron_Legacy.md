**ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE**

**SRS**

**Tron Legacy**

_"En busca de una nueva realidad"_

Demo 3D jugable de aventura narrativa desarrollada en Python

| **Versión**                 | 1.0 — Borrador para revisión                                  |
| --------------------------- | ------------------------------------------------------------- |
| **Fecha de elaboración**    | Lunes 19 de octubre de 2026                                   |
| **Documento base**          | TRON_LEGACY_DOSSIER.docx (GDD v1.0 y Dosier del proyecto)     |
| **Entrega comprometida**    | Viernes 23 de octubre de 2026                                 |
| **Vinculación estratégica** | Pieza educativa y de marketing de ArcasShred Pro              |
| **Marco de referencia**     | Estructura basada en IEEE 830 / ISO/IEC/IEEE 29148 (adaptada) |

_Nota: "Tron Legacy" es el nombre de trabajo interno del proyecto. El título definitivo está pendiente de verificación marcaria (ver Anexo A)._

# Control del documento

## Historial de versiones

| **Versión** | **Fecha**  | **Estado** | **Descripción del cambio**                                                 |
| ----------- | ---------- | ---------- | -------------------------------------------------------------------------- |
| **1.0**     | 19/10/2026 | Borrador   | Primera especificación completa, derivada del dossier y adaptada a Python. |

## Convenciones de este documento

- **Identificadores:** cada requisito tiene un ID único con el formato RF-&lt;módulo&gt;-&lt;n&gt; (funcional) o RNF-&lt;categoría&gt;-&lt;n&gt; (no funcional).
- **Prioridad:** **E** = Esencial (forma parte del alcance mínimo viable), **D** = Deseable (se implementa si el plazo lo permite), **O** = Opcional.
- **Verificación:** Prueba (ejecución con resultado medible), Demostración (observación del comportamiento), Inspección (revisión de artefactos o código), Análisis (cálculo o medición con herramientas).
- **Origen de los valores:** los parámetros numéricos se marcan como "Dossier" (provienen del documento original) o "Propuesto" (definidos en este SRS para cerrar un vacío y sujetos a validación).
- **Redacción:** "deberá" indica obligación; "podrá" indica posibilidad.

## Contenido

# 1\. Introducción

## 1.1 Propósito

Este documento especifica los requisitos de software de la demo interactiva Tron Legacy: "En busca de una nueva realidad", descrita en el dossier del proyecto. Define qué debe hacer el sistema y bajo qué restricciones, de modo que pueda diseñarse, implementarse en Python, probarse y aceptarse de forma objetiva.

Está dirigido al programador, al diseñador narrativo, al artista 3D, al diseñador de audio, al tester y al fundador del proyecto (quien aprueba alcance, fecha y presupuesto).

## 1.2 Alcance

El producto es una aplicación de escritorio 3D en tercera persona, de 10 a 15 minutos de duración, en la que el jugador encarna a Don, un agente financiero atrapado en el universo interno de una computadora (la ciudad OpenCulin). A través de exploración, diálogo, evasión y tres decisiones clave, el jugador descubre por qué borrar información de verdad es más difícil de lo que parece.

Objetivos del producto (tomados del GDD):

| **Objetivo**                    | **Criterio de éxito**                               | **Cómo lo soporta el software**                                        |
| ------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------- |
| **Entretenimiento**             | ≥ 8/10 de satisfacción en jugadores de prueba       | Exploración, diálogos con humor, persecución con tensión, tres finales |
| **Educación**                   | ≥ 80 % explica correctamente el concepto tras jugar | Puzzle del Sector 2, cadena de rastro visible, mensajes explicativos   |
| **Promoción de ArcasShred Pro** | ≥ 50 % visita el sitio web al finalizar             | Pantalla final con enlace directo y certificado de final               |

Dentro del alcance: demo jugable de tres sectores, cuatro personajes con diálogo, tres puntos de decisión, tres finales, cadena de rastro visible, HUD, menús, audio, ejecutable de escritorio y material de distribución (README, créditos, página de descarga).

Fuera del alcance (según la sección "Lo que el proyecto NO es" del dossier):

- Un videojuego comercial completo: no hay monetización, tienda ni modo multijugador.
- Un simulador técnico: la demo no enseña comandos ni interfaces reales de borrado seguro.
- Combate físico: el conflicto se resuelve corriendo, escondiéndose y convenciendo.
- Continuación garantizada: el contenido posterior depende de resultados y presupuesto.

## 1.3 Definiciones, acrónimos y abreviaturas

| **Término**               | **Definición**                                                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **SRS**                   | Software Requirements Specification: este documento.                                                                              |
| **GDD / Dossier**         | Documento de Diseño de Juego y Dosier del proyecto (archivo TRON_LEGACY_DOSSIER.docx).                                            |
| **TPS**                   | Perspectiva de tercera persona (third-person).                                                                                    |
| **HUD**                   | Interfaz superpuesta que muestra información de juego en pantalla.                                                                |
| **NPC**                   | Personaje no jugable.                                                                                                             |
| **OpenCulin**             | Ciudad ficticia donde se conectan todos los programas; escenario de la demo.                                                      |
| **Consejo de los OS**     | Órgano que gobierna OpenCulin y persigue a Don por considerarlo un intruso.                                                       |
| **BIOS**                  | Autoridad suprema del mundo virtual; emite el juicio final.                                                                       |
| **Centinela**             | Entidad del Consejo de los OS que patrulla y detecta a Don (enemigo de evasión, sin combate).                                     |
| **Programas de arranque** | Aliados iniciales que explican las reglas del mundo; incluyen a dos personajes con diálogo.                                       |
| **Archivo residual**      | Dato que permanece en el medio tras un borrado aparente.                                                                          |
| **FTL**                   | Flash Translation Layer: capa interna de un SSD que redirige las escrituras; base del enigma del Sector 2.                        |
| **SSD**                   | Unidad de estado sólido.                                                                                                          |
| **Cadena de rastro**      | Registro encadenado por hash (SHA-256) de las decisiones del jugador; versión lúdica de la cadena de evidencia de ArcasShred Pro. |
| **PD-1, PD-2, PD-3**      | Los tres puntos de decisión de la demo.                                                                                           |
| **Checkpoint**            | Punto de reaparición tras una captura.                                                                                            |
| **glTF**                  | Formato abierto de modelos 3D utilizado para importar assets al motor.                                                            |
| **Panda3D**               | Motor 3D de código abierto con API en Python, adoptado como base técnica de este SRS.                                             |
| **MVP**                   | Alcance mínimo viable: conjunto de requisitos de prioridad Esencial.                                                              |
| **FPS**                   | Fotogramas por segundo.                                                                                                           |

## 1.4 Referencias

- TRON_LEGACY_DOSSIER.docx — GDD v1.0 (21 de enero de 2025) y Dosier del proyecto (19 de octubre de 2026).
- IEEE Std 830-1998, Recommended Practice for Software Requirements Specifications.
- ISO/IEC/IEEE 29148:2018, Systems and software engineering — Requirements engineering.
- Documentación oficial de Python (módulos hashlib, json, pathlib, logging) y de Panda3D.

## 1.5 Organización del documento

La sección 2 describe el producto de forma general y la decisión tecnológica. La sección 3 contiene los requisitos específicos (interfaces, funcionales, parámetros, no funcionales, datos y contenido). La sección 4 propone una arquitectura de referencia. Las secciones 5 a 7 cubren verificación, riesgos y plan de entrega. Los anexos recogen las ambigüedades detectadas en el dossier con la decisión asumida en cada caso, y la matriz de trazabilidad.

# 2\. Descripción general

## 2.1 Perspectiva del producto

La demo es un producto autónomo y sin conexión: no depende de servidores ni de ArcasShred Pro para funcionar. Su única relación con el exterior es un enlace que abre el sitio de ArcasShred Pro en el navegador del sistema al finalizar. Funciona como pieza de comunicación del producto empresarial: entretiene y, al terminar, deja la pregunta "¿y cómo se borra bien, entonces?", que solo ArcasShred Pro responde.

## 2.2 Funciones del producto

- **Explorar** OpenCulin en tercera persona a lo largo de tres sectores conectados.
- **Dialogar** con los habitantes del sistema mediante árboles de opciones que modifican su confianza.
- **Evadir** al Consejo de los OS mediante una barra de amenaza, escondites y puertas hackeables, sin combate.
- **Decidir** en tres puntos clave que cambian diálogos, rutas y final.
- **Aprender** mediante el puzzle del Sector 2 (lo "borrado" sigue visible) y mensajes explicativos.
- **Registrar** cada decisión en una cadena de rastro verificable por hash y mostrarla al jugador.
- **Cerrar** con uno de tres finales, un certificado propio de cada final y un enlace a ArcasShred Pro.

## 2.3 Clases de usuario

| **Clase de usuario**                       | **Interés**                                                 | **Implicación para el software**                                             |
| ------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Público general curioso**                | Disfrutar una aventura breve y salir sabiendo algo nuevo    | Tutorial claro; sin conocimientos previos de videojuegos ni de TI            |
| **Profesionales de TI y seguridad**        | Reconocer el chiste interno y validar la precisión técnica  | Metáforas técnicamente correctas (FTL, sobrescritura, borrado criptográfico) |
| **Tomadores de decisión empresariales**    | Entender el problema de cumplimiento sin leer un whitepaper | Mensajes educativos concisos y certificado final legible                     |
| **Estudiantes de tecnología**              | Material introductorio memorable                            | Explicaciones en lenguaje llano al resolver el puzzle                        |
| **Clientes potenciales de ArcasShred Pro** | Ver el problema y, acto seguido, la solución                | Enlace destacado en la pantalla final                                        |
| **Equipo interno (desarrollo y QA)**       | Probar, medir y depurar                                     | Modo de diagnóstico (FPS, log) y telemetría local                            |

## 2.4 Entorno operativo

_Los valores siguientes son propuestos y deben validarse en las tres PCs de prueba exigidas por el checklist de entrega._

| **Componente**        | **Mínimo**                                                          | **Recomendado**                 |
| --------------------- | ------------------------------------------------------------------- | ------------------------------- |
| **Sistema operativo** | Windows 10 de 64 bits                                               | Windows 11 de 64 bits           |
| **Procesador**        | 4 núcleos, ~2,5 GHz                                                 | 6 núcleos o más                 |
| **Memoria RAM**       | 8 GB                                                                | 16 GB                           |
| **Gráficos**          | Compatible con OpenGL 3.3 (p. ej., gráfica integrada Intel UHD 620) | Gráfica dedicada de gama básica |
| **Almacenamiento**    | 1 GB libres                                                         | SSD con 2 GB libres             |
| **Resolución**        | 1280 × 720                                                          | 1920 × 1080                     |
| **Periféricos**       | Teclado, mouse y salida de audio                                    | Ídem                            |

## 2.5 Pila tecnológica adoptada (Python)

**Decisión tecnológica**

El dossier recomienda Unity 2022 LTS con C#. Para este SRS se **sustituye por Python**, por instrucción expresa del solicitante. El cambio afecta la plataforma web, el flujo de trabajo y el riesgo de plazo; los efectos se tratan en 2.6, 6 y el Anexo A.

| **Capa**                   | **Dossier original** | **Adoptado en este SRS**                                                                                 |
| -------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------- |
| **Lenguaje**               | C#                   | Python 3.11 o superior (64 bits)                                                                         |
| **Motor / render 3D**      | Unity 2022 LTS       | Panda3D 1.10.x (OpenGL). Alternativa admitida: Ursina, que se apoya en Panda3D                           |
| **Importación de modelos** | Asset Store / FBX    | glTF 2.0 mediante panda3d-gltf; los FBX de Mixamo se convierten previamente a glTF (p. ej., con Blender) |
| **Animación**              | Mixamo + Animator    | Mixamo (convertido a glTF) + Actor de Panda3D                                                            |
| **Interfaz**               | Unity UI Toolkit     | DirectGUI de Panda3D (menús, HUD y diálogos)                                                             |
| **Audio**                  | Audio de Unity       | Gestor de audio de Panda3D (OpenAL)                                                                      |
| **Datos y configuración**  | ScriptableObjects    | Archivos JSON en UTF-8 (diálogos, configuración)                                                         |
| **Cadena de rastro**       | No especificado      | hashlib (SHA-256) de la biblioteca estándar                                                              |
| **Pruebas**                | No especificado      | pytest para la lógica del juego                                                                          |
| **Empaquetado**            | WebGL 2.0 + .exe     | PyInstaller (carpeta ejecutable para Windows)                                                            |
| **Versionado**             | Git + Git LFS        | Git + Git LFS (sin cambios)                                                                              |

## 2.6 Restricciones

- **Plazo:** entrega el viernes 23 de octubre de 2026. Con elaboración el lunes 19, quedan cinco jornadas de trabajo (jornadas de unas 6 horas según el dossier).
- **Presupuesto:** de USD 0 a 20 en la opción mínima; hasta USD 120–210 en la recomendada. Se prioriza el uso de assets gratuitos (Kenney, Mixamo, itch.io, Freesound, música Creative Commons).
- **Lenguaje:** Python. No se utilizará Unity ni C#.
- **Plataforma web:** Python no ofrece hoy una vía estable para ejecutar un juego 3D en el navegador. El requisito de WebGL del dossier se sustituye por un ejecutable de escritorio más una página web de descarga (RF-PKG-03); un build de navegador queda como opción experimental (RF-PKG-04).
- **Sin combate físico, sin salto y sin multijugador**, para acotar el alcance al plazo.
- **Idioma:** el contenido se presenta en español.
- **Propiedad intelectual:** no se pueden usar elementos protegidos de la franquicia audiovisual homónima; el título es un nombre de trabajo.

## 2.7 Supuestos y dependencias

- Se dispone de un programador con dominio de Python; el diseñador narrativo, el artista 3D, el diseñador de audio y el tester pueden ser externos.
- Los assets gratuitos seleccionados tienen licencia compatible con uso promocional y se pueden convertir a glTF sin pérdida relevante.
- El guion final con los tres finales estará cerrado antes del día 2; el dossier señala que el documento original está truncado a mitad de la escena de persecución inicial.
- Se dispondrá de la URL definitiva de ArcasShred Pro para el enlace final; mientras tanto se parametriza en la configuración.
- Existen tres PCs de prueba con características distintas y al menos tres usuarios para playtest.

## 2.8 Priorización y alcance mínimo viable

El MVP está formado por todos los requisitos de prioridad E. Si el plazo se compromete, el dossier prevé esta reducción progresiva, que este SRS adopta como plan de contingencia:

| **Nivel**                    | **Alcance**                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Plan A (completo)**        | Tres sectores, tres decisiones y tres finales; requisitos E y los D que el tiempo permita.                                                       |
| **Plan B (reducido)**        | Dos sectores (Entrada y Archivos) con un único final; se mantienen RF-DEC, RF-EDU y RF-FIN-02 para conservar la tesis educativa y la conversión. |
| **Plan C (mínimo absoluto)** | Demo de 2–3 minutos: un sector, una decisión, cadena de rastro y pantalla final con enlace.                                                      |

# 3\. Requisitos específicos

## 3.1 Interfaces externas

### 3.1.1 Interfaz de usuario: controles

| **Entrada**          | **Acción**                                              |
| -------------------- | ------------------------------------------------------- |
| **W, A, S, D**       | Mover a Don (relativo a la cámara)                      |
| **Shift (mantener)** | Correr                                                  |
| **Mouse**            | Rotar la cámara con suavizado                           |
| **E**                | Interactuar (hasta 3 m del objetivo)                    |
| **1, 2, 3 o clic**   | Elegir opción de diálogo                                |
| **Espacio / Enter**  | Avanzar o completar el texto de un diálogo              |
| **Esc**              | Abrir o cerrar el menú de pausa                         |
| **F11**              | Alternar pantalla completa                              |
| **F3**               | Mostrar u ocultar el contador de FPS (modo diagnóstico) |

Estilo visual (dirección artística del dossier): paleta de azules profundos, cian y violeta sobre negro, con naranja reservado para alertas; geometría limpia con líneas de circuito y superficies emisivas; neón volumétrico, sombras duras y bruma; estética tecno-noir sin imitar diseños protegidos.

### 3.1.2 Interfaces de hardware

Pantalla con soporte OpenGL 3.3, teclado, mouse y dispositivo de audio. No se requiere gamepad.

### 3.1.3 Interfaces de software

| **Software**                             | **Uso**                                                   |
| ---------------------------------------- | --------------------------------------------------------- |
| **Windows 10/11 (64 bits)**              | Sistema operativo objetivo del ejecutable                 |
| **Python 3.11+**                         | Entorno de desarrollo (no requerido por el usuario final) |
| **panda3d, panda3d-gltf**                | Motor 3D e importación de modelos glTF                    |
| **pytest**                               | Pruebas unitarias de la lógica del juego                  |
| **PyInstaller**                          | Empaquetado del ejecutable                                |
| **Navegador predeterminado del sistema** | Apertura del enlace a ArcasShred Pro (módulo webbrowser)  |

### 3.1.4 Interfaces de comunicaciones

El juego no establece conexiones de red. La única acción relacionada es solicitar al sistema operativo que abra una URL en el navegador.

## 3.2 Requisitos funcionales

### 3.2.1 Aplicación y flujo (APP)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                                                                       | **Prior.** | **Verificación** |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-APP-01** | Mostrar al iniciar un menú principal con las opciones Jugar, Controles, Créditos y Salir.                                                                                                | E          | Demostración     |
| **RF-APP-02** | Mostrar una secuencia de introducción (Acto I) en la que Don prueba el videojuego en su computadora doméstica y es absorbido al interior del sistema, mediante texto y efectos visuales. | E          | Demostración     |
| **RF-APP-03** | Encadenar la experiencia en el orden: introducción → Sector 1 → Sector 2 → Sector 3 → final → pantalla final → créditos.                                                                 | E          | Prueba           |
| **RF-APP-04** | Ofrecer un menú de pausa (Esc) con Reanudar, Ver árbol de decisiones, Ver cadena de rastro, Controles y Salir al menú.                                                                   | E          | Prueba           |
| **RF-APP-05** | Permitir reiniciar la partida desde la pantalla final y desde el menú principal, reinicializando todo el estado de juego.                                                                | E          | Prueba           |
| **RF-APP-06** | Presentar todo el texto en español con soporte de á, é, í, ó, ú, ü, ñ, ¿ y ¡ en la tipografía utilizada.                                                                                 | E          | Inspección       |
| **RF-APP-07** | Mostrar una pantalla de créditos con la atribución de todos los assets de terceros.                                                                                                      | E          | Inspección       |
| **RF-APP-08** | Ofrecer ajustes de volumen de música, volumen de efectos y sensibilidad del mouse, y permitir alternar pantalla completa con F11.                                                        | D          | Demostración     |

### 3.2.2 Movimiento y cámara (MOV)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                    | **Prior.** | **Verificación** |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-MOV-01** | Mantener una cámara en tercera persona que siga a Don a una distancia configurable (propuesta: 4 m) sin atravesar muros.              | E          | Demostración     |
| **RF-MOV-02** | Permitir la rotación libre de la cámara con el mouse, con suavizado y límites de inclinación vertical.                                | E          | Demostración     |
| **RF-MOV-03** | Mover a Don con W, A, S, D relativo a la orientación de la cámara, y correr mientras se mantiene Shift, con las velocidades de 3.3.   | E          | Prueba           |
| **RF-MOV-04** | Impedir que Don atraviese edificios o muros y que salga de los límites del sector.                                                    | E          | Prueba           |
| **RF-MOV-05** | Mostrar en el HUD un indicador de objetivo con la dirección y la distancia (en metros) al objetivo activo.                            | E          | Demostración     |
| **RF-MOV-06** | Orientar el modelo de Don hacia su dirección de movimiento con un giro suave.                                                         | D          | Demostración     |
| **RF-MOV-07** | Reproducir las animaciones de reposo, caminar y correr según la velocidad real, y una animación de conversación durante los diálogos. | D          | Demostración     |
| **RF-MOV-08** | No ofrecer salto, de forma intencional, para acotar el alcance.                                                                       | E          | Inspección       |

### 3.2.3 Interacción (INT)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                         | **Prior.** | **Verificación** |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| **RF-INT-01** | Activar un objeto o NPC interactuable al pulsar E cuando la distancia entre Don y el objeto sea menor o igual a 3 m.                       | E          | Prueba           |
| **RF-INT-02** | Resaltar el interactuable más cercano dentro del alcance y mostrar una indicación contextual (p. ej., "\[E\] Hablar", "\[E\] Esconderse"). | E          | Demostración     |
| **RF-INT-03** | Soportar los tipos de interacción: conversar, ocultarse, hackear puerta, activar elemento del puzzle y tomar una decisión.                 | E          | Demostración     |
| **RF-INT-04** | Deshabilitar la interacción durante un diálogo activo, una captura o una transición entre sectores.                                        | E          | Prueba           |

### 3.2.4 Diálogo y confianza (DIA)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                                                                                                                                                                                       | **Prior.** | **Verificación** |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-DIA-01** | Cargar el contenido de los diálogos desde archivos JSON externos con el esquema de 3.5.1; no se admiten diálogos incrustados en el código.                                                                                                                                                               | E          | Inspección       |
| **RF-DIA-02** | Mostrar en cada nodo el hablante, el texto y hasta tres opciones de respuesta; un nodo sin opciones avanza con Espacio o Enter.                                                                                                                                                                          | E          | Prueba           |
| **RF-DIA-03** | Permitir elegir la opción con las teclas 1, 2 o 3, o con clic.                                                                                                                                                                                                                                           | E          | Prueba           |
| **RF-DIA-04** | Permitir que cada opción modifique la confianza de un NPC (delta), active o desactive banderas, y desbloquee nodos, accesos o rutas posteriores.                                                                                                                                                         | E          | Prueba           |
| **RF-DIA-05** | Mantener la confianza de cada NPC como un entero entre 0 y 100, saturado en los límites, con valor inicial parametrizable (propuesto: 50).                                                                                                                                                               | E          | Prueba           |
| **RF-DIA-06** | Calcular la "confianza de aliados" como el promedio de la confianza de las dos programadoras de arranque, y habilitar el atajo de RF-NIV-05 cuando sea ≥ 70.                                                                                                                                             | E          | Prueba           |
| **RF-DIA-07** | Implementar el diálogo de ejemplo del dossier: la programadora de arranque pregunta "¿Qué haces aquí, archivo no reconocido?" con tres respuestas (identificarse como Don, agente financiero; preguntar dónde está; guardar silencio aceptando el riesgo), cada una con efecto distinto en la confianza. | E          | Prueba           |
| **RF-DIA-08** | Variar textos, rutas y accesos según las banderas activadas por decisiones y respuestas previas.                                                                                                                                                                                                         | E          | Prueba           |
| **RF-DIA-09** | Mostrar el texto con efecto de máquina de escribir, completable de inmediato con Espacio o Enter.                                                                                                                                                                                                        | D          | Demostración     |
| **RF-DIA-10** | Bloquear el movimiento de Don y orientar la cámara hacia el interlocutor durante el diálogo.                                                                                                                                                                                                             | D          | Demostración     |

### 3.2.5 Evitación y amenaza (EVA)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                                                                               | **Prior.** | **Verificación** |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| **RF-EVA-01** | Mostrar en el HUD una barra de amenaza con valores de 0 a 100.                                                                                                                                   | E          | Demostración     |
| **RF-EVA-02** | Incrementar la barra mientras algún centinela vea a Don (dentro de su cono y distancia de visión y con línea de visión libre), con la tasa de 3.3; fuera de la vista, la barra decae lentamente. | E          | Prueba           |
| **RF-EVA-03** | Al llegar la barra a 100, capturar a Don: mostrar la pantalla de captura y reaparecerlo en el último checkpoint con la amenaza en 0, conservando las decisiones y la cadena de rastro.           | E          | Prueba           |
| **RF-EVA-04** | Permitir que Don se oculte en puntos de escondite (interacción E); tras 10 segundos continuos oculto, reducir la amenaza al 50 % de su valor actual.                                             | E          | Prueba           |
| **RF-EVA-05** | Implementar centinelas con rutas de patrulla por puntos de paso y los estados patrulla, alerta y búsqueda.                                                                                       | E          | Demostración     |
| **RF-EVA-06** | Implementar una primera persecución guionizada al final del Sector 1 que cierre el Acto I.                                                                                                       | E          | Demostración     |
| **RF-EVA-07** | No incluir ataques, daño ni combate físico de ningún tipo.                                                                                                                                       | E          | Inspección       |
| **RF-EVA-08** | Permitir hackear puertas mediante una interacción breve (p. ej., mantener E durante 2 s) que abre rutas alternativas.                                                                            | D          | Demostración     |

### 3.2.6 Decisiones y cadena de rastro (DEC)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                                                                                                   | **Prior.** | **Verificación** |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-DEC-01** | Incluir exactamente tres puntos de decisión: PD-1 (encuentro con los programas de arranque), PD-2 (sector de archivos residuales) y PD-3 (ante el BIOS).                                                             | E          | Inspección       |
| **RF-DEC-02** | PD-1 deberá ofrecer Aceptar ayuda o Ignorar. Aceptar aumenta la confianza de aliados y habilita ayuda en el Sector 2; ignorar eleva el riesgo de captura (tasa de amenaza ×1,25).                                    | E          | Prueba           |
| **RF-DEC-03** | PD-2 deberá ofrecer Sobrescribir o Usar comando de firmware. Sobrescribir deja los archivos visibles (ver RF-EDU-03) y añade tiempo de travesía; el comando de firmware resuelve el enigma de forma definitiva.      | E          | Prueba           |
| **RF-DEC-04** | PD-3 deberá ofrecer Destruir el rastro (borrado criptográfico), Rescatar los datos (para E-cofr) o Escapar con Elena, y determinar el final.                                                                         | E          | Prueba           |
| **RF-DEC-05** | Registrar cada decisión en la cadena de rastro con los campos de 3.5.2, calculando el hash SHA-256 de cada bloque a partir del hash del anterior.                                                                    | E          | Prueba           |
| **RF-DEC-06** | Exponer una función de verificación de la cadena que devuelva si es íntegra y, si no, el índice del primer bloque alterado; la aplicación no deberá ofrecer ninguna operación para modificar bloques ya registrados. | E          | Prueba           |
| **RF-DEC-07** | Mostrar en el menú de pausa el árbol de decisiones, resaltando el camino recorrido, y la cadena de rastro con sus hashes abreviados.                                                                                 | E          | Demostración     |
| **RF-DEC-08** | Conservar el estado de decisiones, banderas y confianza entre sectores.                                                                                                                                              | E          | Prueba           |
| **RF-DEC-09** | Generar al final un certificado distinto por cada final, que incluya el título del final, las decisiones tomadas, la longitud de la cadena y su hash final.                                                          | E          | Demostración     |

### 3.2.7 Niveles y mundo (NIV)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                                              | **Prior.** | **Verificación** |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-NIV-01** | Sector 1 — Entrada (~3 min): tutorial de movimiento, interacción, diálogo y escondite; encuentro con las programadoras de arranque (PD-1); primera persecución. | E          | Demostración     |
| **RF-NIV-02** | Sector 2 — Archivos residuales (~5 min): puzzle educativo (sección 3.2.8) y PD-2.                                                                               | E          | Demostración     |
| **RF-NIV-03** | Sector 3 — Núcleo BIOS (~4 min): juicio del BIOS, PD-3, final y desenlace.                                                                                      | E          | Demostración     |
| **RF-NIV-04** | Realizar las transiciones entre sectores con pantalla de carga o fundido, cargando los assets del sector siguiente antes de entrar.                             | E          | Demostración     |
| **RF-NIV-05** | Si la confianza de aliados es ≥ 70, abrir un atajo que acorte y reduzca la vigilancia del recorrido por el Sector 2; el atajo no omite el puzzle educativo.     | E          | Prueba           |
| **RF-NIV-06** | Crear checkpoints al inicio de cada sector y tras cada punto de decisión.                                                                                       | E          | Prueba           |
| **RF-NIV-07** | Lograr que una partida completa dure entre 10 y 15 minutos para un jugador que no se pierde.                                                                    | E          | Prueba           |

### 3.2.8 Puzzle educativo del Sector 2 (EDU)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                                                                                                                                                                             | **Prior.** | **Verificación** |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-EDU-01** | Representar dos capas visibles en el Sector 2: el "sistema de archivos" (nombres y referencias) y las "celdas físicas" (donde reside el contenido).                                                                                                                                            | E          | Demostración     |
| **RF-EDU-02** | Mostrar archivos supuestamente borrados como entidades que siguen vivas y visibles en las celdas físicas.                                                                                                                                                                                      | E          | Demostración     |
| **RF-EDU-03** | Al elegir Sobrescribir, mostrar que el archivo parece cambiar pero reaparece en otra celda (metáfora de la FTL), de modo que el jugador descubra por sí mismo que sobrescribir no basta.                                                                                                       | E          | Demostración     |
| **RF-EDU-04** | Exigir al jugador localizar y activar un elemento del mundo que represente un "comando de firmware", sin mostrar sintaxis ni interfaces reales de comandos ATA o NVMe.                                                                                                                         | E          | Demostración     |
| **RF-EDU-05** | Al resolver el puzzle, mostrar un mensaje en lenguaje llano que explique que borrar elimina la referencia y no la información, y por qué en un SSD sobrescribir puede no tocar las celdas reales.                                                                                              | E          | Inspección       |
| **RF-EDU-06** | Presentar durante la demo, al menos una vez, cada uno de los tres conceptos de la tesis educativa: (1) borrar quita la referencia, no el contenido; (2) en SSD la capa de traducción puede engañar a la sobrescritura; (3) borrar bien exige método según el medio y evidencia de que se hizo. | E          | Inspección       |
| **RF-EDU-07** | Mostrar tras el final una pregunta abierta opcional ("¿Qué entendiste sobre cómo se borra información de verdad?") y guardar la respuesta solo de forma local.                                                                                                                                 | O          | Demostración     |

### 3.2.9 Finales y conversión (FIN)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                             | **Prior.** | **Verificación** |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| **RF-FIN-01** | Implementar tres finales con la narrativa y lectura educativa de la tabla siguiente.                                           | E          | Demostración     |
| **RF-FIN-02** | Mostrar una pantalla final con un botón "Conocer ArcasShred Pro" que abra en el navegador la URL definida en la configuración. | E          | Prueba           |
| **RF-FIN-03** | Separar visualmente la identidad del juego de la del producto ArcasShred Pro para evitar confusión.                            | D          | Inspección       |
| **RF-FIN-04** | Registrar localmente el clic en el enlace como evento (ver RF-MET-01).                                                         | D          | Prueba           |

| **Final (PD-3)**       | **Qué hace Don**                            | **Consecuencia narrativa**                            | **Lectura educativa**                               |
| ---------------------- | ------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| **Destruir el rastro** | Provoca el borrado criptográfico del núcleo | Escapa limpio, pero pierde la información de Day-Play | El borrado criptográfico es irreversible por diseño |
| **Rescatar los datos** | Copia la información para E-cofr            | Sale con el botín, pero deja rastro verificable       | La evidencia sobrevive al intento de ocultamiento   |
| **Escapar con Elena**  | Prioriza salir sin resolver el sistema      | Final agridulce; el sistema queda intacto             | Lo que no se sanitiza, permanece                    |

### 3.2.10 Interfaz y HUD (UI)

| **ID**       | **Requisito (El sistema deberá…)**                                                                                                                                                                                                                             | **Prior.** | **Verificación** |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-UI-01** | Implementar los ocho elementos de interfaz del GDD: barra de amenaza, indicador de objetivo, indicación de interacción, caja de diálogo, selector de opciones, menú de pausa, vista de árbol de decisiones y cadena de rastro, y pantallas de captura y final. | E          | Inspección       |
| **RF-UI-02** | Mostrar la alerta de amenaza con color naranja acompañado de un icono, sin depender solo del color.                                                                                                                                                            | D          | Inspección       |
| **RF-UI-03** | Mostrar el nivel de confianza de aliados en la vista de pausa.                                                                                                                                                                                                 | D          | Demostración     |
| **RF-UI-04** | Mostrar indicaciones de control contextuales durante el tutorial del Sector 1.                                                                                                                                                                                 | E          | Demostración     |

### 3.2.11 Audio (AUD)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                            | **Prior.** | **Verificación** |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-AUD-01** | Reproducir música de fondo de ambiente sintético con al menos una pista; objetivo: tres pistas (exploración, persecución y juicio).           | E          | Demostración     |
| **RF-AUD-02** | Reproducir efectos y sonidos ambientales (objetivo: cinco), con pulsos rítmicos durante la persecución y silencio durante el juicio del BIOS. | D          | Demostración     |
| **RF-AUD-03** | Permitir ajustar por separado el volumen de música y el de efectos.                                                                           | D          | Demostración     |

### 3.2.12 Métricas y diagnóstico (MET)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                                                                                          | **Prior.** | **Verificación** |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-MET-01** | Registrar localmente, en un archivo de texto, eventos con marca de tiempo: inicio de partida, entrada a sector, decisión, captura, final alcanzado, clic en el enlace y tiempo total; sin datos personales. | D          | Inspección       |
| **RF-MET-02** | Mostrar un contador de FPS en modo diagnóstico (F3) y registrar las caídas de rendimiento.                                                                                                                  | D          | Demostración     |

### 3.2.13 Empaquetado y distribución (PKG)

| **ID**        | **Requisito (El sistema deberá…)**                                                                                                     | **Prior.** | **Verificación** |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RF-PKG-01** | Empaquetar la demo para Windows como una carpeta ejecutable (PyInstaller o equivalente) que no requiera tener Python instalado.        | E          | Prueba           |
| **RF-PKG-02** | Incluir un README con requisitos, instrucciones de ejecución, controles, solución de problemas y créditos de assets con sus licencias. | E          | Inspección       |
| **RF-PKG-03** | Publicar una página web de descarga con el ejecutable, un video de gameplay de 2–3 minutos y el enlace a ArcasShred Pro.               | E          | Inspección       |
| **RF-PKG-04** | Evaluar de forma experimental una versión ejecutable en navegador; su ausencia no impide la aceptación.                                | O          | Demostración     |
| **RF-PKG-05** | Mantener el código en un repositorio Git con Git LFS y la estructura de carpetas de la sección 4.                                      | E          | Inspección       |
| **RF-PKG-06** | Proveer un script reproducible que construya el ejecutable desde el repositorio.                                                       | D          | Prueba           |

## 3.3 Parámetros y reglas numéricas

El dossier deja pendiente "especificar el sistema de diálogo con reglas numéricas". La tabla reúne los valores del dossier y los propuestos para cerrar ese vacío; todos residen en config.json y pueden ajustarse sin tocar el código.

| **Parámetro**                                                  | **Valor**                               | **Origen** | **Requisito** |
| -------------------------------------------------------------- | --------------------------------------- | ---------- | ------------- |
| **Alcance de interacción**                                     | 3 m                                     | Dossier    | RF-INT-01     |
| **Rango de confianza de NPC**                                  | 0 – 100                                 | Dossier    | RF-DIA-05     |
| **Umbral de atajo (confianza de aliados)**                     | ≥ 70                                    | Dossier    | RF-DIA-06     |
| **Captura por amenaza**                                        | 100                                     | Dossier    | RF-EVA-03     |
| **Ocultarse: tiempo y reducción**                              | 10 s continuos → −50 % del valor actual | Dossier    | RF-EVA-04     |
| **Puntos de decisión**                                         | 3                                       | Dossier    | RF-DEC-01     |
| **Confianza inicial por NPC**                                  | 50                                      | Propuesto  | RF-DIA-05     |
| **Variación de confianza por opción**                          | ±10 (leve), ±20 (fuerte)                | Propuesto  | RF-DIA-04     |
| **Velocidad al caminar / correr**                              | 3,5 m/s / 6,5 m/s                       | Propuesto  | RF-MOV-03     |
| **Distancia de la cámara**                                     | 4 m                                     | Propuesto  | RF-MOV-01     |
| **Cono y distancia de visión del centinela**                   | 90° y 15 m                              | Propuesto  | RF-EVA-02     |
| **Aumento de amenaza con visión directa**                      | +20 por segundo                         | Propuesto  | RF-EVA-02     |
| **Decaimiento de amenaza fuera de la vista**                   | −5 por segundo                          | Propuesto  | RF-EVA-02     |
| **Multiplicador de amenaza si se ignora a los aliados (PD-1)** | ×1,25                                   | Propuesto  | RF-DEC-02     |
| **Penalización de tiempo por sobrescribir (PD-2)**             | +60 s de travesía                       | Propuesto  | RF-DEC-03     |
| **Duración de la partida**                                     | 10 – 15 min (≈ 3 + 5 + 4)               | Dossier    | RF-NIV-07     |

## 3.4 Requisitos no funcionales

### 3.4.1 Rendimiento (REN)

| **ID**         | **Requisito (El sistema deberá…)**                                                                                                                | **Prior.** | **Verificación** |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RNF-REN-01** | Mantener un promedio de al menos 30 FPS a 1280 × 720 en el equipo de referencia mínimo, en los tres sectores.                                     | E          | Prueba           |
| **RNF-REN-02** | Alcanzar el menú principal en un máximo de 10 s desde el lanzamiento, y cargar cada sector en un máximo de 5 s (propuesto), en un equipo con SSD. | E          | Prueba           |
| **RNF-REN-03** | Utilizar como máximo 2 GB de memoria RAM.                                                                                                         | D          | Análisis         |
| **RNF-REN-04** | Limitar el tamaño del paquete distribuible a 500 MB.                                                                                              | D          | Inspección       |
| **RNF-REN-05** | Cargar los assets antes de entrar al sector y evitar que la lógica del juego bloquee el bucle de render más de 50 ms.                             | D          | Análisis         |

### 3.4.2 Usabilidad (USA)

| **ID**         | **Requisito (El sistema deberá…)**                                                                                            | **Prior.** | **Verificación**    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| **RNF-USA-01** | Permitir que un jugador sin experiencia previa en videojuegos complete el Sector 1 sin ayuda externa, guiado por el tutorial. | E          | Prueba con usuarios |
| **RNF-USA-02** | Mostrar el texto con tamaño equivalente a 18 px o más a 1080p y contraste mínimo de 4,5:1 sobre el fondo.                     | D          | Inspección          |
| **RNF-USA-03** | Entregar toda la información relevante también en texto; no depender únicamente del audio ni del color.                       | D          | Inspección          |

### 3.4.3 Fiabilidad (FIA)

| **ID**         | **Requisito (El sistema deberá…)**                                                                                              | **Prior.** | **Verificación** |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RNF-FIA-01** | Completar la demo de principio a fin, para cada uno de los tres finales, sin cierres inesperados en tres PCs distintas.         | E          | Prueba           |
| **RNF-FIA-02** | Registrar las excepciones no controladas en un archivo de log y mostrar un mensaje comprensible en lugar de cerrar en silencio. | D          | Prueba           |
| **RNF-FIA-03** | Sustituir por un marcador y registrar una advertencia cuando falte un asset no crítico, sin abortar la ejecución.               | D          | Prueba           |

### 3.4.4 Portabilidad (POR)

| **ID**         | **Requisito (El sistema deberá…)**                                                                                                                                                | **Prior.** | **Verificación** |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RNF-POR-01** | Funcionar en Windows 10 y 11 de 64 bits.                                                                                                                                          | E          | Prueba           |
| **RNF-POR-02** | Evitar rutas absolutas y dependencias exclusivas de Windows (uso de pathlib), de modo que la lógica sea portable a Linux y macOS; esa portabilidad no se probará en esta entrega. | O          | Inspección       |

### 3.4.5 Mantenibilidad (MAN)

| **ID**         | **Requisito (El sistema deberá…)**                                                                                                                                 | **Prior.** | **Verificación** |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| **RNF-MAN-01** | Separar la lógica del juego (confianza, amenaza, diálogo, decisiones, cadena) de la capa de presentación, sin dependencias del motor 3D, para probarla con pytest. | E          | Inspección       |
| **RNF-MAN-02** | Centralizar los parámetros en config.json en lugar de dispersarlos como constantes en el código.                                                                   | E          | Inspección       |
| **RNF-MAN-03** | Fijar las versiones exactas de las dependencias en requirements.txt y trabajar en un entorno virtual.                                                              | E          | Inspección       |
| **RNF-MAN-04** | Seguir PEP 8 y usar anotaciones de tipo en los módulos de lógica.                                                                                                  | D          | Inspección       |
| **RNF-MAN-05** | Alcanzar al menos 80 % de cobertura de pruebas unitarias en los módulos de lógica.                                                                                 | D          | Análisis         |

### 3.4.6 Seguridad, privacidad y aspectos legales (SEG / LEG)

| **ID**         | **Requisito (El sistema deberá…)**                                                                                                                                                                            | **Prior.** | **Verificación** |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RNF-SEG-01** | No transmitir datos por la red ni recolectar datos personales; toda telemetría es local.                                                                                                                      | E          | Inspección       |
| **RNF-SEG-02** | Calcular la cadena de rastro con SHA-256 mediante hashlib. Se trata de una cadena que evidencia alteraciones (tamper-evident) dentro de la partida; no protege contra un usuario que modifique el ejecutable. | E          | Inspección       |
| **RNF-LEG-01** | Utilizar únicamente assets con licencia compatible con uso promocional y registrar su atribución en los créditos y en el README.                                                                              | E          | Inspección       |
| **RNF-LEG-02** | No usar ni imitar assets, música, logotipos ni diseños protegidos de la franquicia audiovisual homónima, y mantener el título del juego como valor de configuración hasta completar la verificación marcaria. | E          | Inspección       |

### 3.4.7 Localización (LOC)

| **ID**         | **Requisito (El sistema deberá…)**                                                                                          | **Prior.** | **Verificación** |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| **RNF-LOC-01** | Almacenar los textos del juego en archivos UTF-8 externos al código, para facilitar correcciones y una eventual traducción. | D          | Inspección       |

## 3.5 Requisitos de datos

### 3.5.1 Esquema de diálogo (JSON)

Cada archivo de diálogo contiene una lista de nodos con los siguientes campos:

| **Campo**          | **Tipo**    | **Descripción**                                                                                                                 |
| ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **id**             | texto       | Identificador único del nodo.                                                                                                   |
| **speaker**        | texto       | Identificador del hablante (don, arranque_a, arranque_b, bios, elena…).                                                         |
| **text**           | texto       | Línea mostrada; admite variantes condicionadas por banderas.                                                                    |
| **requires_flags** | lista       | Banderas necesarias para que el nodo esté disponible (opcional).                                                                |
| **next**           | texto       | Nodo siguiente cuando el nodo no tiene opciones (opcional).                                                                     |
| **options**        | lista (≤ 3) | Opciones del jugador; cada una con text, next, trust_delta, set_flags, clear_flags y decision_id (opcionales los tres últimos). |

Ejemplo ilustrativo:

```
{
  "id": "s1_arranque_01",
  "speaker": "arranque_a",
  "text": "¿Qué haces aquí, archivo no reconocido?",
  "options": [
    { "text": "Soy Don, agente financiero. Necesito ayuda.",
      "next": "s1_arranque_02", "trust_delta": { "arranque_a": 10 } },
    { "text": "No sé dónde estoy. ¿Me explicas este lugar?",
      "next": "s1_arranque_03", "trust_delta": { "arranque_a": 20 } },
    { "text": "[Silencio]… (acepto el riesgo)",
      "next": "s1_arranque_04", "trust_delta": { "arranque_a": -10 },
      "set_flags": ["silencio_inicial"] }
  ]
}
```

### 3.5.2 Registro de la cadena de rastro

| **Campo**       | **Tipo**       | **Descripción**                                             |
| --------------- | -------------- | ----------------------------------------------------------- |
| **index**       | entero         | Posición del bloque; el bloque génesis tiene índice 0.      |
| **timestamp**   | texto          | Fecha y hora UTC en formato ISO 8601.                       |
| **decision_id** | texto          | PD-1, PD-2 o PD-3 (o "génesis").                            |
| **option_id**   | texto          | Opción elegida por el jugador.                              |
| **sector**      | entero         | Sector en que se tomó la decisión.                          |
| **prev_hash**   | texto (64 hex) | Hash del bloque anterior; el génesis usa 64 ceros.          |
| **hash**        | texto (64 hex) | SHA-256 de la concatenación de los demás campos del bloque. |

### 3.5.3 Configuración (config.json)

Debe contener, como mínimo: título del juego, URL de ArcasShred Pro, todos los parámetros de 3.3, volúmenes iniciales, resolución y modo de pantalla, y activación del modo diagnóstico.

## 3.6 Requisitos de contenido y assets

Las cantidades provienen del GDD. En Python no existe Asset Store: los modelos se obtienen de fuentes externas y se convierten a glTF.

| **Contenido**             | **Cantidad**                               | **Fuente prevista**                      | **Observación**                                    |
| ------------------------- | ------------------------------------------ | ---------------------------------------- | -------------------------------------------------- |
| **Modelos de personajes** | 4 (Don, 2 programadoras de arranque, BIOS) | Kenney, Mixamo, packs low-poly           | Los centinelas reutilizan un modelo con otro color |
| **Modelos de entorno**    | 8 (módulos de OpenCulin)                   | itch.io, packs sci-fi modulares          | Verificar la conversión a glTF el día 1            |
| **Texturas y materiales** | 20 o más                                   | Incluidos en los packs                   | Limitar resolución para el rendimiento             |
| **Animaciones**           | 12 (reposo, caminar, correr, diálogo…)     | Mixamo (gratuito)                        | Convertir de FBX a glTF                            |
| **Sonidos**               | 5                                          | Freesound.org                            | Revisar la licencia de cada archivo                |
| **Música**                | 3 pistas                                   | Creative Commons o licencia royalty-free | Registrar la atribución exigida                    |
| **Elementos de interfaz** | 8                                          | Hechos en el proyecto                    | Ver RF-UI-01                                       |
| **Efectos de partículas** | 4                                          | Hechos con el motor                      | Estela, alerta, activación, borrado                |

Personajes con diálogo: Don (protagonista), las dos programadoras de arranque (aliadas) y el BIOS (antagonista final). Elena y el Consejo de los OS influyen en la historia; su forma de aparecer en pantalla se define en el Anexo A.

# 4\. Arquitectura de referencia (informativa)

Esta sección no es vinculante: propone una organización que facilita cumplir RNF-MAN-01 y RF-PKG-05.

## 4.1 Estructura del repositorio

```
tron-legacy/
├─ src/
│  ├─ main.py                # punto de entrada
│  ├─ app.py                 # ShowBase, máquina de estados
│  ├─ core/                  # lógica pura, sin dependencia del motor
│  │  ├─ state.py            # GameState: banderas, sector, checkpoint
│  │  ├─ trust.py            # confianza por NPC y de aliados
│  │  ├─ threat.py           # barra de amenaza, ocultamiento
│  │  ├─ dialogue.py         # carga y avance de árboles de diálogo
│  │  ├─ decisions.py        # puntos de decisión y finales
│  │  └─ chain.py            # cadena de rastro SHA-256
│  ├─ world/                 # sector1.py, sector2.py, sector3.py
│  ├─ entities/              # player.py, npc.py, sentinel.py
│  ├─ ui/                    # hud.py, menus.py, dialog_box.py, final.py
│  ├─ audio.py
│  └─ telemetry.py
├─ data/                    # config.json, dialogs/*.json
├─ assets/                  # models/, textures/, audio/ (Git LFS)
├─ tests/                   # pytest sobre src/core
├─ docs/                    # README, créditos, este SRS
└─ build/                   # script de empaquetado
```

## 4.2 Estados de la aplicación

| **Estado**           | **Descripción**                      | **Transiciones**                                  |
| -------------------- | ------------------------------------ | ------------------------------------------------- |
| **MENU**             | Menú principal, controles y créditos | → INTRO                                           |
| **INTRO**            | Secuencia del Acto I                 | → SECTOR_1                                        |
| **SECTOR_1 / 2 / 3** | Juego activo en cada sector          | → siguiente sector; → PAUSA; → CAPTURA; → DIALOGO |
| **DIALOGO**          | Conversación con un NPC              | → sector de origen                                |
| **PAUSA**            | Menú de pausa, árbol y cadena        | → sector de origen; → MENU                        |
| **CAPTURA**          | Pantalla de captura                  | → reaparición en el checkpoint                    |
| **FINAL**            | Final, certificado y enlace          | → CREDITOS; → MENU (reinicio)                     |
| **CREDITOS**         | Créditos y atribuciones              | → MENU                                            |

# 5\. Verificación y aceptación

## 5.1 Estrategia de pruebas

- **Pruebas unitarias (pytest)** sobre la lógica de src/core: confianza, amenaza, motor de diálogo, decisiones y cadena de rastro.
- **Pruebas funcionales manuales** siguiendo un guion por sector y por final.
- **Pruebas de rendimiento** en tres PCs distintas con el contador de FPS y la medición de tiempos de carga.
- **Playtest** con al menos tres usuarios antes de entregar, para detectar narrativa confusa y validar la comprensión del concepto.

## 5.2 Casos de prueba principales

| **Caso**  | **Descripción**                                                                                 | **Resultado esperado**                                            | **Requisito**        |
| --------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------- |
| **CP-01** | Iniciar la aplicación y recorrer el menú principal                                              | Se muestran las cuatro opciones y funcionan                       | RF-APP-01            |
| **CP-02** | Moverse y correr contra un muro y el límite del sector                                          | Don no atraviesa ni sale del sector                               | RF-MOV-03/04         |
| **CP-03** | Interactuar a 2,9 m y a 3,1 m de un NPC                                                         | Funciona a 2,9 m; no a 3,1 m                                      | RF-INT-01            |
| **CP-04** | Elegir respuestas que sumen más de 100 de confianza                                             | El valor se satura en 100                                         | RF-DIA-05            |
| **CP-05** | Permanecer a la vista de un centinela hasta llenar la barra                                     | Captura y reaparición en checkpoint con amenaza 0                 | RF-EVA-02/03         |
| **CP-06** | Ocultarse 10 s con amenaza en 80                                                                | La amenaza baja a 40                                              | RF-EVA-04            |
| **CP-07** | Elegir Sobrescribir en el Sector 2                                                              | Los archivos reaparecen visibles en otra celda                    | RF-EDU-03            |
| **CP-08** | Tomar las tres decisiones y verificar la cadena; luego alterar un bloque en una prueba unitaria | Íntegra al inicio; alterada con índice del primer bloque corrupto | RF-DEC-05/06         |
| **CP-09** | Completar la demo por cada una de las tres rutas finales                                        | Tres finales y tres certificados distintos                        | RF-FIN-01, RF-DEC-09 |
| **CP-10** | Llegar al Sector 2 con confianza de aliados ≥ 70 y con < 70                                     | El atajo solo existe con ≥ 70; el puzzle no se omite              | RF-NIV-05            |
| **CP-11** | Pulsar "Conocer ArcasShred Pro"                                                                 | Se abre la URL configurada en el navegador                        | RF-FIN-02            |
| **CP-12** | Medir FPS durante las tres zonas en el equipo mínimo                                            | Promedio ≥ 30 FPS                                                 | RNF-REN-01           |
| **CP-13** | Medir el tiempo de carga inicial                                                                | ≤ 10 s hasta el menú                                              | RNF-REN-02           |
| **CP-14** | Ejecutar el paquete en un PC sin Python                                                         | Se ejecuta sin instalaciones adicionales                          | RF-PKG-01            |
| **CP-15** | Ejecutar con la red desconectada, salvo el enlace final                                         | Funciona completo; sin tráfico de red                             | RNF-SEG-01           |

## 5.3 Criterios de aceptación de la entrega

Adaptados del checklist del dossier, la demo se acepta cuando se cumple todo lo siguiente:

- Demo jugable completa, con los tres sectores accesibles y los tres finales alcanzables (o el plan de contingencia acordado, ver 2.8).
- Todos los requisitos de prioridad E verificados con resultado satisfactorio.
- Ejecutable para Windows más página de descarga; README con instrucciones y créditos de assets con sus atribuciones.
- Enlace a ArcasShred Pro funcional en la pantalla final.
- Pruebas realizadas en tres PCs distintas; rendimiento ≥ 30 FPS en el equipo mínimo y carga inicial ≤ 10 s.
- Grabación de gameplay de 2–3 minutos para portafolio.

# 6\. Riesgos de software

Se retoman los riesgos del dossier y se añaden los derivados del uso de Python.

| **Riesgo**                                                                                                                        | **Impacto** | **Mitigación**                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Cinco jornadas son insuficientes, agravado por no contar con un editor visual de escenas como el de Unity**                     | Crítico     | Construir primero la lógica pura con pruebas (día 1), usar escenas basadas en módulos simples y aplicar el plan B o C de 2.8 sin dudar |
| **Versión web no alcanzable con Python 3D**                                                                                       | Alto        | Sustituir por ejecutable más página de descarga (RF-PKG-03); decidir temprano si se explora RF-PKG-04                                  |
| **Conversión de FBX de Mixamo a glTF con fallos**                                                                                 | Alto        | Validar la importación de un personaje animado completo el día 1; tener un modelo de respaldo                                          |
| **Rendimiento insuficiente en equipos modestos**                                                                                  | Medio       | Texturas reducidas, pocos objetos dinámicos, modelos simples y medición de FPS desde el día 2                                          |
| **Uso del nombre "Tron" (marca de un tercero)**                                                                                   | Alto        | Mantener el título como parámetro de configuración y obtener verificación marcaria antes de publicar                                   |
| **Guion incompleto o confuso**                                                                                                    | Medio       | Cerrar los tres finales antes del día 2; playtest con tres usuarios                                                                    |
| **El ejecutable generado es marcado como sospechoso por algún antivirus (falso positivo frecuente con empaquetadores de Python)** | Medio       | Probar el paquete en las tres PCs, preferir la distribución en carpeta y documentar la advertencia en el README                        |
| **Confusión entre el juego y el producto**                                                                                        | Medio       | Separar visualmente ambas marcas (RF-FIN-03)                                                                                           |

# 7\. Plan de entrega

Cronograma de cinco días del dossier, ajustado a Python. Cada jornada es de unas 6 horas.

| **Día** | **Fecha**  | **Trabajo**                                                                                                                                   | **Entregable**                    |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **1**   | Lun 19 oct | Entorno Python y repositorio; importación y conversión de assets; escena base; módulos core (confianza, amenaza, diálogo, cadena) con pruebas | Escena navegable y lógica probada |
| **2**   | Mar 20 oct | Movimiento, cámara, interacción, interfaz de diálogo y Sector 1 con tutorial                                                                  | Don se mueve y conversa           |
| **3**   | Mié 21 oct | Sector 2, puzzle educativo, centinelas, escondites y barra de amenaza                                                                         | Mecánica central funcional        |
| **4**   | Jue 22 oct | Sector 3, decisiones, tres finales, certificado, HUD y audio                                                                                  | Demo completa jugable             |
| **5**   | Vie 23 oct | Corrección de errores, empaquetado, pruebas en tres PCs, página de descarga y README                                                          | Build final entregada             |

# Anexo A. Ambigüedades del dossier y decisiones asumidas

Durante el análisis se detectaron vacíos e inconsistencias. Cada fila indica la decisión adoptada en este SRS para poder avanzar y quién debe confirmarla.

| **#**  | **Hallazgo**                                                                                                    | **Decisión asumida**                                                                                                          | **Confirma**        |
| ------ | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **1**  | El dossier fija Unity y C#; el solicitante pide Python                                                          | Se adopta Python 3.11+ con Panda3D (sección 2.5)                                                                              | Fundador            |
| **2**  | WebGL como plataforma, incompatible con Python 3D                                                               | Ejecutable de escritorio y página de descarga; build web opcional (RF-PKG-03/04)                                              | Fundador            |
| **3**  | El protagonista aparece como "Don" y "Dom"                                                                      | Se fija "Don", como recomienda el dossier                                                                                     | Diseñador narrativo |
| **4**  | "Tron Legacy" es una marca de terceros                                                                          | Nombre de trabajo; título configurable; sin assets de la franquicia (RNF-LEG-02)                                              | Fundador / Legal    |
| **5**  | Elena solo existe en el mundo real, pero el tercer final es "Escapar con Elena"                                 | Elena se manifiesta en el Sector 3 como voz o proyección que conecta con el mundo real; el guion debe confirmarlo             | Diseñador narrativo |
| **6**  | El mapa dibuja el atajo (confianza ≥ 70 %) con una flecha desde el Sector 3 hacia atrás, sin explicar su efecto | El atajo acorta y reduce la vigilancia del Sector 2 pero no omite el puzzle, para no perder el objetivo educativo (RF-NIV-05) | Diseñador narrativo |
| **7**  | "Ocultarse 10 segundos reduce la amenaza 50 %" admite varias lecturas                                           | Tras 10 s continuos ocultos, la amenaza baja al 50 % de su valor actual (RF-EVA-04)                                           | Programador         |
| **8**  | No se define qué ocurre al ser capturado                                                                        | Reaparición en el último checkpoint con amenaza 0, conservando decisiones (RF-EVA-03)                                         | Diseñador narrativo |
| **9**  | El GDD pide usar comandos ATA/NVMe, y el dosier aclara que no enseña comandos reales                            | Se representa un "comando de firmware" genérico, sin sintaxis real (RF-EDU-04)                                                | Fundador            |
| **10** | La opción "+Tiempo / +Seguridad real" de PD-2 no indica a qué opción corresponde cada efecto                    | Sobrescribir añade tiempo y deja archivos visibles; el comando de firmware da seguridad real (RF-DEC-03)                      | Diseñador narrativo |
| **11** | Los enemigos del Consejo de los OS no figuran entre los cuatro modelos de personajes                            | Se reutiliza un modelo con distinto color como centinela                                                                      | Artista 3D          |
| **12** | El guion original está truncado y faltan los diálogos de los tres actos                                         | Los diálogos se cargan de archivos externos; el contenido se completa sin cambiar el código (RF-DIA-01)                       | Diseñador narrativo |
| **13** | Faltan reglas numéricas del sistema de diálogo y de la amenaza                                                  | Se proponen valores en 3.3, ajustables en config.json                                                                         | Programador         |
| **14** | Dos duraciones: demo de 10–15 min (GDD) y recomendación de 2–3 min si la fecha es fija                          | Se especifica la demo completa y se definen los planes B y C como contingencia (2.8)                                          | Fundador            |
| **15** | No se indica la URL de ArcasShred Pro, el equipo real ni el presupuesto definitivo                              | URL como parámetro; el resto queda como dependencia (2.7)                                                                     | Fundador            |

# Anexo B. Matriz de trazabilidad

## B.1 Objetivos y métricas del dossier

| **Objetivo / métrica del dossier** | **Meta**  | **Requisitos que la soportan**                      |
| ---------------------------------- | --------- | --------------------------------------------------- |
| **Entretenimiento**                | ≥ 8/10    | RF-MOV, RF-DIA, RF-EVA, RF-AUD (medido en playtest) |
| **Educación**                      | ≥ 80 %    | RF-EDU-01 a 07, RF-DEC-05 a 09                      |
| **Conversión a ArcasShred Pro**    | ≥ 50 %    | RF-FIN-02, RF-FIN-03, RF-FIN-04, RF-MET-01          |
| **Tiempo medio de partida**        | 10–15 min | RF-NIV-01 a 03, RF-NIV-07                           |
| **Completitud**                    | ≥ 85 %    | RF-EVA-03, RF-NIV-06, RNF-FIA-01, RNF-USA-01        |
| **Rendimiento**                    | ≥ 30 FPS  | RNF-REN-01, RNF-REN-05                              |
| **Carga inicial**                  | ≤ 10 s    | RNF-REN-02                                          |

## B.2 Objetivos de aprendizaje del GDD

| **Objetivo de aprendizaje**                 | **Requisitos y mecánica**                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| **La sobrescritura no funciona en SSD**     | RF-EDU-01, RF-EDU-02, RF-EDU-03 (archivos "borrados" que siguen visibles) |
| **Los comandos de firmware son necesarios** | RF-EDU-04, RF-DEC-03                                                      |
| **La evidencia es crucial**                 | RF-DEC-05 a RF-DEC-09 (cadena de rastro y certificado)                    |
| **El contexto legal importa**               | RF-DEC-04, RF-FIN-01 (el BIOS juzga según la elección)                    |

## B.3 Resumen de requisitos por prioridad

| **Grupo**                | **Esencial** | **Deseable** | **Opcional** | **Total** |
| ------------------------ | ------------ | ------------ | ------------ | --------- |
| **Funcionales (RF)**     | 63           | 15           | 2            | 80        |
| **No funcionales (RNF)** | 12           | 10           | 1            | 23        |