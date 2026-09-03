import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  useDemoNotice,
} from "../components/ui";
import { generateAiSummary } from "../domain/ai-summary";
import { rehabilitationApi } from "../services/rehabilitation";

const dateTime = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function SessionDetailPage() {
  const { sessionId = "" } = useParams();
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const download = useDemoNotice(
    "训练记录导出（CSV / PDF）暂未在演示版开放；本页展示的数据即为完整演示样本。",
  );
  const sessionQuery = useQuery({
    queryKey: ["session", sessionId],
    queryFn: ({ signal }) => rehabilitationApi.getSession(sessionId, signal),
  });
  const clientQuery = useQuery({
    queryKey: ["client", sessionQuery.data?.clientId],
    enabled: Boolean(sessionQuery.data?.clientId),
    queryFn: ({ signal }) =>
      rehabilitationApi.getClient(sessionQuery.data!.clientId, signal),
  });
  const summary = useMemo(
    () => (sessionQuery.data ? generateAiSummary(sessionQuery.data) : null),
    [sessionQuery.data],
  );
  if (sessionQuery.isLoading) return <LoadingState label="正在复盘训练记录…" />;
  if (!sessionQuery.data || !summary)
    return <ErrorState onRetry={() => void sessionQuery.refetch()} />;
  const session = sessionQuery.data;
  const client = clientQuery.data?.client;
  return (
    <>
      <div className="breadcrumb">
        <Link to="/clients">康复对象</Link>
        <span>/</span>
        {client ? (
          <Link to={`/clients/${client.id}`}>{client.name}</Link>
        ) : (
          <span>对象档案</span>
        )}
        <span>/</span>
        <span>训练记录</span>
      </div>
      <PageHeader
        eyebrow="Session evidence"
        title="训练记录复盘"
        description={`${client?.name ?? "康复对象"} · ${dateTime.format(new Date(session.startedAt))} · ${session.durationMinutes} 分钟`}
        actions={
          <>
            <button
              className="secondary-button"
              type="button"
              onClick={download.show}
            >
              下载记录
            </button>
            <Link
              className="primary-button link-button"
              to={`/plans/${session.planId}/edit`}
            >
              调整训练计划
            </Link>
          </>
        }
      />
      {download.notice}
      <aside className="context-hint" role="note">
        <span aria-hidden="true">◎</span>
        <div>
          <strong>
            当前对象：{client?.name ?? "康复对象"} · 阶段：
            {client?.stage === "entering"
              ? "进入期"
              : client?.stage === "participating"
                ? "参与期"
                : "维持期"}
          </strong>
          <p>
            最近反馈：{session.subjectiveFeedback}
            {client?.attentionReason
              ? `；系统关注：${client.attentionReason}`
              : ""}
          </p>
        </div>
      </aside>
      {summary.uncertainty && (
        <aside className="uncertainty-banner" role="note">
          <span aria-hidden="true">!</span>
          <div>
            <strong>本次记录存在不确定性</strong>
            <p>
              {summary.uncertainty}
              。以下信息用于支持人工复核，不能单独作为判断依据。
            </p>
          </div>
        </aside>
      )}
      <div className="session-layout">
        <div className="session-main">
          <Panel
            title="系统事实"
            subtitle="来自设备数据与本次记录，不含 AI 推断"
          >
            <div className="fact-grid">
              {summary.facts.map((fact) => (
                <article key={fact.id}>
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                  <p>{fact.detail}</p>
                </article>
              ))}
            </div>
          </Panel>
          <Panel title="动作表现" subtitle="目标、完成与系统反馈的并列证据">
            <div className="exercise-results">
              <div className="result-header">
                <span>训练动作</span>
                <span>完成次数</span>
                <span>动作幅度</span>
                <span>系统反馈</span>
                <span>数据质量</span>
              </div>
              {session.exercises.map((exercise) => (
                <div className="result-row" key={exercise.exerciseId}>
                  <strong>{exercise.name}</strong>
                  <span className="data-value small-data">
                    {exercise.completedRepetitions}/{exercise.targetRepetitions}
                  </span>
                  <div className="range-cell">
                    <span>{Math.round(exercise.rangeCompletion * 100)}%</span>
                    <div>
                      <i
                        style={{ width: `${exercise.rangeCompletion * 100}%` }}
                      />
                    </div>
                  </div>
                  <span>{exercise.feedbackCount} 次</span>
                  <span className={`quality quality-${exercise.sensorQuality}`}>
                    {exercise.sensorQuality === "good"
                      ? "良好"
                      : exercise.sensorQuality === "fair"
                        ? "一般"
                        : "不足"}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="用户主观反馈" subtitle="原始记录，不由 AI 改写">
            <blockquote className="subjective-quote">
              “{session.subjectiveFeedback}”
            </blockquote>
          </Panel>
        </div>
        <aside className="session-side">
          <section className="ai-summary-panel">
            <header>
              <span className="ai-orbit" aria-hidden="true">
                ✦
              </span>
              <div>
                <span>AI 辅助摘要</span>
                <strong>建议需人工确认</strong>
              </div>
            </header>
            <div className="ai-boundary">
              <strong>能力边界</strong>
              <span>根据本次记录整理线索；不诊断、不自动修改计划。</span>
            </div>
            <div className="suggestion-list">
              {summary.suggestions.length ? (
                summary.suggestions.map((item) => (
                  <article
                    key={item.id}
                    className={confirmed.includes(item.id) ? "confirmed" : ""}
                  >
                    <span>建议</span>
                    <p>{item.text}</p>
                    <small>依据：{item.rationale}</small>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmed((current) =>
                          current.includes(item.id)
                            ? current
                            : [...current, item.id],
                        )
                      }
                    >
                      {confirmed.includes(item.id)
                        ? "✓ 已确认并记录"
                        : "确认采用"}
                    </button>
                  </article>
                ))
              ) : (
                <p className="empty-copy">本次未生成需要确认的调整建议。</p>
              )}
            </div>
            <footer>
              <span>生成依据</span>
              <p>动作完成计数、传感器完整度、反馈频次与用户自述。</p>
            </footer>
          </section>
        </aside>
      </div>
    </>
  );
}
