#!/bin/zsh
cd -- "$(dirname -- "$0")" || exit 1
BASTIONS_NODE_BIN="$(command -v node 2>/dev/null)"
if [[ -z "$BASTIONS_NODE_BIN" ]]; then
  for candidate in "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" /opt/homebrew/bin/node /usr/local/bin/node; do
    if [[ -x "$candidate" ]]; then BASTIONS_NODE_BIN="$candidate"; break; fi
  done
fi
if [[ -z "$BASTIONS_NODE_BIN" ]]; then
  print 'Node.js 20 ou plus récent est nécessaire sur cet ordinateur.'
  print 'Installez la version LTS depuis https://nodejs.org puis relancez ce fichier.'
  read '?Appuyez sur Entrée pour fermer.'
  exit 1
fi
if [[ ! -d node_modules/qrcode ]]; then
  "$(dirname "$BASTIONS_NODE_BIN")/npm" ci || exit 1
fi
"$BASTIONS_NODE_BIN" server.mjs --open
if [[ $? -ne 0 ]]; then read '?Appuyez sur Entrée pour fermer.'; fi
