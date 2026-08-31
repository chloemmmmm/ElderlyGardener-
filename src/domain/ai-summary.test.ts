import { describe, expect, it } from "vitest";

import { generateAiSummary } from "./ai-summary";
import type { TrainingSession } from "./models";

const lowQualitySession: TrainingSession = {
  id: "session-004",
  clientId: "client-001",
  planId: "plan-001",
  startedAt: "2026-08-30T09:10:00+08:00",
  durationMinutes: 18,
  status: "completed",
  subjectiveFeedback: "系统说完成了，但我觉得修剪时手臂抬得不够高。",
  sensorCompleteness: 0.72,
  exercises: [
    {
      exerciseId: "prune",
      name: "修剪树枝",
      targetRepetitions: 5,
      completedRepetitions: 5,
      rangeCompletion: 0.64,
      feedbackCount: 7,
      sensorQuality: "low",
    },
  ],
};

describe("generateAiSummary", () => {
  it("separates observed facts from therapist suggestions", () => {
    const result = generateAiSummary(lowQualitySession);

    expect(result.facts).toContainEqual(
      expect.objectContaining({ source: "sensor-quality", value: "72%" }),
    );
    expect(result.suggestions[0]?.requiresConfirmation).toBe(true);
    expect(result.uncertainty).toMatch(/数据质量/);
  });

  it("calls out conflict between system completion and subjective feedback", () => {
    const result = generateAiSummary(lowQualitySession);

    expect(result.facts).toContainEqual(
      expect.objectContaining({ source: "subjective-feedback" }),
    );
    expect(result.uncertainty).toMatch(/主观反馈与系统完成判定不一致/);
  });
});
