#!/usr/bin/env bash
# Build resume PDF from resume/print.html (no toolbar) using Chrome headless.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HTML="$ROOT/resume/print.html"
OUT_RESUME="$ROOT/resume/resume.pdf"
OUT_SITE="$ROOT/resume.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [[ ! -f "$HTML" ]]; then
  echo "Missing $HTML"
  exit 1
fi

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found."
  echo "Open in browser: http://127.0.0.1:8766/resume.html"
  echo "Then: Print → Save as PDF (Letter, turn off headers/footers)"
  exit 1
fi

HTML_URL="file://${HTML// /%20}"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT_SITE" \
  "$HTML_URL"

cp "$OUT_SITE" "$OUT_RESUME"
echo "OK — webpage: http://127.0.0.1:8766/resume.html"
echo "OK — PDF:     http://127.0.0.1:8766/resume.pdf"
echo "Written: resume.pdf + resume/resume.pdf"
