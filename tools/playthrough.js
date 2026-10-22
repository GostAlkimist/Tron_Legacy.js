// Recorrido automático (solo desarrollo): node tools/playthrough.js <over|fw> <destruir|rescatar|escapar> [carpeta capturas]
const { chromium } = require("playwright"); const path = require("path");
(async () => {
  const route = process.argv[2] || "fw", ending = process.argv[3] || "destruir", out = process.argv[4] || "/tmp/shots/" + route + "_" + ending;
  require("fs").mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 900, height: 506 } });
  const errors = []; page.on("pageerror", e => errors.push("PAGEERR " + e.message)); page.on("console", m => { if (m.type() === "error") errors.push("CONSOLE " + m.text()); });
  await page.addInitScript(() => { HTMLCanvasElement.prototype.requestPointerLock = function () {}; });
  await page.goto("file://" + path.resolve(__dirname, "../index.html")); await page.waitForTimeout(800);
  const ev = (f, a) => page.evaluate(f, a), sleep = ms => page.waitForTimeout(ms);
  const shot = n => page.screenshot({ path: out + "/" + n + ".png", timeout: 60000 });
  const mode = () => ev(() => TLDebug.game.mode);
  const waitMode = async (m, ms = 60000) => {
    try { await page.waitForFunction(m => TLDebug.game.mode === m, m, { timeout: ms }); }
    catch (e) { const s = await page.evaluate(() => ({ mode: TLDebug.game.mode, stage: TLDebug.game.sector.stage, sector: TLDebug.game.state.sector, tgt: TLDebug.game.target && TLDebug.game.target.id, x: TLDebug.game.player.x, z: TLDebug.game.player.z, fps: Math.round(TLDebug.game.fps) })); throw new Error("esperando modo " + m + " → " + JSON.stringify(s)); }
  };
  const tp = (x, z) => ev(([x, z]) => { const p = TLDebug.game.player; p.x = x; p.z = z; p.vx = p.vz = 0; }, [x, z]);
  const E = async () => { await page.keyboard.press("KeyE"); await sleep(250); };
  async function dialogue(choices) {
    let guard = 0; choices = choices.slice();
    while ((await mode()) === "DIALOGUE" && guard++ < 40) {
      await ev(() => TLDebug.game.ui.dialogComplete());
      const n = await ev(() => (TLDebug.game.dlgView ? TLDebug.game.dlgView.options.length : 0));
      if (n) await ev(i => TLDebug.game.dialogueChoose(i), Math.min(n - 1, choices.length ? choices.shift() : 0));
      else await ev(() => TLDebug.game.dialogueAdvanceOrComplete());
      await sleep(80);
    }
  }
  const closeInfo = async () => { await waitMode("INFO", 5000); await ev(() => { TLDebug.game.infoReady = 0; }); await page.keyboard.press("Enter"); await sleep(400); };
  const log = (...a) => console.log(...a);
  const settle = () => ev(() => { const g = TLDebug.game; for (let i = 0; i < 400 && g.mode === "TRANSITION"; i++) { g.update(0.033); g.input.endFrame(); } });

  await page.click('[data-act="play"]'); await sleep(600);
  while ((await mode()) === "INTRO") { await ev(() => TLDebug.game.ui.introAdvance()); await sleep(60); }
  await waitMode("PLAY"); log("S1 jugando");

  // ---- Sector 1: tutorial, PD-1 y persecución real ----
  await tp(0, -4); await sleep(300); await tp(-0.5, 3); await sleep(500); await shot("01_s1_plaza");
  await E(); await waitMode("DIALOGUE", 5000); await sleep(300); await shot("02_s1_dialogo");
  await dialogue([1, 1, 0]); await waitMode("PLAY", 5000);
  log("PD-1:", await ev(() => TLDebug.game.state.decisions["PD-1"]), "confianza aliados:", await ev(() => TLDebug.game.state.trust.alliesTrust()));
  await shot("03_s1_persecucion");
  // El bot corre por la ruta libre con las teclas reales; la simulación avanza por pasos (sin dibujar) para ir rápido
  const res = await ev(() => {
    const g = TLDebug.game, wps = [[10, 12], [10, 18], [-18, 18], [-18, 24], [-21, 27.5]]; let i = 0, caps = 0, maxThr = 0;
    for (let n = 0; n < 2400 && g.state.sector === 1; n++) {
      if (g.mode === "PLAY") { const p = g.player, w = wps[i];
        if (w && Math.hypot(w[0] - p.x, w[1] - p.z) < 0.9) i++;
        const t = wps[Math.min(i, wps.length - 1)]; g.camYaw = Math.atan2(t[0] - p.x, t[1] - p.z); g.input.keys.add("KeyW"); g.input.keys.add("ShiftLeft"); }
      g.update(0.033); g.input.endFrame(); maxThr = Math.max(maxThr, g.state.threat.value);
      if (g.mode === "CAPTURE") caps++;
    }
    g.input.keys.clear(); return { sector: g.state.sector, wp: i, maxThr: Math.round(maxThr), captures: g.state.stats.captures };
  });
  log("persecución:", JSON.stringify(res));
  log("tras la persecución → sector", await ev(() => TLDebug.game.state.sector), "capturas:", await ev(() => TLDebug.game.state.stats.captures));
  await settle(); await waitMode("PLAY", 20000); await sleep(800); await shot("05_s2_inicio");

  // ---- Sector 2: puzzle, PD-2 ----
  log("sector", await ev(() => TLDebug.game.state.sector), "atajo:", await ev(() => TLDebug.game.state.flags.has("atajo_abierto")));
  await tp(-9, 3.6); await sleep(300); await shot("06_s2_hub");
  for (const [x, z] of [[-9, 3.6], [0, 9.6], [9, 3.6]]) { await tp(x, z); await sleep(250); await E(); await waitMode("DIALOGUE", 5000); await dialogue([]); if (await ev(() => TLDebug.game.mode === "INFO")) await closeInfo(); await waitMode("PLAY", 5000); }
  log("etapa:", await ev(() => TLDebug.game.sector.stage));
  await tp(0, 2); await sleep(300); await E(); await waitMode("DIALOGUE", 5000); await dialogue([route === "over" ? 0 : 1]);
  log("PD-2:", await ev(() => TLDebug.game.state.decisions["PD-2"]));
  if (route === "over") {
    await waitMode("PLAY", 5000); await sleep(1500); await shot("07_s2_ceros");
    await page.waitForFunction(() => TLDebug.game.mode === "DIALOGUE", null, { timeout: 60000 }); await dialogue([]); await closeInfo();
    await tp(30, 27.4); await sleep(300); await E(); log("firmware bloqueado:", await ev(() => TLDebug.game.sector.stage), "penalización:", await ev(() => TLDebug.game.state.timePenalty));
    await ev(() => { TLDebug.game.time += 61; });
  }
  await waitMode("PLAY", 5000);
  // puerta hackeable (mantener E)
  await tp(-15.2, 4); await sleep(300); await page.keyboard.down("KeyE"); await sleep(3500); await page.keyboard.up("KeyE"); await sleep(300);
  log("puerta hackeada:", await ev(() => TLDebug.game.level.doors.some(d => d.open && d.col && d.w < 2)));
  await tp(30, 27.4); await sleep(400); await shot("08_s2_boveda"); await E(); await closeInfo(); await sleep(500); await shot("09_s2_purga");
  await tp(-24, 29.5); await page.waitForFunction(() => TLDebug.game.state.sector === 3 || TLDebug.game.mode === "TRANSITION", null, { timeout: 30000 }); await settle(); await waitMode("PLAY", 20000); await sleep(800);

  // ---- Sector 3 ----
  await shot("10_s3_inicio"); await tp(-13, 3.6); await sleep(300); await E(); await waitMode("DIALOGUE", 5000); await dialogue([0]); await waitMode("PLAY", 5000);
  await tp(0, 17.4); await sleep(500); await shot("11_s3_bios"); await E(); await waitMode("DIALOGUE", 5000); await sleep(200); await shot("12_s3_juicio");
  await dialogue([ending === "destruir" ? 0 : ending === "rescatar" ? 1 : 2]);
  await page.waitForFunction(() => TLDebug.game.mode === "TRANSITION", null, { timeout: 30000 }); await settle(); await page.waitForFunction(() => TLDebug.game.mode === "FINAL", null, { timeout: 30000 }); await sleep(800); await shot("13_final");
  const cert = await ev(() => TL.Decisions.certificate(TLDebug.game.state, TLDebug.game.state.chain));
  log("FINAL:", cert.ending, "| decisiones:", cert.decisions.map(d => d.id + "=" + d.label).join("; "), "| bloques:", cert.chainLength, "| íntegra:", cert.integrity);
  log("registro:", (await ev(() => TLDebug.game.telemetry.lines.length)), "líneas");
  log("ERRORES:", errors.length ? errors.join("\n") : "ninguno");
  await browser.close();
})().catch(e => { console.error("FALLO:", e.message); process.exit(1); });
