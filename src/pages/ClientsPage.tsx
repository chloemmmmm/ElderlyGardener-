import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusTag,
} from "../components/ui";
import type { ClientListQuery } from "../domain/models";
import { rehabilitationApi } from "../services/rehabilitation";

const defaults: ClientListQuery = {
  q: "",
  stage: "all",
  alert: "all",
  plan: "all",
  sort: "attention",
  page: 1,
  pageSize: 8,
};

export function ClientsPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState<ClientListQuery>({
    ...defaults,
    alert:
      params.get("alert") === "needs-attention" ? "needs-attention" : "all",
  });
  const [noticeVisible, setNoticeVisible] = useState(false);
  const clients = useQuery({
    queryKey: ["clients", query],
    queryFn: ({ signal }) => rehabilitationApi.getClients(query, signal),
  });
  useEffect(() => {
    setQuery((current) => ({ ...current, page: 1 }));
  }, [query.q, query.stage, query.alert, query.plan, query.sort]);
  const update = <K extends keyof ClientListQuery>(
    key: K,
    value: ClientListQuery[K],
  ) => setQuery((current) => ({ ...current, [key]: value }));
  return (
    <>
      <PageHeader
        eyebrow="Client management"
        title="康复对象"
        description="统一查看训练阶段、计划执行与风险线索。"
        actions={
          <button
            className="primary-button"
            type="button"
            onClick={() => setNoticeVisible(true)}
          >
            ＋ 新增康复对象
          </button>
        }
      />
      {noticeVisible && (
        <div className="demo-notice" role="status">
          <span aria-hidden="true">✳</span>
          <p>
            当前版本聚焦“对象管理 → 计划调整 → 训练复盘”的既有闭环；
            新增对象走入院建档流程，暂不在当前版本范围内。
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
      <div className="filter-bar" aria-label="对象筛选">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            className="filter-control"
            aria-label="搜索姓名"
            value={query.q}
            onChange={(event) => update("q", event.target.value)}
            placeholder="搜索姓名…"
          />
        </label>
        <select
          className="filter-control"
          aria-label="训练阶段"
          value={query.stage}
          onChange={(event) =>
            update("stage", event.target.value as ClientListQuery["stage"])
          }
        >
          <option value="all">全部阶段</option>
          <option value="entering">进入期</option>
          <option value="participating">参与期</option>
          <option value="sustaining">维持期</option>
        </select>
        <select
          className="filter-control"
          aria-label="关注状态"
          value={query.alert}
          onChange={(event) =>
            update("alert", event.target.value as ClientListQuery["alert"])
          }
        >
          <option value="all">全部关注状态</option>
          <option value="needs-attention">需要关注</option>
          <option value="stable">状态稳定</option>
        </select>
        <select
          className="filter-control"
          aria-label="计划状态"
          value={query.plan}
          onChange={(event) =>
            update("plan", event.target.value as ClientListQuery["plan"])
          }
        >
          <option value="all">全部计划</option>
          <option value="active">执行中</option>
          <option value="review-due">待评估</option>
          <option value="paused">已暂停</option>
        </select>
        <select
          className="filter-control"
          aria-label="排序"
          value={query.sort}
          onChange={(event) =>
            update("sort", event.target.value as ClientListQuery["sort"])
          }
        >
          <option value="attention">按关注优先</option>
          <option value="completion">按完成率</option>
          <option value="name">按姓名</option>
        </select>
      </div>
      <div className="client-table-wrap">
        {clients.isLoading ? (
          <LoadingState label="正在载入对象名单…" />
        ) : !clients.data ? (
          <ErrorState onRetry={() => void clients.refetch()} />
        ) : clients.data.items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "16%" }}>姓名</th>
                  <th style={{ width: "12%" }}>训练阶段</th>
                  <th style={{ width: "21%" }}>当前计划</th>
                  <th style={{ width: "16%" }}>7 日完成率</th>
                  <th style={{ width: "25%" }}>关注线索</th>
                  <th style={{ width: "10%" }}>负责人</th>
                </tr>
              </thead>
              <tbody>
                {clients.data.items.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <Link className="name-link" to={`/clients/${client.id}`}>
                        {client.name}
                      </Link>
                      <span className="person-meta">{client.age} 岁</span>
                    </td>
                    <td>
                      <StatusTag value={client.stage} />
                    </td>
                    <td>
                      {client.planName}
                      <span className="person-meta">
                        <StatusTag value={client.planStatus} />
                      </span>
                    </td>
                    <td>
                      <div className="completion-cell">
                        <div className="mini-progress" aria-hidden="true">
                          <span
                            style={{
                              width: `${client.sevenDayCompletionRate}%`,
                            }}
                          />
                        </div>
                        <strong>{client.sevenDayCompletionRate}%</strong>
                      </div>
                    </td>
                    <td>
                      {client.attentionReason ? (
                        <>
                          <StatusTag value={client.attentionSeverity!} />
                          <span className="person-meta">
                            {client.attentionReason}
                          </span>
                        </>
                      ) : (
                        <span className="muted-ok">— 状态稳定</span>
                      )}
                    </td>
                    <td>{client.ownerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="table-footer">
              <span>
                共 {clients.data.total} 位对象 · 当前显示{" "}
                {clients.data.items.length} 位
              </span>
              <div className="pagination">
                <button
                  type="button"
                  disabled={query.page === 1}
                  onClick={() => update("page", Math.max(1, query.page - 1))}
                  aria-label="上一页"
                >
                  ‹
                </button>
                {Array.from(
                  { length: Math.ceil(clients.data.total / query.pageSize) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    aria-current={page === query.page ? "page" : undefined}
                    onClick={() => update("page", page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={
                    query.page >= Math.ceil(clients.data.total / query.pageSize)
                  }
                  onClick={() => update("page", query.page + 1)}
                  aria-label="下一页"
                >
                  ›
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
}
