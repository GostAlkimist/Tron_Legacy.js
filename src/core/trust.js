/* Confianza de los NPC (RF-DIA-05/06). Entero 0–100, saturado. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  class Trust {
    constructor(cfg) { this.cfg = cfg; this.values = {}; }
    get(npc) { return npc in this.values ? this.values[npc] : this.cfg.initial; }
    set(npc, v) { this.values[npc] = Math.max(this.cfg.min, Math.min(this.cfg.max, Math.round(v))); return this.values[npc]; }
    add(npc, delta) { return this.set(npc, this.get(npc) + delta); }
    /** Promedio de la confianza de las dos programadoras de arranque. */
    alliesTrust() { const a = this.cfg.allies; return a.reduce((s, id) => s + this.get(id), 0) / a.length; }
    shortcutUnlocked() { return this.alliesTrust() >= this.cfg.shortcutThreshold; }
    reset() { this.values = {}; }
  }
  TL.Trust = Trust;
})();
