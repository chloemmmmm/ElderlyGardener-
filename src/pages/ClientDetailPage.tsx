import * as Tabs from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  StatusTag,
  useDemoNotice,
} from "../components/ui";
import { rehabilitationApi } from "../services/rehabilitation";

const dateTime = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function ClientDetailPage() {
  const { clientId = "" } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const followUp = useDemoNotice(
    "随访记录写入需接入语音转写与结构化模板，暂未在演示版开放；可在下方查看已留痕的干预记录。",
  );
  const detail = useQuery({
    queryKey: ["client", clientId],
    queryFn: ({ signal }) => rehabilitationApi.getClient(clientId, signal),
  });
  if (detail.isLoading) return <LoadingState label="正在整理对象档案…" />;
  if (!detail.data) return <ErrorState onRetry={() => void detail.refetch()} />;
  const { client, plan, sessions, interventions } = detail.data;
  return (
    <>
      <div className="breadcrumb">
        <Link to="/clients">康复对象</Link>
        <span>/</span>
        <span>{client.name}</span>
      </div>
      <PageHeader
        eyebrow="Client profile"
        title={client.name}
        description={`${client.age} 岁 · 负责人 ${client.ownerName} · 最近训练 ${client.latestSessionAt ? dateTime.format(new Date(client.latestSessionAt)) : "暂无"}`}
        actions={
          <>
            <Link
              className="secondary-button link-button"
              to={`/plans/${plan.id}/edit`}
            >
              编辑训练计划
            </Link>
            <button
              className="primary-button"
              type="button"
              onClick={followUp.show}
            >
              记录随访
            </button>
          </>
        }
      />
      {followUp.notice}
      <div className="profile-summary-strip">
        <div>
          <span>训练阶段</span>
          <StatusTag value={client.stage} />
        </div>
        <div>
          <span>7 日完成率</span>
          <strong className="data-value">
            {client.sevenDayCompletionRate}%
          </strong>
        </div>
        <div>
          <span>当前计划</span>
          <strong>{client.planName}</strong>
        </div>
        <div>
          <span>关注状态</span>
          {client.attentionSeverity ? (
            <StatusTag value={client.attentionSeverity} />
          ) : (
            <span className="muted-ok">状态稳定</span>
          )}
        </div>
      </div>
      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="detail-tabs"
      >
        <Tabs.List aria-label="档案内容" className="tab-list">
          <Tabs.Trigger value="overview">概览</Tabs.Trigger>
          <Tabs.Trigger value="sessions">
            训练记录 <span>{sessions.length}</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="notes">
            干预记录 <span>{interventions.length}</span>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview" className="tab-content">
          <div className="two-column-detail">
            <div className="detail-stack">
              {client.attentionReason && (
                <aside className="attention-banner">
                  <div>
                    <StatusTag value={client.attentionSeverity!} />
                    <strong>{client.attentionReason}</strong>
                    <p>
                      这是系统识别的复核线索，不代表临床结论。建议结合训练记录和主观反馈判断。
                    </p>
                  </div>
                  <Link to={sessions[0] ? `/sessions/${sessions[0].id}` : "#"}>
                    查看证据 →
                  </Link>
                </aside>
              )}
              <Panel
                title="当前训练计划"
                subtitle={`更新于 ${dateTime.format(new Date(plan.updatedAt))}`}
                action={<StatusTag value={plan.status} />}
              >
                <div className="exercise-preview">
                  {plan.exercises.map((exercise, index) => (
                    <div
                      className="exercise-preview-row"
                      key={exercise.exerciseId}
                    >
                      <span className="exercise-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <strong>{exercise.name}</strong>
                        <span>
                          {exercise.targetRepetitions} 次
                          {exercise.holdSeconds > 0
                            ? ` · 保持 ${exercise.holdSeconds} 秒`
                            : ""}
                        </span>
                      </div>
                      <span className="feedback-label">
                        {exercise.feedbackMode === "vibration"
                          ? "震动反馈"
                          : "气动反馈"}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
            <div className="detail-stack">
              <Panel
                title="近期训练"
                subtitle="最近 3 条记录"
                action={
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => setActiveTab("sessions")}
                  >
                    查看全部 →
                  </button>
                }
              >
                <div className="recent-sessions">
                  {sessions.slice(0, 3).map((session) => (
                    <Link key={session.id} to={`/sessions/${session.id}`}>
                      <time>
                        {dateTime.format(new Date(session.startedAt))}
                      </time>
                      <div>
                        <strong>
                          {session.durationMinutes} 分钟 ·{" "}
                          {session.status === "completed" ? "已完成" : "已中断"}
                        </strong>
                        <span>
                          数据完整度{" "}
                          {Math.round(session.sensorCompleteness * 100)}%
                        </span>
                      </div>
                      <span>›</span>
                    </Link>
                  ))}
                </div>
              </Panel>
              <Panel title="干预记录" subtitle="人工确认内容优先">
                <div className="note-list">
                  {interventions.length ? (
                    interventions.map((note) => (
                      <article key={note.id}>
                        <div>
                          <span className="avatar small-avatar">
                            {note.authorName.slice(0, 1)}
                          </span>
                          <strong>{note.authorName}</strong>
                          <time>
                            {dateTime.format(new Date(note.createdAt))}
                          </time>
                        </div>
                        <p>{note.text}</p>
                      </article>
                    ))
                  ) : (
                    <p className="empty-copy">暂无干预记录。</p>
                  )}
                </div>
              </Panel>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content value="sessions" className="tab-content">
          <Panel title="全部训练记录" subtitle="按时间倒序">
            <div className="session-table-list">
              {sessions.map((session) => (
                <Link key={session.id} to={`/sessions/${session.id}`}>
                  <time>{dateTime.format(new Date(session.startedAt))}</time>
                  <strong>{session.durationMinutes} 分钟</strong>
                  <span>{session.exercises.length} 个动作</span>
                  <span>
                    完整度 {Math.round(session.sensorCompleteness * 100)}%
                  </span>
                  <span>查看详情 →</span>
                </Link>
              ))}
            </div>
          </Panel>
        </Tabs.Content>
        <Tabs.Content value="notes" className="tab-content">
          <Panel title="干预记录" subtitle="由康复师确认并留痕">
            <div className="note-list expanded-notes">
              {interventions.map((note) => (
                <article key={note.id}>
                  <div>
                    <span className="avatar small-avatar">
                      {note.authorName.slice(0, 1)}
                    </span>
                    <strong>{note.authorName}</strong>
                    <time>{dateTime.format(new Date(note.createdAt))}</time>
                  </div>
                  <p>{note.text}</p>
                </article>
              ))}
            </div>
          </Panel>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
