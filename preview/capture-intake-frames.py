#!/usr/bin/env python3
"""Capture GA catalog + non-catalog chat flows as PNG frames (chat only)."""

from __future__ import annotations

import json
import os
import time
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

BASE = os.environ.get("SANA_URL", "http://localhost:5174")
PREVIEW = Path(__file__).resolve().parent
FRAMES = PREVIEW / "sana-captures" / "frames"
VIEWPORT = {"width": 1440, "height": 900}
CHROME = (
    Path.home()
    / "Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
)


def hide_chrome(page: Page) -> None:
    page.evaluate(
        """() => {
          const hide = (sel) => document.querySelectorAll(sel).forEach((el) => {
            el.style.setProperty('display', 'none', 'important');
          });
          hide('.intake-milestone-fab');
        }"""
    )


def prep_chat(page: Page) -> None:
    page.goto(f"{BASE}/?view=ga", wait_until="networkidle")
    time.sleep(0.3)
    collapse = page.get_by_role("button", name="Collapse sidebar")
    if collapse.count() and collapse.first.is_visible():
        collapse.first.click()
        time.sleep(0.2)
    hide_chrome(page)


def snap_stage(page: Page, folder: Path, idx: list[int]) -> Path:
    """Full viewport — GA catalog docks as position:fixed outside the chat crop."""
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{idx[0]:03d}.png"
    page.screenshot(path=str(path), full_page=False)
    idx[0] += 1
    return path


def burst(page: Page, folder: Path, idx: list[int], timings: list, n: int, gap: float, hold_ms: int) -> None:
    for i in range(n):
        p = snap_stage(page, folder, idx)
        timings.append((p, hold_ms if i == n - 1 else int(gap * 1000)))
        if i < n - 1:
            time.sleep(gap)


def capture_catalog(page: Page) -> list[tuple[Path, int]]:
    folder = FRAMES / "catalog"
    idx = [0]
    timings: list[tuple[Path, int]] = []

    prep_chat(page)
    page.get_by_role("button", name="Use suggestion: Catalog order").click()
    page.wait_for_selector("text=Found contracted laptops", timeout=20_000)
    hide_chrome(page)
    page.keyboard.press("Escape")
    time.sleep(0.4)
    burst(page, folder, idx, timings, n=3, gap=0.12, hold_ms=140)

    # Morph into the docked canvas (auto-expand, or click Expand if it stays collapsed)
    review = page.get_by_role("button", name="Review requisition")
    try:
        review.wait_for(state="visible", timeout=8_000)
    except Exception:
        expand = page.get_by_role("button", name="Expand")
        if expand.count():
            expand.first.click()
        review.wait_for(state="visible", timeout=12_000)

    # Expanded catalog list — this is the beat the case study needs
    page.get_by_role("tab", name="Laptops").wait_for(state="visible", timeout=8_000)
    burst(page, folder, idx, timings, n=10, gap=0.14, hold_ms=200)

    # Composer also exposes name="Add" — skip it; use the first catalog row Add
    catalog_add = page.get_by_role("button", name="Add", exact=True).nth(1)
    catalog_add.wait_for(state="visible", timeout=8_000)
    catalog_add.click()
    time.sleep(0.45)
    burst(page, folder, idx, timings, n=8, gap=0.12, hold_ms=1400)
    return timings


def capture_noncatalog(page: Page) -> list[tuple[Path, int]]:
    folder = FRAMES / "noncatalog"
    idx = [0]
    timings: list[tuple[Path, int]] = []

    prep_chat(page)
    page.get_by_role("button", name="Use suggestion: Non-catalog").click()
    page.wait_for_selector("text=No catalog match found", timeout=20_000)
    hide_chrome(page)
    time.sleep(0.4)
    burst(page, folder, idx, timings, n=3, gap=0.11, hold_ms=140)

    page.wait_for_selector("text=Non-catalog request", timeout=12_000)
    time.sleep(0.25)
    burst(page, folder, idx, timings, n=3, gap=0.1, hold_ms=160)

    for step in range(4):
        next_btn = page.get_by_role("button", name="Next", exact=True)
        skip_btn = page.get_by_role("button", name="Skip", exact=True)
        burst(page, folder, idx, timings, n=2, gap=0.1, hold_ms=140)
        if next_btn.count() and next_btn.first.is_visible():
            next_btn.first.click()
            time.sleep(0.38)
            burst(page, folder, idx, timings, n=3, gap=0.1, hold_ms=220 if step < 3 else 850)
        elif skip_btn.count() and skip_btn.first.is_visible():
            skip_btn.first.click()
            time.sleep(0.38)
            burst(page, folder, idx, timings, n=3, gap=0.1, hold_ms=220)
        else:
            break
    return timings


def main() -> None:
    os.environ.setdefault(
        "PLAYWRIGHT_BROWSERS_PATH",
        str(Path.home() / "Library/Caches/ms-playwright"),
    )
    only = os.environ.get("CAPTURE_ONLY", "catalog")
    for sub in ("catalog", "noncatalog"):
        if only not in ("all", sub):
            continue
        d = FRAMES / sub
        if d.exists():
            for f in d.glob("*.png"):
                f.unlink()

    existing = {}
    timings_path = FRAMES / "timings.json"
    if timings_path.exists():
        existing = json.loads(timings_path.read_text())

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path=str(CHROME) if CHROME.exists() else None,
        )
        context = browser.new_context(viewport=VIEWPORT)
        page = context.new_page()
        if only in ("all", "catalog"):
            existing["catalog"] = [(str(p), ms) for p, ms in capture_catalog(page)]
        if only in ("all", "noncatalog"):
            existing["noncatalog"] = [(str(p), ms) for p, ms in capture_noncatalog(page)]
        browser.close()

    timings_path.write_text(json.dumps(existing, indent=2))
    print(f"Catalog: {len(existing.get('catalog', []))} frames")
    print(f"Non-catalog: {len(existing.get('noncatalog', []))} frames")


if __name__ == "__main__":
    main()
