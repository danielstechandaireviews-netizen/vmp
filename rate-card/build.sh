#!/bin/sh
# Renders rate-card/rate-card.html to public/rate-card.pdf with Microsoft Edge (headless).
# Run from the project root: sh rate-card/build.sh
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
SRC="file:///$(pwd -W 2>/dev/null || pwd)/rate-card/rate-card.html"
"$EDGE" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$(pwd -W 2>/dev/null || pwd)/public/rate-card.pdf" "$SRC"
