import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusTag,
} from "../components/ui";
import type { PlanStatus } from "../domain/models";
import { rehabilitationApi } from "../services/rehabilitation";

const statusOptions: Array<{ value: PlanStatus | "all"; label: string }> = [
  { value: "all", label: "全部计划" },
  { value: "active", label: "执行中" },
  { value: "review-due", label: "待评估" },
  { value: "paused", label: "已暂停" },
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function PlansPage() {
  const plans = useQuery({
    queryKey: ["plans"],
    queryFn: ({ signal }) => rehabilitationApi.getPlans(signal),
  });
  const [status, setStatus] = useState<PlanStatus | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [noticeVisible, setNoticeVisible] = useState(false);

  const filtered = useMemo(() => {
    if (!plans.data) return [];
    const query = keyword.trim();
    return plans.data.filter(
      (plan) =>
        (status === "all" || plan.status === status) &&
        (query === "" || plan.clientName.includes(query)),
    );
  }, [plans.data, status, keyword]);

  return (
    <>
      <PageHeader
        eyebrow="Plan library"
        title="训练计划"
        description="以康复对象为中心管理园艺上肢训练计划：阶段、执行状态与最近调整一目了然。计划内容均为演示样例。"
        actions={
          <button
            className="primary-button"
            type="button"
            onClick={() => setNoticeVisible(true)}
          >
            ＋ 新建训练计划
          </button>
        }
      />
      {noticeVisible && (
        <div className="demo-notice" role="status">
          <span aria-hidden="true">✳</span>
          <p>
            演示版聚焦“评估 → 调整 → 复盘”的闭环，
            暂不开放新建流程；可从任一执行中计划进入编辑器体验计划调整能力。
          </p>
          <button
            className="demo-notice__close"
            type="button"
            aria-label="关闭提示"
            onClick={() => setNoticeVisible(false)}
          >
            ×
          </button>
        </div>
      )}
      <div className="filter-bar" aria-label="计划筛选">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            className="filter-control"
            aria-label="搜索康复对象"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索康复对象…"
          />
        </label>
        <select
          className="filter-control"
          aria-label="计划状态"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as PlanStatus | "all")
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {plans.isLoading ? (
        <LoadingState label="正在载入训练计划…" />
      ) : !plans.data ? (
        <ErrorState onRetry={() => void plans.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="没有匹配的训练计划" />
      ) : (
        <div className="plan-grid">
          {filtered.map((plan) => (
            <article className="plan-card" key={plan.id}>
              <header className="plan-card__head">
                <StatusTag value={plan.status} />
                <span className="plan-card__updated">
                  更新于 {formatDate(plan.updatedAt)}
                </span>
              </header>
              <h2 className="plan-card__client">
                <Link
                  className="name-link"
                  to={`/clients/${plan.clientId}`}
                >
                  {plan.clientName}
                </Link>
              </h2>
              <p className="plan-card__name">{plan.name}</p>
              <div className="plan-card__meta">
                <StatusTag value={plan.stage} />
                <span>{plan.exerciseCount} 个园艺动作</span>
              </div>
              <div className="plan-card__progress">
                <div className="plan-card__progress-label">
                  <span>近 7 日完成率</span>
                  <strong>{plan.sevenDayCompletionRate}%</strong>
                </div>
                <div className="mini-progress" aria-hidden="true">
                  <span
                    style={{
                      width: `${plan.sevenDayCompletionRate}%`,
                    }}
                  />
                </div>
              </div>
              <footer className="plan-card__actions">
                <Link
                  className="text-button link-button"
                  to={`/plans/${plan.id}/edit`}
                >
                  查看并调整计划 →
                </Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
