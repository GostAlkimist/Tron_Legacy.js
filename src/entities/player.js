/* Don: movimiento relativo a la cámara, correr, colisiones y giro suave (RF-MOV-03/04/06). */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const G = TL.Geom;
  class Player {
    constructor() { this.x = 0; this.z = 0; this.yaw = 0; this.vx = 0; this.vz = 0; this.phase = 0; this.hidden = false; this.speed = 0; this.running = false; this.t = 0; }
    place(x, z, yaw) { this.x = x; this.z = z; this.yaw = yaw || 0; this.vx = this.vz = 0; this.hidden = false; }
    update(dt, input, camYaw, level, canMove) {
      const c = TL.config.player; this.t += dt;
      let ix = 0, iz = 0;
      if (canMove) {
        ix = (input.down("KeyD") || input.down("ArrowRight") ? 1 : 0) - (input.down("KeyA") || input.down("ArrowLeft") ? 1 : 0);
        iz = (input.down("KeyW") || input.down("ArrowUp") ? 1 : 0) - (input.down("KeyS") || input.down("ArrowDown") ? 1 : 0);
      }
      const fx = Math.sin(camYaw), fz = Math.cos(camYaw), rx = -Math.cos(camYaw), rz = Math.sin(camYaw);
      let dx = fx * iz + rx * ix, dz = fz * iz + rz * ix; const l = Math.hypot(dx, dz);
      this.running = canMove && (input.down("ShiftLeft") || input.down("ShiftRight")) && l > 0;
      const sp = l > 0 ? (this.running ? c.run : c.walk) : 0;
      if (l > 0) { dx /= l; dz /= l; }
      const k = Math.min(1, c.accel * dt);
      this.vx += (dx * sp - this.vx) * k; this.vz += (dz * sp - this.vz) * k;
      const pos = { x: this.x + this.vx * dt, z: this.z + this.vz * dt };
      G.resolve(pos, c.radius, level.boxes, level.bounds);
      this.x = pos.x; this.z = pos.z;
      this.speed = Math.hypot(this.vx, this.vz);
      if (this.speed > 0.15) this.yaw = G.lerpAngle(this.yaw, Math.atan2(this.vx, this.vz), 1 - Math.exp(-c.turnRate * dt));
      this.phase += this.speed * dt * 2.4;
    }
    draw(r) {
      if (this.hidden) return;
      TL.Rig.drawHumanoid(r, this.x, 0, this.z, this.yaw, "don", { phase: this.phase, amp: Math.min(1, this.speed / 5), t: this.t, talk: this.talking ? 1 : 0 });
    }
  }
  TL.Player = Player;
})();
