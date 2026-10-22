/* Sector 2 — Archivos residuales (~5 min): puzzle educativo (sistema de archivos vs. celdas físicas) y PD-2. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  TL.sectors = TL.sectors || {};
  const C = TL.Level.C, M = TL.M, G = TL.Geom;
  const VAULT = { x: 30, z: 30 }, CONSOLE = { x: 0, z: 0 }, PORTAL = { x: -24, z: 31.5 };
  const FILES = [
    { id: "s2_f1", name: "nomina_2025.xlsx", path: "C:\\Finanzas\\", x: -9, z: 6, nx: -6, nz: 12, cell: "0x1A", cell2: "0x3C" },
    { id: "s2_f2", name: "contratos_dayplay.pdf", path: "C:\\Legal\\", x: 0, z: 12, nx: 6, nz: 3, cell: "0x2F", cell2: "0x44" },
    { id: "s2_f3", name: "claves_respaldo.kdbx", path: "C:\\Seguridad\\", x: 9, z: 6, nx: 3, nz: 9, cell: "0x51", cell2: "0x68" }
  ];

  TL.sectors[2] = class Sector2 {
    constructor(game) {
      this.g = game; this.stage = "inspect"; this.inspected = new Set(); this.fileState = "alive"; this.over = null;
      this.lockUntil = 0; this.edu = {}; this.purged = false;
    }

    build() {
      const g = this.g, T = TL.texts, L = new TL.Level(2, { x1: -35, z1: -35, x2: 35, z2: 35 },
        { accent: C.blue, accent2: C.violet, grid: [0.35, 0.3, 0.95], gridSize: 3, floor: [0.015, 0.02, 0.06], fog: [0.015, 0.014, 0.07] });
      [[-35, -35, -8, -22, 8], [8, -35, 35, -22, 6],
       [-26, -19, -14, -14, 5], [14, -19, 26, -14, 7], [-5, -18, 5, -14, 3],
       [-35, -8, -16, 2, 10], [-30, 6, -16, 16, 10], [16, -8, 35, 3, 10], [16, 8, 28, 16, 10],
       [-16, 16, 10, 19, 6],
       [-8, 24, 0, 30, 6], [-18, 22, -14, 28, 4], [4, 26, 12, 31, 5],
       [24, 22, 35, 24, 8], [22, 24, 24, 29, 8], [22, 31, 24, 35, 8]].forEach(b => L.building(...b));
      L.perimeter(); L.skyline(30);
      L.strip(0, -35, 0, -8, C.blue); L.strip(0, -8, 0, 2, C.violet);
      L.arch(0, -34, 8, 7, C.blue); L.pylon(-14, -4, 4, C.violet); L.pylon(14, -4, 4, C.violet); L.pylon(-14, 14, 3, C.blue); L.pylon(14, 14, 3, C.blue);
      // Puertas: conducto (atajo), puerta hackeable al oeste y portal de salida
      this.conduit = L.door(10, 16, 16, 19, 4, C.orange); this.conduit.col = [0.7, 0.25, 0.3];
      this.hackDoor = L.door(-17, 2, -16, 6, 4, C.magenta);
      this.portal = L.door(-27, 33, -21, 34, 5, C.magenta); L.arch(PORTAL.x, 33.5, 6, 6, C.cyan);
      // Escondites
      L.hide(-10, -16.2, "a"); L.hide(10, -11.5, "b"); L.hide(-13, 10, "c"); L.hide(24, 3.95, "d"); L.hide(10, 20.6, "e"); L.hide(-20, 24, "f");
      // Centinelas
      const cs = TL.config.sentinel;
      this.sA = new TL.Sentinel({ x: -22, z: -10.5, route: [{ x: -22, z: -10.5 }, { x: 22, z: -10.5 }], speed: 2.4, yaw: Math.PI / 2 });
      this.sB = new TL.Sentinel({ x: 20, z: 5.5, route: [{ x: 20, z: 5.5 }, { x: 31, z: 5.5 }, { x: 32, z: 17 }], speed: 2.2, yaw: Math.PI / 2 });
      this.sC = new TL.Sentinel({ x: -6, z: 20.5, route: [{ x: -6, z: 20.5 }, { x: 18, z: 20.5 }], speed: 2.2, yaw: Math.PI / 2 });
      this.sD = new TL.Sentinel({ kind: "sweep", x: -32.5, z: 13, yaw: Math.PI, sweep: { amp: 0.7, rate: 0.7 }, range: 12 });
      this.sE = new TL.Sentinel({ kind: "sweep", x: 27, z: 33, yaw: Math.PI, sweep: { amp: 0.9, rate: 0.6 }, range: 12 });
      L.sentinels.push(this.sA, this.sB, this.sC, this.sD, this.sE);
      // Archivos «borrados» (3 pilares inspeccionables)
      FILES.forEach((f, i) => {
        f.cx = f.x; f.cz = f.z;
        L.interactables.push({ id: f.id, get x() { return f.cx; }, get z() { return f.cz; }, y: 1.6, label: "inspect",
          enabled: () => this.fileState !== "gone" && this.stage !== "vault" && this.stage !== "exit" && !this.inspected.has(f.id),
          onUse: () => g.startDialogue(f.id, null) });
        L.label({ get x() { return f.cx; }, get z() { return f.cz; }, y: 0.4, max: 20, cls: "cell",
          text: () => this.fileState === "gone" ? "celda " + (f.moved ? f.cell2 : f.cell) + " · vacía" : "celda " + (f.moved ? f.cell2 : f.cell) + " · contenido intacto", color: "#7fe6ff" });
        L.label({ x: f.x, y: 8.6, z: f.z, max: 40, cls: "fs", color: "#8aa4ff",
          text: () => this.fileState === "gone" ? "" : f.path + f.name + "  [ELIMINADO]" });
      });
      // Consola del Índice
      L.interactables.push({ id: "console", x: CONSOLE.x, z: CONSOLE.z, y: 2, label: "console", enabled: () => this.stage === "console",
        onUse: () => g.startDialogue("s2_console", null) });
      L.label({ x: CONSOLE.x, y: 3.2, z: CONSOLE.z, text: "Índice de archivos", color: "#a77bff", max: 22 });
      // Bóveda de firmware
      L.interactables.push({ id: "firmware", x: VAULT.x, z: VAULT.z, y: 2.2, label: "firmware", enabled: () => this.stage === "vault",
        onUse: () => this.activateFirmware() });
      L.label({ x: VAULT.x, y: 4, z: VAULT.z, text: "Comando de firmware", color: "#6dffc4", max: 26 });
      L.interactables.push({ id: "hack_door", x: -16.5, z: 4, y: 2, label: "hack", hold: TL.config.interact.hackSeconds, enabled: () => !this.hackDoor.open,
        onUse: () => { L.setDoor(this.hackDoor, true); this.hackDoor.t = 0; g.toast(T.toasts.hackDone); g.audio.sfx("door"); g.particles.activate(-16.5, 4); } });
      // Aliada (solo si se aceptó su ayuda en PD-1)
      this.B = new TL.NPC({ id: "arranque_b", x: 4, z: 1.5, yaw: Math.PI, visible: false });
      L.npcs.push(this.B);
      L.interactables.push({ id: "talk_b", x: 4, z: 1.5, y: 2.2, label: "talk", enabled: () => this.B.visible, onUse: () => { this.B.talking = true; g.startDialogue("s2_b", this.B); } });
      L.label({ x: 4, y: 2.7, z: 1.5, text: T.speakers.arranque_b.name, color: T.speakers.arranque_b.color, max: 16, show: () => this.B.visible });
      L.lights.push({ x: 0, y: 3, z: 6, r: 16, c: [0.3, 0.35, 0.9] }, { x: VAULT.x, y: 3, z: VAULT.z, r: 14, c: [0.2, 0.9, 0.6] });

      // Dibujo del puzzle: capa de celdas físicas (suelo) y capa del sistema de archivos (plano elevado)
      L.addProp((r, t) => {
        for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) {
          const x = -12 + i * 3, z = 3 + j * 3;
          r.drawBox(M.TRS(x, 0.03, z, 0, 2.7, 0.05, 2.7), [0.12, 0.2, 0.55], 0.45, 0.45);
        }
        r.drawBox(M.TRS(0, 8, 8, 0, 36, 0.06, 28), [0.2, 0.35, 0.95], 0.35, 0.10);
        const fsNodes = [[-14, 4], [-4, 14], [6, 2], [14, 12], [-10, 12], [10, 3]];
        fsNodes.forEach(([x, z], k) => r.drawBox(M.TRS(x, 8.1, z, t * 0.2 + k, 0.7, 0.7, 0.7), [0.4, 0.55, 1], 0.9, 0.7));
        FILES.forEach((f, i) => {
          const px = f.cx, pz = f.cz;
          if (this.fileState !== "gone") r.drawBox(M.TRS(f.x, 8.2, f.z, t * 0.4, 0.7, 0.45, 0.7), [0.5, 0.5, 0.65], 0.2, 0.45);   // fantasma en el índice
          if (this.fileState === "gone") return;
          const black = this.fileState === "zero";
          r.drawBox(M.TRS(px, 1.1 + Math.sin(t * 2 + i) * 0.1, pz, t * 0.8, 0.9, 0.9, 0.9), black ? [0.02, 0.02, 0.03] : [0.45, 0.95, 1], black ? 0.0 : 1, 1);
          r.drawBox(M.TRS(px, 0.5, pz, 0, 0.12, 1.0, 0.12), black ? [0.1, 0.1, 0.12] : [0.3, 0.9, 1], black ? 0 : 0.9, 1);
        });
        // Columna del comando de firmware
        const hl = g.state.flags.has("ruta_marcada") || this.stage === "vault";
        const pulse = 1 + Math.sin(t * 3) * 0.1;
        r.drawBox(M.TRS(VAULT.x, 1.2, VAULT.z, t * 0.6, 0.9 * pulse, 2.4, 0.9 * pulse), C.green, 0.95, 1);
        r.drawBox(M.TRS(VAULT.x, 2.6, VAULT.z, -t * 1.1, 1.6, 0.12, 1.6), C.cyan, 1, 0.9);
        if (hl && this.stage !== "exit") r.drawBox(M.TRS(VAULT.x, 22, VAULT.z, 0, 0.3, 44, 0.3), C.green, 1, 0.35);
        // Indicador del portal
        r.drawBox(M.TRS(PORTAL.x, 0.05, 33.5, 0, 6, 0.1, 2), this.purged ? C.cyan : C.magenta, 1, 0.5);
      });
      return L;
    }

    enter(cp) {
      const g = this.g;
      if (cp) return this.respawn(cp);
      g.player.place(0, -32, 0); this.stage = "inspect";
      g.setCheckpoint({ x: 0, z: -32, yaw: 0, stage: "inspect" });
      g.setMusic("explore");
      this.B.visible = g.state.flags.has("ayuda_aliados");
      if (g.state.trust.shortcutUnlocked()) { g.state.flags.add("atajo_abierto"); g.level.setDoor(this.conduit, true); this.conduit.t = 0; this.sB.active = false; g.toast(TL.texts.toasts.shortcut, 5); }
      else this.sB.active = true;
    }

    respawn(cp) {
      const g = this.g; g.player.place(cp.x, cp.z, cp.yaw); this.stage = cp.stage;
      g.level.sentinels.forEach(s => s.reset());
      g.setMusic("explore");
    }

    onDialogEvent(name) {
      const g = this.g;
      if (name === "overwrite_start") { this.over = { t: 0, said: false }; this.fileState = "zero"; g.audio.sfx("erase"); FILES.forEach(f => g.particles.erase(f.cx, f.cz)); }
      if (name === "firmware_route") { this.stage = "vault"; g.setCheckpoint({ x: g.player.x, z: g.player.z, yaw: 0, stage: "vault" }); }
    }

    onDialogEnd(id) {
      const g = this.g; if (this.B) this.B.talking = false;
      if (id.startsWith("s2_f")) {
        this.inspected.add(id); g.toast(TL.texts.toasts.inspected);
        if (!this.edu.edu1) { this.edu.edu1 = true; g.showInfo("edu1"); }
        if (this.inspected.size >= 3 && this.stage === "inspect") this.stage = "console";
      } else if (id === "s2_console") {
        if (g.state.decisions["PD-2"] === "firmware") { this.stage = "vault"; g.setCheckpoint({ x: g.player.x, z: g.player.z, yaw: 0, stage: "vault" }); }
        else this.stage = "overwrite";
      } else if (id === "s2_after_over") {
        this.edu.edu2 = true; g.showInfo("edu2", () => { this.stage = "vault"; this.lockUntil = g.time + g.state.timePenalty; g.toast(TL.texts.toasts.overwriteWait, 5);
          g.setCheckpoint({ x: g.player.x, z: g.player.z, yaw: 0, stage: "vault" }); });
      }
    }

    activateFirmware() {
      const g = this.g, T = TL.texts;
      if (g.time < this.lockUntil) { g.toast(T.toasts.locked + " · " + Math.ceil(this.lockUntil - g.time) + " s"); g.audio.sfx("deny"); return; }
      g.audio.sfx("activate"); FILES.forEach(f => g.particles.erase(f.cx, f.cz)); g.particles.activate(VAULT.x, VAULT.z);
      this.fileState = "gone"; this.purged = true; this.stage = "exit"; g.level.setDoor(this.portal, true); this.portal.t = 0; g.toast(T.toasts.purge, 5);
      const pending = !this.edu.edu2;
      g.showInfo({ title: T.edu.edu3.title, body: (pending ? T.edu.edu2.body + "\n\n" : "") + T.eduPurge + "\n\n" + T.edu.edu3.body }, () => {
        g.setCheckpoint({ x: g.player.x, z: g.player.z, yaw: 0, stage: "exit" });
      });
      this.edu.edu2 = this.edu.edu3 = true;
    }

    update(dt) {
      const g = this.g, p = g.player, T = TL.texts;
      this.conduit.t += dt; this.hackDoor.t += dt; this.portal.t += dt;
      // Animación de sobrescritura: los archivos se «ponen a cero» y reaparecen en otra celda (metáfora de la FTL)
      if (this.over && g.mode === "PLAY") {
        this.over.t += dt;
        if (this.over.t > 4 && !this.over.said) {
          this.over.said = true; this.fileState = "alive"; FILES.forEach(f => { f.cx = f.nx; f.cz = f.nz; f.moved = true; g.particles.activate(f.cx, f.cz); });
          g.audio.sfx("alert"); g.startDialogue("s2_after_over", null);
        }
      }
      if (!this.hackHint && G.dist(p.x, p.z, -16.5, 4) < 6 && !this.hackDoor.open) { this.hackHint = true; g.hint(T.hints.hack, 6); }
      if (this.stage === "exit" && G.dist(p.x, p.z, PORTAL.x, PORTAL.z) < 2.6) g.gotoSector(3);
    }

    objective() {
      const g = this.g, p = g.player, T = TL.texts.objectives;
      if (this.stage === "inspect") {
        if (p.z < -8 && this.inspected.size === 0) return { x: 0, z: 3, label: T.s2_hub };
        const f = FILES.filter(f => !this.inspected.has(f.id)).sort((a, b) => G.dist(p.x, p.z, a.cx, a.cz) - G.dist(p.x, p.z, b.cx, b.cz))[0];
        return f ? { x: f.cx, z: f.cz, label: T.s2_inspect + " (" + this.inspected.size + "/3)" } : null;
      }
      if (this.stage === "console") return { x: CONSOLE.x, z: CONSOLE.z, label: T.s2_console };
      if (this.stage === "overwrite") return null;
      if (this.stage === "vault") return { x: VAULT.x, z: VAULT.z, label: g.time < this.lockUntil ? T.s2_wait + " · " + Math.ceil(this.lockUntil - g.time) + " s" : T.s2_vault };
      if (this.stage === "exit") return { x: PORTAL.x, z: PORTAL.z, label: T.s2_exit };
      return null;
    }
  };
})();
