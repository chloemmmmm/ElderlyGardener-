import type { TrainingPlan } from "./models";

export interface PlanChange {
  exerciseId: string;
  exerciseName: string;
  field: "enabled" | "targetRepetitions" | "holdSeconds" | "feedbackMode";
  before: boolean | number | string;
  after: boolean | number | string;
}

export function diffTrainingPlan(
  _before: TrainingPlan,
  _after: TrainingPlan,
): PlanChange[] {
  const before = _before;
  const after = _after;
  const fields: PlanChange["field"][] = [
    "enabled",
    "targetRepetitions",
    "holdSeconds",
    "feedbackMode",
  ];
  const changes: PlanChange[] = [];

  for (const beforeExercise of before.exercises) {
    const afterExercise = after.exercises.find(
      (exercise) => exercise.exerciseId === beforeExercise.exerciseId,
    );
    if (!afterExercise) continue;

    for (const field of fields) {
      if (beforeExercise[field] === afterExercise[field]) continue;
      changes.push({
        exerciseId: beforeExercise.exerciseId,
        exerciseName: beforeExercise.name,
        field,
        before: beforeExercise[field],
        after: afterExercise[field],
      });
    }
  }

  return changes;
}
