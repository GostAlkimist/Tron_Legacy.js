/* Constructor de niveles: edificios, decoración neón, escondites, puertas y utilidades de dibujo. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const M = TL.M;
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const C = { cyan: [0.22, 0.9, 1.0], violet: [0.55, 0.38, 1.0], blue: [0.2, 0.45, 1.0], magenta: [0.92, 0.3, 0.9], orange: [1.0, 0.54, 0.12], white: [0.85, 0.95, 1.0], green: [0.3, 1.0, 0.7] };

  class Level {
    constructor(id, bounds, theme) {
      this.id = id; this.bounds = bounds; this.theme = Object.assign({ accent: C.cyan, accent2: C.violet, grid: C.cyan, gridSize: 4, floor: [0.02, 0.03, 0.07], fog: [0.012, 0.02, 0.06] }, theme);
      this.batch = new TL.Batch(); this.boxes = []; this.rand = rng(1000 + id * 77);
      this.interactables = []; this.sentinels = []; this.npcs = []; this.doors = []; this.props = []; this.labels = []; this.lights = []; this.hides = [];
    }
    _body() { const r = this.rand(); return [0.025 + r * 0.03, 0.035 + r * 0.04, 0.09 + r * 0.08]; }
    /** Edificio con colisión y líneas de neón. Coordenadas mínimas/máximas en el plano XZ. */
    building(x1, z1, x2, z2, h, o) {
      o = o || {}; const w = x2 - x1, d = z2 - z1, cx = (x1 + x2) / 2, cz = (z1 + z2) / 2, B = this.batch, R = this.rand;
      const acc = o.accent || this.theme.accent, acc2 = o.accent2 || this.theme.accent2;
      this.boxes.push({ x1, z1, x2, z2, h });
      B.box(cx, h / 2, cz, w, h, d, o.color || this._body(), 0, 0);
      for (const [px, pz, sx, sz] of [[cx, z1, w + 0.1, 0.1], [cx, z2, w + 0.1, 0.1], [x1, cz, 0.1, d + 0.1], [x2, cz, 0.1, d + 0.1]]) B.box(px, h + 0.05, pz, sx, 0.1, sz, acc, 1, 0);
      for (let y = 3.2; y < h - 0.5; y += 4.2 + R() * 2) B.box(cx, y, cz, w + 0.08, 0.07, d + 0.08, R() < 0.5 ? acc : acc2, 0.9, 0);
      for (let x = x1 + 1.2; x < x2 - 0.6; x += 2.6 + R() * 2) {
        if (R() < 0.75) { const hh = Math.max(1.5, h * (0.35 + R() * 0.55)), col = R() < 0.7 ? acc : acc2;
          B.box(x, hh / 2 + 0.3, z1 - 0.03, 0.12, hh, 0.06, col, 0.95, 0); if (R() < 0.6) B.box(x, hh / 2 + 0.3, z2 + 0.03, 0.12, hh, 0.06, col, 0.95, 0); }
      }
      for (let z = z1 + 1.2; z < z2 - 0.6; z += 2.8 + R() * 2) {
        if (R() < 0.7) { const hh = Math.max(1.5, h * (0.35 + R() * 0.55)), col = R() < 0.7 ? acc : acc2;
          B.box(x1 - 0.03, hh / 2 + 0.3, z, 0.06, hh, 0.12, col, 0.95, 0); if (R() < 0.6) B.box(x2 + 0.03, hh / 2 + 0.3, z, 0.06, hh, 0.12, col, 0.95, 0); }
      }
    }
    /** Línea de circuito sobre el suelo. */
    strip(x1, z1, x2, z2, col, w) { w = w || 0.14; this.batch.box((x1 + x2) / 2, 0.025, (z1 + z2) / 2, Math.abs(x2 - x1) + w, 0.05, Math.abs(z2 - z1) + w, col || this.theme.accent, 0.95, 0); }
    pylon(x, z, h, col) { const B = this.batch; B.box(x, 0.2, z, 0.9, 0.4, 0.9, [0.04, 0.05, 0.12], 0, 0); B.box(x, h / 2, z, 0.22, h, 0.22, col || this.theme.accent, 0.95, 0); B.box(x, h + 0.15, z, 0.5, 0.3, 0.5, col || this.theme.accent, 1, 0.7); this.lights.push({ x, y: Math.min(h, 4), z, r: 9, c: (col || this.theme.accent).map(v => v * 0.9) }); }
    /** Arco de entrada/salida (eje "x": el vano se abre a lo largo de X). */
    arch(x, z, w, h, col) { const B = this.batch; B.box(x - w / 2, h / 2, z, 0.5, h, 0.5, col, 1, 0); B.box(x + w / 2, h / 2, z, 0.5, h, 0.5, col, 1, 0); B.box(x, h, z, w + 0.5, 0.45, 0.5, col, 1, 0); this.lights.push({ x, y: 2.5, z, r: 11, c: col.map(v => v * 0.8) }); }
    /** Contenedor de datos para esconderse (RF-EVA-04). */
    hide(x, z, id) {
      const b = { x1: x - 1, z1: z - 0.9, x2: x + 1, z2: z + 0.9, h: 1.9 }; this.boxes.push(b);
      this.batch.box(x, 0.95, z, 2, 1.9, 1.8, [0.05, 0.07, 0.16], 0, 0);
      this.batch.box(x, 1.93, z, 2.05, 0.08, 1.85, C.cyan, 0.9, 0);
      this.batch.box(x, 1.0, z - 0.91, 1.4, 0.12, 0.04, C.cyan, 1, 0); this.batch.box(x, 1.0, z + 0.91, 1.4, 0.12, 0.04, C.cyan, 1, 0);
      const spot = { id: id || "hide" + this.hides.length, x, z }; this.hides.push(spot); return spot;
    }
    /** Puerta hackeable: colisión + panel. Devuelve el objeto puerta. */
    door(x1, z1, x2, z2, h, col) {
      const box = { x1, z1, x2, z2, h: h || 3.2 }; this.boxes.push(box);
      const d = { box, open: false, t: 0, col: col || C.magenta, cx: (x1 + x2) / 2, cz: (z1 + z2) / 2, w: x2 - x1, d: z2 - z1, h: box.h };
      this.doors.push(d); return d;
    }
    setDoor(d, open) { d.open = open; d.box.off = open; }
    perimeter() {
      const b = this.bounds, B = this.batch, h = 14, t = 3, col = [0.02, 0.03, 0.08], acc = this.theme.accent;
      const W = b.x2 - b.x1 + t * 2, D = b.z2 - b.z1;
      for (const [cx, cz, sx, sz] of [[(b.x1 + b.x2) / 2, b.z1 - t / 2, W, t], [(b.x1 + b.x2) / 2, b.z2 + t / 2, W, t], [b.x1 - t / 2, (b.z1 + b.z2) / 2, t, D], [b.x2 + t / 2, (b.z1 + b.z2) / 2, t, D]]) {
        B.box(cx, h / 2, cz, sx, h, sz, col, 0, 0);
        B.box(cx, 0.3, cz, sx + 0.1, 0.1, sz + 0.1, acc, 1, 0); B.box(cx, h, cz, sx + 0.1, 0.1, sz + 0.1, acc, 1, 0);
      }
    }
    skyline(n) {
      const b = this.bounds, R = this.rand, B = this.batch;
      for (let i = 0; i < n; i++) {
        const a = R() * Math.PI * 2, rad = 48 + R() * 60, x = Math.cos(a) * rad, z = Math.sin(a) * rad;
        if (x > b.x1 - 6 && x < b.x2 + 6 && z > b.z1 - 6 && z < b.z2 + 6) continue;
        const h = 18 + R() * 50, w = 3 + R() * 6, col = R() < 0.6 ? this.theme.accent : this.theme.accent2;
        B.box(x, h / 2, z, w, h, w, [0.02, 0.03, 0.09], 0, 0); B.box(x, h, z, w + 0.1, 0.3, w + 0.1, col, 1, 0);
        for (let y = 6; y < h; y += 6 + R() * 4) B.box(x, y, z, w + 0.08, 0.15, w + 0.08, col, 0.9, 0);
      }
    }
    addProp(fn) { this.props.push(fn); }
    label(o) { this.labels.push(o); return o; }
    finalize(gl) { this.batch.upload(gl); }
    dispose(gl) { this.batch.dispose(gl); }
    draw(r, game) {
      const b = this.bounds, T = this.theme;
      r.fog = T.fog;
      r.drawBox(M.TRS((b.x1 + b.x2) / 2, -0.5, (b.z1 + b.z2) / 2, 0, b.x2 - b.x1 + 400, 1, b.z2 - b.z1 + 400), T.floor, 0, 1, { color: T.grid, size: T.gridSize });
      r.drawBatch(this.batch);
      for (const d of this.doors) {
        const k = d.open ? Math.max(0, 1 - d.t * 3) : 1; if (k <= 0.01) continue;
        const prog = d.hack || 0;
        r.drawBox(M.TRS(d.cx, d.h / 2 * k, d.cz, 0, d.w, d.h * k, d.d), d.col, 0.55 + 0.35 * prog, 0.55 + 0.3 * Math.sin(r.time * 4 + d.cx) * 0.2);
      }
      for (const fn of this.props) fn(r, r.time, game);
    }
  }
  Level.C = C;
  TL.Level = Level;
})();
