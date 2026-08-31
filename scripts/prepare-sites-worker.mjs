/* global URL */

import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const projectRoot = new URL("../", import.meta.url);
const workerSource = fileURLToPath(new URL("sites/worker.js", projectRoot));
const workerDirectory = fileURLToPath(new URL("dist/server/", projectRoot));
const workerTarget = fileURLToPath(new URL("dist/server/index.js", projectRoot));
const indexSource = fileURLToPath(new URL("dist/index.html", projectRoot));
const notFoundTarget = fileURLToPath(new URL("dist/404.html", projectRoot));

await mkdir(workerDirectory, { recursive: true });
await copyFile(workerSource, workerTarget);
await copyFile(indexSource, notFoundTarget);
