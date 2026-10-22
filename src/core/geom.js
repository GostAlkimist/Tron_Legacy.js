/* Geometría 2D (plano XZ): colisiones círculo–caja, línea de visión y alcance. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const Geom = {
    dist(ax, az, bx, bz) { return Math.hypot(ax - bx, az - bz); },
    /** RF-INT-01: interacción válida si la distancia es <= alcance (3 m). */
    inRange(ax, az, bx, bz, range) { return Math.hypot(ax - bx, az - bz) <= range; },
    angleDiff(a, b) { let d = (a - b) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; },
    lerpAngle(a, b, t) { return a + Geom.angleDiff(b, a) * t; },
    /** Empuja un círculo fuera de las cajas (deslizamiento). Modifica pos {x,z}. */
    resolve(pos, r, boxes, bounds) {
      for (let it = 0; it < 3; it++) {
        for (const b of boxes) {
          if (b.off) continue;
          const cx = Math.max(b.x1, Math.min(pos.x, b.x2)), cz = Math.max(b.z1, Math.min(pos.z, b.z2));
          const dx = pos.x - cx, dz = pos.z - cz, d2 = dx * dx + dz * dz;
          if (d2 < r * r) {
            if (d2 > 1e-8) { const d = Math.sqrt(d2), k = (r - d) / d; pos.x += dx * k; pos.z += dz * k; }
            else { // centro dentro de la caja: salir por el lado más cercano
              const l = pos.x - b.x1, rr = b.x2 - pos.x, t = pos.z - b.z1, bt = b.z2 - pos.z, m = Math.min(l, rr, t, bt);
              if (m === l) pos.x = b.x1 - r; else if (m === rr) pos.x = b.x2 + r; else if (m === t) pos.z = b.z1 - r; else pos.z = b.z2 + r;
            }
          }
        }
      }
      if (bounds) {
        pos.x = Math.max(bounds.x1 + r, Math.min(bounds.x2 - r, pos.x));
        pos.z = Math.max(bounds.z1 + r, Math.min(bounds.z2 - r, pos.z));
      }
    },
    /** Distancia al primer impacto de un rayo 2D con las cajas (método de slabs); Infinity si no hay. */
    rayDist(ox, oz, dx, dz, maxD, boxes, minH) {
      let best = Infinity;
      for (const b of boxes) {
        if (b.off || (minH && b.h < minH)) continue;
        let t0 = 0, t1 = maxD, ok = true;
        for (const [o, d, lo, hi] of [[ox, dx, b.x1, b.x2], [oz, dz, b.z1, b.z2]]) {
          if (Math.abs(d) < 1e-9) { if (o < lo || o > hi) { ok = false; break; } }
          else { let a = (lo - o) / d, c = (hi - o) / d; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); if (t0 > t1) { ok = false; break; } }
        }
        if (ok && t0 < best) best = t0;
      }
      return best;
    },
    /** Línea de visión libre entre dos puntos (solo cajas altas bloquean la vista). */
    los(ax, az, bx, bz, boxes) {
      const dx = bx - ax, dz = bz - az, d = Math.hypot(dx, dz); if (d < 1e-6) return true;
      return Geom.rayDist(ax, az, dx / d, dz / d, d, boxes, 2.5) === Infinity;
    }
  };
  TL.Geom = Geom;
})();
