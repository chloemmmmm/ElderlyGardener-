import { Navigate, createBrowserRouter } from "react-router-dom";

import { getRouterBasename } from "../config/public-path";
import { AppShell } from "./AppShell";
import { ProjectLayout } from "./ProjectLayout";
import { RouteErrorPage } from "./RouteErrorPage";

const CHUNK_RELOAD_FLAG = "router-chunk-reload";

/**
 * 部署后浏览器可能仍持有旧 index.html，其引用的懒加载 chunk 已被新构建替换，
 * 动态 import 会 404 并抛错。此时自动强刷一次，让浏览器重新拉取最新入口。
 */
async function lazyPage<T>(importer: () => Promise<T>): Promise<T> {
  try {
    return await importer();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isChunkLoadError =
      /failed to fetch dynamically imported module|importing a module script failed|error loading dynamically imported module/i.test(
        message,
      );
    if (isChunkLoadError && !window.sessionStorage.getItem(CHUNK_RELOAD_FLAG)) {
      window.sessionStorage.setItem(CHUNK_RELOAD_FLAG, "1");
      window.location.reload();
    }
    throw error;
  }
}

export const router = createBrowserRouter(
  [
    {
      element: <ProjectLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        {
          index: true,
          lazy: () =>
            lazyPage(async () => {
              const { ProjectShowcasePage } =
                await import("../pages/ProjectShowcasePage");
              return { Component: ProjectShowcasePage };
            }),
        },
        {
          path: "prd",
          lazy: () =>
            lazyPage(async () => {
              const { ProjectPrdPage } =
                await import("../pages/ProjectPrdPage");
              return { Component: ProjectPrdPage };
            }),
        },
        {
          path: "case-study",
          element: <Navigate to="/" replace />,
        },
      ],
    },
    {
      element: <AppShell />,
      errorElement: <RouteErrorPage />,
      children: [
        {
          path: "dashboard",
          lazy: () =>
            lazyPage(async () => {
              const { DashboardPage } = await import("../pages/DashboardPage");
              return { Component: DashboardPage };
            }),
        },
        {
          path: "clients",
          lazy: () =>
            lazyPage(async () => {
              const { ClientsPage } = await import("../pages/ClientsPage");
              return { Component: ClientsPage };
            }),
        },
        {
          path: "clients/:clientId",
          lazy: () =>
            lazyPage(async () => {
              const { ClientDetailPage } =
                await import("../pages/ClientDetailPage");
              return { Component: ClientDetailPage };
            }),
        },
        {
          path: "sessions/:sessionId",
          lazy: () =>
            lazyPage(async () => {
              const { SessionDetailPage } =
                await import("../pages/SessionDetailPage");
              return { Component: SessionDetailPage };
            }),
        },
        {
          path: "plans/:planId/edit",
          lazy: () =>
            lazyPage(async () => {
              const { PlanEditorPage } =
                await import("../pages/PlanEditorPage");
              return { Component: PlanEditorPage };
            }),
        },
        {
          path: "sessions",
          lazy: () =>
            lazyPage(async () => {
              const { SessionsPage } = await import("../pages/SessionsPage");
              return { Component: SessionsPage };
            }),
        },
        {
          path: "plans",
          lazy: () =>
            lazyPage(async () => {
              const { PlansPage } = await import("../pages/PlansPage");
              return { Component: PlansPage };
            }),
        },
        {
          path: "analytics",
          lazy: () =>
            lazyPage(async () => {
              const { AnalyticsPage } = await import("../pages/AnalyticsPage");
              return { Component: AnalyticsPage };
            }),
        },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ],
  { basename: getRouterBasename(import.meta.env.BASE_URL) },
);
