/* Lote estático de cajas: geometría del escenario en un único buffer (1 draw call). */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const FACES = [ // normal, 4 esquinas (CCW visto desde fuera)
    [[0, 0, 1], [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]],
    [[0, 0, -1], [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]]],
    [[1, 0, 0], [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]]],
    [[-1, 0, 0], [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]],
    [[0, 1, 0], [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]]],
    [[0, -1, 0], [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]]
  ];
  class Batch {
    constructor() { this.data = []; this.count = 0; this.buf = null; }
    /** Caja centrada en (cx,cy,cz) con tamaño (sx,sy,sz), color [r,g,b], emisión 0..1 y giro ry. */
    box(cx, cy, cz, sx, sy, sz, col, emis, ry) {
      const c = Math.cos(ry || 0), s = Math.sin(ry || 0), e = emis || 0, d = this.data;
      for (const [n, q] of FACES) {
        const nx = n[0] * c + n[2] * s, nz = -n[0] * s + n[2] * c;
        const P = q.map(v => { const x = v[0] * sx / 2, z = v[2] * sz / 2; return [cx + x * c + z * s, cy + v[1] * sy / 2, cz - x * s + z * c]; });
        for (const i of [0, 1, 2, 0, 2, 3]) d.push(P[i][0], P[i][1], P[i][2], nx, n[1], nz, col[0], col[1], col[2], e);
        this.count += 6;
      }
    }
    upload(gl) {
      if (this.buf) gl.deleteBuffer(this.buf);
      this.buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
      this.data = [];
    }
    dispose(gl) { if (this.buf) gl.deleteBuffer(this.buf); this.buf = null; }
  }
  Batch.FACES = FACES;
  TL.Batch = Batch;
})();
