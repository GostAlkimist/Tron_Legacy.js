/* Sector 1 — Encuentro con las programadoras de arranque (incluye PD-1). Esquema: SRS 3.5.1 */
TL.registerDialog("s1", {
  start: "s1_arranque_01",
  nodes: [
    { id: "s1_arranque_01", speaker: "arranque_a", text: "¿Qué haces aquí, archivo no reconocido?",
      options: [
        { text: "Soy Don, agente financiero. Necesito ayuda.", next: "s1_arranque_02", trust_delta: { arranque_a: 10 } },
        { text: "No sé dónde estoy. ¿Me explicas este lugar?", next: "s1_arranque_03", trust_delta: { arranque_a: 20 } },
        { text: "[Silencio]… (acepto el riesgo)", next: "s1_arranque_04", trust_delta: { arranque_a: -10 }, set_flags: ["silencio_inicial"] }
      ] },
    { id: "s1_arranque_02", speaker: "arranque_a",
      text: "¿Agente financiero? No tienes extensión, ni firma, ni permisos. Lo más parecido que tengo en el catálogo es «virus con corbata».",
      next: "s1_bootina_01" },
    { id: "s1_arranque_03", speaker: "arranque_a",
      text: "Esto es OpenCulin, la ciudad donde se conectan todos los programas. Aquí todo tiene vida propia… y tú, por ahora, eres una anomalía.",
      next: "s1_bootina_01" },
    { id: "s1_arranque_04", speaker: "arranque_a",
      text: "Valiente o confundido. Aquí ambas cosas se tratan igual: con sospecha.",
      next: "s1_bootina_01" },

    { id: "s1_bootina_01", speaker: "arranque_b",
      text: [
        { requires_flags: ["silencio_inicial"], text: "Kernela, está temblando. Eso no es un ataque, es un humano en mala racha." },
        { text: "Kernela, míralo: tiene cara de no haber guardado su documento." }
      ],
      options: [
        { text: "No soy un virus. Solo quería probar un juego.", next: "s1_decision", trust_delta: { arranque_b: 10 }, set_flags: ["se_explico"] },
        { text: "¿Pueden ayudarme a volver a casa?", next: "s1_decision", trust_delta: { arranque_b: 20 } },
        { text: "[Mirar alrededor en silencio]", next: "s1_decision", trust_delta: { arranque_b: -10 } }
      ] },

    { id: "s1_decision", speaker: "arranque_a",
      text: [
        { requires_flags: ["silencio_inicial"], text: "El Consejo de los OS ya ordenó tu limpieza. Podemos esconderte y guiarte… aunque tu silencio no ayuda. ¿Aceptas?" },
        { text: "El Consejo de los OS ya ordenó tu limpieza. Podemos esconderte y guiarte hasta el núcleo, o puedes arreglártelas solo." }
      ],
      options: [
        { text: "Acepto su ayuda.", next: "s1_fin_aceptar", decision_id: "PD-1", option_id: "aceptar" },
        { text: "Prefiero ir por mi cuenta.", next: "s1_fin_ignorar", decision_id: "PD-1", option_id: "ignorar" }
      ] },

    { id: "s1_fin_aceptar", speaker: "arranque_b",
      text: "¡Perfecto! Te enseñaremos atajos… pero primero corre. ¡Ya vienen los Centinelas! ¡Al portón norte!",
      event: "start_chase" },
    { id: "s1_fin_ignorar", speaker: "arranque_a",
      text: "Como quieras. Que el kernel te sea leve. Y corre: ya están aquí.",
      event: "start_chase" }
  ]
});
