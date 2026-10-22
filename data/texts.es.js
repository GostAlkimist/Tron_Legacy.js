/* Textos del juego en español, UTF-8, externos al código (RNF-LOC-01). */
(globalThis.TL = globalThis.TL || {}).texts = {
  speakers: {
    don:        { name: "Don",       color: "#46e6ff" },
    arranque_a: { name: "Kernela",   color: "#a77bff" },
    arranque_b: { name: "Bootina",   color: "#5f9bff" },
    bios:       { name: "BIOS",      color: "#e8f4ff" },
    elena:      { name: "Elena",     color: "#ff9fe0" },
    sistema:    { name: "Sistema",   color: "#7fd9c6" },
    consejo:    { name: "Consejo de los OS", color: "#ff8a1f" }
  },

  sectorNames: ["", "Sector 1 · Entrada", "Sector 2 · Archivos residuales", "Sector 3 · Núcleo BIOS"],
  sectorCards: [
    "",
    "Sector 1\nEntrada de OpenCulin",
    "Sector 2\nArchivos residuales",
    "Sector 3\nNúcleo BIOS"
  ],

  intro: [
    "Viernes, 7:42 p. m. Casa de Don.",
    "En E-cofr, el equipo de Don evalúa a Day-Play, una startup que crea universos virtuales.\nLe entregaron una copia de su producto más reciente: Tron.",
    "Don solo quería probarlo cinco minutos antes de cenar.\nEn su equipo, Elena le había dejado una nota: «No lo instales sin revisarlo».",
    "Hizo clic en Jugar.",
    "USUARIO NO CLASIFICADO DETECTADO.\nConvirtiendo a datos…"
  ],

  // Pronunciación para la síntesis de voz: [expresión regular, reemplazo]
  voiceFix: [["\\bBIOS\\b", "bayos"], ["\\bOS\\b", "o ese"], ["\\bFTL\\b", "efe te ele"], ["\\bSSD\\b", "ese ese de"], ["\\bE-cofr\\b", "e cofre"], ["\\bDay-Play\\b", "Dei Plei"], ["\\bOpenCulin\\b", "Open Culin"], ["\\bArcasShred\\b", "Arcas Shred"], ["0x([0-9A-F]{2})", "celda $1"]],

  menu: { play: "Jugar", controls: "Controles", settings: "Ajustes", credits: "Créditos", quit: "Salir",
          quitMsg: "Puedes cerrar esta pestaña o ventana para salir." },

  controls: [
    ["W A S D / flechas", "Mover a Don (relativo a la cámara)"],
    ["Shift", "Correr"],
    ["Ratón", "Girar la cámara (haz clic en la pantalla para capturarlo; si no, arrastra)"],
    ["E", "Interactuar (hasta 3 m del objetivo). Mantener E para hackear puertas"],
    ["1 · 2 · 3 o clic", "Elegir una opción de diálogo"],
    ["Espacio / Enter", "Avanzar o completar el texto"],
    ["Esc", "Menú de pausa"],
    ["H", "Ayuda: abre esta lista de controles (también el botón ? de arriba a la derecha)"],
    ["M", "Silenciar / activar el sonido (botón de altavoz para ajustar volúmenes)"],
    ["F11", "Pantalla completa"],
    ["F3", "Contador de FPS (modo diagnóstico)"]
  ],

  pause: { title: "Pausa", resume: "Reanudar", tree: "Ver árbol de decisiones", chain: "Ver cadena de rastro",
           controls: "Controles", settings: "Ajustes", menu: "Salir al menú", back: "Volver" },

  hud: { threat: "Amenaza", hiding: "Oculto", distance: "m", allies: "Confianza de aliados",
         pressAny: "Haz clic en la pantalla para controlar la cámara" },

  // Indicaciones contextuales del tutorial (RF-UI-04)
  hints: {
    move: "Usa W A S D para moverte",
    run: "Mantén Shift para correr",
    camera: "Mueve el ratón para girar la cámara (clic en la pantalla para capturarlo)",
    sentinel: "Los Centinelas te ven dentro de su cono violeta. Si te ven, la barra de amenaza sube.",
    hide: "Escóndete con [E] en un contenedor: 10 s ocultos reducen la amenaza a la mitad.",
    talk: "Acércate a las programadoras de arranque y pulsa [E] para hablar.",
    run_now: "¡Corre al portón norte! Pasa los muros por el lado libre y no te detengas.",
    hack: "Mantén [E] 2 segundos para hackear la puerta."
  },

  objectives: {
    s1_cross: "Cruza la calle y llega a la plaza",
    s1_talk: "Habla con las programadoras de arranque",
    s1_gate: "Llega al portón norte",
    s2_hub: "Llega al Índice de archivos",
    s2_inspect: "Inspecciona los archivos «borrados»",
    s2_console: "Usa la consola del Índice",
    s2_wait: "La bóveda se reinicia por la sobrescritura",
    s2_vault: "Llega a la Bóveda de firmware",
    s2_exit: "Cruza el portal al Núcleo",
    s3_elena: "Sigue hacia el Núcleo (puedes hablar con Elena)",
    s3_bios: "Preséntate ante el BIOS"
  },

  toasts: {
    seen: "¡Intruso sin extensión detectado!",
    capture: "Capturado por el Consejo de los OS",
    halved: "Amenaza reducida a la mitad",
    checkpoint: "Checkpoint guardado",
    hackDone: "Puerta hackeada",
    locked: "Bloqueado",
    shortcut: "Las programadoras abren un conducto de atajo",
    inspected: "Archivo inspeccionado",
    purge: "Purga de firmware ejecutada",
    overwriteWait: "Sobrescritura en curso: la bóveda se reinicia"
  },

  barks: [
    "Consejo de los OS: «Elemento desconocido y sospechoso».",
    "Consejo de los OS: «Sin extensión, sin permisos, sin remedio».",
    "Consejo de los OS: «Ejecuten la limpieza».",
    "Consejo de los OS: «¿Quién dejó entrar a un humano?»"
  ],

  prompts: { talk: "Hablar", hide: "Esconderse", unhide: "Salir del escondite", hack: "Hackear puerta (mantener)",
             inspect: "Inspeccionar archivo", console: "Usar el Índice", firmware: "Activar comando de firmware",
             elena: "Hablar con Elena", bios: "Presentarse ante el BIOS" },

  // Conceptos de la tesis educativa (RF-EDU-05/06)
  edu: {
    edu1: { title: "Registro del sistema · Borrar no es destruir",
            body: "Cuando se borra un archivo y se vacía la papelera, normalmente solo desaparece su referencia en el índice. El contenido sigue físicamente en las celdas hasta que algo lo reemplace… o nunca." },
    edu2: { title: "Registro del sistema · La capa de traducción",
            body: "En un SSD, el controlador redirige cada escritura a otra celda mediante una capa de traducción (FTL). Sobrescribir con ceros puede parecer que funciona y no haber tocado ni una celda real: el dato original sigue vivo donde ya no lo ves." },
    edu3: { title: "Registro del sistema · Método y evidencia",
            body: "Borrar bien exige un método adecuado al medio (en un SSD, órdenes del propio firmware o borrado criptográfico) y, además, evidencia de que se hizo. Lo que no se demuestra, no cuenta." }
  },
  eduPurge: "El comando de firmware actúa sobre las celdas reales, no sobre el índice. Por eso esta vez los archivos desaparecen de verdad.",

  decisionLabels: {
    "PD-1": { aceptar: "Aceptar ayuda", ignorar: "Ignorar a las programadoras" },
    "PD-2": { sobrescribir: "Sobrescribir", firmware: "Usar comando de firmware" },
    "PD-3": { destruir: "Destruir el rastro", rescatar: "Rescatar los datos", escapar: "Escapar con Elena" }
  },
  tree: { root: "Don entra a OpenCulin", pd: { "PD-1": "Encuentro con los programas de arranque",
          "PD-2": "Archivos «borrados» encontrados", "PD-3": "Final con el BIOS" } },

  endings: {
    destruir: {
      title: "Destruir el rastro",
      narrative: "Don ordena el borrado criptográfico del núcleo. Las claves se destruyen y, con ellas, todo lo que protegían. OpenCulin se apaga como una ciudad al amanecer. Don despierta en su cuarto, limpio de rastros… pero sin la información de Day-Play.",
      lesson: "El borrado criptográfico es irreversible por diseño: sin la clave, el dato deja de ser recuperable."
    },
    rescatar: {
      title: "Rescatar los datos",
      narrative: "Don copia la información para E-cofr y sale con el botín. El BIOS lo deja ir… pero cada paso quedó anotado: la cadena de rastro sigue ahí, verificable por cualquiera que sepa mirarla.",
      lesson: "La evidencia sobrevive al intento de ocultamiento: lo que se hizo, queda registrado."
    },
    escapar: {
      title: "Escapar con Elena",
      narrative: "Don prioriza salir. La voz de Elena lo guía hasta la puerta y vuelve a casa a tiempo para la cena. Es un final agridulce: el sistema queda intacto, con sus archivos «borrados» todavía vivos en las celdas.",
      lesson: "Lo que no se sanitiza, permanece."
    }
  },

  final: { title: "Fin de la demo", cert: "Certificado de final", decisions: "Decisiones tomadas", chainLen: "Longitud de la cadena",
           finalHash: "Hash final", integrity: "Cadena íntegra", broken: "Cadena alterada",
           arcas: "Conocer ArcasShred Pro", arcasNote: "Fuera del juego · ArcasShred Pro",
           arcasPitch: "Si te quedó la pregunta «¿y cómo se borra bien, entonces?», ArcasShred Pro es la respuesta real.",
           again: "Jugar de nuevo", credits: "Créditos", menu: "Menú principal",
           question: "¿Qué entendiste sobre cómo se borra información de verdad? (opcional, se guarda solo en este equipo)",
           save: "Guardar respuesta", saved: "Guardada localmente" },

  capture: { title: "Capturado", sub: "El Consejo de los OS te ha detenido. Reapareces en el último checkpoint." },

  credits: {
    heading: "Créditos",
    lines: [
      "Concepto, GDD y dosier: equipo del proyecto Tron Legacy · ArcasShred Pro",
      "Programación (JavaScript, motor WebGL propio): construido a partir del SRS v1.0",
      "Modelos, entornos, partículas e interfaz: generados por código; sin assets de terceros",
      "Música y efectos: sintetizados en tiempo real con Web Audio; sin archivos de audio de terceros",
      "Tipografías: fuentes del sistema del usuario",
      "«Tron Legacy» es un nombre de trabajo; el título definitivo está pendiente de verificación marcaria"
    ],
    assets: "Atribuciones de assets de terceros: ninguna. Todo el contenido visual y sonoro es original y se genera por código."
  }
};
