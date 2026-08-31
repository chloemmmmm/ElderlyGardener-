import { Navigate, createBrowserRouter } from "react-router-dom";

import { getRouterBasename } from "../config/public-path";
import { AppShell } from "./AppShell";
import { RouteErrorPage } from "./RouteErrorPage";

export const router = createBrowserRouter(
  [
    {
      element: <AppShell />,
      errorElement: <RouteErrorPage />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        {
          path: "dashboard",
          lazy: async () => {
            const { DashboardPage } = await import("../pages/DashboardPage");
            return { Component: DashboardPage };
          },
        },
        {
          path: "clients",
          lazy: async () => {
            const { ClientsPage } = await import("../pages/ClientsPage");
            return { Component: ClientsPage };
          },
        },
        {
          path: "clients/:clientId",
          lazy: async () => {
            const { ClientDetailPage } =
              await import("../pages/ClientDetailPage");
            return { Component: ClientDetailPage };
          },
        },
        {
          path: "sessions/:sessionId",
          lazy: async () => {
            const { SessionDetailPage } =
              await import("../pages/SessionDetailPage");
            return { Component: SessionDetailPage };
          },
        },
        {
          path: "plans/:planId/edit",
          lazy: async () => {
            const { PlanEditorPage } = await import("../pages/PlanEditorPage");
            return { Component: PlanEditorPage };
          },
        },
        { path: "*", element: <Navigate to="/dashboard" replace /> },
      ],
    },
  ],
  { basename: getRouterBasename(import.meta.env.BASE_URL) },
);
