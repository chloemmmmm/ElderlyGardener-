/* global URL, console */

import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const projectRoot = new URL("../", import.meta.url);
const workerSource = fileURLToPath(new URL("sites/worker.js", projectRoot));
const workerDirectory = fileURLToPath(new URL("dist/server/", projectRoot));
const workerTarget = fileURLToPath(
  new URL("dist/server/index.js", projectRoot),
);
const indexSource = fileURLToPath(new URL("dist/index.html", projectRoot));
const notFoundTarget = fileURLToPath(new URL("dist/404.html", projectRoot));

await mkdir(workerDirectory, { recursive: true });
await copyFile(workerSource, workerTarget);
await copyFile(indexSource, notFoundTarget);

/**
 * GitHub Pages 对不存在的路径会返回 404 状态码（即使 404.html 里是应用本体），
 * 微信分享预览、爬虫和部分企业网络会把这类深链判定为"页面不存在"。
 * 为各主入口生成真实目录（/dashboard/ 等），使其以 200 状态返回应用入口，
 * 同时保证 /dashboard 这类无斜杠访问经 301 跳转后依然可用。
 */
const deepLinkRoutes = [
  "prd",
  "dashboard",
  "clients",
  "sessions",
  "plans",
  "analytics",
];

for (const route of deepLinkRoutes) {
  const routeDirectory = fileURLToPath(new URL(`dist/${route}/`, projectRoot));
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(indexSource, `${routeDirectory}index.html`);
}

console.log(
  `[prepare-sites-worker] 已生成 ${deepLinkRoutes.length} 个深链入口：${deepLinkRoutes.join(", ")}`,
);
