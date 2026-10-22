/* Renderizador WebGL propio: caja unitaria, lotes estáticos, triángulos dinámicos, niebla, luces puntuales,
   rejilla en el suelo y post-proceso de brillo (bloom). Sin dependencias externas. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const M = TL.M;
  const VS = `attribute vec3 aPos;attribute vec3 aNor;attribute vec4 aCol;
uniform mat4 uVP;uniform mat4 uModel;
varying vec3 vW;varying vec3 vN;varying vec4 vC;
void main(){vec4 w=uModel*vec4(aPos,1.0);vW=w.xyz;vN=(uModel*vec4(aNor,0.0)).xyz;vC=aCol;gl_Position=uVP*w;}`;
  const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec3 vW;varying vec3 vN;varying vec4 vC;
uniform vec3 uTint;uniform float uEmis;uniform float uAlpha;uniform vec3 uCam;uniform vec3 uFog;uniform float uFogD;
uniform vec3 uLightDir;uniform vec4 uPL[4];uniform vec3 uPLC[4];
uniform float uGrid;uniform vec3 uGridCol;uniform float uGridSize;uniform float uTime;
void main(){
  vec3 n=normalize(vN);
  vec3 base=vC.rgb*uTint;
  float em=clamp(max(vC.a,uEmis),0.0,1.0);
  float diff=max(dot(n,-uLightDir),0.0);
  vec3 light=vec3(0.20,0.25,0.42)+vec3(0.50,0.58,0.90)*diff*0.7;
  for(int i=0;i<4;i++){vec3 d=uPL[i].xyz-vW;float dist=length(d);float a=clamp(1.0-dist/max(uPL[i].w,0.01),0.0,1.0);light+=uPLC[i]*a*a*max(dot(n,d/max(dist,0.001)),0.0)*1.6;}
  vec3 col=base*light;
  if(uGrid>0.5&&n.y>0.5){
    vec2 f=abs(fract(vW.xz/uGridSize)-0.5);float m=max(f.x,f.y);
    float line=smoothstep(0.485,0.495,m);float glow=smoothstep(0.40,0.5,m)*0.35;
    float pulse=0.75+0.25*sin(uTime*1.3+(vW.x+vW.z)*0.08);
    col+=uGridCol*(line*1.1+glow)*pulse;
  }
  col=mix(col,base*1.45,em);
  float fd=length(vW-uCam);float fg=1.0-exp(-uFogD*uFogD*fd*fd);
  col=mix(col,uFog,clamp(fg,0.0,1.0));
  gl_FragColor=vec4(col,uAlpha);
}`;
  const PVS = `attribute vec2 aP;varying vec2 vUV;void main(){vUV=aP*0.5+0.5;gl_Position=vec4(aP,0.0,1.0);}`;
  const PFS_BRIGHT = `precision mediump float;varying vec2 vUV;uniform sampler2D uT;uniform float uTh;
void main(){vec3 c=texture2D(uT,vUV).rgb;float l=dot(c,vec3(0.299,0.587,0.114));gl_FragColor=vec4(c*smoothstep(uTh,uTh+0.3,l),1.0);}`;
  const PFS_BLUR = `precision mediump float;varying vec2 vUV;uniform sampler2D uT;uniform vec2 uDir;
void main(){vec3 s=texture2D(uT,vUV).rgb*0.2270;
s+=texture2D(uT,vUV+uDir*1.0).rgb*0.1946+texture2D(uT,vUV-uDir*1.0).rgb*0.1946;
s+=texture2D(uT,vUV+uDir*2.0).rgb*0.1216+texture2D(uT,vUV-uDir*2.0).rgb*0.1216;
s+=texture2D(uT,vUV+uDir*3.0).rgb*0.0540+texture2D(uT,vUV-uDir*3.0).rgb*0.0540;
s+=texture2D(uT,vUV+uDir*4.0).rgb*0.0162+texture2D(uT,vUV-uDir*4.0).rgb*0.0162;gl_FragColor=vec4(s,1.0);}`;
  const PFS_COMP = `precision mediump float;varying vec2 vUV;uniform sampler2D uScene;uniform sampler2D uBloom;
uniform float uK;uniform float uThreat;uniform float uTime;uniform float uFade;
void main(){vec3 c=texture2D(uScene,vUV).rgb+texture2D(uBloom,vUV).rgb*uK;
float r=length(vUV-0.5)*1.45;float v=smoothstep(1.05,0.35,r);
float pulse=0.65+0.35*sin(uTime*7.0);
c+=vec3(1.0,0.42,0.04)*uThreat*(1.0-v)*1.1*pulse;
c*=mix(0.55,1.0,v);c*=0.985+0.015*sin(vUV.y*900.0);
gl_FragColor=vec4(c*uFade,1.0);}`;

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      const opt = { antialias: true, alpha: false, powerPreference: "high-performance" };
      const gl = canvas.getContext("webgl", opt) || canvas.getContext("experimental-webgl", opt);
      if (!gl) throw new Error("WebGL no está disponible en este navegador o equipo.");
      this.gl = gl; this.time = 0; this.threat = 0; this.fade = 1; this.bloom = 1;
      this.fog = [0.012, 0.02, 0.06]; this.fogDensity = 0.022; this.lightDir = [-0.4, -0.85, -0.35];
      this.lights = [];
      this.prog = this._link(VS, FS);
      this.u = {}; ["uVP", "uModel", "uTint", "uEmis", "uAlpha", "uCam", "uFog", "uFogD", "uLightDir", "uPL", "uPLC", "uGrid", "uGridCol", "uGridSize", "uTime"]
        .forEach(n => { this.u[n] = gl.getUniformLocation(this.prog, n); });
      this.a = { pos: gl.getAttribLocation(this.prog, "aPos"), nor: gl.getAttribLocation(this.prog, "aNor"), col: gl.getAttribLocation(this.prog, "aCol") };
      this.cube = new TL.Batch(); this.cube.box(0, 0, 0, 1, 1, 1, [1, 1, 1], 0, 0); this.cube.upload(gl);
      this.triBuf = gl.createBuffer(); this.maxTri = 3 * 64;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.triBuf); gl.bufferData(gl.ARRAY_BUFFER, this.maxTri * 40, gl.DYNAMIC_DRAW);
      this._initPost(); this.resize();
    }
    _compile(type, src) {
      const gl = this.gl, s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("Shader: " + gl.getShaderInfoLog(s));
      return s;
    }
    _link(vs, fs) {
      const gl = this.gl, p = gl.createProgram();
      gl.attachShader(p, this._compile(gl.VERTEX_SHADER, vs)); gl.attachShader(p, this._compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("Link: " + gl.getProgramInfoLog(p));
      return p;
    }
    _initPost() {
      const gl = this.gl;
      this.post = { ok: false };
      try {
        this.quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const mk = fs => { const p = this._link(PVS, fs); return { p, aP: gl.getAttribLocation(p, "aP"), loc: n => gl.getUniformLocation(p, n) }; };
        this.pBright = mk(PFS_BRIGHT); this.pBlur = mk(PFS_BLUR); this.pComp = mk(PFS_COMP);
        this.post.ok = true;
      } catch (e) { console.warn("Post-proceso desactivado:", e.message); }
    }
    _target(w, h, depth) {
      const gl = this.gl, tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      let rb = null;
      if (depth) { rb = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb); }
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { tex, fb, rb, w, h, ok };
    }
    _freeTargets() {
      const gl = this.gl;
      for (const t of [this.scene, this.ping, this.pong]) if (t) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); if (t.rb) gl.deleteRenderbuffer(t.rb); }
    }
    resize() {
      const c = this.canvas, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let w = Math.max(2, Math.floor(c.clientWidth * dpr)), h = Math.max(2, Math.floor(c.clientHeight * dpr));
      if (w > 1920) { h = Math.floor(h * 1920 / w); w = 1920; }
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
      this.w = w; this.h = h;
      if (this.post.ok) {
        this._freeTargets();
        this.scene = this._target(w, h, true);
        const hw = Math.max(2, w >> 1), hh = Math.max(2, h >> 1);
        this.ping = this._target(hw, hh, false); this.pong = this._target(hw, hh, false);
        if (!(this.scene.ok && this.ping.ok && this.pong.ok)) { this.post.ok = false; this._freeTargets(); this.scene = null; }
      }
    }
    beginFrame(cam, dt) {
      const gl = this.gl; this.time += dt;
      this.proj = M.persp(cam.fov, this.w / this.h, 0.1, 220);
      this.view = M.lookAt(cam.eye, cam.target, [0, 1, 0]);
      this.vp = M.mul(this.proj, this.view); this.cam = cam.eye;
      if (this.post.ok) gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene.fb);
      gl.viewport(0, 0, this.w, this.h);
      gl.clearColor(this.fog[0], this.fog[1], this.fog[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(this.prog);
      gl.uniformMatrix4fv(this.u.uVP, false, this.vp);
      gl.uniform3fv(this.u.uCam, cam.eye); gl.uniform3fv(this.u.uFog, this.fog); gl.uniform1f(this.u.uFogD, this.fogDensity);
      gl.uniform3fv(this.u.uLightDir, this.lightDir); gl.uniform1f(this.u.uTime, this.time);
      const pl = new Float32Array(16), plc = new Float32Array(12);
      this.lights.slice(0, 4).forEach((l, i) => { pl.set([l.x, l.y, l.z, l.r], i * 4); plc.set(l.c, i * 3); });
      gl.uniform4fv(this.u.uPL, pl); gl.uniform3fv(this.u.uPLC, plc);
      gl.uniform1f(this.u.uGrid, 0); gl.uniform3f(this.u.uTint, 1, 1, 1); gl.uniform1f(this.u.uEmis, 0); gl.uniform1f(this.u.uAlpha, 1);
      gl.uniformMatrix4fv(this.u.uModel, false, M.ident());
    }
    _bind(buf) {
      const gl = this.gl, a = this.a;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(a.pos); gl.vertexAttribPointer(a.pos, 3, gl.FLOAT, false, 40, 0);
      gl.enableVertexAttribArray(a.nor); gl.vertexAttribPointer(a.nor, 3, gl.FLOAT, false, 40, 12);
      gl.enableVertexAttribArray(a.col); gl.vertexAttribPointer(a.col, 4, gl.FLOAT, false, 40, 24);
      // aCol.rgb en los 3 primeros floats y emisión en el cuarto: el buffer guarda (r,g,b,e) tras la normal
    }
    drawBatch(batch) {
      if (!batch.buf || !batch.count) return; const gl = this.gl;
      gl.uniformMatrix4fv(this.u.uModel, false, M.ident()); gl.uniform3f(this.u.uTint, 1, 1, 1); gl.uniform1f(this.u.uEmis, 0); gl.uniform1f(this.u.uAlpha, 1);
      this._bind(batch.buf); gl.drawArrays(gl.TRIANGLES, 0, batch.count);
    }
    /** Caja unitaria transformada. grid: {color, size} para dibujar rejilla en la cara superior. */
    drawBox(model, color, emis, alpha, grid) {
      const gl = this.gl, a = alpha === undefined ? 1 : alpha;
      gl.uniformMatrix4fv(this.u.uModel, false, model);
      gl.uniform3fv(this.u.uTint, color); gl.uniform1f(this.u.uEmis, emis || 0); gl.uniform1f(this.u.uAlpha, a);
      if (grid) { gl.uniform1f(this.u.uGrid, 1); gl.uniform3fv(this.u.uGridCol, grid.color); gl.uniform1f(this.u.uGridSize, grid.size); }
      if (a < 1) gl.depthMask(false);
      this._bind(this.cube.buf); gl.drawArrays(gl.TRIANGLES, 0, 36);
      if (a < 1) gl.depthMask(true);
      if (grid) gl.uniform1f(this.u.uGrid, 0);
    }
    /** Triángulos dinámicos en el plano (lista de [x,y,z,...] planos, normal hacia arriba). */
    drawTris(verts, color, alpha, emis) {
      const gl = this.gl, n = verts.length / 3; if (!n) return;
      const data = new Float32Array(n * 10);
      for (let i = 0; i < n; i++) data.set([verts[i * 3], verts[i * 3 + 1], verts[i * 3 + 2], 0, 1, 0, 1, 1, 1, 0], i * 10);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.triBuf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.uniformMatrix4fv(this.u.uModel, false, M.ident()); gl.uniform3fv(this.u.uTint, color);
      gl.uniform1f(this.u.uEmis, emis || 0); gl.uniform1f(this.u.uAlpha, alpha === undefined ? 1 : alpha);
      this._bind(this.triBuf); gl.disable(gl.CULL_FACE); gl.depthMask(false);
      gl.drawArrays(gl.TRIANGLES, 0, n); gl.depthMask(true); gl.enable(gl.CULL_FACE);
    }
    endFrame() {
      const gl = this.gl;
      if (!this.post.ok) { return; }
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.disable(gl.BLEND);
      const quad = (P) => { gl.useProgram(P.p); gl.bindBuffer(gl.ARRAY_BUFFER, this.quad); gl.enableVertexAttribArray(P.aP);
        gl.vertexAttribPointer(P.aP, 2, gl.FLOAT, false, 0, 0); };
      const tex = (unit, t) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t.tex); };
      // 1) umbral
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.ping.fb); gl.viewport(0, 0, this.ping.w, this.ping.h);
      quad(this.pBright); tex(0, this.scene); gl.uniform1i(this.pBright.loc("uT"), 0); gl.uniform1f(this.pBright.loc("uTh"), 0.55); gl.drawArrays(gl.TRIANGLES, 0, 6);
      // 2) desenfoque separable (2 pasadas)
      for (let i = 0; i < 2; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.pong.fb); quad(this.pBlur); tex(0, this.ping);
        gl.uniform1i(this.pBlur.loc("uT"), 0); gl.uniform2f(this.pBlur.loc("uDir"), 1.6 / this.ping.w, 0); gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.ping.fb); tex(0, this.pong);
        gl.uniform2f(this.pBlur.loc("uDir"), 0, 1.6 / this.ping.h); gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      // 3) composición en pantalla
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.w, this.h);
      quad(this.pComp); tex(0, this.scene); tex(1, this.ping);
      gl.uniform1i(this.pComp.loc("uScene"), 0); gl.uniform1i(this.pComp.loc("uBloom"), 1);
      gl.uniform1f(this.pComp.loc("uK"), this.bloom); gl.uniform1f(this.pComp.loc("uThreat"), this.threat);
      gl.uniform1f(this.pComp.loc("uTime"), this.time); gl.uniform1f(this.pComp.loc("uFade"), this.fade);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.activeTexture(gl.TEXTURE0);
    }
    /** Proyecta un punto del mundo a coordenadas de pantalla CSS; null si queda detrás de la cámara. */
    project(x, y, z) {
      const m = this.vp, w = m[3] * x + m[7] * y + m[11] * z + m[15]; if (w <= 0.01) return null;
      const cx = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w, cy = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
      return { x: (cx * 0.5 + 0.5) * this.canvas.clientWidth, y: (1 - (cy * 0.5 + 0.5)) * this.canvas.clientHeight, w };
    }
  }
  TL.Renderer = Renderer;
})();
