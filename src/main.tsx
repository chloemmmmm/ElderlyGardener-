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

async function startApplication() {
  if (isDemoModeEnabled(import.meta.env.VITE_DEMO_MODE)) {
    try {
      const { worker } = await import("./mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: {
          url: getPublicAssetUrl(
            import.meta.env.BASE_URL,
            "mockServiceWorker.js",
          ),
        },
      });
    } catch (error) {
      // 跨境弱网下 mock worker 可能注册失败：降级继续渲染，
      // 避免应用卡在启动画面无法显示任何内容。
      console.warn("[demo] 模拟服务层启动失败，降级渲染：", error);
    }
  }

  createRoot(root as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  window.setTimeout(dismissSplash, 250);
}

void startApplication();
