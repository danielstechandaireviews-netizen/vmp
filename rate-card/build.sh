#!/bin/sh
# Renders rate-card/rate-card.html to two PDFs with Microsoft Edge (headless):
#   public/rate-card.pdf           with the Black Friday column
#   public/rate-card-standard.pdf  regular prices only (?standard)
# Run from the project root: sh rate-card/build.sh
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
ROOT="$(pwd -W 2>/dev/null || pwd)"
SRC="file:///$ROOT/rate-card/rate-card.html"
"$EDGE" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$ROOT/public/rate-card.pdf" "$SRC"
"$EDGE" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$ROOT/public/rate-card-standard.pdf" "$SRC?standard"
