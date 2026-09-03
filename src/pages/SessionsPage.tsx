import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from "../components/ui";
import type { SessionState, SessionListItem } from "../domain/models";
import { rehabilitationApi } from "../services/rehabilitation";

const qualityLabels = { good: "良好", fair: "一般", low: "不足" } as const;

const statusOptions: Array<{ value: SessionState | "all"; label: string }> = [
  { value: "all", label: "全部状态" },
  { value: "completed", label: "已完成" },
  { value: "interrupted", label: "中途中断" },
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function SessionStateBadge({ status }: { status: SessionState }) {
  return (
    <span className={`session-badge is-${status}`} aria-label={status}>
      {status === "completed" ? "已完成" : "中途中断"}
    </span>
  );
}

export function SessionsPage() {
  const sessions = useQuery({
    queryKey: ["sessions"],
    queryFn: ({ signal }) => rehabilitationApi.getSessions(signal),
  });
  const [status, setStatus] = useState<SessionState | "all">("all");
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    if (!sessions.data) return [];
    const query = keyword.trim();
    return sessions.data.filter(
      (session: SessionListItem) =>
        (status === "all" || session.status === status) &&
        (query === "" ||
          session.clientName.includes(query) ||
          session.planName.includes(query)),
    );
  }, [sessions.data, status, keyword]);

  return (
    <>
      <PageHeader
        eyebrow="Session records"
        title="训练记录"
        description="全部会话的完成情况与数据质量一览。记录与数值均为作品集演示样本，用于展示康复师的复盘工作流。"
      />
      <div className="filter-bar" aria-label="记录筛选">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            className="filter-control"
            aria-label="搜索对象或计划"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索对象或计划…"
          />
        </label>
        <select
          className="filter-control"
          aria-label="记录状态"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as SessionState | "all")
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="client-table-wrap">
        {sessions.isLoading ? (
          <LoadingState label="正在载入训练记录…" />
        ) : !sessions.data ? (
          <ErrorState onRetry={() => void sessions.refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState title="没有匹配的训练记录" />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "16%" }}>康复对象</th>
                  <th style={{ width: "14%" }}>开始时间</th>
                  <th style={{ width: "9%" }}>时长</th>
                  <th style={{ width: "16%" }}>完成度</th>
                  <th style={{ width: "18%" }}>传感器数据质量</th>
                  <th style={{ width: "12%" }}>状态</th>
                  <th style={{ width: "12%" }}>复盘</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((session) => (
                  <tr key={session.id}>
                    <td>
                      <Link
                        className="name-link"
                        to={`/clients/${session.clientId}`}
                      >
                        {session.clientName}
                      </Link>
                      <span className="person-meta">{session.planName}</span>
                    </td>
                    <td>
                      <time dateTime={session.startedAt}>
                        {formatDateTime(session.startedAt)}
                      </time>
                    </td>
                    <td>{session.durationMinutes} 分钟</td>
                    <td>
                      <div className="completion-cell">
                        <div className="mini-progress" aria-hidden="true">
                          <span
                            style={{ width: `${session.completionRate}%` }}
                          />
                        </div>
                        <strong>{session.completionRate}%</strong>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`quality-text quality-${session.worstQuality}`}
                      >
                        {session.sensorCompleteness}%
                      </span>
                      <span className="person-meta">
                        {qualityLabels[session.worstQuality]}
                      </span>
                    </td>
                    <td>
                      <SessionStateBadge status={session.status} />
                    </td>
                    <td>
                      <Link
                        className="text-button link-button"
                        to={`/sessions/${session.id}`}
                      >
                        复盘 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="table-footer">
              <span>
                共 {sessions.data.length} 条记录 · 当前显示 {filtered.length} 条
              </span>
            </footer>
          </>
        )}
      </div>
    </>
  );
}
