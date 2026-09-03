import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ErrorState,
  LoadingState,
  PageHeader,
  StatusTag,
} from "../components/ui";
import { diffTrainingPlan } from "../domain/plan-diff";
import type { ExercisePlan, TrainingPlan } from "../domain/models";
import { rehabilitationApi } from "../services/rehabilitation";

const feedbackLabels = {
  vibration: "震动反馈",
  pneumatic: "气动反馈",
  visual: "视觉反馈",
  none: "无反馈",
};
const fieldLabels = {
  enabled: "启用状态",
  targetRepetitions: "目标次数",
  holdSeconds: "保持秒数",
  feedbackMode: "反馈方式",
};

export function PlanEditorPage() {
  const { planId = "" } = useParams();
  const queryClient = useQueryClient();
  const planQuery = useQuery({
    queryKey: ["plan", planId],
    queryFn: ({ signal }) => rehabilitationApi.getPlan(planId, signal),
  });
  const [draft, setDraft] = useState<TrainingPlan | null>(null);
  const [saved, setSaved] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  useEffect(() => {
    if (planQuery.data && !draft) setDraft(structuredClone(planQuery.data));
  }, [planQuery.data, draft]);
  const changes = useMemo(
    () =>
      planQuery.data && draft ? diffTrainingPlan(planQuery.data, draft) : [],
    [planQuery.data, draft],
  );
  const changedExerciseIds = useMemo(
    () => new Set(changes.map((change) => change.exerciseId)),
    [changes],
  );
  const savePlan = useMutation({
    mutationFn: () =>
      rehabilitationApi.updatePlan(
        planId,
        { exercises: draft!.exercises },
        simulateError ? { scenario: "save-error" } : undefined,
      ),
    onSuccess: (updated) => {
      queryClient.setQueryData(["plan", planId], updated);
      setDraft(structuredClone(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });
  if (planQuery.isLoading || !draft)
    return <LoadingState label="正在打开训练计划…" />;
  if (!planQuery.data)
    return <ErrorState onRetry={() => void planQuery.refetch()} />;
  const updateExercise = (id: string, patch: Partial<ExercisePlan>) => {
    setSaved(false);
    setDraft((current) =>
      current
        ? {
            ...current,
            exercises: current.exercises.map((item) =>
              item.exerciseId === id ? { ...item, ...patch } : item,
            ),
          }
        : current,
    );
  };
  return (
    <>
      <div className="breadcrumb">
        <Link to={`/clients/${draft.clientId}`}>对象档案</Link>
        <span>/</span>
        <span>编辑训练计划</span>
      </div>
      <PageHeader
        eyebrow="Plan editor"
        title="编辑训练计划"
        description="调整动作目标与反馈方式。保存前会展示变更摘要，所有修改均需康复师确认。"
        actions={<StatusTag value={draft.status} />}
      />
      <div className="editor-layout">
        <div className="plan-canvas">
          <header className="plan-title-row">
            <div>
              <span>计划名称</span>
              <input value={draft.name} readOnly aria-label="计划名称" />
            </div>
            <div className="plan-meta">
              <span>适用对象</span>
              <Link to={`/clients/${draft.clientId}`}>王桂兰 →</Link>
            </div>
          </header>
          <section className="plan-section">
            <header>
              <div>
                <span className="step-number">01</span>
                <div>
                  <h2>动作与目标</h2>
                  <p>按训练顺序配置完成次数和保持时间。</p>
                </div>
              </div>
              <span>
                {draft.exercises.filter((item) => item.enabled).length} 个已启用
              </span>
            </header>
            <div className="exercise-editor-list">
              {draft.exercises.map((exercise, index) => (
                <article
                  key={exercise.exerciseId}
                  className={[
                    exercise.enabled ? "" : "disabled-exercise",
                    changedExerciseIds.has(exercise.exerciseId)
                      ? "has-field-change"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div
                    className="drag-handle"
                    aria-hidden="true"
                    title="动作按训练顺序固定，排序调整将在完整版中支持"
                  >
                    ⠿
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={exercise.enabled}
                      onChange={(event) =>
                        updateExercise(exercise.exerciseId, {
                          enabled: event.target.checked,
                        })
                      }
                    />
                    <span />
                  </label>
                  <div className="exercise-title">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{exercise.name}</strong>
                  </div>
                  <label>
                    目标次数
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={exercise.targetRepetitions}
                      onChange={(event) =>
                        updateExercise(exercise.exerciseId, {
                          targetRepetitions: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    保持秒数
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={exercise.holdSeconds}
                      onChange={(event) =>
                        updateExercise(exercise.exerciseId, {
                          holdSeconds: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <label>
                    反馈方式
                    <select
                      value={exercise.feedbackMode}
                      onChange={(event) =>
                        updateExercise(exercise.exerciseId, {
                          feedbackMode: event.target
                            .value as ExercisePlan["feedbackMode"],
                        })
                      }
                    >
                      <option value="pneumatic">气动反馈</option>
                      <option value="vibration">震动反馈</option>
                      <option value="visual">视觉反馈</option>
                      <option value="none">无反馈</option>
                    </select>
                  </label>
                </article>
              ))}
            </div>
          </section>
          <section className="plan-section feedback-section">
            <header>
              <div>
                <span className="step-number">02</span>
                <div>
                  <h2>反馈原则</h2>
                  <p>产品采用低打扰反馈，避免把设备提示理解为康复结论。</p>
                </div>
              </div>
            </header>
            <div className="principle-grid">
              <article>
                <strong>动作中</strong>
                <p>仅在达到触发阈值时给出简短反馈。</p>
              </article>
              <article>
                <strong>动作后</strong>
                <p>总结完成状态，保留主观感受入口。</p>
              </article>
              <article>
                <strong>异常时</strong>
                <p>标记为待复核，不自动下调训练难度。</p>
              </article>
            </div>
          </section>
        </div>
        <aside className="change-sidebar">
          <section>
            <header>
              <span>变更摘要</span>
              <strong>{changes.length} 项修改</strong>
            </header>
            {changes.length > 0 && (
              <div className="change-overview">
                <span aria-hidden="true">●</span>
                <span>
                  变更概览：{changedExerciseIds.size} 个动作，共{" "}
                  {changes.length} 项参数已修改
                </span>
              </div>
            )}
            {changes.length ? (
              <div className="change-list">
                {changes.map((change, index) => (
                  <article key={`${change.exerciseId}-${change.field}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>
                        {change.exerciseName} · {fieldLabels[change.field]}
                      </strong>
                      <p>
                        <del>{String(change.before)}</del>
                        <i>→</i>
                        <ins>
                          {change.field === "feedbackMode"
                            ? feedbackLabels[
                                change.after as keyof typeof feedbackLabels
                              ]
                            : String(change.after)}
                        </ins>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-changes">
                <span>✓</span>
                <strong>尚未修改</strong>
                <p>调整动作参数后，变更会在这里逐项列出。</p>
              </div>
            )}
          </section>
          <aside className="safety-note">
            <strong>安全确认</strong>
            <p>
              完整上线需接入机构权限、处方审核和设备校准流程，当前版本未包含。
            </p>
          </aside>
          <label className="demo-error-toggle">
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
            />{" "}
            触发保存失败状态
          </label>
        </aside>
      </div>
      <div className="editor-savebar">
        <div>
          {savePlan.isError ? (
            <span className="save-error" role="alert">
              保存失败，请稍后重试；当前修改仍保留在页面中。
            </span>
          ) : saved ? (
            <span className="save-success" role="status">
              ✓ 计划已保存并留下变更记录
            </span>
          ) : (
            <span>上次保存：2026-08-28 14:00</span>
          )}
        </div>
        <div>
          {changes.length > 0 ? (
            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <button className="secondary-button" type="button">
                  取消
                </button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="dialog-overlay" />
                <AlertDialog.Content className="dialog-content">
                  <AlertDialog.Title>放弃未保存的修改？</AlertDialog.Title>
                  <AlertDialog.Description>
                    当前有 {changes.length}{" "}
                    项修改尚未保存，返回对象档案后将丢失这些改动。
                  </AlertDialog.Description>
                  <div className="dialog-actions">
                    <AlertDialog.Cancel asChild>
                      <button className="secondary-button">继续编辑</button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <Link
                        className="primary-button link-button"
                        to={`/clients/${draft.clientId}`}
                      >
                        放弃修改
                      </Link>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          ) : (
            <Link
              className="secondary-button link-button"
              to={`/clients/${draft.clientId}`}
            >
              取消
            </Link>
          )}
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                className="primary-button"
                type="button"
                disabled={changes.length === 0 || savePlan.isPending}
              >
                {savePlan.isPending
                  ? "正在保存…"
                  : `保存 ${changes.length} 项变更`}
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="dialog-overlay" />
              <AlertDialog.Content className="dialog-content">
                <span className="dialog-icon" aria-hidden="true">
                  ✓
                </span>
                <AlertDialog.Title>确认更新训练计划？</AlertDialog.Title>
                <AlertDialog.Description>
                  本次将保存 {changes.length}{" "}
                  项修改。系统不会自动通知康复对象；请在保存后按机构流程完成沟通。
                </AlertDialog.Description>
                <div className="dialog-actions">
                  <AlertDialog.Cancel asChild>
                    <button
                      className="secondary-button"
                      onClick={() => savePlan.reset()}
                    >
                      返回检查
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      className="primary-button"
                      onClick={() => savePlan.mutate()}
                    >
                      确认保存
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </div>
    </>
  );
}
