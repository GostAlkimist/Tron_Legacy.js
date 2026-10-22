/* Punto de entrada: crea el juego y captura los errores no controlados (RNF-FIA-02). */
(function () {
  const TL = globalThis.TL;
  function showError(msg) {
    const e = document.getElementById("errorBox"); if (!e) return;
    e.textContent = msg; e.classList.remove("hidden");
  }
  window.addEventListener("error", ev => { try { if (TL.game) TL.game.telemetry.log("error", ev.message); } catch (e) {} showError("Ocurrió un error: " + ev.message + ". Recarga la página (F5)."); });
  window.addEventListener("unhandledrejection", ev => showError("Ocurrió un error: " + (ev.reason && ev.reason.message || ev.reason)));
  window.addEventListener("DOMContentLoaded", () => {
    try { TL.game = new TL.Game(document.getElementById("gl")); window.TLDebug = { game: TL.game }; }
    catch (e) { showError("No se pudo iniciar el juego: " + e.message + ". Se requiere un navegador con WebGL (Chrome, Edge o Firefox actualizados)."); console.error(e); }
  });
})();
