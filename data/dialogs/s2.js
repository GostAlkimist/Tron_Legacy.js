/* Sector 2 — Bootina en el Índice (si aceptaste ayuda) y consola del Índice (incluye PD-2). */
TL.registerDialog("s2_b", {
  start: "s2b_01",
  nodes: [
    { id: "s2b_01", speaker: "arranque_b",
      text: [
        { requires_flags: ["atajo_abierto"], text: "¡Don! Kernela y yo te seguimos por los conductos. Abrimos un atajo hacia el norte: nos has dado buenas razones para confiar." },
        { text: "¡Don! Te seguí por los conductos. Aquí las cosas no son lo que parecen." }
      ],
      options: [
        { text: "¿Qué es este lugar?", next: "s2b_02", trust_delta: { arranque_b: 5 } },
        { text: "¿Dónde está el comando de firmware?", next: "s2b_03", set_flags: ["ruta_marcada"] },
        { text: "Gracias. Sigo solo." }
      ] },
    { id: "s2b_02", speaker: "arranque_b",
      text: "Mira hacia arriba: ese es el sistema de archivos, nombres y referencias. Abajo, en las celdas físicas, vive lo que de verdad existe. Lo «borrado» solo perdió el nombre.",
      next: "s2b_01" },
    { id: "s2b_03", speaker: "arranque_b",
      text: "Marqué la Bóveda de firmware en el noreste. Ahí está el comando que sí llega a las celdas reales. Antes revisa los tres archivos «borrados» y usa el Índice.",
      next: "s2b_01" }
  ]
});

TL.registerDialog("s2_console", {
  start: "s2c_01",
  nodes: [
    { id: "s2c_01", speaker: "sistema",
      text: "ÍNDICE DE ARCHIVOS: 3 entradas marcadas como ELIMINADAS. Celdas físicas: contenido presente. ¿Cómo procedes?",
      options: [
        { text: "Sobrescribir los archivos con ceros.", next: "s2c_over", decision_id: "PD-2", option_id: "sobrescribir" },
        { text: "Buscar un comando de firmware del disco.", next: "s2c_fw", decision_id: "PD-2", option_id: "firmware" }
      ] },
    { id: "s2c_over", speaker: "sistema",
      text: "Sobrescribiendo… 100 %. Operación completada en el índice.", event: "overwrite_start" },
    { id: "s2c_fw", speaker: "sistema",
      text: "Comando de firmware localizado en la Bóveda (noreste). Requiere activación manual.", event: "firmware_route" }
  ]
});

TL.registerDialog("s2_after_over", {
  start: "s2o_01",
  nodes: [
    { id: "s2o_01", speaker: "don", text: "¿Qué…? Los archivos volvieron a aparecer, ¡y en otra celda!", next: "s2o_02" },
    { id: "s2o_02", speaker: "sistema",
      text: "La capa de traducción redirigió la escritura. La bóveda de firmware se reinicia por el esfuerzo inútil: 60 s." }
  ]
});

/* Inspección de los tres archivos «borrados» (RF-EDU-01/02). */
[["s2_f1", "nomina_2025.xlsx", "0x1A"], ["s2_f2", "contratos_dayplay.pdf", "0x2F"], ["s2_f3", "claves_respaldo.kdbx", "0x51"]].forEach(([id, name, cell]) => {
  TL.registerDialog(id, { start: id + "_n", nodes: [
    { id: id + "_n", speaker: "sistema",
      text: name + " · Índice: ELIMINADO (solo se quitó la referencia). Celda física " + cell + ": el contenido sigue ahí, intacto y legible." }
  ] });
});
