#!/bin/bash
# Creates a clean folder on your Desktop — NO node_modules, NO dev junk.
# Usage: ./scripts/export-for-github.sh

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$HOME/Desktop/ericwork-UPLOAD-TO-GITHUB"
ZIP="$HOME/Desktop/ericwork-site.zip"

rm -rf "$OUT" "$ZIP"
mkdir -p "$OUT"

# Site files only
cp "$ROOT"/*.html "$OUT/" 2>/dev/null || true
cp "$ROOT"/*.css "$OUT/"
cp "$ROOT"/auth.js "$ROOT"/analytics.js "$ROOT"/site-meta.js "$OUT/"
cp "$ROOT"/liquid-glass-tabs.bundle.js "$OUT/"
cp "$ROOT/resume.pdf" "$OUT/"

# Images + hub demo
cp -R "$ROOT/images" "$OUT/images"
cp -R "$ROOT/hub" "$OUT/hub"

# Zip for Netlify/Vercel
(cd "$(dirname "$OUT")" && zip -r "$ZIP" "$(basename "$OUT")" -x "*.DS_Store")

FILE_COUNT=$(find "$OUT" -type f | wc -l | tr -d ' ')

cat > "$OUT/00-READ-ME-FIRST.txt" << EOF
UPLOAD THIS FOLDER ONLY — not the whole ericwork project.

This folder has $FILE_COUNT files. No node_modules.

LIQUID GLASS FIX: these 3 files MUST be uploaded together:
  - liquid-glass-tabs.bundle.js   (the effect script — at ROOT, not in assets/)
  - intake-agent.html
  - inventory-picking.html
  - purchase-compliance.html

On GitHub the script line must be:
  <script src="liquid-glass-tabs.bundle.js?v=20260750"></script>
NOT assets/liquid-glass-tabs.bundle.js

DO NOT upload node_modules/ (2,400+ files).
EOF

echo ""
echo "✓ Ready on your Desktop:"
echo "    Folder: $OUT  ($FILE_COUNT files)"
echo "    Zip:    $ZIP"
echo ""
echo "To fix liquid glass on GitHub, upload these 4 files:"
echo "  liquid-glass-tabs.bundle.js"
echo "  intake-agent.html"
echo "  inventory-picking.html"
echo "  purchase-compliance.html"
