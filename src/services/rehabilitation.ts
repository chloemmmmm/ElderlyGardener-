import type {
  AnalyticsData,
  AppNotification,
  ClientDetail,
  ClientListQuery,
  DashboardData,
  PaginatedClients,
  PlanListItem,
  SearchResults,
  SessionListItem,
  TrainingPlan,
  TrainingSession,
  UpdateTrainingPlanInput,
} from "../domain/models";
import { apiRequest } from "./api";

function toSearchParams(query: ClientListQuery) {
  const params = new URLSearchParams();
  params.set("q", query.q);
  params.set("stage", query.stage);
  params.set("alert", query.alert);
  params.set("plan", query.plan);
  params.set("sort", query.sort);
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  return params;
}

export const rehabilitationApi = {
  getDashboard(signal?: AbortSignal) {
    return apiRequest<DashboardData>("/api/dashboard", { signal });
  },
  getClients(query: ClientListQuery, signal?: AbortSignal) {
    return apiRequest<PaginatedClients>(
      `/api/clients?${toSearchParams(query)}`,
      { signal },
    );
  },
  getClient(clientId: string, signal?: AbortSignal) {
    return apiRequest<ClientDetail>(`/api/clients/${clientId}`, { signal });
  },
  getSession(sessionId: string, signal?: AbortSignal) {
    return apiRequest<TrainingSession>(`/api/sessions/${sessionId}`, {
      signal,
    });
  },
  getPlan(planId: string, signal?: AbortSignal) {
    return apiRequest<TrainingPlan>(`/api/plans/${planId}`, { signal });
  },
  updatePlan(
    planId: string,
    input: UpdateTrainingPlanInput,
    options?: { scenario?: "save-error" },
  ) {
    return apiRequest<TrainingPlan>(`/api/plans/${planId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        ...(options?.scenario ? { "x-demo-scenario": options.scenario } : {}),
      },
      body: JSON.stringify(input),
    });
  },
  getSessions(signal?: AbortSignal) {
    return apiRequest<SessionListItem[]>("/api/sessions", { signal });
  },
  getPlans(signal?: AbortSignal) {
    return apiRequest<PlanListItem[]>("/api/plans", { signal });
  },
  getAnalytics(signal?: AbortSignal) {
    return apiRequest<AnalyticsData>("/api/analytics", { signal });
  },
  getNotifications(signal?: AbortSignal) {
    return apiRequest<AppNotification[]>("/api/notifications", { signal });
  },
  markNotificationRead(notificationId: string) {
    return apiRequest<AppNotification[]>(
      `/api/notifications/${notificationId}/read`,
      { method: "PUT" },
    );
  },
  markAllNotificationsRead() {
    return apiRequest<AppNotification[]>("/api/notifications/read-all", {
      method: "PUT",
    });
  },
  search(query: string, signal?: AbortSignal) {
    return apiRequest<SearchResults>(
      `/api/search?q=${encodeURIComponent(query)}`,
      { signal },
    );
  },
};
