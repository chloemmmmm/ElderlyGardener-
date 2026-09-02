import { Navigate, createBrowserRouter } from "react-router-dom";

import { getRouterBasename } from "../config/public-path";
import { AppShell } from "./AppShell";
import { ProjectLayout } from "./ProjectLayout";
import { RouteErrorPage } from "./RouteErrorPage";

export const router = createBrowserRouter(
  [
    {
      element: <ProjectLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { ProjectShowcasePage } = await import(
              "../pages/ProjectShowcasePage"
            );
            return { Component: ProjectShowcasePage };
          },
        },
        {
          path: "prd",
          lazy: async () => {
            const { ProjectPrdPage } = await import(
              "../pages/ProjectPrdPage"
            );
            return { Component: ProjectPrdPage };
          },
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
            const { ClientDetailPage } = await import(
              "../pages/ClientDetailPage"
            );
            return { Component: ClientDetailPage };
          },
        },
        {
          path: "sessions/:sessionId",
          lazy: async () => {
            const { SessionDetailPage } = await import(
              "../pages/SessionDetailPage"
            );
            return { Component: SessionDetailPage };
          },
        },
        {
          path: "plans/:planId/edit",
          lazy: async () => {
            const { PlanEditorPage } = await import(
              "../pages/PlanEditorPage"
            );
            return { Component: PlanEditorPage };
          },
        },
        {
          path: "sessions",
          lazy: async () => {
            const { SessionsPage } = await import("../pages/SessionsPage");
            return { Component: SessionsPage };
          },
        },
        {
          path: "plans",
          lazy: async () => {
            const { PlansPage } = await import("../pages/PlansPage");
            return { Component: PlansPage };
          },
        },
        {
          path: "analytics",
          lazy: async () => {
            const { AnalyticsPage } = await import("../pages/AnalyticsPage");
            return { Component: AnalyticsPage };
          },
        },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ],
  { basename: getRouterBasename(import.meta.env.BASE_URL) },
);
