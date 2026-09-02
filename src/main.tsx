import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import { isDemoModeEnabled } from "./config/demo-mode";
import { getPublicAssetUrl } from "./config/public-path";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/case-study.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("应用根节点不存在");
}

async function startApplication() {
  if (isDemoModeEnabled(import.meta.env.VITE_DEMO_MODE)) {
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
  }

  createRoot(root as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void startApplication();
