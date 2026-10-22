/* Telemetría local (RF-MET-01): eventos con marca de tiempo, sin datos personales y sin red (RNF-SEG-01). */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  class Telemetry {
    constructor() { this.lines = []; this.t0 = Date.now(); }
    log(event, detail) {
      const line = new Date().toISOString() + " · " + event + (detail ? " · " + detail : "");
      this.lines.push(line); if (this.lines.length > 600) this.lines.shift();
      try { localStorage.setItem("tl_log", this.lines.slice(-300).join("\n")); } catch (e) { /* almacenamiento no disponible */ }
      if (TL.config.diagnostics) console.log("[TL]", line);
    }
    reset() { this.lines = []; this.t0 = Date.now(); }
    text() { return this.lines.join("\n") + "\n"; }
    download() {
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([this.text()], { type: "text/plain;charset=utf-8" }));
      a.download = "tron-legacy-registro.txt"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }
  }
  TL.Telemetry = Telemetry;
})();
