import type {
  AnalyticsData,
  AppNotification,
  AttentionItem,
  Client,
  DashboardData,
  InterventionNote,
  PlanListItem,
  SearchResults,
  SensorQuality,
  SessionListItem,
  TrainingPlan,
  TrainingSession,
} from "../domain/models";

export const exerciseCatalog = [
  { id: "hoe", name: "耙土" },
  { id: "transplant", name: "移栽提把" },
  { id: "water", name: "提水浇水" },
  { id: "prune", name: "修剪树枝" },
  { id: "harvest", name: "摘果子" },
] as const;

const clientSeeds = [
  [
    "client-001",
    "王桂兰",
    72,
    "participating",
    42,
    "连续 3 天未完成训练",
    "high",
  ],
  [
    "client-002",
    "李建国",
    68,
    "entering",
    76,
    "修剪动作反馈次数偏高",
    "medium",
  ],
  ["client-003", "周玉梅", 75, "sustaining", 91, null, null],
  ["client-004", "赵国强", 70, "participating", 84, null, null],
  [
    "client-005",
    "陈秀英",
    78,
    "entering",
    63,
    "传感器数据完整度不足",
    "medium",
  ],
  ["client-006", "贺春梅", 67, "sustaining", 96, null, null],
  [
    "client-007",
    "孙明远",
    73,
    "participating",
    71,
    "训练计划 2 天后到期",
    "low",
  ],
  ["client-008", "林巧云", 69, "sustaining", 88, null, null],
  ["client-009", "郑文海", 76, "entering", 57, "最近动作幅度持续下降", "high"],
  ["client-010", "高兰芬", 71, "participating", 82, null, null],
  ["client-011", "吴庆山", 74, "sustaining", 93, null, null],
  ["client-012", "黄淑珍", 66, "entering", 79, "首次训练待复核", "low"],
] as const;

export const clients: Client[] = clientSeeds.map(
  ([id, name, age, stage, completion, reason, severity], index) => ({
    id,
    name,
    age,
    stage,
    planId: `plan-${String(index + 1).padStart(3, "0")}`,
    planName: `园艺上肢训练 · 第 ${stage === "entering" ? 1 : stage === "participating" ? 2 : 3} 阶段`,
    planStatus: index === 6 ? "review-due" : "active",
    sevenDayCompletionRate: completion,
    latestSessionAt: `2026-08-${String(30 - (index % 5)).padStart(2, "0")}T09:${String((index * 7) % 60).padStart(2, "0")}:00+08:00`,
    attentionReason: reason,
    attentionSeverity: severity,
    ownerName:
      index % 3 === 0 ? "林医生" : index % 3 === 1 ? "陈治疗师" : "周治疗师",
  }),
);

function createExercises(stageIndex: number) {
  return exerciseCatalog.map((exercise, index) => ({
    exerciseId: exercise.id,
    name: exercise.name,
    enabled: true,
    targetRepetitions: stageIndex + 4 + (index % 2),
    holdSeconds: index === 3 ? 2 : 0,
    feedbackMode: index === 3 ? ("vibration" as const) : ("pneumatic" as const),
  }));
}

export const plans: TrainingPlan[] = clients.map((client, index) => ({
  id: client.planId,
  clientId: client.id,
  name: client.planName,
  status: client.planStatus,
  updatedAt: `2026-08-${String(20 + (index % 9)).padStart(2, "0")}T14:00:00+08:00`,
  exercises: createExercises(
    client.stage === "entering" ? 0 : client.stage === "participating" ? 1 : 2,
  ),
}));

function buildSession(
  id: string,
  client: Client,
  offset: number,
  sensorCompleteness: number,
): TrainingSession {
  const plan = plans.find((item) => item.id === client.planId)!;
  return {
    id,
    clientId: client.id,
    planId: plan.id,
    startedAt: `2026-08-${String(30 - offset).padStart(2, "0")}T09:${String(offset * 7).padStart(2, "0")}:00+08:00`,
    durationMinutes: 18 + (offset % 4),
    status: "completed",
    subjectiveFeedback:
      offset % 3 === 0
        ? "训练节奏基本合适，修剪动作需要再确认。"
        : "今天完成得比较顺畅。",
    sensorCompleteness,
    exercises: plan.exercises.map((exercise, exerciseIndex) => ({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      targetRepetitions: exercise.targetRepetitions,
      completedRepetitions: Math.max(
        1,
        exercise.targetRepetitions - ((offset + exerciseIndex) % 2),
      ),
      rangeCompletion: 0.66 + ((offset + exerciseIndex) % 4) * 0.08,
      feedbackCount: 2 + ((offset + exerciseIndex) % 4),
      sensorQuality:
        sensorCompleteness < 0.8
          ? ("low" as const)
          : sensorCompleteness < 0.9
            ? ("fair" as const)
            : ("good" as const),
    })),
  };
}

export const sessions: TrainingSession[] = [
  {
    ...buildSession("session-004", clients[0]!, 1, 0.72),
    subjectiveFeedback: "系统说完成了，但我觉得修剪时手臂抬得不够高。",
    exercises: plans[0]!.exercises.map((exercise, index) => ({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      targetRepetitions: exercise.targetRepetitions,
      completedRepetitions: exercise.targetRepetitions,
      rangeCompletion: index === 3 ? 0.64 : 0.82,
      feedbackCount: index === 3 ? 7 : 2,
      sensorQuality: index === 3 ? ("low" as const) : ("fair" as const),
    })),
  },
  ...clients.flatMap((client, index) => [
    buildSession(
      `session-${String(index * 2 + 10).padStart(3, "0")}`,
      client,
      index % 5,
      index === 4 ? 0.76 : 0.94,
    ),
    buildSession(
      `session-${String(index * 2 + 11).padStart(3, "0")}`,
      client,
      (index + 2) % 5,
      0.91,
    ),
  ]),
];

export const interventions: InterventionNote[] = [
  {
    id: "note-001",
    clientId: "client-001",
    createdAt: "2026-08-28T14:32:00+08:00",
    authorName: "林医生",
    text: "已提醒下次训练前检查绑带位置，并重点观察修剪动作幅度。",
    source: "therapist",
  },
];

export const attentionItems: AttentionItem[] = [
  {
    id: "attention-001",
    clientId: "client-001",
    clientName: "王桂兰",
    sessionId: "session-004",
    severity: "high",
    reason: "连续 3 天未完成训练",
    evidence: "近 7 日计划 7 次，实际完成 3 次",
    nextAction: "复盘最近训练并确认计划难度",
  },
  {
    id: "attention-002",
    clientId: "client-009",
    clientName: "郑文海",
    sessionId: "session-026",
    severity: "high",
    reason: "最近动作幅度持续下降",
    evidence: "连续 3 次训练的平均幅度由 82% 降至 66%",
    nextAction: "核对训练记录和用户反馈",
  },
  {
    id: "attention-003",
    clientId: "client-005",
    clientName: "陈秀英",
    sessionId: "session-018",
    severity: "medium",
    reason: "传感器数据完整度不足",
    evidence: "最近一次训练完整度为 76%",
    nextAction: "检查佩戴说明并人工复核",
  },
];

export const dashboardData: DashboardData = {
  attentionItems,
  todaySchedule: [
    {
      id: "schedule-001",
      time: "09:30",
      clientName: "李建国",
      task: "首次训练复核",
    },
    {
      id: "schedule-002",
      time: "14:00",
      clientName: "孙明远",
      task: "计划到期评估",
    },
    {
      id: "schedule-003",
      time: "16:30",
      clientName: "王桂兰",
      task: "依从性随访",
    },
  ],
  completionTrend: [
    { date: "8/25", completed: 22, planned: 28 },
    { date: "8/26", completed: 24, planned: 29 },
    { date: "8/27", completed: 21, planned: 28 },
    { date: "8/28", completed: 26, planned: 30 },
    { date: "8/29", completed: 25, planned: 29 },
    { date: "8/30", completed: 23, planned: 28 },
    { date: "8/31", completed: 18, planned: 27 },
  ],
  activity: [
    {
      id: "activity-001",
      occurredAt: "10:18",
      text: "周治疗师确认了周玉梅的训练记录",
    },
    {
      id: "activity-002",
      occurredAt: "09:42",
      text: "陈治疗师更新了李建国的训练计划",
    },
    {
      id: "activity-003",
      occurredAt: "08:55",
      text: "系统标记了王桂兰的依从性变化",
    },
  ],
};

// ---- 平台完善 v1：全局列表与数据看板聚合（由 handlers 调用）----

const qualityRank = { good: 0, fair: 1, low: 2 } as const;

function findClient(clientId: string) {
  const client = clients.find((item) => item.id === clientId);
  if (!client) throw new Error(`未知康复对象: ${clientId}`);
  return client;
}

export function buildSessionList(): SessionListItem[] {
  return sessions
    .map((session) => {
      const client = findClient(session.clientId);
      const target = session.exercises.reduce(
        (sum, item) => sum + item.targetRepetitions,
        0,
      );
      const completed = session.exercises.reduce(
        (sum, item) => sum + item.completedRepetitions,
        0,
      );
      const worstQuality = session.exercises.reduce<SensorQuality>(
        (worst, item) =>
          qualityRank[item.sensorQuality] > qualityRank[worst]
            ? item.sensorQuality
            : worst,
        "good",
      );
      return {
        id: session.id,
        clientId: session.clientId,
        clientName: client.name,
        planName: client.planName,
        startedAt: session.startedAt,
        durationMinutes: session.durationMinutes,
        status: session.status,
        completionRate:
          target === 0 ? 0 : Math.round((completed / target) * 100),
        sensorCompleteness: Math.round(session.sensorCompleteness * 100),
        worstQuality,
      };
    })
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export function buildPlanList(): PlanListItem[] {
  return plans
    .map((plan) => {
      const client = findClient(plan.clientId);
      return {
        id: plan.id,
        clientId: plan.clientId,
        clientName: client.name,
        name: plan.name,
        stage: client.stage,
        status: plan.status,
        sevenDayCompletionRate: client.sevenDayCompletionRate,
        updatedAt: plan.updatedAt,
        exerciseCount: plan.exercises.length,
        latestSessionAt: client.latestSessionAt,
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function buildAnalytics(): AnalyticsData {
  const clientsTotal = clients.length;
  const completionValues = clients.map(
    (item) => item.sevenDayCompletionRate,
  );
  const averageCompletion = Math.round(
    completionValues.reduce((sum, value) => sum + value, 0) / clientsTotal,
  );
  const trend = dashboardData.completionTrend;
  const trendDelta =
    trend.length > 1
      ? trend[trend.length - 1]!.completed - trend[trend.length - 2]!.completed
      : 0;
  const averageDuration = Math.round(
    sessions.reduce((sum, item) => sum + item.durationMinutes, 0) /
      sessions.length,
  );
  const severityOrder: AttentionItem["severity"][] = ["high", "medium", "low"];
  const stageOrder: Client["stage"][] = [
    "entering",
    "participating",
    "sustaining",
  ];
  const exerciseMap = new Map<
    string,
    { name: string; rangeSum: number; feedbackSum: number; count: number }
  >();
  for (const session of sessions) {
    for (const exercise of session.exercises) {
      const entry = exerciseMap.get(exercise.exerciseId) ?? {
        name: exercise.name,
        rangeSum: 0,
        feedbackSum: 0,
        count: 0,
      };
      entry.rangeSum += exercise.rangeCompletion;
      entry.feedbackSum += exercise.feedbackCount;
      entry.count += 1;
      exerciseMap.set(exercise.exerciseId, entry);
    }
  }
  const ownerMap = new Map<string, { sum: number; count: number }>();
  for (const client of clients) {
    const entry = ownerMap.get(client.ownerName) ?? { sum: 0, count: 0 };
    entry.sum += client.sevenDayCompletionRate;
    entry.count += 1;
    ownerMap.set(client.ownerName, entry);
  }
  return {
    summary: {
      activeClients: clients.filter((item) => item.planStatus !== "paused")
        .length,
      needsAttention: clients.filter((item) => item.attentionReason).length,
      weeklyCompletionRate: averageCompletion,
      weeklyTrendDelta: trendDelta,
      avgDurationMinutes: averageDuration,
    },
    riskDistribution: severityOrder.map((severity) => ({
      severity,
      count: clients.filter((item) => item.attentionSeverity === severity)
        .length,
    })),
    stageDistribution: stageOrder.map((stage) => ({
      stage,
      count: clients.filter((item) => item.stage === stage).length,
    })),
    weeklyTrend: trend,
    exerciseCoverage: [...exerciseMap.entries()].map(
      ([exerciseId, entry]) => ({
        exerciseId,
        name: entry.name,
        avgRangeCompletion: Math.round(
          (entry.rangeSum / entry.count) * 100,
        ),
        avgFeedbackPerSession:
          Math.round((entry.feedbackSum / entry.count) * 10) / 10,
      }),
    ),
    completionByOwner: [...ownerMap.entries()].map(
      ([ownerName, entry]) => ({
        ownerName,
        clientCount: entry.count,
        avgCompletionRate: Math.round(entry.sum / entry.count),
      }),
    ),
  };
}

// ---- 平台完善 v2：通知中心与全局搜索 ----

export const notificationsSeed: AppNotification[] = [
  {
    id: "ntf-001",
    kind: "decision",
    title: "AI 建议待你确认",
    detail: "郑文海连续 3 次动作幅度下降，建议核对会话证据后调整计划。",
    occurredAt: "09:10",
    read: false,
    target: { to: "/sessions/session-026", label: "查看会话证据" },
  },
  {
    id: "ntf-002",
    kind: "plan",
    title: "计划即将到期",
    detail: "孙明远的训练计划 2 天后到期，完成率 71%，建议安排评估。",
    occurredAt: "08:40",
    read: false,
    target: { to: "/clients/client-007", label: "查看对象档案" },
  },
  {
    id: "ntf-003",
    kind: "adherence",
    title: "依从性变化提醒",
    detail: "王桂兰连续 3 天未完成训练，7 日完成率降至 42%。",
    occurredAt: "08:12",
    read: false,
    target: { to: "/clients/client-001", label: "查看对象档案" },
  },
  {
    id: "ntf-004",
    kind: "sensor",
    title: "传感器数据质量提示",
    detail: "陈秀英最近一次训练完整度 76%，疑似佩戴位置问题。",
    occurredAt: "昨天 17:26",
    read: false,
    target: { to: "/sessions/session-018", label: "查看会话记录" },
  },
  {
    id: "ntf-005",
    kind: "system",
    title: "训练记录已确认",
    detail: "周治疗师确认了周玉梅 08-30 的训练记录。",
    occurredAt: "昨天 10:18",
    read: true,
    target: { to: "/sessions/session-028", label: "查看记录" },
  },
];

export function buildSearchResults(query: string): SearchResults {
  const q = query.trim();
  if (!q) return { clients: [], plans: [], sessions: [] };
  const matches = (value: string) => value.includes(q);
  const planItems = buildPlanList();
  const sessionItems = buildSessionList();
  const matchedClients = clients
    .filter((client) => matches(client.name) || matches(client.planName))
    .map((client) => ({
      id: client.id,
      name: client.name,
      detail: `${client.age} 岁 · ${client.planName}`,
      to: `/clients/${client.id}`,
    }));
  const matchedPlans = planItems
    .filter((plan) => matches(plan.clientName) || matches(plan.name))
    .map((plan) => ({
      id: plan.id,
      name: plan.name,
      detail: `${plan.clientName} · ${plan.sevenDayCompletionRate}% 完成率`,
      to: `/plans/${plan.id}/edit`,
    }));
  const matchedSessions = sessionItems
    .filter(
      (session) =>
        matches(session.clientName) || matches(session.planName),
    )
    .map((session) => ({
      id: session.id,
      name: session.clientName,
      detail: `${session.startedAt.slice(5, 10).replace("-", "/")} · ${
        session.planName
      }`,
      to: `/sessions/${session.id}`,
    }));
  return {
    clients: matchedClients.slice(0, 4),
    plans: matchedPlans.slice(0, 4),
    sessions: matchedSessions.slice(0, 4),
  };
}
