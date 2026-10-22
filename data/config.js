/* Configuración central del juego (RNF-MAN-02). Todos los parámetros numéricos viven aquí.
   Origen: "Dossier" = valor del documento original; "Propuesto" = valor definido en el SRS. */
(globalThis.TL = globalThis.TL || {}).config = {
  title: "Tron Legacy",                       // Nombre de trabajo: pendiente de verificación marcaria (RNF-LEG-02)
  subtitle: "En busca de una nueva realidad",
  arcasUrl: "https://example.com/arcasshred-pro", // CAMBIAR por la URL real de ArcasShred Pro (RF-FIN-02)

  player: { walk: 3.5, run: 6.5, radius: 0.4, turnRate: 12, accel: 16 },          // Propuesto
  camera: { distance: 4, minDistance: 1.2, height: 1.55, pitchMin: 0.06, pitchMax: 1.1,
            smoothing: 16, fov: 62, sensitivity: 1 },                              // distancia: Propuesto (4 m)
  interact: { range: 3, hackSeconds: 2 },                                          // 3 m: Dossier

  trust: { initial: 50, min: 0, max: 100, shortcutThreshold: 70,                   // rango y umbral: Dossier
           allies: ["arranque_a", "arranque_b"] },
  threat: { max: 100, risePerSecond: 20, decayPerSecond: 5,                        // Propuesto
            hideSeconds: 10, hideFactor: 0.5,                                      // 10 s y 50 %: Dossier
            ignoreMultiplier: 1.25 },                                              // Propuesto
  sentinel: { fov: 90, distance: 15, patrolSpeed: 2.2, alertSpeed: 3.0,
              chaseSpeed: 5.4, loseSightSeconds: 4, searchSeconds: 5 },            // Propuesto
  decisions: { overwritePenaltySeconds: 60 },                                      // Propuesto

  audio: { music: 0.5, sfx: 0.7 },
  diagnostics: false
};
