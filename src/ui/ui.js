/* Interfaz: HUD, diálogo, menús, pausa (árbol de decisiones y cadena de rastro), captura, final y créditos.
   Todo el texto se toma de TL.texts (español, UTF-8). */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const T = () => TL.texts;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  class UI {
    constructor(game) {
      this.g = game; this.dlg = null; this.intro = null; this.infoCb = null; this.labelEls = new Map(); this.lastLevel = null;
      this.el = { hud: $("hud"), screen: $("screen"), dialog: $("dialog"), fade: $("fade"), hint: $("hint"), prompt: $("prompt"), labels: $("labels"), toasts: $("toasts") };
      this.el.screen.addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (b) this.g.onUiAction(b.dataset.act, b.dataset); });
      this.el.screen.addEventListener("input", e => { const s = e.target.closest("[data-set]"); if (s) { this.g.setSetting(s.dataset.set, parseFloat(s.value)); const o = s.parentElement.querySelector("output"); if (o) o.textContent = Math.round(s.value * (s.dataset.set === "sens" ? 100 : 100)) + "%"; } });
      this._bindTools();
      $("dlgOptions").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) this.g.dialogueChoose(parseInt(b.dataset.i, 10)); });
      this.el.dialog.addEventListener("click", e => { if (!e.target.closest("[data-i]")) this.g.dialogueAdvanceOrComplete(); });
    }

    // ---------- botones de ayuda y sonido ----------
    _bindTools() {
      const pop = $("soundPop");
      $("btnHelp").addEventListener("click", e => { e.currentTarget.blur(); pop.classList.add("hidden"); this.g.openHelp(); });
      $("btnSound").addEventListener("click", e => { e.stopPropagation(); e.currentTarget.blur(); pop.classList.toggle("hidden"); });
      $("btnMute").addEventListener("click", e => { e.currentTarget.blur(); this.g.toggleMute(); });
      for (const [id, key] of [["slMusic", "music"], ["slSfx", "sfx"], ["slVoice", "voice"]]) {
        $(id).addEventListener("input", e => this.g.setSetting(key, parseFloat(e.target.value)));
        $(id).addEventListener("change", e => e.target.blur());           // el juego recupera el teclado
      }
      document.addEventListener("click", e => { if (!e.target.closest("#tools")) pop.classList.add("hidden"); });
    }
    syncTools() {
      const s = this.g.settings, b = $("btnSound");
      b.classList.toggle("muted", !!s.muted); b.setAttribute("aria-pressed", s.muted ? "true" : "false");
      $("slMusic").value = s.music; $("slSfx").value = s.sfx; $("slVoice").value = s.voice;
      const st = this.g.voice ? this.g.voice.status() : "ok";
      $("voiceNote").textContent = st === "unsupported" ? "Este navegador no permite voces." : st === "no-voices" ? "No hay voces en español instaladas en este equipo; los diálogos se leen en texto." : "";
      $("slVoice").disabled = st !== "ok"; $("btnMute").textContent = s.muted ? "Activar sonido (M)" : "Silenciar todo (M)";
    }

    // ---------- utilidades ----------
    screen(html, cls) { const s = this.el.screen; s.className = cls || ""; s.innerHTML = html; s.classList.remove("hidden"); const f = s.querySelector(".btn"); if (f && !this.noFocus) f.focus({ preventScroll: true }); }
    hideScreen() { this.el.screen.classList.add("hidden"); this.el.screen.innerHTML = ""; }
    setFade(v) { this.el.fade.style.opacity = v; }
    showHud(v) { this.el.hud.classList.toggle("hidden", !v); }
    toast(text, secs) {
      const d = document.createElement("div"); d.textContent = text; this.el.toasts.appendChild(d);
      while (this.el.toasts.children.length > 3) this.el.toasts.firstChild.remove();
      setTimeout(() => d.remove(), (secs || 3) * 1000);
    }
    clearToasts() { this.el.toasts.innerHTML = ""; }
    error(msg) { const e = $("errorBox"); e.textContent = msg; e.classList.remove("hidden"); }

    // ---------- HUD ----------
    updateHud(h) {
      $("threatFill").style.width = h.threat + "%"; $("threatNum").textContent = Math.round(h.threat);
      $("threat").classList.toggle("alert", h.threat >= 60); $("sectorName").textContent = h.sector || "";
      $("status").textContent = h.status || "";
      const hint = this.el.hint; if (h.hint) { hint.textContent = h.hint; hint.classList.add("on"); } else hint.classList.remove("on");
      const obj = $("objective"); if (h.objective) {
        obj.style.display = "flex"; $("objText").textContent = h.objective.label; $("objDist").textContent = Math.round(h.objective.dist) + " " + T().hud.distance;
        $("objArrow").style.transform = "rotate(" + h.objective.angle + "deg)";
      } else obj.style.display = "none";
      const p = this.el.prompt; if (h.prompt) {
        p.classList.remove("hidden"); p.style.left = h.prompt.x + "px"; p.style.top = h.prompt.y + "px"; $("promptText").textContent = h.prompt.text;
        p.classList.toggle("hold", !!h.prompt.hold); $("holdBar").firstChild.style.width = (h.prompt.progress * 100) + "%";
      } else p.classList.add("hidden");
      const lh = $("lockHint"); if (h.lockHint) { lh.textContent = T().hud.pressAny; lh.classList.remove("hidden"); } else lh.classList.add("hidden");
      const f = $("fps"); if (h.fps) { f.textContent = h.fps; f.classList.remove("hidden"); } else f.classList.add("hidden");
    }
    updateLabels(level, r, player) {
      if (level !== this.lastLevel) { this.el.labels.innerHTML = ""; this.labelEls.clear(); this.lastLevel = level; }
      if (!level) return;
      for (const o of level.labels) {
        let el = this.labelEls.get(o);
        if (!el) { el = document.createElement("div"); if (o.cls) el.className = o.cls; el.style.color = o.color || "#fff"; this.el.labels.appendChild(el); this.labelEls.set(o, el); }
        const txt = typeof o.text === "function" ? o.text() : o.text, d = Math.hypot(o.x - player.x, o.z - player.z);
        const vis = txt && d < (o.max || 20) && (!o.show || o.show());
        const sp = vis ? r.project(o.x, o.y, o.z) : null;
        if (!sp) { el.style.display = "none"; continue; }
        el.style.display = "block"; el.style.left = sp.x + "px"; el.style.top = sp.y + "px"; if (el.textContent !== txt) el.textContent = txt;
        el.style.opacity = Math.max(0.2, Math.min(1, 1.4 - d / (o.max || 20)));
      }
    }

    // ---------- Diálogo ----------
    dialogShow(view) {
      const sp = T().speakers[view.speaker] || { name: view.speaker, color: "#fff" };
      this.dlg = { full: view.text, shown: 0, options: view.options, rendered: false };
      $("dlgSpeaker").textContent = sp.name; $("dlgSpeaker").style.color = sp.color; this.el.dialog.style.borderColor = sp.color;
      $("dlgText").textContent = ""; $("dlgOptions").innerHTML = ""; $("dlgNext").style.visibility = "hidden";
      this.el.dialog.classList.remove("hidden");
    }
    dialogHide() { this.dlg = null; this.el.dialog.classList.add("hidden"); }
    _dlgRender() {
      const d = this.dlg; d.rendered = true; $("dlgText").textContent = d.full;
      if (d.options.length) $("dlgOptions").innerHTML = d.options.map(o => '<button class="opt" data-i="' + o.index + '"><b>' + (o.index + 1) + "</b><span>" + esc(o.text) + "</span></button>").join("");
      else $("dlgNext").style.visibility = "visible";
    }
    dialogTyping() { return !!this.dlg && !this.dlg.rendered; }
    dialogComplete() { if (this.dialogTyping()) { this.dlg.shown = this.dlg.full.length; this._dlgRender(); return true; } return false; }
    update(dt) {
      const d = this.dlg;
      if (d && !d.rendered) { const prev = Math.floor(d.shown); d.shown += 58 * dt; if (Math.floor(d.shown) % 4 === 0 && Math.floor(d.shown) !== prev) this.g.audio.sfx("type");
        if (d.shown >= d.full.length) this._dlgRender(); else $("dlgText").textContent = d.full.slice(0, Math.floor(d.shown)); }
      const it = this.intro; if (it) {
        const line = T().intro[it.i]; if (it.shown < line.length) { it.shown += 40 * dt; $("introText").textContent = line.slice(0, Math.floor(it.shown)); }
        else if (!it.done) { it.done = true; $("introText").textContent = line; }
      }
    }

    // ---------- Introducción (Acto I) ----------
    introStart(onDone) {
      this.intro = { i: 0, shown: 0, onDone, done: false };
      this.screen('<div class="intro" id="introText"></div><div class="skip">Espacio / Enter ▸</div>', "solid"); this._introVoice();
    }
    _introVoice() { const it = this.intro; if (it) this.g.voice.speak(it.i === T().intro.length - 1 ? "sistema" : "narrador", T().intro[it.i]); }
    introAdvance() {
      const it = this.intro; if (!it) return; const line = T().intro[it.i];
      if (it.shown < line.length) { it.shown = line.length; return; }
      it.i++; it.shown = 0; it.done = false;
      if (it.i >= T().intro.length) { const cb = it.onDone; this.intro = null; this.g.voice.stop(); cb(); return; }
      this._introVoice();
      $("introText").className = "intro" + (it.i === T().intro.length - 1 ? " glitch" : "");
    }

    // ---------- Menús ----------
    menu() {
      const t = T().menu, cfg = TL.config, words = cfg.title.split(" ");
      this.screen('<div class="menuWrap"><h1 class="title">' + words.map(esc).join("<br>") + '</h1><div class="subtitle">' + esc(cfg.subtitle) + '</div><div class="col">' +
        '<button class="btn primary" data-act="play">' + t.play + '</button><button class="btn" data-act="controls">' + t.controls + '</button><button class="btn" data-act="settings">' + t.settings +
        '</button><button class="btn" data-act="credits">' + t.credits + '</button><button class="btn" data-act="quit">' + t.quit + '</button></div><p class="small" id="menuNote"></p></div>');
    }
    note(msg) { const n = $("menuNote"); if (n) n.textContent = msg; }
    controls(back) {
      const label = back === "resume" ? "Volver al juego (Esc)" : T().pause.back;
      this.screen('<div class="panel"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:10px"><h2 style="margin:0">' + T().menu.controls + '</h2><button class="btn primary" data-act="' + back + '">' + label + '</button></div><table class="ctl">' +
        T().controls.map(r => "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td></tr>").join("") + "</table></div>", back === "pause" || back === "resume" ? "clear" : "");
    }
    settings(back) {
      const s = this.g.settings;
      const sl = (k, label, v, max, step) => '<label class="slider"><span>' + label + '</span><input type="range" min="0" max="' + max + '" step="' + step + '" value="' + v + '" data-set="' + k + '"><output>' + Math.round(v * 100) + "%</output></label>";
      this.screen('<div class="panel"><h2>' + T().menu.settings + "</h2>" + sl("music", "Volumen de música", s.music, 1, 0.05) + sl("sfx", "Volumen de efectos", s.sfx, 1, 0.05) + sl("voice", "Volumen de voces", s.voice, 1, 0.05) + sl("sens", "Sensibilidad del ratón", s.sens, 2.5, 0.1) +
        '<div class="row"><button class="btn" data-act="fullscreen">Pantalla completa (F11)</button><button class="btn" data-act="download">Descargar registro local</button></div>' +
        '<p class="small">El registro de diagnóstico se guarda solo en este equipo y no contiene datos personales.</p>' +
        '<div class="row" style="margin-top:12px"><button class="btn" data-act="' + back + '">' + T().pause.back + "</button></div></div>", back === "pause" ? "clear" : "");
    }
    credits(back) {
      const c = T().credits;
      this.screen('<div class="panel"><h2>' + c.heading + '</h2><div class="col">' + c.lines.map(l => "<div>" + esc(l) + "</div>").join("") + '<p class="small">' + esc(c.assets) + '</p></div><div class="row" style="margin-top:18px"><button class="btn" data-act="' + back + '">' + T().pause.back + "</button></div></div>");
    }

    // ---------- Pausa ----------
    pause() {
      const p = T().pause;
      this.screen('<div class="panel" style="width:min(460px,94vw)"><h2>' + p.title + '</h2><div class="col"><button class="btn primary" data-act="resume">' + p.resume + '</button><button class="btn" data-act="tree">' + p.tree + '</button><button class="btn" data-act="chain">' + p.chain +
        '</button><button class="btn" data-act="pcontrols">' + p.controls + '</button><button class="btn" data-act="psettings">' + p.settings + '</button><button class="btn" data-act="menu">' + p.menu + "</button></div></div>", "clear");
    }
    tree() {
      const st = this.g.state, L = T(), allies = Math.round(st.trust.alliesTrust());
      const rows = Object.keys(TL.Decisions.DECISIONS).map(pd => {
        const d = TL.Decisions.DECISIONS[pd], chosen = st.decisions[pd], reached = st.sector >= d.sector;
        const pills = d.options.map(o => '<span class="pill ' + (chosen === o ? "on" : chosen || !reached ? "miss" : "") + '">' + esc(L.decisionLabels[pd][o]) + "</span>").join("");
        return '<div class="row-pd"><div class="pdn">' + pd + "<b>" + esc(L.tree.pd[pd]) + "</b></div><div>" + pills + "</div></div>";
      }).join("");
      const end = st.ending ? '<p class="ok">Final: ' + esc(L.endings[st.ending].title) + "</p>" : "";
      this.screen('<div class="panel tree"><h2>Árbol de decisiones</h2><div class="small">' + esc(L.tree.root) + " → " + L.sectorNames.slice(1).join(" → ") + "</div>" + rows + end +
        "<h4>" + L.hud.allies + " · " + allies + '</h4><div class="bar2"><i style="width:' + allies + '%"></i></div><p class="small">Con 70 o más se abre un atajo en el Sector 2.</p>' +
        '<div class="row"><button class="btn" data-act="pause">' + L.pause.back + "</button></div></div>", "clear");
    }
    chain() {
      const ch = this.g.state.chain, bl = ch.blocks, ver = ch.verify();
      const rows = bl.map(b => "<tr><td>" + b.index + "</td><td>" + esc(b.decision_id) + "</td><td>" + esc(b.option_id) + "</td><td>" + b.sector + '</td><td class="h">' + TL.Chain.short(b.hash) + '</td><td class="h">' + TL.Chain.short(b.prev_hash) + "</td></tr>").join("");
      this.screen('<div class="panel" style="width:min(860px,96vw)"><h2>Cadena de rastro</h2><p class="small">Cada decisión queda unida a la anterior por su hash SHA-256. Ningún bloque registrado puede modificarse desde el juego.</p>' +
        '<table class="chain"><tr><th>#</th><th>Decisión</th><th>Opción</th><th>Sector</th><th>Hash</th><th>Hash previo</th></tr>' + rows + '</table><p id="verifyMsg" class="' + (ver.ok ? "ok" : "bad") + '">' + (ver.ok ? "✔ Cadena íntegra" : "✖ Cadena alterada en el bloque " + ver.firstBad) + '</p><div class="row"><button class="btn" data-act="verify">Verificar integridad</button><button class="btn" data-act="pause">' + T().pause.back + "</button></div></div>", "clear");
    }
    verifyMsg() { const v = this.g.state.chain.verify(), m = $("verifyMsg"); if (m) { m.className = v.ok ? "ok" : "bad"; m.textContent = v.ok ? "✔ Cadena íntegra · " + this.g.state.chain.length + " bloques verificados" : "✖ Alterada en el bloque " + v.firstBad; } }

    // ---------- Otros ----------
    info(title, body, cb) { this.infoCb = cb; this.screen('<div class="panel info"><h2>' + esc(title) + "</h2><p>" + esc(body) + '</p><div class="row"><button class="btn primary" data-act="infoOk">Continuar (Enter)</button></div></div>', "clear"); }
    capture() { this.screen('<div class="capture"><h1>' + T().capture.title + "</h1><p>" + T().capture.sub + "</p></div>", "cap"); }
    loading(text) { const parts = text.split("\n"); this.screen('<div class="loading">' + esc(parts[0]) + "<br>" + esc(parts[1] || "") + "<small>CARGANDO…</small></div>", "solid"); }
    final(cert) {
      const L = T(), E = L.endings[cert.ending], F = L.final;
      this.noFocus = false;
      this.screen('<div class="final" data-end="' + cert.ending + '"><div class="panel" style="width:auto"><div class="kicker">' + F.title + "</div><h1>" + esc(E.title) + '</h1><p class="narr">' + esc(E.narrative) + '</p><div class="lesson">' + esc(E.lesson) + "</div>" +
        '<div class="cert"><div class="ch">' + F.cert + "</div><h3>" + esc(cert.title) + "</h3><dl><dt>" + F.decisions + "</dt><dd><ol>" + cert.decisions.map(d => "<li>" + d.id + " · " + esc(d.label) + "</li>").join("") + "</ol></dd><dt>" + F.chainLen + "</dt><dd>" + cert.chainLength + " bloques</dd><dt>" + F.finalHash +
        '</dt><dd class="hash">' + cert.finalHash + '</dd></dl><p class="' + (cert.integrity ? "ok" : "bad") + '" style="margin:10px 0 0">' + (cert.integrity ? "✔ " + F.integrity : "✖ " + F.broken) + "</p></div></div>" +
        '<div class="col"><div class="panel arcas"><div class="tag">' + F.arcasNote + "</div><p>" + esc(F.arcasPitch) + '</p><button class="cta" data-act="arcas">' + F.arcas + '</button></div><div class="panel" style="width:auto"><p class="small" style="margin-top:0">' + esc(F.question) + '</p><textarea id="answer" maxlength="600"></textarea><div class="row"><button class="btn" data-act="saveAnswer">' + F.save +
        '</button><span class="small" id="savedMsg"></span></div></div><div class="row"><button class="btn primary" data-act="again">' + F.again + '</button><button class="btn" data-act="credits2">' + F.credits + '</button><button class="btn" data-act="menu">' + F.menu + "</button></div></div></div>", "clear");
      this.noFocus = false;
    }
    savedMsg() { const m = $("savedMsg"); if (m) m.textContent = TL.texts.final.saved; }
    answerText() { const a = $("answer"); return a ? a.value : ""; }
  }
  TL.UI = UI;
})();
