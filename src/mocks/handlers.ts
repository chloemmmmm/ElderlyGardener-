import { delay, http } from "msw";

import {
  getAnalyticsResponse,
  getClientDetailResponse,
  getClientsResponse,
  getDashboardResponse,
  getNotificationsResponse,
  getPlanResponse,
  getPlansResponse,
  getSessionResponse,
  getSessionsResponse,
  readAllNotificationsResponse,
  readNotificationResponse,
  searchResponse,
  updatePlanResponse,
} from "./api-responses";

/**
 * MSW Service Worker 处理器。
 * 实际响应逻辑已从 handlers.ts 拆到 api-responses.ts，
 * 便于在 Service Worker 不可用（微信/企业 WebView）时复用为本地回退。
 */
export const handlers = [
  http.get("/api/dashboard", async () => {
    await delay(40);
    return getDashboardResponse();
  }),
  http.get("/api/clients", async ({ request }) => {
    await delay(40);
    return getClientsResponse(request);
  }),
  http.get("/api/clients/:clientId", async ({ params }) => {
    await delay(40);
    return getClientDetailResponse(params);
  }),
  http.get("/api/sessions/:sessionId", async ({ params }) => {
    await delay(40);
    return getSessionResponse(params);
  }),
  http.get("/api/plans/:planId", async ({ params }) => {
    await delay(40);
    return getPlanResponse(params);
  }),
  http.put("/api/plans/:planId", async ({ request, params }) => {
    await delay(80);
    return updatePlanResponse(request, params);
  }),
  http.get("/api/sessions", async () => {
    await delay(40);
    return getSessionsResponse();
  }),
  http.get("/api/plans", async () => {
    await delay(40);
    return getPlansResponse();
  }),
  http.get("/api/analytics", async () => {
    await delay(40);
    return getAnalyticsResponse();
  }),
  http.get("/api/notifications", async () => {
    await delay(30);
    return getNotificationsResponse();
  }),
  http.put("/api/notifications/read-all", async () => {
    await delay(40);
    return readAllNotificationsResponse();
  }),
  http.put("/api/notifications/:notificationId/read", async ({ params }) => {
    await delay(30);
    return readNotificationResponse(params);
  }),
  http.get("/api/search", async ({ request }) => {
    await delay(50);
    return searchResponse(request);
  }),
];
