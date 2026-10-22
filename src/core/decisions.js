/* Puntos de decisión y finales (RF-DEC-01..04, 09). Exactamente tres decisiones. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const DECISIONS = {
    "PD-1": { sector: 1, options: ["aceptar", "ignorar"] },
    "PD-2": { sector: 2, options: ["sobrescribir", "firmware"] },
    "PD-3": { sector: 3, options: ["destruir", "rescatar", "escapar"] }
  };
  const ENDINGS = ["destruir", "rescatar", "escapar"];

  /** Aplica los efectos de una decisión y la registra en la cadena de rastro (RF-DEC-05). */
  function apply(decisionId, optionId, state, chain, sector) {
    const d = DECISIONS[decisionId];
    if (!d || !d.options.includes(optionId)) throw new Error("Decisión inválida: " + decisionId + "/" + optionId);
    const cfg = TL.config;
    state.decisions[decisionId] = optionId;
    if (decisionId === "PD-1") {
      if (optionId === "aceptar") {
        cfg.trust.allies.forEach(a => state.trust.add(a, 15));
        state.flags.add("ayuda_aliados");
      } else {
        cfg.trust.allies.forEach(a => state.trust.add(a, -10));
        state.flags.add("aliados_ignorados");
        state.threatMultiplier = cfg.threat.ignoreMultiplier;       // ×1,25 (RF-DEC-02)
      }
    } else if (decisionId === "PD-2") {
      if (optionId === "sobrescribir") { state.flags.add("sobrescribio"); state.timePenalty = cfg.decisions.overwritePenaltySeconds; }
      else state.flags.add("firmware_elegido");
    } else if (decisionId === "PD-3") {
      state.ending = optionId;
    }
    return chain.record(decisionId, optionId, sector);
  }

  /** Datos del certificado del final (RF-DEC-09). */
  function certificate(state, chain) {
    const T = TL.texts;
    const ending = state.ending;
    return {
      ending,
      title: ending ? T.endings[ending].title : "",
      decisions: Object.keys(DECISIONS).filter(k => state.decisions[k]).map(k => ({
        id: k, label: T.decisionLabels[k][state.decisions[k]] })),
      chainLength: chain.length,
      finalHash: chain.lastHash,
      integrity: chain.verify().ok
    };
  }
  TL.Decisions = { DECISIONS, ENDINGS, apply, certificate };
})();
