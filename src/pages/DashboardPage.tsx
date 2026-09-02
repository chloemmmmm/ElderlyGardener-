import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";

import {
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  StatusTag,
} from "../components/ui";
import { rehabilitationApi } from "../services/rehabilitation";

export function DashboardPage() {
  const dashboard = useQuery({
    queryKey: ["dashboard"],
    queryFn: ({ signal }) => rehabilitationApi.getDashboard(signal),
  });
  if (dashboard.isLoading) return <LoadingState label="正在生成今日工作台…" />;
  if (!dashboard.data)
    return <ErrorState onRetry={() => void dashboard.refetch()} />;
  const data = dashboard.data;
  return (
    <>
      <PageHeader
        eyebrow="Therapist workspace"
        title="早上好，林医生"
        description="从需要判断的事项开始，再处理今天的复核与随访。系统提示仅作为线索，最终决策由康复师确认。"
        actions={
          <>
            <button className="secondary-button" type="button">
              导出周报
            </button>
            <Link className="primary-button link-button" to="/clients">
              查看全部对象
            </Link>
          </>
        }
      />
      <div className="metric-grid">
        <article className="metric-card attention">
          <span className="metric-label">需要优先关注</span>
          <strong className="metric-value">03</strong>
          <span className="metric-detail">
            <strong>2 项高优先</strong> · 1 项数据复核
          </span>
        </article>
        <article className="metric-card">
          <span className="metric-label">今日计划训练</span>
          <strong className="metric-value">27</strong>
          <span className="metric-detail">已完成 18 次 · 当前 67%</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">7 日完成率</span>
          <strong className="metric-value">82%</strong>
          <span className="metric-detail">
            <strong>较上周 +4%</strong>
          </span>
        </article>
        <article className="metric-card">
          <span className="metric-label">执行中计划</span>
          <strong className="metric-value">11</strong>
          <span className="metric-detail">1 份计划即将到期</span>
        </article>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Panel
            title="需要判断"
            subtitle="按风险与时效排序，点击进入证据页"
            action={
              <Link
                className="text-button link-button"
                to="/clients?alert=needs-attention"
              >
                查看列表 →
              </Link>
            }
          >
            <div className="attention-list">
              {data.attentionItems.map((item) => (
                <Link
                  className="attention-row"
                  key={item.id}
                  to={
                    item.sessionId
                      ? `/sessions/${item.sessionId}`
                      : `/clients/${item.clientId}`
                  }
                >
                  <div>
                    <span className="person-name">{item.clientName}</span>
                    <span className="person-meta">康复对象</span>
                  </div>
                  <div className="attention-reason">
                    <StatusTag value={item.severity} />
                    <span>{item.reason}</span>
                  </div>
                  <div className="evidence-cell">
                    <strong>{item.evidence}</strong>
                    <span>建议：{item.nextAction}</span>
                  </div>
                  <span className="row-arrow" aria-hidden="true">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          </Panel>
          <Panel
            title="近 7 日训练完成趋势"
            subtitle="完成次数 / 计划次数"
            action={
              <div className="chart-legend">
                <span>已完成</span>
                <span>已计划</span>
              </div>
            }
          >
            <div className="trend-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.completionTrend}
                  margin={{ top: 12, right: 10, bottom: 0, left: -16 }}
                >
                  <defs>
                    <linearGradient
                      id="completionFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#176b55"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="#176b55"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e5ebe8" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#68766f" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#68766f" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 6,
                      borderColor: "#c9d6d0",
                      fontSize: 11,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    stroke="#b9c8c2"
                    fill="transparent"
                    strokeDasharray="4 4"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#176b55"
                    strokeWidth={2}
                    fill="url(#completionFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
        <div className="dashboard-column">
          <Panel title="今日安排" subtitle="3 项复核与随访">
            <div className="schedule-list">
              {data.todaySchedule.map((item) => (
                <div className="schedule-row" key={item.id}>
                  <time className="schedule-time">{item.time}</time>
                  <div>
                    <strong>{item.clientName}</strong>
                    <span>{item.task}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="最新动态" subtitle="团队与系统事件">
            <div className="activity-list">
              {data.activity.map((item) => (
                <div className="activity-row" key={item.id}>
                  <time>{item.occurredAt}</time>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="今日证据链" subtitle="按时间线聚合传感器、AI 与人工判断">
            <div className="evidence-chain">
              {[
                {
                  id: "ev-001",
                  source: "ai",
                  time: "08:42",
                  text: "王桂兰修剪动作幅度连续 3 次低于阈值",
                },
                {
                  id: "ev-002",
                  source: "sensor",
                  time: "08:45",
                  text: "传感器完整度 72%，疑似绑带松动",
                },
                {
                  id: "ev-003",
                  source: "therapist",
                  time: "09:10",
                  text: "林医生标记：建议复核绑带位置并观察下次训练",
                },
              ].map((item, index, list) => (
                <div className="evidence-chain__item" key={item.id}>
                  <div className="evidence-chain__line" aria-hidden="true">
                    <span
                      className={`evidence-chain__dot evidence-chain__dot--${item.source}`}
                    />
                    {index < list.length - 1 ? (
                      <span className="evidence-chain__bar" />
                    ) : null}
                  </div>
                  <div className="evidence-chain__content">
                    <time>{item.time}</time>
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <aside className="ai-workflow-card" aria-label="AI 辅助说明">
            <span className="ai-kicker">AI 辅助 · 可追溯</span>
            <strong>先证据，后建议</strong>
            <p>
              AI
              只整理系统事实、标记不确定性，并给出待确认建议；不会自动改写训练计划。
            </p>
            <Link to="/sessions/session-004">查看示例记录 →</Link>
          </aside>
        </div>
      </div>
    </>
  );
}
