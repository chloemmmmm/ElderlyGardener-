/* global console, process */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/assets/showcase");
const BASE = "http://localhost:4173";

const shots = [
  { route: "/dashboard", name: "console-dashboard", waitFor: "text=早上好" },
  { route: "/clients", name: "console-clients", waitFor: "text=康复对象" },
  { route: "/plans", name: "console-plans", waitFor: "text=训练计划" },
  { route: "/sessions", name: "console-sessions", waitFor: "text=训练记录" },
  { route: "/analytics", name: "console-analytics", waitFor: "text=数据看板" },
  { route: "/clients/client-001", name: "console-client-detail", waitFor: "text=对象档案" },
  { route: "/sessions/session-001", name: "console-session-detail", waitFor: "text=训练复盘" },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  for (const shot of shots) {
    const page = await context.newPage();
    await page.goto(`${BASE}${shot.route}`, { waitUntil: "networkidle" });
    await page.waitForSelector(shot.waitFor, { timeout: 15_000 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(OUT_DIR, `${shot.name}.png`),
      fullPage: false,
    });
    await page.close();
    console.log(`Captured ${shot.name}.png`);
  }

  await context.close();
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
