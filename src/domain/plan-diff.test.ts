import { describe, expect, it } from "vitest";

import { diffTrainingPlan } from "./plan-diff";
import type { TrainingPlan } from "./models";

const original: TrainingPlan = {
  id: "plan-001",
  clientId: "client-001",
  name: "园艺上肢训练 · 第 2 阶段",
  status: "active",
  updatedAt: "2026-08-28T14:00:00+08:00",
  exercises: [
    {
      exerciseId: "prune",
      name: "修剪树枝",
      enabled: true,
      targetRepetitions: 5,
      holdSeconds: 2,
      feedbackMode: "vibration",
    },
  ],
};

describe("diffTrainingPlan", () => {
  it("describes changed exercise targets without clinical claims", () => {
    const edited: TrainingPlan = {
      ...original,
      exercises: [{ ...original.exercises[0]!, targetRepetitions: 4 }],
    };

    expect(diffTrainingPlan(original, edited)).toContainEqual({
      exerciseId: "prune",
      exerciseName: "修剪树枝",
      field: "targetRepetitions",
      before: 5,
      after: 4,
    });
  });

  it("returns no changes for equal plans", () => {
    expect(diffTrainingPlan(original, structuredClone(original))).toEqual([]);
  });
});
