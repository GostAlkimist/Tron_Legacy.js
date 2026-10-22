/* Entrada: teclado (por código físico), ratón con bloqueo de puntero o arrastre como alternativa. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  class Input {
    constructor(canvas) {
      this.canvas = canvas; this.keys = new Set(); this.pressed = new Set(); this.dx = 0; this.dy = 0;
      this.locked = false; this.dragging = false; this.expectUnlock = false; this.onLockLost = null; this.onCanvasClick = null;
      const prevent = new Set(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab", "F3", "F11"]);
      window.addEventListener("keydown", e => {
        if (prevent.has(e.code) && !(e.target && /INPUT|TEXTAREA/.test(e.target.tagName))) e.preventDefault();
        if (e.target && /TEXTAREA|INPUT/.test(e.target.tagName)) return;
        if (!e.repeat) this.pressed.add(e.code); this.keys.add(e.code);
      });
      window.addEventListener("keyup", e => this.keys.delete(e.code));
      window.addEventListener("blur", () => { this.keys.clear(); this.dragging = false; });
      canvas.addEventListener("mousedown", e => { if (e.button === 0) { this.dragging = true; if (this.onCanvasClick) this.onCanvasClick(); } });
      window.addEventListener("mouseup", () => { this.dragging = false; });
      window.addEventListener("mousemove", e => { if (this.locked || this.dragging) { this.dx += e.movementX || 0; this.dy += e.movementY || 0; } });
      document.addEventListener("pointerlockchange", () => {
        const was = this.locked; this.locked = document.pointerLockElement === canvas;
        if (was && !this.locked) { if (this.expectUnlock) this.expectUnlock = false; else if (this.onLockLost) this.onLockLost(); }
      });
    }
    down(code) { return this.keys.has(code); }
    wasPressed(code) { return this.pressed.has(code); }
    takeMouse() { const d = { x: this.dx, y: this.dy }; this.dx = this.dy = 0; return d; }
    endFrame() { this.pressed.clear(); }
    requestLock() { try { const p = this.canvas.requestPointerLock && this.canvas.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* sin bloqueo: se usa arrastre */ } }
    releaseLock() { if (document.pointerLockElement === this.canvas) { this.expectUnlock = true; document.exitPointerLock(); } }
  }
  TL.Input = Input;
})();
