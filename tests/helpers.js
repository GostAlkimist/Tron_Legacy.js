// Carga los módulos de lógica (sin motor 3D) en Node, en el mismo orden que index.html.
globalThis.TL = globalThis.TL || {};
const path = require("path");
const root = path.join(__dirname, "..");
["data/config.js", "data/texts.es.js", "src/voice.js", "src/core/sha256.js", "src/core/chain.js", "src/core/trust.js",
 "src/core/threat.js", "src/core/geom.js", "src/core/dialogue.js", "src/core/decisions.js", "src/core/state.js",
 "data/dialogs/s1.js", "data/dialogs/s2.js", "data/dialogs/s3.js"]
  .forEach(f => { try { require(path.join(root, f)); } catch (e) { if (e.code !== "MODULE_NOT_FOUND") throw e; } });
module.exports = globalThis.TL;
