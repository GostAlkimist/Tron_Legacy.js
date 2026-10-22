#!/bin/sh
# Abre el juego en el navegador predeterminado (no requiere instalar nada).
DIR="$(cd "$(dirname "$0")" && pwd)"
if command -v xdg-open >/dev/null 2>&1; then xdg-open "$DIR/index.html"; elif command -v open >/dev/null 2>&1; then open "$DIR/index.html"; else echo "Abre $DIR/index.html en tu navegador."; fi
