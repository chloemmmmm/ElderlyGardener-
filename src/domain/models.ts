export type TrainingStage = "entering" | "participating" | "sustaining";
export type PlanStatus = "active" | "review-due" | "paused";
export type AttentionSeverity = "high" | "medium" | "low";
export type SensorQuality = "good" | "fair" | "low";
export type FeedbackMode = "vibration" | "pneumatic" | "visual" | "none";

export interface Client {
  id: string;
  name: string;
  age: number;
  stage: TrainingStage;
  planId: string;
  planName: string;
  planStatus: PlanStatus;
  sevenDayCompletionRate: number;
  latestSessionAt: string | null;
  attentionReason: string | null;
  attentionSeverity: AttentionSeverity | null;
  ownerName: string;
}

export interface ExercisePlan {
  exerciseId: string;
  name: string;
  enabled: boolean;
  targetRepetitions: number;
  holdSeconds: number;
  feedbackMode: FeedbackMode;
}

export interface TrainingPlan {
  id: string;
  clientId: string;
  name: string;
  status: PlanStatus;
  updatedAt: string;
  exercises: ExercisePlan[];
}

export interface ExerciseResult {
  exerciseId: string;
  name: string;
  targetRepetitions: number;
  completedRepetitions: number;
  rangeCompletion: number;
  feedbackCount: number;
  sensorQuality: SensorQuality;
}

export interface TrainingSession {
  id: string;
  clientId: string;
  planId: string;
  startedAt: string;
  durationMinutes: number;
  status: "completed" | "interrupted";
  subjectiveFeedback: string;
  sensorCompleteness: number;
  exercises: ExerciseResult[];
}

export interface AttentionItem {
  id: string;
  clientId: string;
  clientName: string;
  sessionId: string | null;
  severity: AttentionSeverity;
  reason: string;
  evidence: string;
  nextAction: string;
}

export type AiFactSource =
  | "session-completion"
  | "sensor-quality"
  | "feedback-frequency"
  | "subjective-feedback";

export interface AiFact {
  id: string;
  label: string;
  value: string;
  detail: string;
  source: AiFactSource;
}

export interface AiSuggestion {
  id: string;
  text: string;
  rationale: string;
  requiresConfirmation: true;
}

export interface AiSummary {
  facts: AiFact[];
  suggestions: AiSuggestion[];
  uncertainty: string | null;
}

export interface InterventionNote {
  id: string;
  clientId: string;
  createdAt: string;
  authorName: string;
  text: string;
  source: "therapist" | "ai-draft-confirmed";
}

export interface DashboardData {
  attentionItems: AttentionItem[];
  todaySchedule: Array<{
    id: string;
    time: string;
    clientName: string;
    task: string;
  }>;
  completionTrend: Array<{ date: string; completed: number; planned: number }>;
  activity: Array<{ id: string; occurredAt: string; text: string }>;
}

export interface ClientListQuery {
  q: string;
  stage: TrainingStage | "all";
  alert: "all" | "needs-attention" | "stable";
  plan: PlanStatus | "all";
  sort: "attention" | "name" | "completion";
  page: number;
  pageSize: number;
}

export interface PaginatedClients {
  items: Client[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClientDetail {
  client: Client;
  plan: TrainingPlan;
  sessions: TrainingSession[];
  interventions: InterventionNote[];
}

export type UpdateTrainingPlanInput = Pick<TrainingPlan, "exercises">;

export type SessionState = TrainingSession["status"];

export interface SessionListItem {
  id: string;
  clientId: string;
  clientName: string;
  planName: string;
  startedAt: string;
  durationMinutes: number;
  status: SessionState;
  completionRate: number;
  sensorCompleteness: number;
  worstQuality: SensorQuality;
}

export interface PlanListItem {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  stage: TrainingStage;
  status: PlanStatus;
  sevenDayCompletionRate: number;
  updatedAt: string;
  exerciseCount: number;
  latestSessionAt: string | null;
}

export interface AnalyticsData {
  summary: {
    activeClients: number;
    needsAttention: number;
    weeklyCompletionRate: number;
    weeklyTrendDelta: number;
    avgDurationMinutes: number;
  };
  riskDistribution: Array<{ severity: AttentionSeverity; count: number }>;
  stageDistribution: Array<{ stage: TrainingStage; count: number }>;
  weeklyTrend: DashboardData["completionTrend"];
  exerciseCoverage: Array<{
    exerciseId: string;
    name: string;
    avgRangeCompletion: number;
    avgFeedbackPerSession: number;
  }>;
  completionByOwner: Array<{
    ownerName: string;
    clientCount: number;
    avgCompletionRate: number;
  }>;
}
