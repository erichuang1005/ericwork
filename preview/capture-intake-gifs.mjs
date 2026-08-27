/**
 * Capture GA catalog + non-catalog intake flows as PNG frame sequences,
 * then assemble GIFs with capture-intake-gifs.py
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SANA_URL ?? "http://localhost:5174";
const OUT = path.join(__dirname, "sana-captures", "frames");
const VIEWPORT = { width: 1280, height: 900 };

async function snap(page, dir, name) {
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${String(name).padStart(3, "0")}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function captureCatalog(browser) {
  const dir = path.join(OUT, "catalog");
  const page = await browser.newPage({ viewport: VIEWPORT });
  let frame = 0;

  await page.goto(`${BASE}/intake-orchestration-agent?view=ga`, {
    waitUntil: "networkidle",
  });
  await wait(800);
  await snap(page, dir, frame++);

  await page.getByRole("button", { name: /Catalog order · laptop/i }).click();
  await wait(600);
  await snap(page, dir, frame++);

  // Agent thinking + response
  await page.waitForSelector("text=Found contracted laptops", { timeout: 15000 });
  for (let i = 0; i < 4; i++) {
    await wait(450);
    await snap(page, dir, frame++);
  }

  // Side panel catalog — add first laptop
  const addBtn = page.getByRole("button", { name: "Add" }).first();
  await addBtn.waitFor({ state: "visible", timeout: 10000 });
  await wait(400);
  await snap(page, dir, frame++);
  await addBtn.click();
  await wait(500);
  await snap(page, dir, frame++);

  // Review requisition enables after add
  const review = page.getByRole("button", { name: "Review requisition" });
  await review.waitFor({ state: "visible", timeout: 8000 });
  for (let i = 0; i < 5; i++) {
    await wait(400);
    await snap(page, dir, frame++);
  }

  await page.close();
  return { dir, count: frame };
}

async function captureNonCatalog(browser) {
  const dir = path.join(OUT, "noncatalog");
  const page = await browser.newPage({ viewport: VIEWPORT });
  let frame = 0;

  await page.goto(`${BASE}/intake-orchestration-agent?view=ga`, {
    waitUntil: "networkidle",
  });
  await wait(800);
  await snap(page, dir, frame++);

  await page.getByRole("button", { name: /Non-catalog · web design/i }).click();
  await wait(700);
  await snap(page, dir, frame++);

  await page.waitForSelector("text=No catalog match found", { timeout: 15000 });
  for (let i = 0; i < 4; i++) {
    await wait(450);
    await snap(page, dir, frame++);
  }

  await page.waitForSelector("text=Non-catalog request", { timeout: 10000 });
  await wait(500);
  await snap(page, dir, frame++);

  // Step through wizard (Skip / Next)
  for (let step = 0; step < 4; step++) {
    const next = page.getByRole("button", { name: "Next" });
    const skip = page.getByRole("button", { name: "Skip" });
    await wait(600);
    await snap(page, dir, frame++);
    if (await next.isVisible().catch(() => false)) {
      await next.click();
      await wait(700);
      await snap(page, dir, frame++);
    } else if (await skip.isVisible().catch(() => false)) {
      await skip.click();
      await wait(700);
      await snap(page, dir, frame++);
    }
  }

  for (let i = 0; i < 3; i++) {
    await wait(400);
    await snap(page, dir, frame++);
  }

  await page.close();
  return { dir, count: frame };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const catalog = await captureCatalog(browser);
    const noncatalog = await captureNonCatalog(browser);
    const manifest = { catalog, noncatalog, capturedAt: new Date().toISOString() };
    await writeFile(
      path.join(OUT, "manifest.json"),
      JSON.stringify(manifest, null, 2),
    );
    console.log(JSON.stringify(manifest, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
