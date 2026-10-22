/* NPC dialogante: se orienta hacia Don durante la conversación (RF-DIA-10). */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  class NPC {
    constructor(o) { Object.assign(this, { yaw: Math.PI, t: Math.random() * 6, talking: false, visible: true, style: o.id }, o); }
    update(dt, game) {
      this.t += dt;
      const p = game.player, near = TL.Geom.dist(this.x, this.z, p.x, p.z) < 7;
      if (this.talking || near) this.yaw = TL.Geom.lerpAngle(this.yaw, Math.atan2(p.x - this.x, p.z - this.z), 1 - Math.exp(-5 * dt));
    }
    draw(r) {
      if (!this.visible) return;
      const S = TL.Rig.STYLES[this.style];
      TL.Rig.drawHumanoid(r, this.x, 0, this.z, this.yaw, this.style, { t: this.t, talk: this.talking ? 1 : 0, alpha: S.holo ? 0.55 + 0.1 * Math.sin(this.t * 9) : 1 });
    }
  }
  TL.NPC = NPC;
})();
