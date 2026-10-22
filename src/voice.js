/* Voces de los diálogos (síntesis de voz del navegador, Web Speech API). Sin archivos de audio ni red propios:
   se usan las voces en español instaladas en el equipo. Cada personaje tiene perfil de voz (tono y ritmo) propio. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  // g: género preferido (f/m/n); pitch 0–2; rate 0.1–10
  const PROFILES = {
    don:        { g: "m", pitch: 1.0,  rate: 1.02 },
    arranque_a: { g: "f", pitch: 0.92, rate: 0.95 },   // Kernela: seria, medida
    arranque_b: { g: "f", pitch: 1.3,  rate: 1.12 },   // Bootina: excéntrica, animada
    elena:      { g: "f", pitch: 1.12, rate: 1.0 },
    bios:       { g: "m", pitch: 0.3,  rate: 0.78 },   // grave y lenta
    sistema:    { g: "m", pitch: 0.75, rate: 1.05 },
    narrador:   { g: "m", pitch: 0.85, rate: 0.95 },
    consejo:    { g: "m", pitch: 0.6,  rate: 0.9 }
  };
  const FEM = /sabina|helena|laura|paulina|dalia|elvira|luc[ií]a|m[oó]nica|paloma|marisol|salom[eé]|camila|valentina|ximena|female|mujer|google/;
  const MAS = /pablo|ra[uú]l|jorge|diego|[aá]lvaro|carlos|gonzalo|juan|mateo|sergio|tom[aá]s|enrique|andr[eé]s|santiago|alonso|male|hombre/;
  const LANG_ORDER = ["es-co", "es-mx", "es-us", "es-419", "es-ar", "es-cl", "es-pe", "es-ve", "es-es"];
  const lang = v => (v.lang || "").toLowerCase().replace("_", "-");
  // Primero las voces locales (funcionan sin conexión) y, dentro de ellas, el español latinoamericano.
  const rank = v => (v.localService ? 0 : 100) + (LANG_ORDER.indexOf(lang(v)) < 0 ? LANG_ORDER.length : LANG_ORDER.indexOf(lang(v)));
  const classify = v => { const n = (v.name || "").toLowerCase(); return FEM.test(n) ? "f" : MAS.test(n) ? "m" : "n"; };

  /** Asigna una voz a cada personaje a partir de la lista de voces del sistema ({} si no hay voces en español). */
  function pickVoices(list) {
    const es = list.filter(v => lang(v).startsWith("es")).sort((a, b) => rank(a) - rank(b));
    if (!es.length) return {};
    const g = { f: [], m: [], n: [] }; es.forEach(v => g[classify(v)].push(v));
    const take = (k, i) => g[k][i] || g[k][0] || g.n[i] || g.n[0] || g.m[0] || g.f[0] || es[0];
    return { don: take("m", 0), narrador: take("m", 2), bios: take("m", 1), sistema: take("m", 1), consejo: take("m", 1),
             arranque_a: take("f", 0), arranque_b: take("f", 1), elena: take("f", 2) };
  }
  /** Prepara el texto para leerlo: pronunciaciones de siglas, mayúsculas sostenidas y símbolos. */
  function normalize(text) {
    let t = String(text).replace(/\s*\n\s*/g, ". ").replace(/[\[\]«»]/g, "");
    const letters = t.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, "");
    if (letters.length > 6 && letters.replace(/[^A-ZÁÉÍÓÚÑ]/g, "").length / letters.length > 0.7) t = t.toLowerCase();
    const fixes = (TL.texts && TL.texts.voiceFix) || [];
    for (const [re, rep] of fixes) t = t.replace(new RegExp(re, "gi"), rep);
    return t;
  }
  const estimate = (text, rate) => Math.max(1.4, String(text).length / (13 * (rate || 1)));

  class Voice {
    constructor(game) {
      this.g = game; this.map = null; this.token = 0;
      this.supported = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
      if (this.supported) { this._refresh(); try { speechSynthesis.addEventListener("voiceschanged", () => this._refresh()); } catch (e) { /* navegador antiguo */ } }
    }
    _load() { this.tried = Date.now(); try { this.map = pickVoices(speechSynthesis.getVoices()); } catch (e) { this.map = {}; } }
    _refresh() { this._load(); if (this.g.ui) this.g.ui.syncTools(); }
    /** "ok" | "no-voices" | "unsupported" (no vuelve a cargar voces: evita bucles con la interfaz) */
    status() { if (!this.supported) return "unsupported"; if (this.map === null) this._load(); return this.map.don ? "ok" : "no-voices"; }
    enabled() {
      const s = this.g.settings; if (!this.supported || s.muted || !(s.voice > 0)) return false;
      if (this.map && !this.map.don && Date.now() - this.tried > 3000) this._load();       // algunos navegadores cargan las voces tarde
      return this.status() === "ok";
    }
    /** Dice un texto con la voz del personaje. opts: {onend, queue}. Devuelve false si las voces no están activas. */
    speak(speaker, text, opts) {
      opts = opts || {}; if (!text || !this.enabled()) return false;
      const p = PROFILES[speaker] || PROFILES.sistema, v = this.map[speaker] || this.map.don, my = opts.queue ? this.token : ++this.token;
      const u = new SpeechSynthesisUtterance(normalize(text)); u.voice = v; u.lang = v.lang || "es-ES"; u.pitch = p.pitch; u.rate = p.rate; u.volume = Math.min(1, this.g.settings.voice);
      let done = false; const fin = () => { if (done) return; done = true; if (opts.onend && my === this.token) opts.onend(); };
      u.onend = fin; u.onerror = fin;
      if (!opts.queue) { try { speechSynthesis.cancel(); } catch (e) { /* ignorado */ } }
      setTimeout(() => { if (my !== this.token) return; try { speechSynthesis.speak(u); } catch (e) { fin(); } }, opts.queue ? 0 : 40);   // el retardo evita que cancel() se coma la voz nueva
      return true;
    }
    stop() { this.token++; if (this.supported) { try { speechSynthesis.cancel(); } catch (e) { /* ignorado */ } } }
  }
  Voice.PROFILES = PROFILES; Voice.pickVoices = pickVoices; Voice.normalize = normalize; Voice.estimate = estimate;
  TL.Voice = Voice;
})();
