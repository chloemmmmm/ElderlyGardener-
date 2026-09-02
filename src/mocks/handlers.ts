import { delay, http, HttpResponse } from "msw";

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

export const handlers = [
  http.get("/api/dashboard", async () => {
    await delay(40);
    return HttpResponse.json(dashboardData);
  }),
  http.get("/api/clients", async ({ request }) => {
    await delay(40);
    const url = new URL(request.url);
    const query: ClientListQuery = {
      q: url.searchParams.get("q") ?? "",
      stage:
        (url.searchParams.get("stage") as ClientListQuery["stage"]) ?? "all",
      alert:
        (url.searchParams.get("alert") as ClientListQuery["alert"]) ?? "all",
      plan: (url.searchParams.get("plan") as ClientListQuery["plan"]) ?? "all",
      sort:
        (url.searchParams.get("sort") as ClientListQuery["sort"]) ??
        "attention",
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 10),
    };
    let filtered = clients.filter((client) =>
      client.name.includes(query.q.trim()),
    );
    if (query.stage !== "all")
      filtered = filtered.filter((client) => client.stage === query.stage);
    if (query.plan !== "all")
      filtered = filtered.filter((client) => client.planStatus === query.plan);
    if (query.alert === "needs-attention")
      filtered = filtered.filter((client) => client.attentionReason);
    if (query.alert === "stable")
      filtered = filtered.filter((client) => !client.attentionReason);
    filtered = [...filtered].sort((a, b) => {
      if (query.sort === "name") return a.name.localeCompare(b.name, "zh-CN");
      if (query.sort === "completion")
        return b.sevenDayCompletionRate - a.sevenDayCompletionRate;
      const aRank = a.attentionSeverity ? severityRank[a.attentionSeverity] : 3;
      const bRank = b.attentionSeverity ? severityRank[b.attentionSeverity] : 3;
      return aRank - bRank;
    });
    const start = (query.page - 1) * query.pageSize;
    return HttpResponse.json({
      items: filtered.slice(start, start + query.pageSize),
      total: filtered.length,
      page: query.page,
      pageSize: query.pageSize,
    });
  }),
  http.get("/api/clients/:clientId", async ({ params }) => {
    await delay(40);
    const client = clients.find((item) => item.id === params.clientId);
    if (!client)
      return HttpResponse.json(
        { message: "未找到康复对象。" },
        { status: 404 },
      );
    return HttpResponse.json({
      client,
      plan: plans.find((item) => item.clientId === client.id),
      sessions: sessions.filter((item) => item.clientId === client.id),
      interventions: interventions.filter(
        (item) => item.clientId === client.id,
      ),
    });
  }),
  http.get("/api/sessions/:sessionId", async ({ params }) => {
    await delay(40);
    const session = sessions.find((item) => item.id === params.sessionId);
    return session
      ? HttpResponse.json(session)
      : HttpResponse.json({ message: "未找到训练记录。" }, { status: 404 });
  }),
  http.get("/api/plans/:planId", async ({ params }) => {
    await delay(40);
    const plan = plans.find((item) => item.id === params.planId);
    return plan
      ? HttpResponse.json(plan)
      : HttpResponse.json({ message: "未找到训练计划。" }, { status: 404 });
  }),
  http.put("/api/plans/:planId", async ({ request, params }) => {
    await delay(80);
    if (request.headers.get("x-demo-scenario") === "save-error") {
      return HttpResponse.json(
        { message: "计划未保存，请稍后重试。" },
        { status: 503 },
      );
    }
    const plan = plans.find((item) => item.id === params.planId);
    if (!plan)
      return HttpResponse.json(
        { message: "未找到训练计划。" },
        { status: 404 },
      );
    const input = (await request.json()) as Pick<TrainingPlan, "exercises">;
    plan.exercises = input.exercises;
    plan.updatedAt = new Date("2026-08-31T16:20:00+08:00").toISOString();
    return HttpResponse.json(plan);
  }),
  http.get("/api/sessions", async () => {
    await delay(40);
    return HttpResponse.json(buildSessionList());
  }),
  http.get("/api/plans", async () => {
    await delay(40);
    return HttpResponse.json(buildPlanList());
  }),
  http.get("/api/analytics", async () => {
    await delay(40);
    return HttpResponse.json(buildAnalytics());
  }),
  http.get("/api/notifications", async () => {
    await delay(30);
    return HttpResponse.json(notificationsSeed);
  }),
  http.put("/api/notifications/read-all", async () => {
    await delay(40);
    for (const notification of notificationsSeed) notification.read = true;
    return HttpResponse.json(notificationsSeed);
  }),
  http.put("/api/notifications/:notificationId/read", async ({ params }) => {
    await delay(30);
    const notification = notificationsSeed.find(
      (item) => item.id === params.notificationId,
    );
    if (notification) notification.read = true;
    return HttpResponse.json(notificationsSeed);
  }),
  http.get("/api/search", async ({ request }) => {
    await delay(50);
    const url = new URL(request.url);
    return HttpResponse.json(buildSearchResults(url.searchParams.get("q") ?? ""));
  }),
];
