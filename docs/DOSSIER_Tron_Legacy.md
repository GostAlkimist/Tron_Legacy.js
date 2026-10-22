# 📋 **TRON LEGACY — DOCUMENTO DE DISEÑO DE JUEGO (GDD)** 

**Versión:** 1.0 **Última actualización:** 21 de enero de 2025 **Estado:** En desarrollo **Relación con ArcasShred Pro:** Demo educativa y herramienta de marketing 

# **1. RESUMEN EJECUTIVO** 

|**Campo**|**Detalle**|
|---|---|
|**Nombre del proyecto**|Tron Legacy: "En búsqueda de una nueva realidad"|
|**Tipo de producto**|Demo interactiva 3D educativa (demo jugable)|
|**Duración estimada**|10-15 minutos de gameplay|
|**Fecha objetivo**|23 de octubre de 2026 (fija)|
|**Plazo disponible**|5 días (urgente) o 4-6 semanas (negociable)|
|**Plataforma**|WebGL (vía web) + .exe descargable|
|**Motor recomendado**|Unity 2022 LTS (con C#)|
|**Origen educativo**|Ilustra complejidad del borrado seguro en sistemas modernos|



# **2. PROPÓSITO Y OBJETIVOS** 

# **¿En qué consiste?** 

Tron Legacy es una experiencia interactiva que **enseña cómo funciona el borrado seguro** y lo complejo que es eliminar datos completamente en sistemas operativos actuales, usando narrativa, dramatismo y mecánicas lúdicas. 

# **Objetivos de Aprendizaje** 

|**Objetivo**|**Cómo se enseña en el juego**|
|---|---|
|La sobrescritura no funciona en|Don descubre que sus "archivos borrados" siguen|
|SSD|visibles|
|Los comandos de firmware son|Debe encontrar y usar comandos ATA/NVMe en el|



**Objetivo Cómo se enseña en el juego** necesarios mundo virtual La evidencia es crucial Cada acción deja rastro (hash chain) El contexto legal importa Decisiones afectan consecuencias en tribunales 

# **Metas de Diseño** 

|**Meta**|**Criterio de éxito**|
|---|---|
|**Entretenimiento**|≥8/10 en satisfacción de jugadores de prueba|
|**Educación**|≥80% de jugadores explican correctamente el concepto<br>post-juego|
|**Promoción**<br>**ArcasShred**|≥50% visitan sitio web tras finalizar demo|



# **3. HISTORIA COMPLETA** 

# **Personajes Principales** 

|**Nombre**|**Rol**|**Descripción**|
|---|---|---|
|**Don**|Protagonista|Agente financiero en banca E-cofr, 1 año 6 meses<br>de experiencia, se defiende en sistemas|
|**Elena**|Interest<br>amorosa|Analista de seguridad en su equipo, aún en el<br>mundo real|
|**Programas de**<br>**Arranque**|Aliados iniciales|Damas más experimentadas en OpenCulin|
|**Consejo de OS**|Antagonista<br>medio|Gobierna OpenCulin, ve a Don como amenaza|
|**BIOS**|Antagonista<br>principal|Autoridad suprema, controla toda la realidad del<br>sistema|
|**Day-Play**|Empresa<br>objetivo|Startup que crea universos virtuales (la startup<br>que Don debe evaluar)|



# **Estructura Narrativa (3 Actos)** 

|┌────────────────────────────────────────────────────────────────────────<br>┐<br>│                        ACTO 1: LA ENTRADA                              │|
|---|
|├────────────────────────────────────────────────────────────────────────<br>┤<br>│  • Don prueba el videojuego Tron en su computadora doméstica          │|
|│  • Es teletransportado al mundo virtual "OpenCulin"                   │|
|│  • No es reconocido como programa, lo etiquetan como "archivo       │|
|│    desconocido/intruso"                                             │|
|│  • Los Programas de Arranque le advierten del peligro               │|
|│  • Objetivo: Sobrevivir a los primeros reconocimientos              │<br>└────────────────────────────────────────────────────────────────────────|
|┘|
|┌────────────────────────────────────────────────────────────────────────<br>┐<br>│                        ACTO 2: LA HUIDA                              │|
|├────────────────────────────────────────────────────────────────────────|
|┤<br>│  • Don descubre que en este mundo todo tiene vida propia           │|
|│  • Descubre archivos que creía borrados siguen visibles (meta      │|
|│    educativa: FTL de SSD no borra realmente)                       │|
|│  • El Consejo de OS lo persigue sistemáticamente                   │|
|│  • Debe aprender a usar comandos nativos (ATA Secure Erase)        │|
|│  • Decide: ¿rescatar información de Day-Play o escapar?            │<br>└────────────────────────────────────────────────────────────────────────<br>┘|



|┌────────────────────────────────────────────────────────────────────────<br>┐<br>│                        ACTO 3: LA DECISIÓN                           │<br>├────────────────────────────────────────────────────────────────────────<br>┤<br>│  • Don alcanza el núcleo del sistema (BIOS)                        │|
|---|
|│  • Tres caminos posibles:                                         │|
|│    1. Destruir todos los rastros (borrado criptográfico)           │|
|│    2. Rescatar datos para la banca (sobrescritura insegura)        │|
|│    3. Escapar con Elena (deja evidencias)                         │|
|│  • Cada elección genera certificado diferente                    │<br>│  • El BIOS juzga según elección → Final único                    │<br>└────────────────────────────────────────────────────────────────────────<br>┘|



# **Árboles de Decisión** 

**Momento Opciones Consecuencia Encuentro Programa de** +Aliado / +Riesgo de Aceptar ayuda / Ignorar **Arranque** captura **Archivos "borrados"** Sobrescribir / Usar comando +Tiempo / +Seguridad **encontrados** real firmware **Final con BIOS** Destruir / Rescatar / Escapar 3 finales diferentes 

# **4. MECÁNICAS DE JUEGO DETALLADAS** 

# **4.1 Movimiento y Cámara** 

**Parámetro Configuración Perspectiva** Tercera persona (TPS) **Rotación** Mouse libre con suavizado 

|**Parámetro**<br>**Configuración**|
|---|
|**Movimiento**<br>WASD + Shift (correr)|
|**Interacción**<br>Tecla E (máximo 3 metros de distancia)|
|**UI de cámara** Indicador de objetivo con dirección y distancia|
|**4.2 Sistema de Diálogo**|
|┌─────────────────────────────────────────────────────────────────────┐<br>│  ÁRBOL DE DIÁLOGO — EJEMPLO                                      │|
|├─────────────────────────────────────────────────────────────────────┤|
|│  Programadora de Arranque: "¿Qué haces aquí, archivo no         │|
|│  reconocido?"                                                   │|
|│                                                                  │|
|│  ┌────────────────────────────────────────────────────────────┐  │|
|│  │ 1. "Soy Don, agente financiero. Necesito ayuda."           │  │|
|│  │ 2. "No sé dónde estoy. ¿Me explicas este lugar?"           │  │|
|│  │ 3. "[Silencio]... (acepto riesgo)"                        │  │|
|│  └────────────────────────────────────────────────────────────┘  │|
|│                                                                  │|
|│  Respuesta afecta:                                              │|
|│  → Confianza del NPC (0-100)                                    │|
|│  → Acceso a información posterior                               │|
|│  → Posibilidad de aliados en Acto 2                              │|
|└─────────────────────────────────────────────────────────────────────┘|
|**4.3 Sistema de Combate (Minimizado para Demo)**<br>**i**|
|**Parámetro**<br>**Configuración**|
|**Tipo**<br>Evitación, no confrontación directa|
|**Mecánica**<br>Esconderse detrás de objetos / Correr / Hackear puertas|



# **Parámetro Configuración** 

**Barra de amenaza** Se llena cuando te ven; si llega a 100%, te capturan **Reset** Ocultarse por 10 segundos reduce amenaza 50% 

**Nota** : Eliminado combate físico para cumplir plazo de 5 días. 

# **4.4 Sistema de Toma de Decisiones** 

**Elemento Función Puntos de decisión** 3 en toda la demo **Registro** Decisiones guardadas en "hash chain" visible **Impacto** Cambian diálogos, rutas y final **Visualización** Árbol de decisiones visible en pausa 

# **5. MUNDO VIRTUAL Y NIVELES** 

# **Mapa de OpenCulin (Ciudad Principal)** 



<!-- Start of picture text -->
┌─────────────────────────────────────────────────────────────────────┐<br>│                        OPEN CULIN MAP                             │<br>├─────────────────────────────────────────────────────────────────────┤<br>│                                                                   │<br>│    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │<br>│    │  SECTOR 1    │────▶│  SECTOR 2    │────▶│  SECTOR 3    │       │<br>│    │ Entrada +    │     │ Archivos     │     │ Núcleo BIOS  │       │<br>│    │ Arranque     │     │ "Borrados"   │     │ (Final)      │       │<br>│    └──────────────┘     └──────────────┘     ┌──────────────┘       │<br>│                                            │                    │<br>│              ◀─────────────────────────────┘                    │<br><!-- End of picture text -->

│                (Atajo si confianza ≥70%)                        │ 

└─────────────────────────────────────────────────────────────────────┘ 

# **Descripción de Zonas** 

|**Zona**|**Contenido**|**Tiempo estimado**|
|---|---|---|
|**Sector 1 - Entrada**|<sup>Tutorial + encuentro con Programas de</sup><br>Arranque|3 min|
|**Sector 2 -**<br>**Archivos**|Puzzle educativo (FS vs. celdas físicas)|5 min|
|**Sector 3 - BIOS**|Decisión final + 3 finales distintos|4 min|



# **6. ASSETS REQUERIDOS** 

# **Lista Completa de Activos** 

|**Asset**|**Cantidad**|**Fuente**|**Tiempo**<br>**estimado**|
|---|---|---|---|
|**Modelos 3D**<br>**personajes**|4 (Don, 2 Programadoras,<br>BIOS)|Asset Store (Low<br>Poly)|2 hrs (descarga)|
|**Modelos 3D**<br>**edificios**|8 (OpenCulin modular<br>pack)|Asset Store|2 hrs (descarga)|
|**Texturas y**<br>**materiales**|20+|Incluido en packs|1 hr (aplicar)|
|**Animaciones**|12 (idle, walk, run, dialog)|Mixamo (gratuito)|3 hrs|
|**Sonidos**<br>**ambientales**|5|Freesound.org|2 hrs|
|**Música de fondo**|3 pistas|Kevin MacLeod<br>(gratis)|1 hr|
|**UI/HUD**|8 elementos|Autohecho en Unity|4 hrs|
|**Partículas (efectos)**|4|Built-in Unity|1 hr|
|**Costo Estimado de A**|**ssets**|||



|**Concepto**<br>Pack personajes Low Poly|**Costo (USD)**<br> $20-$50|
|---|---|
|Pack ambientes sci-fi|$30-$80|
|Música royalty-free|$0-$30|
|Sonidos SFX pack|$20-$50|
|**TOTAL**|**$70-$210**|



**Recomendación** : Si presupuesto < $100, usar assets gratuitos (Itch.io, Kenney.nl) + música Creative Commons. 

# **7. CRONOGRAMA DETALLADO (2 OPCIONES)** 

# **OPCIÓN A: PLAZO URGENTE DE 5 DÍAS (23 OCT)** 

|**Día**<br>**Tarea**|**Horas**<br>**estimadas**|**Entregable**|
|---|---|---|
|**Día 1** <sup>Setup Unity + assets + escena</sup><br>base|6|Escena vacía navegable|
|**Día 2**Movimiento + diálogo básico|6|Don puede moverse y hablar|
|**Día 3**Sector 2 + puzzle educativo|6|Mecánica de archivos<br>completada|
|**Día 4**Sector 3 + decisiones + finales|6|Demo jugable completa|
|**Día 5**Bug fixes + export + testing|6|Build final para entrega|



# **OPCIÓN B: PLAZO NEGOCIABLE DE 6 SEMANAS** 

|**Semana**<br>**Hito**|**Entregable**|
|---|---|
|Semana 1 Setup + assets + prototipo movimiento|Escena básica funcional|
|Semana 2 Sistema diálogo + árboles de decisión|Conversación con NPCs|
|Semana 3 Nivel Sector 1 completo|3 minutos jugables|
|Semana 4 Niveles Sector 2-3 + finales|Demo completa|



|**Semana**<br>**Hito**|**Entregable**|
|---|---|
|Semana 5 Polish + audio + optimización|Build optimizada|
|Semana 6 Testing + correcciones|Build final|



# **8. STACK TECNOLÓGICO** 

|**Capa**|**Tecnología**|**Justificación**|
|---|---|---|
|**Motor**|Unity 2022 LTS|Comunidad grande, assets disponibles, WebGL<br>export|
|**Lenguaje**|C#|Requiere el documento original|
|**Animaciones**|<sup>Mixamo +</sup><br>Animator|Animaciones gratuitas importables|
|**UI**|Unity UI Toolkit|Rápido prototipo|
|**Build**|WebGL 2.0 / .exe|Web-first para distribución fácil|
|**Versionado**|Git + Git LFS|Control de cambios + binarios grandes|



# **9. MÉTRICAS DE ÉXITO** 

|**Categoría**|**Métrica**|**Meta**|
|---|---|---|
|**Jugabilidad**|Tiempo promedio en demo|10-15 min|
|**Completitud**|Porcentaje que termina|≥85%|
|**Educación**|Encuesta post-demo (pregunta a|bierta) ≥80% explican borrado seguro|
|**Conversión**|Clicks a ArcasShred Pro|≥50%|
|**Technical**|FPS promedio|≥30 FPS en WebGL|
|**Loading**|Tiempo inicial de carga|≤10 segundos|



# **10. PRESUPUESTO TOTAL** 

|**Partida**|**Costo mínimo (USD**|**) Costo recomendado (USD)**|
|---|---|---|
|Assets 3D|$0 (gratuitos)|$150|
|Música/SFX|$0|$50|
|Hosting web|$0 (GitHub Pages)|$20/mes|
|Licencia Unity|$0 (Personal)|$2,500/año (Pro, si ingresos >$100k)|
|Freelancer apoy|o $0|$500-1,500|
|**TOTAL**|**$0-$20**|**$700-$2,200**|



# **11. RIESGOS Y MITIGACIONES** 

|**Riesgo**|**Probabili**|**dad Impacto**|**Mitigación**|
|---|---|---|---|
|**Fecha 23 oct es**<br>**imposible**|Alta|Crítico|Reducir scope a 2 niveles, eliminar<br>combate|
|**Assets no cargan en**<br>**WebGL**|Media|Alto|Limpiar texturas, optimizar modelos|
|**Bug crítico bloqueante**|Alta|Alto|Testear diario, rollback a build<br>anterior|
|**Narrativa confusa**|Media|Medio|Testear con 3 usuarios antes de<br>entregar|
|**Performance bajo en**<br>**web**|Media|Medio|Target 30 FPS, LODs, compressión<br>textures|
|**Story incompleta**|Alta|Medio|Usar diálogo genérico, dejar<br>cliffhanger|



# **12. CHECKLIST DE ENTREGA FINAL** 

┌────────────────────────────────────────────────────────────────────┐ │                    CHECKLIST PRE-ENTREGA                          │ ├────────────────────────────────────────────────────────────────────┤ 

|│  ☐ Demo jugable completa (todos los sectores acces|ibles)         │|
|---|---|
|│  ☐ Builds: .exe + WebGL (vía web)                                │||
|│  ☐ Documentación: README con instrucciones de ej|ecución         │|
|│  ☐ Créditos: assets utilizados con atribuciones|│|
|│  ☐ Link a ArcasShred Pro en pantalla final                      │||
|│  ☐ Testing realizado en 3 PCs diferentes                        │||
|│  ☐ Performance: ≥30 FPS en PC mediano|│|
|│  ☐ Carga inicial: ≤10 segundos                                 │||
|│  ☐ Grabación de gameplay (2-3 min) para portafolio<br>└──────────────────────────────────────────────|│<br>──────────────────────┘|
|**13. PRÓXIMOS PASOS INMEDIATOS**||
|**Prioridad Acción**|**Responsable**<br>**Plazo**|
|**URGENTE** Confirmar fecha (¿fija 23 oct o negociable?)|i  i     Fundador<br>Hoy|
|**URGENTE** Descargar Unity 2022 LTS + instalar|Programador<br>4 hrs|
|**URGENTE** Descargar assets 3D seleccionados|Programador<br>4 hrs|
|**URGENTE** Crear repo Git con estructura de carpetas|Programador<br>2 hrs|
|**URGENTE** Completar guion final con 3 finales|Diseñador/Narrador 1 día|
|**URGENTE** Definir presupuesto disponible|Fundador<br>Hoy|
|**14. CONCLUSIÓN**||
|**Aspecto**<br>**Evaluación**||
|**Viabilidad en 5 días**<br>**30%**(solo con reducción ext|rema + assets prehechos)|
|**Viabilidad en 6 semanas 85%**(scope razonable + cali|dad media)|
|**Calidad esperable**<br>Media-Baja (prototipo funci|onal, no polished)|



# **Aspecto Evaluación** 

**Valor estratégico** Alto (educa + promueve ArcasShred Pro) 

# **Recomendación Final** 

Si la fecha **23 de octubre es fija** , reduzca el scope a **demo de 2-3 minutos** , elimine combate y use assets gratuitos. 

Si puede **extender la fecha a 4-6 semanas** , construirá un producto más completo que sirva como herramienta educativa duradera para ArcasShred Pro. 

# **¿Te gustaría que genere:** 

1. **Cronograma diario detallado** para 5 días de urgencia? 

2. **Plantilla de Git con estructura de carpetas** ? 

3. **Lista de assets específicos con enlaces** para descargar inmediatamente? 

4. **Guion completo con diálogo** de los 3 actos? 

# 4 archivos 

por favor dame el dosier con to dodo el proyecto y el punto 1 por favor 

Analizado a fondo 

- **📁 DOSIER DEL PROYECTO — TRON LEGACY** 

# **_"En busca de una nueva realidad"_** 

Duración de la demo 

10–15 min 

Sectores jugables 

3 

Plazo restante 

5 días 

Presupuesto mínimo 

USD 0–210 

# **PARTE I — FICHA DE IDENTIFICACIÓN** 

|**Campo**|**Detalle**|
|---|---|
|**Nombre del proyecto**|Tron Legacy: "En busca de una nueva realidad"|
|**Tipo de producto**|Demo 3D jugable (vertical slice)|
|**Género**|Aventura narrativa con exploración en tercera persona|
|**Plataforma objetivo**|WebGL (navegador) + ejecutable descargable|
|**Motor**|Unity 2022 LTS|
|**Lenguaje**|C#|
|**Idioma del contenido**|Español|
|**Fecha de entrega**<br>**comprometida**|Viernes 23 de octubre de 2026|
|**Fecha de elaboración del**<br>**dosier**|Lunes 19 de octubre de 2026|
|**Vinculación estratégica**|Pieza educativa y de marketing de ArcasShred Pro|
|**Estado**|Concepto documentado; pendiente de guion final,<br>assets y desarrollo|



# **PARTE II — PUNTO 1 DESARROLLADO** 

# **¿En qué consiste el proyecto?** 

# **1.1 Definición en una frase** 

Tron Legacy es una **demo 3D de aventura narrativa** en la que el jugador encarna a Don, un agente financiero que queda atrapado dentro del universo interno de una computadora, y que debe aprender —a golpes de persecución, diálogo y decisiones— **por qué borrar información de verdad es mucho más difícil de lo que parece** . 

# **1.2 La premisa** 

Don trabaja en la banca **E-cofr** evaluando inversiones tecnológicas. Su equipo analiza a **Day-Play** , una startup de videojuegos que crea universos virtuales, y les entrega una 

copia de su producto más reciente: **Tron** , un mundo donde cada elemento de un computador cobra vida y donde el usuario es, por definición, un intruso. 

Don lo prueba en su computadora de casa. Al hacer clic, deja de estar en su habitación: es absorbido al interior del sistema. Allí los programas residentes —los encargados del arranque y de la gestión del equipo— no logran clasificarlo. No es un archivo. No es un programa. No tiene extensión reconocible. Así que lo etiquetan con la única categoría que les queda: **elemento desconocido y sospechoso** . 

Desde ese instante, Don no es un invitado: es una anomalía que el sistema quiere eliminar. 

# **1.3 Qué hace el jugador, concretamente** 

La demo se sostiene sobre cuatro acciones encadenadas: 

# **Acción Qué implica para el jugador** 

|**Explorar**|<sup>Recorrer OpenCulin, la ciudad donde se conectan todos los programas, en</sup><br>tercera persona|
|---|---|
|**Dialogar**|<sup>Hablar con los habitantes del sistema y ganar o perder su confianza según</sup><br>lo que responda|
|**Evadir**|Esquivar al Consejo de los OS y a los procesos de limpieza que lo persiguen|
|**Decidir**|Elegir en tres momentos clave, sabiendo que cada elección altera la ruta y<br>el desenlace|



No hay combate cuerpo a cuerpo. El conflicto se resuelve **corriendo, escondiéndose y convenciendo** . Esta decisión no es solo estética: refuerza la idea de que en un sistema informático nadie "pelea" contra el borrado — simplemente se llega tarde, o no se llega. 

# **1.4 La tesis educativa (el corazón del proyecto)** 

Aquí está el motivo real de la existencia del juego. La demo no pretende enseñar comandos ni manuales técnicos. Pretende provocar **una comprensión visceral** de tres hechos que el público general desconoce: 

**Primero.** Cuando alguien "borra" un archivo y vacía la papelera, en la mayoría de los casos el contenido sigue físicamente en el disco. Lo que desapareció es la referencia, no la información. 

**Segundo.** En discos de estado sólido, la situación es todavía más engañosa. El controlador del disco reordena y redirige las escrituras mediante una capa de traducción interna. Sobrescribir con ceros puede parecer que funciona y no haber tocado ni una celda real. El juego representa esto con un sector donde Don encuentra **"archivos borrados" que siguen perfectamente vivos y visibles** : la metáfora es directa y el jugador la descubre por sí mismo. 

**Tercero.** Borrar bien exige métodos distintos según el medio, y exige **demostrar que se hizo** . Por eso el juego introduce, como recurso narrativo, la idea del rastro imborrable: cada decisión del jugador queda registrada en una cadena que no se puede modificar hacia atrás. Es la versión lúdica del registro encadenado por hash que ArcasShred Pro genera en el mundo real. 

# **1.5 Tono y estilo narrativo** 

El documento original pide "de manera divertida y con algo de dramatismo". Esa mezcla define el tono: 

|**Registro**|**Manifestación**|
|---|---|
|**Tecno-noir**|Ciudad oscura, iluminación de neón, arquitectura de circuitos|
|**Aventura ligera**|Diálogos con humor, NPCs excéntricos, situaciones absurdas|
|**Drama de**<br>**persecución**|Tensión creciente, barra de amenaza, riesgo de captura|
|**Melancolía**|Don está lejos de casa y de Elena, la analista de seguridad que<br>le gusta|



El contraste entre un protagonista común —no un hacker, no un héroe, apenas "alguien que se defiende en sistemas"— y un mundo que lo trata como virus, es el motor emocional de la demo. 

# **1.6 A quién está dirigido** 

|**Audiencia**|**Por qué le interesa**|
|---|---|
|**Profesionales de TI y seguridad**|Reconocen el chiste interno y validan la precisión<br>técnica|
|**Tomadores de decisión**|Entienden el problema de cumplimiento sin leer|
|**empresariales**|un whitepaper|
|**Público general curioso**|Disfrutan la aventura y salen sabiendo algo nuevo|



**Audiencia** 

# **Por qué le interesa** 

# **Estudiantes de tecnología** Material introductorio memorable **Clientes potenciales de** Ven el problema y, acto seguido, la solución **ArcasShred Pro** 

# **1.7 Qué diferencia esta demo de un juego cualquiera** 

Tres cosas, y conviene tenerlas explícitas porque son el argumento de venta del proyecto: 

**Es una demo con propósito comercial doble.** Entretiene y, al terminar, deja al jugador con una pregunta que solo ArcasShred Pro responde: _"¿y cómo se borra bien, entonces?"_ . La pantalla final enlaza al producto. 

**Su tema no es decorativo.** El escenario no es "un mundo de computadora" genérico: cada zona, cada obstáculo y cada diálogo ilustra un concepto real de almacenamiento y sanitización. El juego es preciso, no aproximado. 

**Su alcance es deliberadamente pequeño.** No aspira a ser un videojuego comercial. Aspira a ser una pieza de comunicación memorable, terminada y funcional dentro de un plazo corto. 

# **1.8 Qué significa "consiste" en términos de entregable** 

Para evitar ambigüedad, esto es exactamente lo que se entrega el 23 de octubre: 

|┌─────────────────────────────────────────────────────────────────┐<br>│  ENTREGABLE CONCRETO                                           │<br>├─────────────────────────────────────────────────────────────────┤|
|---|
|│  • Una demo jugable de 10 a 15 minutos                        │|
|│  • Tres sectores conectados: Entrada, Archivos, Núcleo BIOS   │<br>│  • Cuatro personajes con diálogo                              │|
|│  • Tres puntos de decisión con efecto en el desenlace         │<br>│  • Un final por cada camino elegido                           │|
|│  • Build WebGL publicada en web + ejecutable descargable      │|



│  • Pantalla final con enlace a ArcasShred Pro                 │ 

│  • README con instrucciones y créditos de assets              │ 

└─────────────────────────────────────────────────────────────────┘ 

# **1.9 Lo que el proyecto NO es** 

Delimitar es tan importante como definir: 

|**No es**|**Aclaración**|
|---|---|
|Un juego comercial completo|Es una demo; no habrá monetización ni tienda|
|Un simulador técnico|No enseña comandos ni interfaces reales de<br>borrado|
|Un producto independiente de|Es una pieza de comunicación del producto|
|ArcasShred|empresarial|
|Un proyecto con continuación|El backlog posterior depende de resultados y|
|garantizada|presupuesto|



# **PARTE III — HISTORIA Y NARRATIVA** 

# **3.1 Estructura en tres actos** 

**Acto I — La entrada.** Don prueba el juego en su casa y es absorbido al sistema. Los programas de arranque lo detectan como elemento no clasificado. Aprende las reglas del mundo: aquí todo tiene vida, y él no pertenece. Termina con su primera huida. 

**Acto II — La huida.** Don descubre que los archivos que creía eliminados siguen presentes. El Consejo de los OS lo persigue de forma sistemática. Debe ganarse aliados, atravesar el sector de los archivos residuales y comprender que la única salida real pasa por el núcleo. 

**Acto III — La decisión.** Don llega ante el BIOS, la autoridad suprema. Se le presentan tres caminos y el sistema lo juzga según el que elija. Cada camino produce un final distinto. 

# **3.2 Los tres finales** 

**Camino Qué hace Don Consecuencia narrativa Lectura educativa Destruir el** Provoca el borrado Escapa limpio, pero El borrado criptográfico 

|**Camino**|**Qué hace Don**|**Consecuencia narrativa **|**Lectura educativa**|
|---|---|---|---|
|**rastro**|criptográfico del|pierde la información de|es irreversible por|
||núcleo|Day-Play|diseño|
|**Rescatar**<br>**los datos**|Copia la información<br>para E-cofr|Sale con el botín, pero<br>deja rastro verificable|La evidencia sobrevive<br>al intento de<br>ocultamiento|
|**Escapar**|Prioriza salir, sin|Final agridulce; el sistema|<br>Lo que no se sanitiza,|
|**con Elena**|resolver el sistema|queda intacto|permanece|



# **3.3 Narrativa ramificada** 

El documento original es explícito: la historia parte de un **árbol de decisiones** donde lo que hace el jugador altera el desarrollo y la duración de la campaña. En la demo esto se implementa de forma contenida pero real: 

|**Punto de**<br>**decisión**|**Ubicación**|**Variables que afecta**|
|---|---|---|
|PD-1|Encuentro con los programas de<br>arranque|Confianza del NPC, acceso a<br>atajos|
|PD-2|Sector de archivos residuales|Método elegido, tiempo de<br>travesía|
|PD-3|Ante el BIOS|Final de la demo|



# **PARTE IV — PERSONAJES** 

|**Personaje**|**Rol**|**Función en la demo**|
|---|---|---|
|**Don**|Protagonista|Agente financiero, un año y medio en E-cofr, se<br>defiende en sistemas. No es experto: es el<br>jugador|
|**Elena**|Interés<br>romántico|Analista de seguridad del equipo de Don.<br>Aparece en el mundo real y motiva el deseo de<br>volver|
|**Programas de**|Aliados iniciales|Guías del mundo. Explican las reglas al jugador y|



|**Personaje**|**Rol**|**Función en la demo**|
|---|---|---|
|**arranque**||al propio Don|
|**Consejo de los**<br>**OS**|Antagonista<br>intermedio|Gobierna OpenCulin. Ordena la persecución del<br>intruso|
|**BIOS**|Antagonista final|<sup>Autoridad superior al Consejo. Emite el juicio</sup><br>final|
|**Day-Play**|Entidad ausente|<sup>La startup evaluada. Su producto es el mundo</sup><br>donde transcurre todo|



**Nota de coherencia del material original:** el documento alterna entre "Don" y "Dom" para el protagonista. Hay que fijar una sola grafía antes de producir textos y voces. Recomiendo **Don** . 

# **PARTE V — MECÁNICAS** 

# **Mecánica Especificación para la demo** 

**Movimiento** Tercera persona, WASD + correr, rotación libre de cámara 

**Interacción** Tecla única, alcance de 3 metros, indicador visual de objetivo 

**Diálogo** Árbol de opciones (3 por nodo) que modifica la confianza del NPC **Evitación** Barra de amenaza; ocultarse la reduce. Sin combate físico **Decisiones** Tres puntos clave; el estado se conserva entre sectores **Rastro** Registro visible de decisiones, presentado como cadena inmutable 

# **PARTE VI — MUNDO Y NIVELES** 

OpenCulin es la ciudad donde se conectan todos los programas. Está gobernada por el Consejo de los OS y, por encima de ellos, por el BIOS. 

|**Sector**|**Contenido**|**Duración**|
|---|---|---|
|**Sector 1 — Entrada**|Tutorial, encuentro con programas de arranque,<br>primera persecución|3 min|



|**Sector**|**Contenido**|**Duración**|
|---|---|---|
|**Sector 2 — Archivos**|Puzzle educativo: lo que se creía borrado sigue|5 min|
|**residuales**|ahí||
|**Sector 3 — Núcleo BIO**|**S**Juicio, decisión final, desenlace|4 min|



# **PARTE VII — DIRECCIÓN ARTÍSTICA Y SONORA** 

|**Elemento**|**Definición**|
|---|---|
|**Paleta**|Azules profundos, cian y violeta sobre negro; naranja como alerta|
|**Geometría**|Volúmenes limpios, líneas de circuito, superficies emisivas|
|**Iluminación**|Neón volumétrico, sombras duras, bruma para profundidad|
|**Referencia**<br>**estética**|Tecno-noir digital, sin imitar diseño protegido de terceros|
|**Audio**|Sintetizadores ambientales, pulsos rítmicos en persecución,<br>silencio en el juicio|



# **PARTE VIII — STACK TÉCNICO** 

|**Capa**|**Elección**|
|---|---|
|Motor|Unity 2022 LTS|
|Lenguaje|C#|
|Animación|Mixamo + Animator|
|Interfaz|Unity UI Toolkit|
|Builds|WebGL 2.0 y ejecutable de escritorio|



Control de versiones Git + Git LFS para binarios 

# **PARTE IX — ASSETS Y PRESUPUESTO** 

|**Categoría**|**Opción gratuita**|**Opción recomendada**|
|---|---|---|
|Modelos de personajes|Kenney, Mixamo|Pack low-poly comercial|
|Ambientes|Itch.io, Unity Asset Store   i|free Pack sci-fi modular|
|Música|Creative Commons|Licencia royalty-free|
|Efectos de sonido|Freesound|Pack comercial|
|**Costo total**|**USD 0–20**|**USD 120–210**|



# **PARTE X — CRONOGRAMA DE 5 DÍAS** 

|**Día**|**Fecha**|**Trabajo**|**Entregable**|
|---|---|---|---|
|1|Lun 19<br>oct|Setup de Unity, importación de assets,<br>escena base|Escena navegable|
|2|Mar 20<br>oct|Movimiento, cámara, sistema de diálogo|Don se mueve y<br>conversa|
|3|Mié 21<br>oct|Sector 2, puzzle educativo, evitación|Mecánica central<br>funcional|
|4|Jue 22 oc     i|t Sector 3, decisiones, tres finales|Demo completa jugable|
|5|Vie 23 oc|t Corrección de errores, build, pruebas|Build final entregada|



# **PARTE XI — EQUIPO Y RESPONSABILIDADES** 

|**Rol**|**Responsabilidad**|**Puede ser externo**|
|---|---|---|
|Programador Unity|Sistemas, integración, builds|No|
|Diseñador narrativo|Guion, diálogos, árbol de decisione|s Sí|
|Artista 3D|Adaptación de assets, escenario|Sí|
|Diseñador de audio|Música y efectos|Sí|
|Tester|Pruebas de flujo y rendimiento|Sí|



# **PARTE XII — MÉTRICAS DE ÉXITO** 

|**Categoría**|**Métrica**|**Meta**|
|---|---|---|
|Jugabilidad|Tiempo medio de partida|10–15 min|
|Completitud|Jugadores que terminan|≥ 85%|
|Educación|Explican el concepto tras jugar|≥ 80%|
|Conversión|Clics a ArcasShred Pro|≥ 50%|
|Rendimiento|Fotogramas por segundo en WebGL|≥ 30 FPS|
|Carga|Tiempo inicial|≤ 10 s|



# **PARTE XIII — RIESGOS** 

|**Riesgo**|**Impacto**|**Mitigación**|
|---|---|---|
|Plazo de 5 días insuficiente|Crítico|Reducir a 2 sectores y un solo final si es<br>necesario|
|Assets incompatibles con<br>WebGL|Alto|Validar importación el día 1|
|**Uso del nombre "Tron"**|**Alto**|Verificar disponibilidad marcaria antes de<br>publicar|
|Guion incompleto|Medio|Cerrar los tres finales antes del día 2|
|Rendimiento bajo en<br>navegador|Medio|Limitar texturas, aplicar LODs|
|Confusión entre juego y<br>producto|Medio|Separar visualmente ambas marcas|



**Advertencia importante sobre el nombre.** "Tron" es una franquicia audiovisual consolidada y registrada por un tercero. Publicar una obra con ese título, incluso sin ánimo de lucro, expone al proyecto a reclamaciones. Recomiendo tratar "Tron Legacy" como **nombre de trabajo interno** y definir un título propio antes de la publicación. Esto requiere verificación legal específica, no basta con la intuición. 

# **PARTE XIV — RELACIÓN CON ARCASHRED PRO** 

|**Dimensión **|**ArcasShred Pro**<br>**Tron Legacy**|
|---|---|
|Naturaleza|Software empresarial<br>Demo de entretenimiento|
|Audiencia|Empresas, ITAD, sectores regulados Público amplio|
|Función|Sanitizar y certificar<br>Explicar y atraer|
|Relación|Producto<br>Pieza de comunicación|
|El juego**no**<br>problema té|**sustituye**al producto ni compite con él. Lo alimenta: convierte un<br>cnico y árido en una experiencia que la gente recuerda y comparte.|



# **PARTE XV — GLOSARIO** 

|**Término**|**Significado**|
|---|---|
|**OpenCulin**|Ciudad ficticia donde se conectan todos los programas|
|**Consejo de los**<br>**OS**|Órgano de gobierno del mundo virtual|
|**BIOS**|Autoridad suprema del sistema|
|**Archivo residual**|Dato que permanece tras un borrado aparente|
|**Cadena de rastro**|Registro inmutable de las decisiones del jugador|
|**FTL**|Capa interna del disco que redirige escrituras (base del enigma del<br>Sector 2)|
|**PARTE XVI — PEN**<br>┌───────────────<br>│  LO QUE FALTA A|**DIENTES CRÍTICOS**<br>──────────────────────────────────────────────────┐<br>NTES DE ESCRIBIR CÓDIGO                         │|
|├───────────────|──────────────────────────────────────────────────┤|
|│  ☐ Cerrar el guio|n: el documento original se corta a mitad                                     │|
|│    de la frase sobr|e la persecución inicial                                                                          │|



│  ☐ Unificar el nombre del protagonista (Don o Dom)                                                  │ 

│  ☐ Confirmar si la fecha del 23 de octubre es fija                                                         │ 

│  ☐ Definir el título definitivo (riesgo marcario)                                                                │ 

│  ☐ Confirmar el equipo real y el presupuesto disponible                                          │ 

│  ☐ Decidir plataforma final: WebGL, escritorio o ambas                                           │ 

│  ☐ Especificar el sistema de diálogo con reglas numéricas                                     │ └─────────────────────────────────────────────────────────────────┘ 

# **Conclusión del dosier** 

Tron Legacy tiene una idea fuerte y un propósito claro: **hacer tangible un problema invisible** . Su debilidad no está en el concepto, sino en la brecha entre lo que el documento describe y lo que un equipo puede producir en cinco días. El concepto pide un juego de aventura con narrativa ramificada; el calendario permite, con suerte, una demo lineal de tres sectores. 

La recomendación es construir la versión pequeña **bien terminada** antes que la versión grande **incompleta** , y resolver cuanto antes los dos asuntos que no son de producción sino de estrategia: el título y la fecha. 

