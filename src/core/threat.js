/* Barra de amenaza (RF-EVA-01..04). Lógica pura, sin dependencias del motor. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  class Threat {
    constructor(cfg) { this.cfg = cfg; this.reset(); }
    reset() { this.value = 0; this.hideTime = 0; this.hideApplied = false; }
    /** opts: {seen, hidden, multiplier, extra}. Devuelve {captured, halved}. */
    update(dt, opts) {
      const c = this.cfg, o = opts || {};
      let halved = false;
      if (o.hidden) {
        // Oculto: sin subida ni decaimiento; a los 10 s continuos baja al 50 % del valor actual (una vez por escondite).
        this.hideTime += dt;
        if (!this.hideApplied && this.hideTime >= c.hideSeconds) {
          this.value *= c.hideFactor; this.hideApplied = true; halved = true;
        }
      } else {
        this.hideTime = 0; this.hideApplied = false;
        if (o.seen) this.value += (c.risePerSecond * (o.multiplier || 1) + (o.extra || 0)) * dt;
        else this.value -= c.decayPerSecond * dt;
      }
      this.value = Math.max(0, Math.min(c.max, this.value));
      return { captured: this.value >= c.max, halved };
    }
    get ratio() { return this.value / this.cfg.max; }
  }
  TL.Threat = Threat;
})();
