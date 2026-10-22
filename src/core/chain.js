/* Cadena de rastro (RF-DEC-05/06). Registro encadenado por hash SHA-256.
   Es "tamper-evident" dentro de la partida; no protege contra quien modifique el código (RNF-SEG-02).
   No existe ninguna operación para modificar bloques ya registrados. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const ZERO = "0".repeat(64);
  class Chain {
    constructor(clock) {
      this._clock = clock || (() => new Date().toISOString());
      this._blocks = [];
      this._push("génesis", "inicio", 0);
    }
    static hashBlock(b) {
      return TL.sha256([b.index, b.timestamp, b.decision_id, b.option_id, b.sector, b.prev_hash].join("|"));
    }
    _push(decisionId, optionId, sector) {
      const prev = this._blocks[this._blocks.length - 1];
      const block = { index: this._blocks.length, timestamp: this._clock(), decision_id: decisionId,
                      option_id: optionId, sector, prev_hash: prev ? prev.hash : ZERO };
      block.hash = Chain.hashBlock(block);
      this._blocks.push(Object.freeze(block));
      return block;
    }
    record(decisionId, optionId, sector) { return { ...this._push(decisionId, optionId, sector) }; }
    get length() { return this._blocks.length; }
    get lastHash() { return this._blocks[this._blocks.length - 1].hash; }
    get blocks() { return this._blocks.map(b => ({ ...b })); }          // copias: no se puede mutar la cadena
    verify() { return Chain.verifyBlocks(this._blocks); }
    /** Devuelve {ok, firstBad}; firstBad = índice del primer bloque alterado o -1. */
    static verifyBlocks(blocks) {
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const expectPrev = i === 0 ? ZERO : blocks[i - 1].hash;
        if (b.index !== i || b.prev_hash !== expectPrev || Chain.hashBlock(b) !== b.hash) return { ok: false, firstBad: i };
      }
      return { ok: true, firstBad: -1 };
    }
    static short(h) { return h ? h.slice(0, 10) + "…" + h.slice(-4) : ""; }
  }
  Chain.ZERO = ZERO;
  TL.Chain = Chain;
})();
