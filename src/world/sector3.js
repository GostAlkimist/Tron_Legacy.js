/* Sector 3 — Núcleo BIOS (~4 min): Elena (proyección), juicio del BIOS, PD-3 y final. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  TL.sectors = TL.sectors || {};
  const C = TL.Level.C, M = TL.M, G = TL.Geom;
  const BIOS = { x: 0, z: 20 }, ELENA = { x: -13, z: 6 };

  TL.sectors[3] = class Sector3 {
    constructor(game) { this.g = game; this.stage = "approach"; this.elenaDone = false; this.verdict = false; }

    build() {
      const g = this.g, T = TL.texts, L = new TL.Level(3, { x1: -25, z1: -25, x2: 25, z2: 25 },
        { accent: C.magenta, accent2: C.white, grid: [0.9, 0.35, 0.95], gridSize: 3, floor: [0.03, 0.015, 0.06], fog: [0.04, 0.012, 0.07] });
      [[-25, -25, -8, -14, 9], [8, -25, 25, -14, 9], [-25, -4, -3, -1, 8], [3, -4, 25, -1, 8], [-25, -1, -19, 12, 6], [19, -1, 25, 12, 8],
       [-25, 12, -8, 25, 10], [8, 12, 25, 25, 10], [-1.6, 18.4, 1.6, 21.6, 3]].forEach(b => L.building(...b));
      L.perimeter(); L.skyline(28);
      L.strip(0, -25, 0, 18, C.magenta); L.arch(0, -24, 8, 7, C.magenta); L.pylon(-6, -8, 3, C.white); L.pylon(6, -8, 3, C.white);
      L.pylon(-8, 14, 4, C.magenta); L.pylon(8, 14, 4, C.magenta);
      this.door = L.door(-3, -4, 3, -1, 4, C.magenta);
      L.hide(-12, -11, "a"); L.hide(14, -9.5, "b"); L.hide(11, 5, "c");
      L.sentinels.push(
        new TL.Sentinel({ kind: "sweep", x: -18, z: -10, yaw: Math.PI / 2, sweep: { amp: 0.8, rate: 0.7 }, range: 15 }),
        new TL.Sentinel({ x: -20, z: -6.5, route: [{ x: -20, z: -6.5 }, { x: 20, z: -6.5 }], speed: 2.4, yaw: Math.PI / 2 }),
        new TL.Sentinel({ x: -8, z: 3, route: [{ x: -8, z: 3 }, { x: 14, z: 8 }], speed: 2.2, yaw: Math.PI / 2 }));
      // Puerta hackeable de la antesala
      L.interactables.push({ id: "hack_door", x: 0, z: -2.5, y: 2.2, label: "hack", hold: TL.config.interact.hackSeconds, enabled: () => !this.door.open,
        onUse: () => { L.setDoor(this.door, true); this.door.t = 0; g.toast(T.toasts.hackDone); g.audio.sfx("door"); g.particles.activate(0, -2.5); } });
      // Elena: proyección holográfica del mundo real
      this.elena = new TL.NPC({ id: "elena", x: ELENA.x, z: ELENA.z, yaw: Math.PI / 2 }); L.npcs.push(this.elena);
      L.interactables.push({ id: "elena", x: ELENA.x, z: ELENA.z, y: 2.2, label: "elena", enabled: () => !this.elenaDone, onUse: () => { this.elena.talking = true; g.startDialogue("s3_elena", this.elena); } });
      L.label({ x: ELENA.x, y: 2.8, z: ELENA.z, text: T.speakers.elena.name + " (proyección)", color: T.speakers.elena.color, max: 18 });
      L.lights.push({ x: ELENA.x, y: 2.5, z: ELENA.z, r: 11, c: [0.9, 0.5, 0.8] }, { x: 0, y: 4, z: 18, r: 16, c: [0.8, 0.4, 0.95] });
      L.pylon(ELENA.x - 2, ELENA.z, 3.5, C.magenta);
      // BIOS
      L.interactables.push({ id: "bios", x: BIOS.x, z: BIOS.z, y: 4, label: "bios", enabled: () => this.stage === "bios" || this.stage === "approach", onUse: () => { g.setMusic(null); g.startDialogue("s3_bios", null); } });
      L.label({ x: BIOS.x, y: 9.5, z: BIOS.z, text: "BIOS", color: "#e8f4ff", max: 40 });
      L.addProp((r, t) => {
        r.drawBox(M.TRS(0, 0.04, 20, 0, 12, 0.06, 12), [0.2, 0.1, 0.35], 0.5, 0.55);
        r.drawBox(M.TRS(0, 4.5, BIOS.z, 0, 2.2, 9, 2.2), [0.06, 0.05, 0.12], 0.0, 1);
        for (let k = 0; k < 4; k++) r.drawBox(M.TRS(0, 2.2 + k * 2, BIOS.z, 0, 2.28, 0.12, 2.28), C.white, 1, 1);
        r.drawBox(M.TRS(0, 7.2 + Math.sin(t * 1.5) * 0.2, BIOS.z, t * 0.7, 1.1, 1.1, 1.1), [1, 0.95, 1], 1, 1);
        for (let k = 0; k < 6; k++) { const a = t * 0.8 + k * Math.PI / 3; r.drawBox(M.TRS(Math.cos(a) * 3.6, 5 + Math.sin(t + k) * 0.6, BIOS.z + Math.sin(a) * 3.6, a, 0.5, 0.5, 0.5), C.magenta, 1, 0.9); }
        for (const [rad, sp] of [[4.6, 0.5], [5.4, -0.35]]) for (let k = 0; k < 12; k++) { const a = t * sp + k * Math.PI / 6; r.drawBox(M.TRS(Math.cos(a) * rad, 0.4, BIOS.z + Math.sin(a) * rad, -a, 1.1, 0.1, 0.2), C.cyan, 1, 0.8); }
      });
      return L;
    }

    enter(cp) {
      const g = this.g; if (cp) return this.respawn(cp);
      g.player.place(0, -22, 0); this.stage = "approach"; g.setCheckpoint({ x: 0, z: -22, yaw: 0, stage: "approach" }); g.setMusic("explore");
    }
    respawn(cp) { const g = this.g; g.player.place(cp.x, cp.z, cp.yaw); this.stage = cp.stage; g.level.sentinels.forEach(s => s.reset()); g.setMusic("explore"); }

    onDialogEvent(name) { if (name === "bios_verdict") this.verdict = true; }
    onDialogEnd(id) {
      const g = this.g; this.elena.talking = false;
      if (id === "s3_elena") this.elenaDone = true;
      if (id === "s3_bios" && g.state.ending) g.finish(g.state.ending);
    }
    update(dt) {
      this.door.t += dt; const g = this.g, p = g.player;
      if (!this.hackHint && G.dist(p.x, p.z, 0, -2.5) < 6 && !this.door.open) { this.hackHint = true; g.hint(TL.texts.hints.hack, 6); }
    }
    objective() {
      const T = TL.texts.objectives, p = this.g.player;
      if (!this.elenaDone && p.z < 9) return { x: BIOS.x, z: BIOS.z - 3, label: T.s3_elena };
      return { x: BIOS.x, z: BIOS.z - 3, label: T.s3_bios };
    }
  };
})();
