/* Centinela del Consejo de los OS: patrulla, alerta y búsqueda; sin combate (RF-EVA-05/07).
   Tipos: "patrol" (ruta de puntos), "sweep" (vigila girando) y "chaser" (persecución guionizada). */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const G = TL.Geom;
  class Sentinel {
    constructor(o) {
      const c = TL.config.sentinel;
      Object.assign(this, { kind: "patrol", route: [], pingpong: true, speed: c.patrolSpeed, fov: c.fov, range: c.distance,
        sweep: { amp: 0.8, rate: 0.7 }, active: true, delay: 0 }, o);
      this.spawn = { x: o.x, z: o.z, yaw: o.yaw || 0 };
      this.phase = 0; this.t = Math.random() * 5; this.reset();
    }
    reset() {
      const s = this.spawn; this.x = s.x; this.z = s.z; this.yaw = s.yaw; this.state = "patrol"; this.wp = this.route.length > 1 ? 1 : 0; this.dir = 1;
      this.lost = 0; this.searchT = 0; this.target = null; this.cooldown = 0; this.waitT = this.delay; this.moving = false; this.finished = false;
      this.baseYaw = s.yaw;
    }
    canSee(p, boxes) {
      if (!this.active || p.hidden || this.waitT > 0) return false;
      const dx = p.x - this.x, dz = p.z - this.z, d = Math.hypot(dx, dz);
      if (d > this.range) return false;
      if (Math.abs(G.angleDiff(Math.atan2(dx, dz), this.yaw)) > (this.fov * Math.PI / 180) / 2) return false;
      return G.los(this.x, this.z, p.x, p.z, boxes);
    }
    _moveTo(tx, tz, sp, dt, boxes) {
      const dx = tx - this.x, dz = tz - this.z, d = Math.hypot(dx, dz);
      if (d < 0.25) { this.moving = false; return true; }
      const st = Math.min(d, sp * dt); this.x += dx / d * st; this.z += dz / d * st;
      this.yaw = G.lerpAngle(this.yaw, Math.atan2(dx, dz), 1 - Math.exp(-8 * dt)); this.moving = true;
      return false;
    }
    /** Devuelve true si ve a Don en este fotograma. */
    update(dt, game) {
      const c = TL.config.sentinel, boxes = game.level.boxes, p = game.player;
      this.t += dt; this.cooldown -= dt;
      if (!this.active) return false;
      if (this.waitT > 0) { this.waitT -= dt; return false; }
      this.moving = false;
      const seen = this.canSee(p, boxes);
      if (this.kind === "chaser") {
        if (!this.finished) {
          const w = this.route[this.wp];
          if (w && this._moveTo(w.x, w.z, this.speed, dt, boxes)) { if (this.wp < this.route.length - 1) this.wp++; else { this.finished = true; this.baseYaw = this.yaw; } }
        } else this.yaw = this.baseYaw + Math.sin(this.t * 1.3) * 1.0;
        if (seen && this.cooldown <= 0) { this.cooldown = 6; game.onSentinelAlert(this); }
        this.phase += (this.moving ? this.speed : 0) * dt * 2.2;
        this.state = seen ? "alert" : "patrol";
        return seen;
      }
      if (seen) {
        if (this.state !== "alert" && this.cooldown <= 0) { this.cooldown = 5; game.onSentinelAlert(this); }
        this.state = "alert"; this.lost = 0; this.target = { x: p.x, z: p.z };
      }
      if (this.state === "alert") {
        if (!seen) { this.lost += dt; if (this.lost > c.loseSightSeconds) { this.state = "search"; this.searchT = c.searchSeconds; } }
        if (this.target) {
          this.yaw = G.lerpAngle(this.yaw, Math.atan2(this.target.x - this.x, this.target.z - this.z), 1 - Math.exp(-6 * dt));
          if (Math.hypot(this.target.x - this.x, this.target.z - this.z) > 3.2) {
            const prev = { x: this.x, z: this.z }, pos = { x: this.x, z: this.z };
            this._moveTo(this.target.x, this.target.z, c.alertSpeed, dt, boxes); pos.x = this.x; pos.z = this.z;
            G.resolve(pos, 0.45, boxes, game.level.bounds); this.x = pos.x; this.z = pos.z;
          } else this.moving = false;
        }
      } else if (this.state === "search") {
        if (this.target && this._moveTo(this.target.x, this.target.z, c.alertSpeed, dt, boxes)) {
          this.searchT -= dt; this.yaw += Math.sin(this.t * 2.4) * dt * 2.2;
          if (this.searchT <= 0) { this.state = "patrol"; this.target = null; this.baseYaw = this.yaw; }
        } else if (!this.target) this.state = "patrol";
      } else if (this.kind === "sweep" || this.route.length < 2) {
        this.yaw = this.baseYaw + Math.sin(this.t * this.sweep.rate) * this.sweep.amp;
      } else {
        const w = this.route[this.wp];
        if (this._moveTo(w.x, w.z, this.speed, dt, boxes)) {
          if (this.pingpong) { if (this.wp + this.dir < 0 || this.wp + this.dir >= this.route.length) this.dir *= -1; this.wp += this.dir; }
          else this.wp = (this.wp + 1) % this.route.length;
        }
      }
      this.phase += (this.moving ? this.speed : 0) * dt * 2.2;
      return seen;
    }
    coneVerts(boxes) {
      const v = [], N = 16, half = (this.fov * Math.PI / 180) / 2;
      let prev = null;
      for (let i = 0; i <= N; i++) {
        const a = this.yaw - half + (2 * half * i) / N, fx = Math.sin(a), fz = Math.cos(a);
        const d = Math.min(this.range, G.rayDist(this.x, this.z, fx, fz, this.range, boxes, 2.5));
        const pt = [this.x + fx * d, 0.06, this.z + fz * d];
        if (prev) v.push(this.x, 0.06, this.z, prev[0], prev[1], prev[2], pt[0], pt[1], pt[2]);
        prev = pt;
      }
      return v;
    }
    draw(r, boxes) {
      if (!this.active) return;
      const alert = this.state === "alert", search = this.state === "search";
      const acc = alert ? [1.0, 0.54, 0.12] : search ? [1.0, 0.75, 0.3] : [0.72, 0.3, 1.0];
      TL.Rig.drawHumanoid(r, this.x, 0, this.z, this.yaw, "sentinel", { phase: this.phase, amp: this.moving ? Math.min(1, this.speed / 4) : 0, t: this.t, accent: acc });
      if (this.waitT <= 0) r.drawTris(this.coneVerts(boxes), acc, alert ? 0.34 : 0.17, 0.7);
    }
  }
  TL.Sentinel = Sentinel;
})();
