/* Juego: bucle principal, máquina de estados (MENU, INTRO, PLAY, DIALOGUE, INFO, PAUSE, CAPTURE, TRANSITION, FINAL),
   cámara en tercera persona, interacción, amenaza, checkpoints, decisiones y transiciones. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const G = TL.Geom, T = () => TL.texts, cfg = TL.config;

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.r = new TL.Renderer(canvas); this.input = new TL.Input(canvas); this.audio = new TL.AudioEngine(); this.telemetry = new TL.Telemetry();
      this.state = new TL.GameState(); this.dialogue = new TL.Dialogue(this.state); this.player = new TL.Player(); this.particles = new TL.Particles();
      this.settings = this._loadSettings(); this.voice = new TL.Voice(this); this.donLine = null; this.audio.setVolumes(this.settings.music, this.settings.sfx); this.audio.setMuted(this.settings.muted);
      this.ui = new TL.UI(this); this.ui.syncTools();
      this.mode = "MENU"; this.time = 0; this.camYaw = 0; this.camPitch = 0.32; this.camDist = cfg.camera.distance; this.camTravel = 0; this.orbit = 0;
      this.hintText = null; this.hintUntil = 0; this.target = null; this.hold = 0; this.holdLock = false; this.hideSpot = null;
      this.fps = 60; this.showFps = !!cfg.diagnostics; this.lowFpsT = 0; this.trans = null; this.infoReady = 0; this.captureT = 0;
      this.camera = { eye: [0, 8, -10], target: [0, 1, 5], fov: cfg.camera.fov * Math.PI / 180 };
      this.input.onCanvasClick = () => { this.audio.ensure(); if (this.mode === "PLAY" && !this.input.locked) this.input.requestLock(); };
      this.input.onLockLost = () => { if (this.mode === "PLAY") this.pause(); };
      window.addEventListener("resize", () => this.r.resize());
      window.addEventListener("pointerdown", () => this.audio.ensure());
      this.showMenuBackdrop(); this.ui.menu();
      this.last = performance.now(); requestAnimationFrame(t => this.frame(t));
    }

    // ---------- ajustes ----------
    _loadSettings() {
      const d = { music: cfg.audio.music, sfx: cfg.audio.sfx, sens: cfg.camera.sensitivity, muted: false, voice: 1 };
      try { return Object.assign(d, JSON.parse(localStorage.getItem("tl_settings") || "{}")); } catch (e) { return d; }
    }
    toggleMute() { this.setSetting("muted", !this.settings.muted); if (this.settings.muted) this.voice.stop(); this.toast(this.settings.muted ? "Sonido silenciado" : "Sonido activado", 1.6); }
    /** Botón/tecla de ayuda: muestra los controles y permite volver al punto donde estaba el jugador. */
    openHelp() {
      this.audio.ensure();
      if (this.mode === "PLAY") { this.mode = "PAUSE"; this.input.releaseLock(); this.ui.controls("resume"); }
      else if (this.mode === "PAUSE") this.ui.controls("pause");
      else if (this.mode === "MENU") this.ui.controls("menuBack");
    }
    setSetting(k, v) { this.settings[k] = v; this.audio.setVolumes(this.settings.music, this.settings.sfx); this.audio.setMuted(this.settings.muted); this.ui && this.ui.syncTools(); try { localStorage.setItem("tl_settings", JSON.stringify(this.settings)); } catch (e) { /* sin almacenamiento */ } }
    log(e, d) { this.telemetry.log(e, d); }
    setMusic(n) { this.audio.music(n); }

    // ---------- niveles ----------
    prepareLevel(L) {
      L.finalize(this.r.gl);
      L.hides.forEach(h => L.interactables.push({ id: "hide_" + h.id, x: h.x, z: h.z, y: 1.3, range: 3,
        label: () => (this.player.hidden ? "unhide" : "hide"), enabled: () => !this.player.hidden || this.hideSpot === h, onUse: () => this.toggleHide(h) }));
    }
    showMenuBackdrop() {
      if (this.level) this.level.dispose(this.r.gl);
      this.state.sector = 0; this.sector = new TL.sectors[1](this); this.level = this.sector.build(); this.prepareLevel(this.level);
      this.player.place(0, -60, 0); this.level.sentinels.forEach(s => { s.active = false; });
    }
    loadSector(n) {
      if (this.level) this.level.dispose(this.r.gl);
      this.state.sector = n; this.sector = new TL.sectors[n](this); this.level = this.sector.build(); this.prepareLevel(this.level);
      this.player.hidden = false; this.hideSpot = null; this.particles.clear(); this.state.threat.reset(); this.hint(null); this.ui.clearToasts();
      this.sector.enter(null); this.camYaw = this.player.yaw; this.camPitch = 0.3; this.camTravel = 0;
      this.log("entrada a sector " + n);
    }
    beginPlay() { this.mode = "PLAY"; this.ui.hideScreen(); this.ui.showHud(true); this.input.requestLock(); }

    newGame() {
      this.audio.ensure(); this.voice.stop(); this.donLine = null; this.state.reset(); this.telemetry.reset(); this.log("inicio de partida"); this.time = 0; this.particles.clear();
      this.showMenuBackdrop(); this.mode = "INTRO"; this.ui.showHud(false); this.setMusic("explore");
      this.ui.introStart(() => { this.loadSector(1); this.beginPlay(); });
    }
    gotoSector(n) {
      if (this.mode !== "PLAY") return;
      this.voice.stop(); this.trans = { phase: "out", t: 0, n }; this.mode = "TRANSITION"; this.input.releaseLock(); this.audio.sfx("activate");
    }
    finish(ending) {
      this.trans = { phase: "fout", t: 0, ending }; this.mode = "TRANSITION"; this.input.releaseLock();
    }
    updateTransition(dt) {
      const tr = this.trans; if (!tr) return; tr.t += dt;
      if (tr.phase === "out") { this.ui.setFade(Math.min(1, tr.t / 0.6)); if (tr.t >= 0.6) { tr.phase = "card"; tr.t = 0; tr.frames = 0; this.ui.showHud(false); this.ui.loading(T().sectorCards[tr.n]); this.ui.setFade(0); } }
      else if (tr.phase === "card") { tr.frames++; if (tr.frames === 3) this.loadSector(tr.n); if (tr.t >= 1.8) { tr.phase = "in"; tr.t = 0; this.ui.hideScreen(); this.ui.setFade(1); this.ui.showHud(true); } }
      else if (tr.phase === "in") { this.ui.setFade(Math.max(0, 1 - tr.t / 0.6)); if (tr.t >= 0.6) { this.trans = null; this.ui.setFade(0); this.mode = "PLAY"; this.input.requestLock(); } }
      else if (tr.phase === "fout") { this.ui.setFade(Math.min(1, tr.t / 1.3)); if (tr.t >= 1.3) { tr.phase = "fin"; tr.t = 0;
        this.mode = "FINAL"; this.ui.showHud(false); this.ui.dialogHide(); this.setMusic("explore"); this.log("final alcanzado: " + tr.ending);
        this.log("tiempo total: " + Math.round(this.state.stats.playSeconds) + " s · capturas: " + this.state.stats.captures);
        this.ui.final(TL.Decisions.certificate(this.state, this.state.chain)); this.voice.speak("narrador", T().endings[tr.ending].narrative); this.mode = "TRANSITION"; } }
      else if (tr.phase === "fin") { this.ui.setFade(Math.max(0, 1 - tr.t / 1.0)); if (tr.t >= 1.0) { this.trans = null; this.ui.setFade(0); this.mode = "FINAL"; } }
    }

    // ---------- utilidades de juego ----------
    hint(text, secs) { this.hintText = text || null; this.hintUntil = secs ? performance.now() + secs * 1000 : 0; }
    toast(t, secs) { this.ui.toast(t, secs); }
    setCheckpoint(p) {
      const had = this.state.checkpoint && this.state.checkpoint.sector === this.state.sector;
      this.state.checkpoint = Object.assign({ sector: this.state.sector, yaw: 0 }, p);
      if (had) this.toast(T().toasts.checkpoint, 2);
      this.log("checkpoint", "sector " + this.state.sector + " · " + p.stage);
    }
    decide(pd, opt) {
      const b = TL.Decisions.apply(pd, opt, this.state, this.state.chain, this.state.sector);
      this.log("decisión", pd + " → " + opt + " · bloque " + b.index); this.audio.sfx("decision");
      this.toast("Decisión registrada en la cadena de rastro · bloque " + b.index + " · " + TL.Chain.short(b.hash), 4);
    }
    onSentinelAlert(s) {
      this.particles.alert(s.x, s.z); this.audio.sfx("alert");
      if (Math.random() < 0.6) this.toast(T().barks[Math.floor(Math.random() * T().barks.length)], 3); else this.toast(T().toasts.seen, 2.5);
    }
    toggleHide(h) {
      const p = this.player, L = this.level;
      if (!p.hidden) { p.hidden = true; p.x = h.x; p.z = h.z; p.vx = p.vz = 0; this.hideSpot = h; this.audio.sfx("hide"); this.log("escondite"); }
      else {
        for (const [x, z] of [[h.x, h.z - 1.6], [h.x, h.z + 1.6], [h.x - 1.9, h.z], [h.x + 1.9, h.z]]) {
          const q = { x, z }; G.resolve(q, cfg.player.radius, L.boxes, L.bounds);
          if (Math.hypot(q.x - x, q.z - z) < 0.05) { p.x = x; p.z = z; break; } p.x = q.x; p.z = q.z;
        }
        p.hidden = false; this.hideSpot = null; this.audio.sfx("unhide");
      }
    }

    // ---------- diálogos e información ----------
    startDialogue(treeId, npc) {
      if (this.mode !== "PLAY") return;
      this.mode = "DIALOGUE"; this.dlg = { treeId, npc }; this.donLine = null; this.input.releaseLock(); this.audio.sfx("blip");
      this.dlgView = this.dialogue.start(treeId); this._dlgEvents();
      if (!this.dlgView) return this.endDialogue(); this._showView(this.dlgView);
    }
    _showView(v) { this.ui.dialogShow(v); this.voice.speak(v.speaker, v.text); }
    _dlgEvents() { this.dialogue.popEvents().forEach(e => this.sector.onDialogEvent && this.sector.onDialogEvent(e)); }
    dialogueChoose(i) {
      if (this.mode !== "DIALOGUE" || this.donLine) return;
      const opt = this.dlgView && this.dlgView.options[i], optText = opt && opt.text;
      const res = this.dialogue.choose(i); if (!res) return;
      this.audio.sfx("blip");
      if (res.decision) this.decide(res.decision.decision_id, res.decision.option_id);
      this.dlgView = res.view; this._dlgEvents();
      // Con voces activas, Don dice la opción elegida antes de que responda el otro personaje
      if (optText && this.voice.enabled()) {
        this.donLine = { view: res.view, t: TL.Voice.estimate(optText, TL.Voice.PROFILES.don.rate) + 0.6, min: 0.5 };
        this.ui.dialogShow({ speaker: "don", text: optText, options: [] }); this.ui.dialogComplete();
        this.voice.speak("don", optText, { onend: () => this._finishDonLine() }); return;
      }
      this._afterChoice(res.view);
    }
    _afterChoice(view) { if (!view) this.endDialogue(); else this._showView(view); }
    _finishDonLine() { const d = this.donLine; if (!d || this.mode !== "DIALOGUE") return; this.donLine = null; this._afterChoice(d.view); }
    dialogueAdvanceOrComplete() {
      if (this.mode !== "DIALOGUE") return;
      if (this.donLine) { if (this.donLine.min <= 0) this._finishDonLine(); return; }
      if (this.ui.dialogComplete()) return;
      if (this.dlgView && this.dlgView.options.length) return;
      this.dlgView = this.dialogue.advance(); this._dlgEvents();
      if (!this.dlgView) this.endDialogue(); else this._showView(this.dlgView);
    }
    endDialogue() {
      const id = this.dlg.treeId; this.voice.stop(); this.donLine = null; this.dialogue.end(); this.ui.dialogHide(); this.mode = "PLAY"; this.dlg = null; this.dlgView = null; this.input.requestLock();
      if (this.sector.onDialogEnd) this.sector.onDialogEnd(id);
    }
    showInfo(keyOrObj, cb) {
      const o = typeof keyOrObj === "string" ? T().edu[keyOrObj] : keyOrObj;
      this.mode = "INFO"; this.input.releaseLock(); this.infoCb = cb; this.infoReady = 0.45; this.audio.sfx("decision");
      this.log("concepto educativo", o.title); this.ui.info(o.title, o.body); this.voice.speak("sistema", o.title + ". " + o.body);
    }
    closeInfo() { if (this.mode !== "INFO" || this.infoReady > 0) return; this.voice.stop(); this.ui.hideScreen(); this.mode = "PLAY"; this.input.requestLock(); const cb = this.infoCb; this.infoCb = null; if (cb) cb(); }

    // ---------- pausa y menús ----------
    pause() { if (this.mode !== "PLAY") return; this.mode = "PAUSE"; this.input.releaseLock(); this.ui.pause(); }
    resume() { this.ui.hideScreen(); this.mode = "PLAY"; this.input.requestLock(); }
    toMenu() { this.voice.stop(); this.donLine = null; this.ui.hideScreen(); this.ui.showHud(false); this.ui.dialogHide(); this.setMusic(null); this.showMenuBackdrop(); this.mode = "MENU"; this.trans = null; this.ui.setFade(0); this.ui.menu(); }
    toggleFullscreen() { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { /* no soportado */ } }
    onUiAction(act) {
      this.audio.ensure();
      switch (act) {
        case "play": case "again": return this.newGame();
        case "controls": return this.ui.controls("menuBack");
        case "settings": return this.ui.settings("menuBack");
        case "credits": case "credits2": return this.ui.credits("menuBack");
        case "quit": this.ui.note(T().menu.quitMsg); try { window.close(); } catch (e) { /* ignorado */ } return;
        case "menuBack": return this.ui.menu();
        case "resume": return this.resume();
        case "pause": return this.ui.pause();
        case "tree": return this.ui.tree();
        case "chain": return this.ui.chain();
        case "pcontrols": return this.ui.controls("pause");
        case "psettings": return this.ui.settings("pause");
        case "menu": return this.toMenu();
        case "verify": return this.ui.verifyMsg();
        case "download": return this.telemetry.download();
        case "fullscreen": return this.toggleFullscreen();
        case "infoOk": return this.closeInfo();
        case "arcas": this.log("clic en enlace de ArcasShred Pro"); window.open(cfg.arcasUrl, "_blank", "noopener"); return;
        case "saveAnswer": try { localStorage.setItem("tl_answer", this.ui.answerText()); } catch (e) { /* sin almacenamiento */ } this.ui.savedMsg(); this.log("respuesta guardada localmente"); return;
      }
    }

    // ---------- captura ----------
    capture() {
      this.mode = "CAPTURE"; this.captureT = 2.4; this.state.stats.captures++; this.audio.sfx("capture"); this.ui.capture(); this.log("captura", "sector " + this.state.sector);
      this.input.releaseLock();
    }
    respawn() {
      this.state.threat.reset(); this.player.hidden = false; this.hideSpot = null; this.ui.hideScreen(); this.particles.clear();
      this.sector.respawn(this.state.checkpoint); this.camYaw = this.player.yaw; this.mode = "PLAY"; this.input.requestLock();
    }

    // ---------- bucle ----------
    frame(now) {
      requestAnimationFrame(t => this.frame(t));
      let dt = (now - this.last) / 1000; this.last = now; if (!(dt > 0)) dt = 0.016;
      this.fps = this.fps * 0.92 + (1 / Math.max(dt, 0.001)) * 0.08;      // FPS reales (sin limitar el paso de simulación)
      dt = Math.min(dt, 0.05);
      try { this.update(dt); this.render(dt); } catch (e) { console.error(e); this.telemetry.log("error", e.message); this.ui.error("Error del juego: " + e.message + " (ver registro). Pulsa F5 para reiniciar."); }
      this.input.endFrame();
    }
    update(dt) {
      const inp = this.input;
      if (inp.wasPressed("F3")) this.showFps = !this.showFps;
      if (inp.wasPressed("F11")) this.toggleFullscreen();
      if (inp.wasPressed("KeyM")) this.toggleMute();
      if (inp.wasPressed("KeyH")) this.openHelp();
      if (this.fps < 30 && this.mode === "PLAY") { this.lowFpsT += dt; if (this.lowFpsT > 3) { this.lowFpsT = 0; this.log("caída de rendimiento", Math.round(this.fps) + " FPS"); } } else this.lowFpsT = 0;
      this.ui.update(dt);
      const confirm = inp.wasPressed("Space") || inp.wasPressed("Enter") || inp.wasPressed("NumpadEnter");
      switch (this.mode) {
        case "MENU": case "FINAL": this.orbit += dt * 0.12; this.level.npcs.forEach(n => n.update(dt, this)); break;
        case "INTRO": this.orbit += dt * 0.12; if (confirm) this.ui.introAdvance(); break;
        case "PLAY": this.playUpdate(dt); break;
        case "DIALOGUE": this.dialogueUpdate(dt, confirm); break;
        case "INFO": this.infoReady -= dt; if (confirm) this.closeInfo(); this.hudUpdate(false); break;
        case "PAUSE": if (inp.wasPressed("Escape")) this.resume(); break;
        case "CAPTURE": this.captureT -= dt; if (this.captureT <= 0) this.respawn(); break;
        case "TRANSITION": this.updateTransition(dt); break;
      }
    }

    dialogueUpdate(dt, confirm) {
      const inp = this.input, p = this.player, npc = this.dlg && this.dlg.npc;
      this.level.npcs.forEach(n => n.update(dt, this)); this.particles.update(dt);
      if (this.donLine) { this.donLine.t -= dt; this.donLine.min -= dt; if (this.donLine.t <= 0) this._finishDonLine(); }
      if (npc) { const a = Math.atan2(npc.x - p.x, npc.z - p.z); p.yaw = G.lerpAngle(p.yaw, a, 1 - Math.exp(-6 * dt)); this.camYaw = G.lerpAngle(this.camYaw, a + 0.35, 1 - Math.exp(-3 * dt)); this.camPitch += (0.2 - this.camPitch) * (1 - Math.exp(-3 * dt)); }
      this.updateCamera(dt, true);
      if (confirm) this.dialogueAdvanceOrComplete();
      for (const [i, codes] of [[0, ["Digit1", "Numpad1"]], [1, ["Digit2", "Numpad2"]], [2, ["Digit3", "Numpad3"]]]) if (codes.some(c => inp.wasPressed(c))) { if (!this.ui.dialogTyping()) this.dialogueChoose(i); else this.ui.dialogComplete(); }
      this.hudUpdate(false);
    }

    playUpdate(dt) {
      const inp = this.input, p = this.player, L = this.level, st = this.state, th = st.threat;
      if (inp.wasPressed("Escape")) return this.pause();
      this.time += dt; st.stats.playSeconds += dt;
      this.updateCamera(dt, false);
      p.update(dt, inp, this.camYaw, L, !p.hidden);
      if (p.running && p.speed > 4.5 && Math.random() < dt * 14) this.particles.trail(p.x, p.z);
      L.npcs.forEach(n => n.update(dt, this)); this.particles.update(dt);
      let seen = false, extra = 0;
      for (const s of L.sentinels) {
        if (s.update(dt, this)) { seen = true; if (s.kind === "chaser" && G.dist(s.x, s.z, p.x, p.z) < 2.6) extra = 40; }
      }
      const res = th.update(dt, { seen, hidden: p.hidden, multiplier: st.threatMultiplier, extra });
      if (res.halved) { this.toast(T().toasts.halved, 2.5); this.audio.sfx("unhide"); }
      if (res.captured) return this.capture();
      this.sector.update(dt); if (this.mode !== "PLAY") return;
      this.updateInteraction(dt);
      this.hudUpdate(true);
    }

    updateInteraction(dt) {
      const p = this.player, L = this.level, inp = this.input; let best = null, bd = 1e9;
      for (const it of L.interactables) {
        if (it.enabled && !it.enabled()) continue;
        if (p.hidden && it.id !== "hide_" + (this.hideSpot && this.hideSpot.id)) continue;
        if (G.inRange(p.x, p.z, it.x, it.z, it.range || cfg.interact.range)) { const d = G.dist(p.x, p.z, it.x, it.z); if (d < bd) { bd = d; best = it; } }
      }
      this.target = best;
      if (!best) { this.hold = 0; return; }
      if (best.hold) {
        if (inp.down("KeyE") && !this.holdLock) { this.hold += dt; if (this.hold >= best.hold) { this.hold = 0; this.holdLock = true; best.onUse(); } } else this.hold = 0;
        if (!inp.down("KeyE")) this.holdLock = false;
      } else if (inp.wasPressed("KeyE")) { this.audio.sfx("blip"); best.onUse(); }
    }

    updateCamera(dt, dialog) {
      const c = cfg.camera, p = this.player;
      if (!dialog) {
        const m = this.input.takeMouse(), k = 0.0024 * this.settings.sens;
        this.camYaw -= m.x * k; this.camPitch = Math.max(c.pitchMin, Math.min(c.pitchMax, this.camPitch + m.y * k)); this.camTravel += Math.abs(m.x * k);
      } else this.input.takeMouse();
      const cp = Math.cos(this.camPitch), sp = Math.sin(this.camPitch), bx = -Math.sin(this.camYaw), bz = -Math.cos(this.camYaw);
      const tx = p.x, ty = c.height + (p.hidden ? -0.4 : 0) - (dialog ? 0.55 : 0), tz = p.z;
      const hit = G.rayDist(tx, tz, bx, bz, c.distance * cp + 0.5, this.level.boxes, 2.5);
      let d = c.distance; if (hit !== Infinity) d = Math.max(c.minDistance, Math.min(d, (hit - 0.4) / Math.max(cp, 0.3)));
      this.camDist += (d - this.camDist) * Math.min(1, (d < this.camDist ? 30 : 5) * dt);
      this.camera.eye = [tx + bx * cp * this.camDist, Math.max(0.35, ty + sp * this.camDist), tz + bz * cp * this.camDist];
      this.camera.target = [tx, ty, tz];
    }

    hudUpdate(play) {
      const p = this.player, st = this.state, h = { threat: st.threat.value, sector: T().sectorNames[st.sector], hint: null, lockHint: false };
      if (this.hintText && (!this.hintUntil || performance.now() < this.hintUntil)) h.hint = this.hintText; else if (this.hintUntil) { this.hintText = null; this.hintUntil = 0; }
      if (play) {
        const ob = this.sector.objective && this.sector.objective();
        if (ob) { const a = Math.atan2(ob.x - p.x, ob.z - p.z), rel = G.angleDiff(a, this.camYaw); h.objective = { label: ob.label, dist: G.dist(p.x, p.z, ob.x, ob.z), angle: -rel * 180 / Math.PI }; }
        if (p.hidden) h.status = T().hud.hiding + " · " + Math.min(cfg.threat.hideSeconds, Math.floor(st.threat.hideTime)) + "/" + cfg.threat.hideSeconds + " s";
        if (this.target) {
          const it = this.target, key = typeof it.label === "function" ? it.label() : it.label, sp = this.r.project(it.x, it.y || 1.8, it.z);
          if (sp) h.prompt = { x: sp.x, y: sp.y - 8, text: T().prompts[key] || key, hold: !!it.hold, progress: it.hold ? this.hold / it.hold : 0 };
        }
        h.lockHint = !this.input.locked && !this.input.dragging && this.camTravel < 2.5 && this.time > 8;
      }
      if (this.showFps) h.fps = Math.round(this.fps) + " FPS · " + (this.fps < 30 ? "bajo" : "ok");
      this.ui.updateHud(h);
      this.ui.updateLabels(this.level, this.r, p);
    }

    // ---------- dibujo ----------
    render(dt) {
      const r = this.r, L = this.level, p = this.player, st = this.state;
      if (this.mode === "MENU" || this.mode === "INTRO" || this.mode === "FINAL" || (this.mode === "TRANSITION" && !L.id)) {
        const a = this.orbit; this.camera.eye = [Math.cos(a) * 20, 6.5, 3 + Math.sin(a) * 20]; this.camera.target = [0, 2.5, 5];
      }
      const cand = L.lights.map(l => ({ l, d: Math.hypot(l.x - this.camera.target[0], l.z - this.camera.target[2]) })).sort((a, b) => a.d - b.d).slice(0, 3).map(o => o.l);
      const lights = [{ x: p.x, y: 2.4, z: p.z, r: 7, c: [0.1, 0.5, 0.6] }];
      const al = L.sentinels.find(s => s.active && s.state === "alert"); if (al) lights.push({ x: al.x, y: 2.2, z: al.z, r: 8, c: [0.9, 0.4, 0.05] });
      r.lights = lights.concat(cand).slice(0, 4);
      r.fogDensity = this.sector && st.sector === 2 ? 0.02 : 0.022;
      const t = st.threat.ratio; r.threat = this.mode === "PLAY" || this.mode === "DIALOGUE" ? Math.max(0, (t - 0.55) / 0.45) * 0.85 : 0;
      r.resize(); r.beginFrame(this.camera, dt);
      L.draw(r, this); L.npcs.forEach(n => n.draw(r)); L.sentinels.forEach(s => s.draw(r, L.boxes)); p.draw(r); this.particles.draw(r);
      r.endFrame();
    }
  }
  TL.Game = Game;
})();
