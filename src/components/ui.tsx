import { useState, type ReactNode } from "react";

import type {
  AttentionSeverity,
  PlanStatus,
  TrainingStage,
} from "../domain/models";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

const labels = {
  high: "高优先",
  medium: "需关注",
  low: "待跟进",
  active: "执行中",
  "review-due": "待评估",
  paused: "已暂停",
  entering: "进入期",
  participating: "参与期",
  sustaining: "维持期",
} as const;

export function StatusTag({
  value,
}: {
  value: AttentionSeverity | PlanStatus | TrainingStage;
}) {
  return <span className={`status-tag status-${value}`}>{labels[value]}</span>;
}

export function Panel({
  title,
  subtitle,
  action,
  className = "",
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <header className="panel-header">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function LoadingState({ label = "正在整理数据…" }: { label?: string }) {
  return (
    <div className="state-box" role="status">
      <span className="loader" aria-hidden="true" />
      <strong>{label}</strong>
      <span>请稍候，演示数据正在同步。</span>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="state-box error-state" role="alert">
      <span className="state-symbol" aria-hidden="true">
        !
      </span>
      <strong>数据暂时未能载入</strong>
      <span>请检查连接后重试，已保存内容不会受到影响。</span>
      {onRetry && (
        <button className="secondary-button" type="button" onClick={onRetry}>
          重新载入
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "没有匹配结果",
  detail = "试试调整筛选条件或搜索关键词。",
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div className="state-box">
      <span className="state-symbol leaf-symbol" aria-hidden="true">
        ⌁
      </span>
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}

/**
 * 演示版中暂未开放的功能，点击后给出与「新增康复对象」一致的解释提示，
 * 而不是无响应的假按钮。
 */
export function useDemoNotice(message: string) {
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const notice = visible ? (
    <div className="demo-notice" role="status">
      <span aria-hidden="true">✳</span>
      <p>{message}</p>
      <button
        className="demo-notice__close"
        type="button"
        aria-label="关闭提示"
        onClick={() => setVisible(false)}
      >
        ×
      </button>
    </div>
  ) : null;
  return { notice, show };
}
