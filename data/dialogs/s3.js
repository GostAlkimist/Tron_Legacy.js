/* Sector 3 — Elena (proyección) y juicio del BIOS (incluye PD-3). */
TL.registerDialog("s3_elena", {
  start: "s3e_01",
  nodes: [
    { id: "s3e_01", speaker: "elena",
      text: [
        { requires_flags: ["sobrescribio"], text: "¿Don? Te veo en la pantalla, inmóvil. Vi tus intentos de sobrescribir… eso nunca basta, ya lo sabes." },
        { text: "¿Don? ¿Me oyes? Dejaste la sesión abierta y te veo en la pantalla, inmóvil, con cara de susto." }
      ],
      options: [
        { text: "Elena, estoy dentro del sistema. Necesito salir.", next: "s3e_02", trust_delta: { elena: 20 }, set_flags: ["hablo_elena"] },
        { text: "¿Cómo está todo allá? ¿Alguien notó algo?", next: "s3e_03", trust_delta: { elena: 10 }, set_flags: ["hablo_elena"] },
        { text: "No tengo tiempo, Elena.", next: "s3e_04", trust_delta: { elena: -10 } }
      ] },
    { id: "s3e_02", speaker: "elena",
      text: "Entonces escúchame: la salida es el núcleo. Decidas lo que decidas, recuerda que cada paso queda registrado, y que lo que no se sanitiza, permanece." },
    { id: "s3e_03", speaker: "elena",
      text: "Nadie lo notó. Pero sigues ahí, y yo no pienso dejar tu silla vacía. Ve al núcleo; yo te guío la salida." },
    { id: "s3e_04", speaker: "elena",
      text: "Está bien. Pero si me necesitas, mi voz llega hasta el núcleo." }
  ]
});

TL.registerDialog("s3_bios", {
  start: "s3b_01",
  nodes: [
    { id: "s3b_01", speaker: "bios",
      text: [
        { requires_flags: ["sobrescribio"], text: "INTRUSO NO CLASIFICADO. INTENTASTE SOBRESCRIBIR. LA CAPA DE TRADUCCIÓN TE SONRÍE." },
        { requires_flags: ["firmware_elegido"], text: "INTRUSO NO CLASIFICADO. BUSCASTE EL FIRMWARE. ES UN BUEN MÉTODO. PERO ¿PARA QUÉ?" },
        { text: "INTRUSO NO CLASIFICADO." }
      ],
      next: "s3b_02" },
    { id: "s3b_02", speaker: "bios",
      text: [
        { requires_flags: ["ayuda_aliados"], text: "HAS CRUZADO TRES SECTORES CON AYUDA DE DOS PROGRAMAS DE ARRANQUE. TODO ESTÁ REGISTRADO EN LA CADENA." },
        { text: "HAS CRUZADO TRES SECTORES SIN AYUDA DE LOS PROGRAMAS DE ARRANQUE. TODO ESTÁ REGISTRADO EN LA CADENA." }
      ],
      next: "s3b_03" },
    { id: "s3b_03", speaker: "bios",
      text: "SE EMITE JUICIO SOBRE EL RASTRO: DESTRUIRLO, RESCATARLO O ABANDONARLO. ELIGE.",
      options: [
        { text: "Destruir el rastro (borrado criptográfico del núcleo).", next: "s3b_fin", decision_id: "PD-3", option_id: "destruir" },
        { text: "Rescatar los datos de Day-Play para E-cofr.", next: "s3b_fin", decision_id: "PD-3", option_id: "rescatar" },
        { text: "Escapar con Elena, sin resolver el sistema.", next: "s3b_fin", decision_id: "PD-3", option_id: "escapar" }
      ] },
    { id: "s3b_fin", speaker: "bios", text: "SENTENCIA REGISTRADA.", event: "bios_verdict" }
  ]
});
