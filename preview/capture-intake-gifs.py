#!/usr/bin/env python3
"""Assemble PNG frames into a non-flickering looping GIF (shared palette)."""

from __future__ import annotations

import json
import os
from pathlib import Path

from PIL import Image

PREVIEW = Path(__file__).resolve().parent
FRAMES = PREVIEW / "sana-captures" / "frames"
OUT_DIR = PREVIEW.parent / "images" / "intake-agent"
MAX_WIDTH = 1024
CANVAS = (1024, 640)  # 16:10 — both GIFs must share this size in the gallery


def fit_canvas(im: Image.Image) -> Image.Image:
    """Cover-fit into CANVAS so catalog + non-catalog GIFs have identical pixels."""
    tw, th = CANVAS
    im = im.convert("RGB")
    scale = max(tw / im.width, th / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = 0  # keep top chrome (chat header) visible
    return im.crop((left, top, left + tw, top + th))


def load_timed(key: str) -> list[tuple[Image.Image, int]]:
    data = json.loads((FRAMES / "timings.json").read_text())
    out: list[tuple[Image.Image, int]] = []
    for path_str, ms in data[key]:
        im = fit_canvas(Image.open(path_str))
        out.append((im, max(80, int(ms))))
    return out


def quantize_shared(images: list[Image.Image]) -> list[Image.Image]:
    """One palette for every frame — per-frame palettes make GIFs blink on loop."""
    sample = images[min(2, len(images) - 1)]
    pal = sample.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
    return [im.quantize(palette=pal, dither=Image.Dither.NONE) for im in images]


def save_gif(timed: list[tuple[Image.Image, int]], dest: Path) -> None:
    images = [im for im, _ in timed]
    durations = [ms for _, ms in timed]
    quantized = quantize_shared(images)
    # Ping-pong so the loop never hard-cuts back to frame 0 (that flash).
    if len(quantized) > 2:
        reverse = quantized[-2:0:-1]
        reverse_d = durations[-2:0:-1]
        quantized = quantized + reverse
        durations = durations + reverse_d
    dest.parent.mkdir(parents=True, exist_ok=True)
    quantized[0].save(
        dest,
        save_all=True,
        append_images=quantized[1:],
        duration=durations,
        loop=0,
        optimize=False,
        disposal=1,
    )
    poster = dest.with_suffix(".poster.png")
    images[-1].save(poster)
    print(f"Wrote {dest} ({len(quantized)} frames, {dest.stat().st_size // 1024} KB)")


def main() -> None:
    only = os.environ.get("CAPTURE_ONLY", "all")
    if only in ("all", "catalog"):
        save_gif(load_timed("catalog"), OUT_DIR / "catalog-flow.gif")
    if only in ("all", "noncatalog"):
        save_gif(load_timed("noncatalog"), OUT_DIR / "noncatalog-flow.gif")


if __name__ == "__main__":
    main()
