/* Sector 1 — Entrada (~3 min): tutorial, encuentro con las programadoras de arranque (PD-1) y primera persecución. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  TL.sectors = TL.sectors || {};
  const C = TL.Level.C, M = TL.M, G = TL.Geom;
  const GATE = { x: -21, z: 28 };

  TL.sectors[1] = class Sector1 {
    constructor(game) { this.g = game; this.stage = "tutorial"; this.step = 0; this.stepT = 0; this.shown = {}; this.done = false; }

    build() {
      const g = this.g, T = TL.texts, L = new TL.Level(1, { x1: -30, z1: -30, x2: 30, z2: 30 }, { grid: C.cyan, gridSize: 4 });
      // Edificios (x1,z1,x2,z2,altura)
      [[-30, -30, -6, -18, 10], [6, -30, 30, -18, 8], [-30, -10, -7, -1, 12], [7, -10, 30, -1, 9],
       [-30, -1, -16, 11, 7], [16, -1, 30, 11, 11], [-30, 11, 6, 15, 6], [-6, 19, 30, 23, 6], [-12, 23, 30, 30, 10]]
        .forEach(b => L.building(...b));
      L.perimeter(); L.skyline(34);
      // Líneas de circuito guía
      L.strip(0, -30, 0, 10, C.cyan); L.strip(-28, -14, 28, -14, C.violet, 0.1);
      L.strip(0, 10, 10, 10, C.cyan); L.strip(10, 10, 10, 17, C.cyan); L.strip(10, 17, -18, 17, C.cyan); L.strip(-18, 17, -18, 26, C.cyan); L.strip(-18, 26, -21, 26, C.cyan);
      // Arco de entrada y terminal de arranque
      L.arch(0, -29, 8, 7, C.cyan); L.pylon(0, 8, 5, C.violet); L.pylon(-8, 3, 3, C.blue); L.pylon(8, 3, 3, C.blue);
      L.pylon(-4.5, -5, 3, C.cyan); L.pylon(4.5, -5, 3, C.cyan);
      // Portón norte (cerrado hasta la persecución)
      L.arch(GATE.x, GATE.z, 6, 6, C.cyan);
      this.gate = L.door(-24, GATE.z - 0.5, -18, GATE.z + 0.5, 5.5, C.magenta);
      // Escondites: tutorial y persecución
      L.hide(-9, -16.8, "t1"); L.hide(9, -16.8, "t2"); L.hide(-12, 15.9, "c1"); L.hide(-27, 27.2, "c2"); L.hide(22, 17, "c3");
      // Programadoras de arranque
      this.A = new TL.NPC({ id: "arranque_a", x: -2.5, z: 5, yaw: Math.PI });
      this.B = new TL.NPC({ id: "arranque_b", x: 2.5, z: 5, yaw: Math.PI });
      L.npcs.push(this.A, this.B);
      [this.A, this.B].forEach(n => {
        L.label({ x: n.x, y: 2.7, z: n.z, text: T.speakers[n.id].name, color: T.speakers[n.id].color, max: 16 });
        L.interactables.push({ id: "talk_" + n.id, x: n.x, z: n.z, y: 2.2, label: "talk", enabled: () => this.stage !== "chase" && !this.done,
          onUse: () => { n.talking = true; g.startDialogue("s1", n); } });
        L.lights.push({ x: n.x, y: 2.5, z: n.z, r: 10, c: [0.4, 0.3, 0.8] });
      });
      // Centinelas: guardia del tutorial (barrido) y dos perseguidores
      this.guard = new TL.Sentinel({ kind: "sweep", x: -14, z: -14, yaw: Math.PI / 2, sweep: { amp: 0.9, rate: 0.8 }, range: 16 });
      const cs = TL.config.sentinel, route = [{ x: 0, z: -1 }, { x: 2, z: 8 }, { x: 10, z: 12 }, { x: 10, z: 17 }, { x: -18, z: 17 }, { x: -18, z: 22 }, { x: -21, z: 27 }];
      this.chasers = [0, 1].map(i => new TL.Sentinel({ kind: "chaser", x: 0 - i * 1.2, z: -9 - i * 3, yaw: 0, route, speed: cs.chaseSpeed, fov: 130, range: 20, active: false, delay: 1.5 + i * 1.6 }));
      L.sentinels.push(this.guard, ...this.chasers);
      // Portón: indicador de estado
      L.addProp((r, t) => { r.drawBox(M.TRS(GATE.x, 0.05, GATE.z, 0, 6, 0.1, 2), this.gate.open ? C.cyan : C.magenta, 1, 0.5); });
      return L;
    }

    enter(cp) {
      const g = this.g;
      if (cp) return this.respawn(cp);
      g.player.place(0, -26, 0); this.stage = "tutorial"; this.step = 0; this.stepT = 0; this.shown = {};
      g.setCheckpoint({ x: 0, z: -26, yaw: 0, stage: "tutorial" });
      g.setMusic("explore");
    }

    respawn(cp) {
      const g = this.g, L = g.level; g.player.place(cp.x, cp.z, cp.yaw);
      L.sentinels.forEach(s => s.reset());
      this.stage = cp.stage;
      if (this.stage === "chase") this.startChase(true); else { this.gate.open = false; this.gate.box.off = false; this.chasers.forEach(c => { c.active = false; }); this.guard.active = true; g.setMusic("explore"); }
    }

    startChase(silent) {
      const g = this.g, T = TL.texts;
      this.stage = "chase"; this.done = true; this.guard.active = false; this.A.talking = this.B.talking = false;
      this.chasers.forEach(c => { c.reset(); c.active = true; });
      g.level.setDoor(this.gate, true); this.gate.t = 0;
      g.setMusic("chase"); g.hint(T.hints.run_now, 6);
      if (!silent) g.toast(T.barks[0]);
    }

    onDialogEvent(name) { if (name === "start_chase") { this.g.setCheckpoint({ x: this.g.player.x, z: this.g.player.z, yaw: 0, stage: "chase" }); this.startChase(); } }
    onDialogEnd() { this.A.talking = this.B.talking = false; }

    update(dt) {
      const g = this.g, p = g.player, T = TL.texts;
      this.gate.t += dt;
      if (this.gate.open === false && this.stage !== "chase") { /* portón cerrado */ }
      if (this.stage === "tutorial") this.tutorial(dt);
      if (this.stage === "chase" && this.gate.open && G.dist(p.x, p.z, GATE.x, GATE.z) < 2.6) g.gotoSector(2);
    }

    tutorial(dt) {
      const g = this.g, p = g.player, T = TL.texts.hints; this.stepT += dt;
      const next = () => { this.step++; this.stepT = 0; };
      switch (this.step) {
        case 0: g.hint(T.move); if (G.dist(p.x, p.z, 0, -26) > 4 || this.stepT > 14) next(); break;
        case 1: g.hint(T.run); if ((p.running && p.speed > 5) || this.stepT > 12) next(); break;
        case 2: g.hint(T.camera); if (g.camTravel > 0.9 || this.stepT > 10) next(); break;
        case 3: g.hint(null); if (p.z > -22) { next(); } break;
        case 4: g.hint(T.sentinel); if (this.stepT > 8 || p.z > -9) next(); break;
        case 5: { const near = g.level.hides.some(h => G.dist(p.x, p.z, h.x, h.z) < 7);
          if (near && p.z < -8) g.hint(T.hide); else g.hint(null); if (p.z > -4) next(); break; }
        case 6: g.hint(T.talk); if (this.done) next(); break;
        default: if (this.step === 7) { g.hint(null); this.step = 8; }
      }
    }

    objective() {
      const T = TL.texts.objectives;
      if (this.stage === "chase") return { x: GATE.x, z: GATE.z, label: T.s1_gate };
      if (g_z(this) < -3) return { x: 0, z: 2, label: T.s1_cross };
      return { x: 0, z: 5, label: T.s1_talk };
    }
  };
  function g_z(s) { return s.g.player.z; }
})();
