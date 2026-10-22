// Verificación rápida en navegador sin dibujar (solo desarrollo): ruta sobrescribir + purga + los 3 finales.
const { chromium } = require("playwright"); const path = require("path");
(async () => {
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 320, height: 200 } });
  const errors = []; page.on("pageerror", e => errors.push(e.message)); page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.addInitScript(() => { HTMLCanvasElement.prototype.requestPointerLock = function () {}; });
  await page.goto("file://" + path.resolve(__dirname, "../index.html")); await page.waitForTimeout(500);
  const res = await page.evaluate(() => {
    const g = TLDebug.game, out = {}, tick = n => { for (let i = 0; i < n; i++) { g.update(0.033); g.input.endFrame(); } };
    const press = c => { g.input.pressed.add(c); tick(1); };
    const dlg = ch => { let k = 0; while (g.mode === "DIALOGUE" && k++ < 30) { g.ui.dialogComplete(); const n = g.dlgView ? g.dlgView.options.length : 0; if (n) g.dialogueChoose(Math.min(n - 1, ch.length ? ch.shift() : 0)); else g.dialogueAdvanceOrComplete(); } };
    const info = () => { if (g.mode === "INFO") { g.infoReady = 0; press("Enter"); } };
    const tp = (x, z) => { g.player.x = x; g.player.z = z; tick(2); };
    // Ruta sobrescribir completa
    g.newGame(); while (g.mode === "INTRO") g.ui.introAdvance(); g.sector.constructor; tick(2);
    g.state.flags.add("ayuda_aliados"); tp(-0.5, 3); press("KeyE"); dlg([1, 1, 0]); tick(1); out.pd1 = g.state.decisions["PD-1"];
    g.gotoSector(2); tick(400); out.sector = g.state.sector; out.mode = g.mode;
    for (const [x, z] of [[-9, 3.6], [0, 9.6], [9, 3.6]]) { tp(x, z); press("KeyE"); dlg([]); info(); }
    tp(0, 2); press("KeyE"); dlg([0]); out.pd2 = g.state.decisions["PD-2"]; tick(150);
    out.dialogoPostSobrescritura = g.mode; dlg([]); info(); tick(2); out.etapa = g.sector.stage; out.penalizacion = g.state.timePenalty;
    tp(30, 27.4); press("KeyE"); out.bloqueado = g.sector.stage === "vault";
    g.time += 61; press("KeyE"); info(); out.etapaTrasPurga = g.sector.stage; out.edu = Object.keys(g.sector.edu).join(",");
    tp(-24, 29.5); tick(400); out.sector3 = g.state.sector;
    tp(0, 17.4); press("KeyE"); dlg([2]); tick(60); out.final = g.mode; out.ending = g.state.ending;
    out.cert = TL.Decisions.certificate(g.state, g.state.chain); out.bloques = g.state.chain.length;
    // Rescatar y destruir desde el Sector 3
    for (const [i, end] of [[1, "rescatar"], [0, "destruir"]]) {
      g.state.reset(); g.state.flags.add("ayuda_aliados"); g.loadSector(3); g.beginPlay(); tick(2); tp(0, 17.4); press("KeyE"); dlg([i]); tick(60);
      out["final_" + end] = g.state.ending + "/" + g.mode;
    }
    return out; });
  console.log(JSON.stringify(res, null, 1)); console.log("ERRORES:", errors.length ? errors.join(" | ") : "ninguno"); await browser.close();
})().catch(e => { console.error("FALLO", e.message); process.exit(1); });
