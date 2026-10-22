/* Audio sintetizado con Web Audio (RF-AUD-01..03): 2 pistas de música (exploración y persecución), silencio en el
   juicio del BIOS y 10 efectos. Sin archivos de audio de terceros. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const hz = (root, semis) => root * Math.pow(2, semis / 12);
  class AudioEngine {
    constructor() { this.ctx = null; this.muted = false; this.vol = { music: 0.5, sfx: 0.7 }; this.track = null; this.step = 0; this.timer = null; this.next = 0; }
    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
        const c = this.ctx = new AC();
        this.master = c.createGain(); this.master.connect(c.destination);
        this.musicGain = c.createGain(); this.sfxGain = c.createGain(); this.musicGain.connect(this.master); this.sfxGain.connect(this.master);
        this.delay = c.createDelay(1); this.delay.delayTime.value = 0.36; const fb = c.createGain(); fb.gain.value = 0.38;
        this.delay.connect(fb); fb.connect(this.delay); const wet = c.createGain(); wet.gain.value = 0.5; this.delay.connect(wet); wet.connect(this.musicGain);
        this.noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = this.noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        this.setVolumes(this.vol.music, this.vol.sfx);
        if (this.trackName) { const n = this.trackName; this.trackName = null; this.music(n); }
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return true;
    }
    setVolumes(m, s) { this.vol.music = m; this.vol.sfx = s; this._apply(); }
    setMuted(b) { this.muted = !!b; this._apply(); }
    _apply() { if (!this.ctx) return; const k = this.muted ? 0 : 1, t = this.ctx.currentTime; this.musicGain.gain.setTargetAtTime(this.vol.music * 0.55 * k, t, 0.05); this.sfxGain.gain.setTargetAtTime(this.vol.sfx * k, t, 0.05); }
    tone(freq, dur, type, vol, o) {
      if (!this.ctx) return; o = o || {}; const c = this.ctx, t = (o.at || c.currentTime), osc = c.createOscillator(), g = c.createGain();
      osc.type = type || "sine"; osc.frequency.setValueAtTime(freq, t); if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (o.attack || 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      let node = osc; if (o.lp) { const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = o.lp; osc.connect(f); node = f; }
      node.connect(g); g.connect(o.music ? this.musicGain : this.sfxGain); if (o.send) g.connect(this.delay);
      osc.start(t); osc.stop(t + dur + 0.05);
    }
    noise(dur, vol, hp, at, music) {
      if (!this.ctx) return; const c = this.ctx, t = at || c.currentTime, s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
      s.buffer = this.noiseBuf; f.type = "highpass"; f.frequency.value = hp || 4000; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(music ? this.musicGain : this.sfxGain); s.start(t); s.stop(t + dur + 0.02);
    }
    sfx(name) {
      if (!this.ctx) return;
      switch (name) {
        case "blip": this.tone(880, 0.09, "square", 0.08); this.tone(1320, 0.09, "square", 0.05, { at: this.ctx.currentTime + 0.06 }); break;
        case "alert": this.tone(660, 0.25, "sawtooth", 0.12, { to: 330, lp: 1800 }); break;
        case "door": this.tone(220, 0.35, "square", 0.1, { to: 660, lp: 2000 }); this.noise(0.2, 0.08, 3000); break;
        case "hide": this.tone(300, 0.2, "triangle", 0.12, { to: 120 }); break;
        case "unhide": this.tone(120, 0.2, "triangle", 0.12, { to: 300 }); break;
        case "capture": this.tone(180, 0.7, "sawtooth", 0.2, { to: 40, lp: 900 }); this.noise(0.5, 0.15, 1500); break;
        case "decision": [0, 4, 7, 12].forEach((s, i) => this.tone(hz(440, s), 0.4, "triangle", 0.1, { at: this.ctx.currentTime + i * 0.07 })); break;
        case "activate": this.tone(220, 0.8, "sawtooth", 0.1, { to: 880, lp: 2500 }); this.tone(440, 0.8, "sine", 0.1, { to: 1760 }); break;
        case "erase": this.noise(0.8, 0.12, 2000); this.tone(900, 0.8, "sine", 0.06, { to: 100 }); break;
        case "deny": this.tone(160, 0.18, "square", 0.1); this.tone(130, 0.2, "square", 0.1, { at: this.ctx.currentTime + 0.12 }); break;
        case "type": this.tone(1500 + Math.random() * 300, 0.025, "square", 0.015); break;
      }
    }
    // --- Música: secuenciador de pasos de 1/16 ---
    music(name) {
      if (name === this.trackName) return; this.trackName = name;
      if (!this.ctx) return;
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      const t = this.ctx.currentTime; this.musicGain.gain.cancelScheduledValues(t); this.musicGain.gain.setTargetAtTime(0.0001, t, 0.25);
      if (!name) return;
      this.step = 0; this.next = t + 0.35; this.bpm = name === "chase" ? 138 : 84;
      this.musicGain.gain.setTargetAtTime(this.vol.music * 0.55 * (this.muted ? 0 : 1), t + 0.4, 0.4);
      this.timer = setInterval(() => this._sched(), 100);
    }
    _sched() {
      const c = this.ctx; if (!c) return; const sd = 60 / this.bpm / 4;
      while (this.next < c.currentTime + 0.4) { (this.trackName === "chase" ? this._chase : this._explore).call(this, this.step, this.next, sd); this.next += sd; this.step++; }
    }
    _explore(i, t, sd) {
      const prog = [[110, [0, 3, 7, 10, 14]], [87.31, [0, 4, 7, 11, 14]], [130.81, [0, 4, 7, 11, 14]], [98, [0, 4, 7, 9, 14]]];
      const bar = Math.floor(i / 16) % 4, [root, ch] = prog[bar], k = i % 16;
      if (k === 0) { ch.slice(0, 4).forEach((s, j) => this.tone(hz(root * 2, s) * (1 + j * 0.0015), sd * 15, "sawtooth", 0.028, { at: t, attack: 1.2, lp: 700, music: true })); this.tone(root / 2, sd * 15, "sine", 0.16, { at: t, attack: 0.3, music: true }); }
      if (k % 2 === 0) { const n = ch[(k / 2 * 3 + bar) % ch.length]; if ((k / 2 + bar) % 3 !== 2) this.tone(hz(root * 4, n), sd * 3, "triangle", 0.06, { at: t, music: true, send: true }); }
    }
    _chase(i, t, sd) {
      const k = i % 16, bars = [55, 55, 65.41, 49], root = bars[Math.floor(i / 16) % 4];
      if (k % 4 === 0) { this.tone(130, 0.18, "sine", 0.5, { at: t, to: 42, music: true }); }
      if (k % 4 === 2) this.noise(0.05, 0.12, 7000, t, true);
      if (k % 2 === 0) this.tone(root * (k % 8 === 6 ? 2 : 1), sd * 1.6, "sawtooth", 0.1, { at: t, lp: 520 + (k % 8) * 60, music: true });
      if (k === 0 || k === 10) this.tone(hz(root * 4, [0, 3, 7][(i >> 3) % 3]), sd * 2, "square", 0.04, { at: t, lp: 1800, music: true, send: true });
    }
  }
  TL.AudioEngine = AudioEngine;
})();
