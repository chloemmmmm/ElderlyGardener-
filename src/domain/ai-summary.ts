import type { AiSummary, TrainingSession } from "./models";

export function generateAiSummary(_session: TrainingSession): AiSummary {
  const session = _session;
  const completed = session.exercises.reduce(
    (total, exercise) => total + exercise.completedRepetitions,
    0,
  );
  const targets = session.exercises.reduce(
    (total, exercise) => total + exercise.targetRepetitions,
    0,
  );
  const feedbackCount = session.exercises.reduce(
    (total, exercise) => total + exercise.feedbackCount,
    0,
  );

  const facts: AiSummary["facts"] = [
    {
      id: "completion",
      label: "动作完成",
      value: `${completed}/${targets} 次`,
      detail: "汇总本次训练各动作的系统完成计数。",
      source: "session-completion",
    },
    {
      id: "sensor-quality",
      label: "传感器数据完整度",
      value: `${Math.round(session.sensorCompleteness * 100)}%`,
      detail: "完整度较低时，系统判定只能作为复核线索。",
      source: "sensor-quality",
    },
    {
      id: "feedback-frequency",
      label: "系统反馈次数",
      value: `${feedbackCount} 次`,
      detail: "反馈次数用于判断提示是否可能打断训练节奏。",
      source: "feedback-frequency",
    },
    {
      id: "subjective-feedback",
      label: "用户自述",
      value: "已记录",
      detail: session.subjectiveFeedback,
      source: "subjective-feedback",
    },
  ];

  const suggestions: AiSummary["suggestions"] = [];
  if (session.sensorCompleteness < 0.8) {
    suggestions.push({
      id: "check-sensors",
      text: "下次训练前核对佩戴位置，并结合动作表现人工复核本次记录。",
      rationale: `本次传感器数据完整度为 ${Math.round(session.sensorCompleteness * 100)}%。`,
      requiresConfirmation: true,
    });
  }
  if (feedbackCount > targets) {
    suggestions.push({
      id: "review-feedback",
      text: "复核提示触发条件，避免反馈过于频繁地打断训练节奏。",
      rationale: `系统反馈 ${feedbackCount} 次，高于目标动作总次数 ${targets} 次。`,
      requiresConfirmation: true,
    });
  }

  const uncertainty: string[] = [];
  if (session.sensorCompleteness < 0.8) {
    uncertainty.push("数据质量不足，动作幅度判断需要人工复核");
  }
  const completedTargets = session.exercises.every(
    (exercise) => exercise.completedRepetitions >= exercise.targetRepetitions,
  );
  const feedbackQuestionsCompletion = /不够|不确定|没做到|但/.test(
    session.subjectiveFeedback,
  );
  if (completedTargets && feedbackQuestionsCompletion) {
    uncertainty.push("主观反馈与系统完成判定不一致");
  }

  return {
    facts,
    suggestions,
    uncertainty: uncertainty.length > 0 ? uncertainty.join("；") : null,
  };
}
