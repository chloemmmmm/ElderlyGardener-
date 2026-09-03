import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ErrorState, LoadingState, PageHeader, Panel } from "../components/ui";
import type { AttentionSeverity, TrainingStage } from "../domain/models";
import { rehabilitationApi } from "../services/rehabilitation";

const riskLabels: Record<AttentionSeverity, string> = {
  high: "高优先",
  medium: "需关注",
  low: "待跟进",
};

const stageLabels: Record<TrainingStage, string> = {
  entering: "进入期",
  participating: "参与期",
  sustaining: "维持期",
};

// 与 StatusTag 语义色保持同源（components.css .status-high/medium/low）
const RISK_COLORS: Record<AttentionSeverity, string> = {
  high: "#b42318",
  medium: "#92580d",
  low: "#5c519c",
};

const STAGE_COLORS: Record<TrainingStage, string> = {
  entering: "#7c93a3",
  participating: "#3d8b74",
  sustaining: "#176b55",
};

const tooltipStyle = {
  borderRadius: 6,
  borderColor: "#c9d6d0",
  fontSize: 11,
};

export function AnalyticsPage() {
  const analytics = useQuery({
    queryKey: ["analytics"],
    queryFn: ({ signal }) => rehabilitationApi.getAnalytics(signal),
  });
  if (analytics.isLoading) return <LoadingState label="正在汇总数据看板…" />;
  if (!analytics.data)
    return <ErrorState onRetry={() => void analytics.refetch()} />;
  const data = analytics.data;
  const summary = data.summary;
  const riskTotal = data.riskDistribution.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const stageTotal = data.stageDistribution.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const delta = summary.weeklyTrendDelta;
  return (
    <>
      <PageHeader
        eyebrow="Program analytics"
        title="数据看板"
        description="跨对象的训练进展与质量洞察，帮助康复师在复核与排期前掌握全局。图表数据为作品集演示样本。"
        actions={
          <span className="demo-data-chip" title="演示样本数据">
            演示样本数据
          </span>
        }
      />
      <div className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">在训对象</span>
          <strong className="metric-value">{summary.activeClients}</strong>
          <span className="metric-detail">覆盖进入期至维持期</span>
        </article>
        <article className="metric-card attention">
          <span className="metric-label">需要关注</span>
          <strong className="metric-value">
            {String(summary.needsAttention).padStart(2, "0")}
          </strong>
          <span className="metric-detail">工作台已按风险排序</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">7 日平均完成率</span>
          <strong className="metric-value">
            {summary.weeklyCompletionRate}%
          </strong>
          <span className="metric-detail">
            较前一日{" "}
            <strong style={{ color: delta >= 0 ? "#176b55" : "#a43129" }}>
              {delta >= 0 ? `+${delta}` : delta}
            </strong>{" "}
            次完成
          </span>
        </article>
        <article className="metric-card">
          <span className="metric-label">平均训练时长</span>
          <strong className="metric-value">
            {summary.avgDurationMinutes}
            <small style={{ fontSize: 13 }}> 分钟</small>
          </strong>
          <span className="metric-detail">按全部园艺训练会话统计</span>
        </article>
      </div>

      <div className="analytics-grid">
        <Panel title="风险分层分布" subtitle="有风险线索的对象按优先级分层">
          <div className="pie-block">
            <div className="pie-block__chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.riskDistribution}
                    dataKey="count"
                    nameKey="severity"
                    innerRadius={46}
                    outerRadius={72}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.riskDistribution.map((entry) => (
                      <Cell
                        key={entry.severity}
                        fill={RISK_COLORS[entry.severity]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} 人`, "对象数"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="pie-legend">
              {data.riskDistribution.map((entry) => (
                <li key={entry.severity}>
                  <span
                    className="pie-legend__dot"
                    style={{
                      background: RISK_COLORS[entry.severity],
                    }}
                    aria-hidden="true"
                  />
                  <span>{riskLabels[entry.severity]}</span>
                  <strong>{entry.count} 人</strong>
                  <em>
                    {riskTotal === 0
                      ? 0
                      : Math.round((entry.count / riskTotal) * 100)}
                    %
                  </em>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel title="训练阶段分布" subtitle="对象所处康复阶段与分层管理">
          <div className="pie-block">
            <div className="pie-block__chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.stageDistribution}
                    dataKey="count"
                    nameKey="stage"
                    innerRadius={46}
                    outerRadius={72}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.stageDistribution.map((entry) => (
                      <Cell
                        key={entry.stage}
                        fill={STAGE_COLORS[entry.stage]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} 人`, "对象数"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="pie-legend">
              {data.stageDistribution.map((entry) => (
                <li key={entry.stage}>
                  <span
                    className="pie-legend__dot"
                    style={{ background: STAGE_COLORS[entry.stage] }}
                    aria-hidden="true"
                  />
                  <span>{stageLabels[entry.stage]}</span>
                  <strong>{entry.count} 人</strong>
                  <em>
                    {stageTotal === 0
                      ? 0
                      : Math.round((entry.count / stageTotal) * 100)}
                    %
                  </em>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="analytics-grid">
        <Panel
          title="园艺动作平均完成幅度"
          subtitle="动作执行质量（幅度完成度）与每次反馈次数"
        >
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.exerciseCoverage}
                margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
              >
                <CartesianGrid stroke="#e5ebe8" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#526661" }}
                />
                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#68766f" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#eef4f1" }}
                  formatter={(value, _name, item) => [
                    `${value}% · 反馈 ${item?.payload?.avgFeedbackPerSession ?? "—"} 次/次`,
                    "平均完成幅度",
                  ]}
                />
                <Bar
                  dataKey="avgRangeCompletion"
                  fill="#3d8b74"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-footnote">
            幅度完成度为会话内各动作的均值（演示样本）。悬停可查看每次平均反馈次数。
          </p>
        </Panel>
        <Panel title="康复师负载" subtitle="负责对象数与平均完成率">
          <table className="data-table analytics-owner-table">
            <thead>
              <tr>
                <th style={{ width: "34%" }}>治疗师</th>
                <th style={{ width: "20%" }}>负责对象</th>
                <th style={{ width: "46%" }}>平均完成率</th>
              </tr>
            </thead>
            <tbody>
              {data.completionByOwner.map((row) => (
                <tr key={row.ownerName}>
                  <td className="name-cell">{row.ownerName}</td>
                  <td>{row.clientCount} 人</td>
                  <td>
                    <div className="completion-cell">
                      <div className="mini-progress" aria-hidden="true">
                        <span style={{ width: `${row.avgCompletionRate}%` }} />
                      </div>
                      <strong>{row.avgCompletionRate}%</strong>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="chart-footnote">
            完成率取各对象近 7 日完成率的均值，帮助识别负载与结果的关系。
          </p>
        </Panel>
      </div>

      <Panel
        title="近 7 日训练完成趋势"
        subtitle="全对象每日完成次数与计划次数对比"
        action={
          <div className="chart-legend">
            <span>已完成</span>
            <span>已计划</span>
          </div>
        }
      >
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.weeklyTrend}
              margin={{ top: 12, right: 10, bottom: 0, left: -16 }}
            >
              <defs>
                <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#176b55" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#176b55" stopOpacity={0.02} />
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
              <Tooltip contentStyle={tooltipStyle} />
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
                fill="url(#analyticsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </>
  );
}
