import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import { isDemoModeEnabled } from "./config/demo-mode";
import { getPublicAssetUrl } from "./config/public-path";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/case-study.css";
import "./styles/platform.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("应用根节点不存在");
}

function dismissSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  splash.classList.add("is-done");
  window.setTimeout(() => splash.remove(), 500);
}

function startApplication() {
  // 先渲染应用，确保首屏不被 Service Worker 注册阻塞。
  // 弱网 / WebView 中 SW 注册可能很慢甚至挂起，若在此 await 会令启动画面卡死。
  createRoot(root as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  window.setTimeout(dismissSplash, 250);

  if (isDemoModeEnabled(import.meta.env.VITE_DEMO_MODE)) {
    // 后台启动 MSW：不阻塞首屏。注册慢/失败时 B 端数据由
    // src/services/api.ts 的本地 mock 回退兜底，不会卡启动画面。
    void import("./mocks/browser")
      .then(({ worker }) =>
        worker.start({
          onUnhandledRequest: "bypass",
          serviceWorker: {
            url: getPublicAssetUrl(
              import.meta.env.BASE_URL,
              "mockServiceWorker.js",
            ),
          },
        }),
      )
      .catch((error) =>
        console.warn("[demo] 模拟服务层启动失败，已走本地回退：", error),
      );
  }
}

void startApplication();
