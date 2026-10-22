/* Motor de diálogo (RF-DIA-01..08). Los árboles se cargan de archivos de datos externos (data/dialogs/*.js),
   nunca incrustados en el código. Esquema: ver SRS 3.5.1. Extensiones: `event` y `end` en el nodo. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  TL.dialogs = TL.dialogs || {};
  TL.registerDialog = function (id, tree) {
    const map = {}; tree.nodes.forEach(n => { map[n.id] = n; });
    TL.dialogs[id] = { id, start: tree.start || tree.nodes[0].id, map };
  };
  const has = (flags, list) => !list || list.every(f => flags.has(f));
  const hasNone = (flags, list) => !list || list.every(f => !flags.has(f));

  class Dialogue {
    constructor(state) { this.state = state; this.tree = null; this.node = null; this.events = []; }
    get active() { return !!this.node; }
    start(treeId, nodeId) {
      this.tree = TL.dialogs[treeId];
      if (!this.tree) throw new Error("Árbol de diálogo inexistente: " + treeId);
      this.events = []; this._goto(nodeId || this.tree.start);
      return this.view();
    }
    _goto(id) {
      const n = id ? this.tree.map[id] : null;
      if (!n || !has(this.state.flags, n.requires_flags)) { this.node = null; return; }
      this.node = n;
      if (n.set_flags) n.set_flags.forEach(f => this.state.flags.add(f));
      if (n.event) this.events.push(n.event);
    }
    _text(n) {
      if (typeof n.text === "string") return n.text;
      const v = n.text.find(t => has(this.state.flags, t.requires_flags) && hasNone(this.state.flags, t.excludes_flags));
      return v ? v.text : "";
    }
    /** Vista actual: {speaker,text,options:[{index,text}],id} o null. Máximo 3 opciones (RF-DIA-02). */
    view() {
      const n = this.node; if (!n) return null;
      const options = (n.options || []).filter(o => has(this.state.flags, o.requires_flags) && hasNone(this.state.flags, o.excludes_flags))
        .slice(0, 3).map((o, i) => ({ index: i, text: o.text, _o: o }));
      this._visible = options;
      return { id: n.id, speaker: n.speaker, text: this._text(n), options: options.map(({ index, text }) => ({ index, text })) };
    }
    /** Nodo sin opciones: avanza (Espacio/Enter). Devuelve la nueva vista o null si terminó. */
    advance() {
      if (!this.node || (this._visible && this._visible.length)) return this.view();
      this._goto(this.node.next); return this.view();
    }
    /** Elige una opción: aplica confianza, banderas y devuelve {decision, view}. */
    choose(i) {
      const opt = this._visible && this._visible[i]; if (!opt) return null;
      const o = opt._o, st = this.state;
      if (o.trust_delta) for (const [npc, d] of Object.entries(o.trust_delta)) st.trust.add(npc, d);
      (o.set_flags || []).forEach(f => st.flags.add(f));
      (o.clear_flags || []).forEach(f => st.flags.delete(f));
      const decision = o.decision_id ? { decision_id: o.decision_id, option_id: o.option_id } : null;
      this._goto(o.next);
      return { decision, view: this.view() };
    }
    popEvents() { const e = this.events; this.events = []; return e; }
    end() { this.node = null; this.tree = null; }
  }
  TL.Dialogue = Dialogue;
})();
