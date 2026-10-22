/* Personaje humanoide procedural (cajas con rayas emisivas). Sustituye a los modelos importados:
   el juego no usa assets de terceros. Convención: el modelo mira hacia +Z cuando yaw = 0. */
(function () {
  const TL = (globalThis.TL = globalThis.TL || {});
  const M = TL.M;
  const STYLES = {
    don:        { suit: [0.05, 0.08, 0.17], accent: [0.25, 0.92, 1.0], skin: [0.75, 0.6, 0.5], head: "hair", sc: 1 },
    arranque_a: { suit: [0.09, 0.05, 0.18], accent: [0.66, 0.48, 1.0], skin: [0.82, 0.7, 0.9], head: "bun", sc: 1.05 },
    arranque_b: { suit: [0.04, 0.09, 0.2],  accent: [0.37, 0.65, 1.0], skin: [0.7, 0.82, 1.0], head: "wide", sc: 0.95 },
    sentinel:   { suit: [0.03, 0.02, 0.07], accent: [0.72, 0.3, 1.0], skin: [0.08, 0.06, 0.12], head: "visor", sc: 1.12, spikes: true },
    elena:      { suit: [0.9, 0.55, 0.9],   accent: [1.0, 0.65, 0.92], skin: [1.0, 0.8, 0.95], head: "hair", sc: 1, holo: true }
  };
  function limb(r, base, px, py, pz, w, len, d, rot, col, accent, a, accentSide) {
    const m = M.mul(base, M.mul(M.trans(px, py, pz), M.mul(M.rotX(rot), M.trans(0, -len / 2, 0))));
    r.drawBox(M.mul(m, M.scale(w, len, d)), col, 0, a);
    if (accent) {
      const off = accentSide === "front" ? [0, 0, d / 2 + 0.005] : [Math.sign(px) * (w / 2 + 0.005), 0, 0];
      const sz = accentSide === "front" ? [w * 0.28, len * 0.86, 0.02] : [0.02, len * 0.86, d * 0.28];
      r.drawBox(M.mul(m, M.mul(M.trans(off[0], off[1], off[2]), M.scale(sz[0], sz[1], sz[2]))), accent, 1, a);
    }
  }
  /** anim: {phase, amp 0..1, talk 0..1, alpha, t, accent (color override), crouch} */
  function drawHumanoid(r, x, y, z, yaw, style, anim) {
    const S = typeof style === "string" ? STYLES[style] : style, an = anim || {};
    const a = an.alpha === undefined ? 1 : an.alpha, acc = an.accent || S.accent, k = S.sc;
    const base = M.mul(M.trans(x, y, z), M.mul(M.rotY(yaw), M.scale(k, k, k)));
    const sw = Math.sin(an.phase || 0) * (an.amp || 0) * 0.75, breathe = Math.sin((an.t || 0) * 2) * 0.02;
    const bob = Math.abs(Math.sin(an.phase || 0)) * (an.amp || 0) * 0.06;
    const B = M.mul(base, M.trans(0, bob, 0));
    // piernas
    limb(r, B, -0.14, 0.85, 0, 0.2, 0.85, 0.22, sw, S.suit, acc, a, "front");
    limb(r, B, 0.14, 0.85, 0, 0.2, 0.85, 0.22, -sw, S.suit, acc, a, "front");
    // torso
    r.drawBox(M.mul(B, M.mul(M.trans(0, 1.2 + breathe, 0), M.scale(0.52, 0.7, 0.3))), S.suit, 0, a);
    r.drawBox(M.mul(B, M.mul(M.trans(0, 1.22, 0.152), M.scale(0.08, 0.5, 0.02))), acc, 1, a);
    r.drawBox(M.mul(B, M.mul(M.trans(0, 1.4, 0.152), M.scale(0.16, 0.12, 0.02))), acc, 1, a);
    // brazos
    const talk = (an.talk || 0) * (-0.9 + Math.sin((an.t || 0) * 6) * 0.35);
    limb(r, B, -0.35, 1.5, 0, 0.16, 0.66, 0.18, -sw, S.suit, acc, a, "side");
    limb(r, B, 0.35, 1.5, 0, 0.16, 0.66, 0.18, sw + talk, S.suit, acc, a, "side");
    // cabeza
    const hy = 1.78 + breathe;
    if (S.head === "visor") {
      r.drawBox(M.mul(B, M.mul(M.trans(0, hy, 0), M.scale(0.34, 0.36, 0.34))), S.skin, 0, a);
      r.drawBox(M.mul(B, M.mul(M.trans(0, hy + 0.02, 0.172), M.scale(0.28, 0.07, 0.02))), acc, 1, a);
    } else {
      r.drawBox(M.mul(B, M.mul(M.trans(0, hy, 0), M.scale(S.head === "wide" ? 0.4 : 0.3, 0.32, 0.3))), S.skin, 0, a);
      r.drawBox(M.mul(B, M.mul(M.trans(0, hy + 0.17, -0.02), M.scale(0.34, 0.1, 0.34))), S.head === "hair" ? [0.08, 0.06, 0.1] : acc, S.head === "hair" ? 0 : 0.6, a);
      if (S.head === "bun") r.drawBox(M.mul(B, M.mul(M.trans(0, hy + 0.3, -0.08), M.scale(0.16, 0.16, 0.16))), acc, 0.8, a);
      r.drawBox(M.mul(B, M.mul(M.trans(0, hy + 0.02, 0.152), M.scale(0.2, 0.04, 0.02))), acc, 1, a);
    }
    if (S.spikes) {
      for (const sx of [-1, 1]) r.drawBox(M.mul(B, M.mul(M.trans(sx * 0.42, 1.62, 0), M.mul(M.rotZ(sx * -0.5), M.scale(0.1, 0.34, 0.14)))), acc, 0.9, a);
    }
  }
  TL.Rig = { STYLES, drawHumanoid };
})();
