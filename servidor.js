/* Servidor local opcional (solo Node.js, sin dependencias): sirve la carpeta y abre el navegador.
   No es necesario para jugar: basta con abrir index.html. Uso: node servidor.js [puerto] */
const http = require("http"), fs = require("fs"), path = require("path"), { exec } = require("child_process");
const root = __dirname, port = parseInt(process.argv[2], 10) || 8080;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".md": "text/plain; charset=utf-8" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
  const f = path.join(root, path.normalize(p));
  if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end("No encontrado"); } res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" }); res.end(d); });
}).listen(port, "127.0.0.1", () => {
  const url = "http://127.0.0.1:" + port + "/"; console.log("Tron Legacy en " + url + "  (Ctrl+C para salir)");
  const cmd = process.platform === "win32" ? 'start "" "' + url + '"' : process.platform === "darwin" ? 'open "' + url + '"' : 'xdg-open "' + url + '"';
  exec(cmd, () => {});
});
