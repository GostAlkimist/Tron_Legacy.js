// Prueba de humo con Playwright (solo desarrollo, no necesaria para jugar): recorre el juego con atajos de depuración.
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const out = process.argv[2] || "/tmp/shots"; require("fs").mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1100, height: 620 } });
  const errors = []; page.on("pageerror", e => errors.push("PAGEERR " + e.message)); page.on("console", m => { if (m.type() === "error") errors.push("CONSOLE " + m.text()); });
  await page.addInitScript(() => { HTMLCanvasElement.prototype.requestPointerLock = function () {}; });
  await page.goto("file://" + path.resolve(__dirname, "../index.html"));
  await page.waitForTimeout(1200);
  const shot = async n => { await page.screenshot({ path: out + "/" + n + ".png", timeout: 60000 }); };
  const ev = f => page.evaluate(f);
  await shot("01_menu");
  await page.click('[data-act="play"]'); await page.waitForTimeout(700);
  await shot("02_intro");
  for (let i = 0; i < 40 && (await ev(() => TLDebug.game.mode)) === "INTRO"; i++) { await ev(() => TLDebug.game.ui.introAdvance()); await page.waitForTimeout(100); }
  await page.waitForTimeout(1200); await shot("03_s1_start");
  console.log("mode:", await ev(() => TLDebug.game.mode), "sector:", await ev(() => TLDebug.game.state.sector));
  console.log("ERRORS:", errors.length ? errors.join("\n") : "ninguno");
  await browser.close();
})().catch(e => { console.error("FALLO", e.message); process.exit(1); });
