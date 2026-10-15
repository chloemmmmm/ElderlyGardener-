import type { PathParams } from "msw";

import type { ClientListQuery, TrainingPlan } from "../domain/models";
import {
  buildAnalytics,
  buildPlanList,
  buildSearchResults,
  buildSessionList,
  clients,
  dashboardData,
  interventions,
  notificationsSeed,
  plans,
  sessions,
} from "./data";

const severityRank = { high: 0, medium: 1, low: 2 } as const;

function paramString(value: PathParams[string]): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

export async function getDashboardResponse() {
  return Response.json(dashboardData);
}

export async function getClientsResponse(request: Request) {
  const url = new URL(request.url);
  const query: ClientListQuery = {
    q: url.searchParams.get("q") ?? "",
    stage: (url.searchParams.get("stage") as ClientListQuery["stage"]) ?? "all",
    alert: (url.searchParams.get("alert") as ClientListQuery["alert"]) ?? "all",
    plan: (url.searchParams.get("plan") as ClientListQuery["plan"]) ?? "all",
    sort:
      (url.searchParams.get("sort") as ClientListQuery["sort"]) ?? "attention",
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 10),
  };

  let filtered = clients.filter((client) =>
    client.name.includes(query.q.trim()),
  );
  if (query.stage !== "all") {
    filtered = filtered.filter((client) => client.stage === query.stage);
  }
  if (query.plan !== "all") {
    filtered = filtered.filter((client) => client.planStatus === query.plan);
  }
  if (query.alert === "needs-attention") {
    filtered = filtered.filter((client) => client.attentionReason);
  }
  if (query.alert === "stable") {
    filtered = filtered.filter((client) => !client.attentionReason);
  }
  filtered = [...filtered].sort((a, b) => {
    if (query.sort === "name") return a.name.localeCompare(b.name, "zh-CN");
    if (query.sort === "completion") {
      return b.sevenDayCompletionRate - a.sevenDayCompletionRate;
    }
    const aRank = a.attentionSeverity ? severityRank[a.attentionSeverity] : 3;
    const bRank = b.attentionSeverity ? severityRank[b.attentionSeverity] : 3;
    return aRank - bRank;
  });

  const start = (query.page - 1) * query.pageSize;
  return Response.json({
    items: filtered.slice(start, start + query.pageSize),
    total: filtered.length,
    page: query.page,
    pageSize: query.pageSize,
  });
}

export async function getClientDetailResponse(params: PathParams) {
  const client = clients.find((item) => item.id === paramString(params.clientId));
  if (!client) {
    return Response.json({ message: "未找到康复对象。" }, { status: 404 });
  }
  return Response.json({
    client,
    plan: plans.find((item) => item.clientId === client.id),
    sessions: sessions.filter((item) => item.clientId === client.id),
    interventions: interventions.filter((item) => item.clientId === client.id),
  });
}

export async function getSessionResponse(params: PathParams) {
  const session = sessions.find((item) => item.id === paramString(params.sessionId));
  return session
    ? Response.json(session)
    : Response.json({ message: "未找到训练记录。" }, { status: 404 });
}

export async function getPlanResponse(params: PathParams) {
  const plan = plans.find((item) => item.id === paramString(params.planId));
  return plan
    ? Response.json(plan)
    : Response.json({ message: "未找到训练计划。" }, { status: 404 });
}

export async function updatePlanResponse(
  request: Request,
  params: PathParams,
) {
  if (request.headers.get("x-demo-scenario") === "save-error") {
    return Response.json(
      { message: "计划未保存，请稍后重试。" },
      { status: 503 },
    );
  }
  const plan = plans.find((item) => item.id === paramString(params.planId));
  if (!plan) {
    return Response.json({ message: "未找到训练计划。" }, { status: 404 });
  }
  const input = (await request.json()) as Pick<TrainingPlan, "exercises">;
  plan.exercises = input.exercises;
  plan.updatedAt = new Date("2026-08-31T16:20:00+08:00").toISOString();
  return Response.json(plan);
}

export async function getSessionsResponse() {
  return Response.json(buildSessionList());
}

export async function getPlansResponse() {
  return Response.json(buildPlanList());
}

export async function getAnalyticsResponse() {
  return Response.json(buildAnalytics());
}

export async function getNotificationsResponse() {
  return Response.json(notificationsSeed);
}

export async function readAllNotificationsResponse() {
  for (const notification of notificationsSeed) notification.read = true;
  return Response.json(notificationsSeed);
}

export async function readNotificationResponse(params: PathParams) {
  const notification = notificationsSeed.find(
    (item) => item.id === paramString(params.notificationId),
  );
  if (notification) notification.read = true;
  return Response.json(notificationsSeed);
}

export async function searchResponse(request: Request) {
  const url = new URL(request.url);
  return Response.json(buildSearchResults(url.searchParams.get("q") ?? ""));
}

type MockRoute = {
  method: string;
  pattern: string;
  handler: (args: {
    request: Request;
    params: Record<string, string>;
  }) => Promise<Response>;
};

const routes: MockRoute[] = [
  {
    method: "GET",
    pattern: "/api/dashboard",
    handler: () => getDashboardResponse(),
  },
  {
    method: "GET",
    pattern: "/api/clients",
    handler: ({ request }) => getClientsResponse(request),
  },
  {
    method: "GET",
    pattern: "/api/clients/:clientId",
    handler: ({ params }) => getClientDetailResponse(params),
  },
  {
    method: "GET",
    pattern: "/api/sessions/:sessionId",
    handler: ({ params }) => getSessionResponse(params),
  },
  {
    method: "GET",
    pattern: "/api/plans/:planId",
    handler: ({ params }) => getPlanResponse(params),
  },
  {
    method: "PUT",
    pattern: "/api/plans/:planId",
    handler: ({ request, params }) => updatePlanResponse(request, params),
  },
  {
    method: "GET",
    pattern: "/api/sessions",
    handler: () => getSessionsResponse(),
  },
  { method: "GET", pattern: "/api/plans", handler: () => getPlansResponse() },
  {
    method: "GET",
    pattern: "/api/analytics",
    handler: () => getAnalyticsResponse(),
  },
  {
    method: "GET",
    pattern: "/api/notifications",
    handler: () => getNotificationsResponse(),
  },
  {
    method: "PUT",
    pattern: "/api/notifications/read-all",
    handler: () => readAllNotificationsResponse(),
  },
  {
    method: "PUT",
    pattern: "/api/notifications/:notificationId/read",
    handler: ({ params }) => readNotificationResponse(params),
  },
  {
    method: "GET",
    pattern: "/api/search",
    handler: ({ request }) => searchResponse(request),
  },
];

function matchPattern(
  pattern: string,
  pathname: string,
): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    if (part.startsWith(":")) {
      params[part.slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (part !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

/**
 * 不依赖 Service Worker 的本地 mock 请求处理器。
 * 用于微信/企业微信等不支持 SW 的 WebView，或 SW 注册失败时的降级。
 */
export async function handleMockRequest(
  request: Request,
): Promise<Response | null> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  for (const route of routes) {
    if (route.method !== method) continue;
    const params = matchPattern(route.pattern, url.pathname);
    if (params) {
      return route.handler({ request, params });
    }
  }

  return null;
}
