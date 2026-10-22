/* Efectos de partículas (SRS 3.6): estela, alerta, activación y borrado. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const M = TL.M, MAX = 200;
  class Particles {
    constructor() { this.list = []; }
    burst(x, y, z, n, color, o) {
      const p = Object.assign({ speed: 2, life: 0.8, size: 0.12, up: 0.5, grav: 0, ring: false }, o || {});
      for (let i = 0; i < n && this.list.length < MAX; i++) {
        const a = p.ring ? (i / n) * Math.PI * 2 : Math.random() * Math.PI * 2, s = p.speed * (p.ring ? 1 : 0.3 + Math.random() * 0.7);
        this.list.push({ x, y, z, vx: Math.cos(a) * s, vy: p.up * (0.4 + Math.random()), vz: Math.sin(a) * s, life: p.life * (0.6 + Math.random() * 0.4), max: p.life, size: p.size, color, grav: p.grav });
      }
    }
    trail(x, z) { this.burst(x, 0.15, z, 1, [0.25, 0.92, 1.0], { speed: 0.15, life: 0.55, size: 0.14, up: 0.2 }); }
    alert(x, z) { this.burst(x, 1.9, z, 14, [1.0, 0.54, 0.12], { speed: 2.4, life: 0.7, size: 0.1, up: 1.2, ring: true }); }
    activate(x, z) { this.burst(x, 0.3, z, 20, [0.4, 0.95, 1.0], { speed: 2.2, life: 0.9, size: 0.1, up: 2.2, ring: true }); }
    erase(x, z) { this.burst(x, 0.6, z, 12, [0.85, 0.95, 1.0], { speed: 0.8, life: 1.4, size: 0.09, up: 2.8 }); }
    update(dt) {
      for (const p of this.list) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.vy -= p.grav * dt; p.vx *= 0.98; p.vz *= 0.98; }
      this.list = this.list.filter(p => p.life > 0);
    }
    draw(r) {
      for (const p of this.list) { const k = p.life / p.max; r.drawBox(M.TRS(p.x, p.y, p.z, 0, p.size * k + 0.02, p.size * k + 0.02, p.size * k + 0.02), p.color, 1, Math.min(1, k * 1.5)); }
    }
    clear() { this.list.length = 0; }
  }
  TL.Particles = Particles;
})();
