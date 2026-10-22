/* Estado de la partida (RF-DEC-08): banderas, confianza, amenaza, cadena y checkpoint. Sin dependencias del motor. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  class GameState {
    constructor(clock) { this.clock = clock; this.reset(); }
    /** RF-APP-05: reinicializa todo el estado de juego. */
    reset() {
      const c = TL.config;
      this.flags = new Set();
      this.trust = new TL.Trust(c.trust);
      this.threat = new TL.Threat(c.threat);
      this.chain = new TL.Chain(this.clock);
      this.decisions = {};
      this.sector = 0;
      this.checkpoint = null;
      this.ending = null;
      this.threatMultiplier = 1;
      this.timePenalty = 0;
      this.stats = { captures: 0, playSeconds: 0 };
    }
  }
  TL.GameState = GameState;
})();
