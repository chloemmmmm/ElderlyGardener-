import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

import { getPublicAssetUrl } from "../config/public-path";
import {
  Activity,
  Apple,
  BookOpen,
  BrainCircuit,
  ClipboardList,
  ClipboardPen,
  Droplets,
  Dumbbell,
  FlagTriangleRight,
  HeartHandshake,
  HeartPulse,
  LineChart,
  MessageCircle,
  Microscope,
  Monitor,
  PhoneCall,
  ScanLine,
  Scissors,
  Search,
  ShieldCheck,
  Shrub,
  SlidersHorizontal,
  Sprout,
  Stethoscope,
  UserRound,
  Users,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  MessageSquarePlus,
  Star,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  authorBio,
  competitors,
  designPrinciples,
  emgValidation,
  heuristicEvaluation,
  interviewGuide,
  journeyStages,
  methodMatrix,
  personas,
  reflections,
  researchQuestions,
  survey,
  therapistSimResponses,
  usabilityFindings,
  usabilityProtocol,
} from "../mocks/research-data";
import {
  emgReport,
  surveyInsights,
  surveyMethod,
} from "../mocks/research-methods";
import { DemoBadge } from "./case-study/shared/DemoBadge";

function asset(path: string) {
  return getPublicAssetUrl(import.meta.env.BASE_URL, path);
}

function Section({
  id,
  eyebrow,
  title,
  variant = "default",
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  variant?: "default" | "subtle" | "surface";
  children: React.ReactNode;
}) {
  const cls =
    variant === "subtle"
      ? "project-section project-section--subtle"
      : variant === "surface"
        ? "project-section project-section--surface"
        : "project-section";
  return (
    <section id={id} className={cls}>
      <div className="project-section__inner">
        {eyebrow ? (
          <span className="project-section__eyebrow">{eyebrow}</span>
        ) : null}
        <h2 className="project-section__title">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function ResearchTimeline() {
  const steps = [
    {
      n: "01",
      label: "问题域",
      desc: "老龄化 + 上肢功能障碍 + 居家康复依从性低",
      Icon: Search,
    },
    {
      n: "02",
      label: "文献调研",
      desc: "园艺动作可转译为标准化上肢训练",
      Icon: BookOpen,
    },
    {
      n: "03",
      label: "用户研究",
      desc: "康复师访谈 · 用户画像 · 旅程地图",
      Icon: Users,
    },
    {
      n: "04",
      label: "设计决策",
      desc: "动作映射 · 多模态反馈 · 证据优先",
      Icon: BrainCircuit,
    },
    {
      n: "05",
      label: "原型验证",
      desc: "C 端硬件 + VR 场景 + B 端后台",
      Icon: Wrench,
    },
    {
      n: "06",
      label: "可用性测试",
      desc: "核心闭环任务 · 指标度量 · 迭代",
      Icon: HeartPulse,
    },
  ];
  return (
    <div className="research-timeline">
      <div className="research-timeline__line" aria-hidden="true" />
      <div className="research-timeline__items">
        {steps.map((s) => (
          <div className="research-timeline__item" key={s.n}>
            <span className="research-timeline__num">
              <s.Icon size={16} aria-hidden="true" />
              {s.n}
            </span>
            <strong>{s.label}</strong>
            <span>{s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function LazyVideo({
  src,
  className,
  label,
}: {
  src: string;
  className: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoaded(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLoaded(true);
            if (!prefersReducedMotion()) {
              el.play().catch(() => {});
            }
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={loaded ? src : undefined}
      muted
      loop
      playsInline
      preload="metadata"
      controls={prefersReducedMotion()}
      aria-label={label}
    />
  );
}

type ReelLanguage = "zh" | "en";

function IntroReelVideo() {
  const [lang, setLang] = useState<ReelLanguage>("zh");
  const [session, setSession] = useState(0);
  const switchTo = (next: ReelLanguage) => {
    if (next === lang) return;
    setLang(next);
    setSession((s) => s + 1);
  };
  const src =
    lang === "zh"
      ? asset("assets/case-study/intro-full-zh-720p.mp4")
      : asset("assets/case-study/intro-full-720p.mp4");
  const label =
    lang === "zh"
      ? "ElderlyGardener 完整介绍片（中文配音 · 中文字幕）"
      : "ElderlyGardener 完整介绍片（英文原声 · 中文字幕）";
  return (
    <div className="demo-video-frame">
      <div className="demo-video-lang" role="group" aria-label="旁白语言">
        <button
          type="button"
          className={lang === "zh" ? "is-active" : undefined}
          aria-pressed={lang === "zh"}
          onClick={() => switchTo("zh")}
        >
          中文配音
        </button>
        <button
          type="button"
          className={lang === "en" ? "is-active" : undefined}
          aria-pressed={lang === "en"}
          onClick={() => switchTo("en")}
        >
          英文原声
        </button>
      </div>
      <video
        key={session}
        src={src}
        controls
        autoPlay
        playsInline
        preload="none"
        aria-label={label}
      >
        <track
          kind="subtitles"
          srcLang="zh"
          label="中文"
          default
          src={asset("assets/case-study/intro-zh.vtt")}
        />
      </video>
    </div>
  );
}

function ExerciseMap() {
  const rows = [
    {
      exercise: "坐姿划船 Seated Row",
      muscle: "背 / 肩后束",
      garden: "耙土整地",
      Icon: Shrub,
      video: "exercise-row.mp4",
    },
    {
      exercise: "臂弯举 Arm Curl",
      muscle: "肱二头肌",
      garden: "移栽幼苗",
      Icon: Sprout,
      video: "exercise-curl.mp4",
    },
    {
      exercise: "侧平举 Side Arm Raise",
      muscle: "三角肌",
      garden: "浇水施肥",
      Icon: Droplets,
      video: "exercise-raise.mp4",
    },
    {
      exercise: "过头举 Overhead Raise",
      muscle: "肩 / 上背",
      garden: "修剪枝条",
      Icon: Scissors,
      video: "exercise-prune.mp4",
    },
    {
      exercise: "握力训练 Hand Grip",
      muscle: "前臂 / 手部",
      garden: "采摘果实",
      Icon: Apple,
      video: "exercise-grip.mp4",
    },
  ];
  return (
    <div className="exercise-map">
      {rows.map((r) => (
        <div className="exercise-map__row" key={r.exercise}>
          <div className="exercise-map__cell exercise-map__cell--exercise">
            <LazyVideo
              className="exercise-map__video"
              src={asset(`/assets/case-study/${r.video}`)}
              label={`${r.exercise} 动作演示动画（AI 生成）`}
            />
            <span className="exercise-map__icon" aria-hidden="true">
              <r.Icon size={22} strokeWidth={1.8} />
            </span>
            <div>
              <strong>{r.exercise}</strong>
              <span>{r.muscle}</span>
            </div>
          </div>
          <div className="exercise-map__arrow" aria-hidden="true">
            →
          </div>
          <div className="exercise-map__cell exercise-map__cell--garden">
            <strong>{r.garden}</strong>
            <span>园艺任务化呈现</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PilotStoryboard() {
  const panels = [
    {
      n: "00",
      title: "基线 IMU 评估",
      date: "Day 1",
      desc: "个性化动作基线标定 + 安全包络校准",
    },
    {
      n: "01",
      title: "第 1 周",
      date: "Jul 9",
      desc: "初始适应期：熟悉 VR 场景与园艺任务",
    },
    {
      n: "02",
      title: "第 2 周",
      date: "Jul 16",
      desc: "初始适应期：建立每日训练节奏",
    },
    {
      n: "03",
      title: "第 3 周",
      date: "Jul 23",
      desc: "表现巩固期：动作完成度逐步提升",
    },
    {
      n: "04",
      title: "第 4 周",
      date: "Jul 30",
      desc: "表现巩固期：增加任务复杂度",
    },
    {
      n: "05",
      title: "第 5 周",
      date: "Aug 6",
      desc: "持续参与期：保持动机与依从性",
    },
    {
      n: "06",
      title: "第 6 周",
      date: "Aug 13",
      desc: "持续参与期：数据趋势稳定",
    },
    {
      n: "07",
      title: "最终访谈",
      date: "Aug 15",
      desc: "整体反思与训练效果评估",
    },
  ];
  return (
    <div className="pilot-storyboard">
      <h3 className="project-section__h3">
        <ClipboardList size={20} className="inline-icon" aria-hidden="true" />8
        周居家训练试点：从基线到访谈
      </h3>
      <div className="pilot-storyboard__track" aria-label="8 周试点时间线">
        {panels.map((p, i) => (
          <div
            className="pilot-storyboard__panel"
            key={p.n}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span className="pilot-storyboard__num">{p.n}</span>
            <strong>{p.title}</strong>
            <span className="pilot-storyboard__date">{p.date}</span>
            <span className="pilot-storyboard__desc">{p.desc}</span>
          </div>
        ))}
      </div>
      <p className="pilot-storyboard__note">
        基线评估 → 6 周渐进式训练 → 最终访谈，覆盖动作表现、依从性与主观反馈。
      </p>
    </div>
  );
}

function MethodMatrix() {
  return (
    <div className="method-matrix">
      <h3 className="project-section__h3">
        <Microscope size={20} className="inline-icon" aria-hidden="true" />
        研究问题 × 方法 × 产出
      </h3>
      <div
        className="method-matrix__table"
        role="table"
        aria-label="研究问题方法矩阵"
      >
        <div role="rowgroup">
          <div
            className="method-matrix__row method-matrix__row--head"
            role="row"
          >
            <span role="columnheader">研究问题</span>
            <span role="columnheader">方法</span>
            <span role="columnheader">产出</span>
          </div>
          {methodMatrix.map((m) => (
            <div className="method-matrix__row" role="row" key={m.rq}>
              <span role="cell">
                <strong>{m.rq}</strong> {m.question}
              </span>
              <span role="cell">{m.method}</span>
              <span role="cell">{m.output}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiteratureReviewCards() {
  return (
    <div className="literature-review">
      <h3 className="project-section__h3">
        <BookOpen size={20} className="inline-icon" aria-hidden="true" />
        循证依据：5 条关键证据链
      </h3>
      <figure className="literature-review__figure literature-review__figure--full">
        <img
          src={asset("assets/case-study/literature-evidence-chain.webp")}
          alt="从老年运动有效性、上肢功能、园艺转译到反馈闭环的 5 条关键证据链"
          loading="lazy"
          className="literature-review__image"
        />
      </figure>
    </div>
  );
}

function CompetitorMatrix() {
  const levels: Record<string, number> = { 高: 3, 中: 2, 低: 1 };
  const total = 3;
  const criteria = [
    "信息架构：核心模块与康复师工作流的匹配度",
    "启发式评估：系统状态可见性、识别而非回忆等维度打分",
    "功能覆盖：传感器数据、计划编辑、远程随访、证据追溯",
    "决策支持：1–3 分，综合数据深度、可视化与可干预性",
  ];
  const xScale = (v: number) => 12 + ((v - 1) / 4) * 84;
  const yScale = (v: number) => 92 - ((v - 1) / 4) * 84;

  return (
    <div className="competitor-matrix">
      <h3 className="project-section__h3">
        <Search size={20} className="inline-icon" aria-hidden="true" />
        竞品对比：判定标准与能力象限
      </h3>

      <div className="competitor-matrix__criteria">
        <strong>判定标准</strong>
        <ul>
          {criteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="competitor-cards">
        {competitors
          .filter((c) => !c.name.startsWith("ElderlyGardener"))
          .map((c) => (
            <article key={c.name} className="competitor-card">
              <div className="competitor-card__shot">
                <img
                  src={asset(c.image)}
                  alt={`${c.name} 产品界面截图`}
                  loading="lazy"
                />
              </div>
              <div className="competitor-card__body">
                <h4>{c.name}</h4>
                <span className="competitor-card__tagline">{c.tagline}</span>
                <p className="competitor-card__audience">{c.audience}</p>
                <div
                  className="competitor-card__support"
                  aria-label={`决策支持 ${c.decisionSupport}`}
                >
                  <span className="competitor-card__support-label">
                    决策支持
                  </span>
                  <span className="support-bar">
                    {Array.from({ length: total }).map((_, i) => (
                      <span
                        key={i}
                        className={`support-bar__dot ${i < levels[c.decisionSupport] ? "is-on" : ""}`}
                      />
                    ))}
                  </span>
                  <span className="competitor-card__support-value">
                    {c.decisionSupport}
                  </span>
                </div>
              </div>
            </article>
          ))}
      </div>

      <div className="competitor-matrix__analysis">
        <div className="competitor-matrix__quadrant">
          <svg
            viewBox="0 0 108 110"
            role="img"
            aria-label="竞品能力象限图：横轴为临床专业性，纵轴为决策支持"
          >
            <rect x="8" y="4" width="46" height="46" fill="#f7fbfa" />
            <rect x="54" y="4" width="46" height="46" fill="#eef6f3" />
            <rect x="8" y="50" width="46" height="46" fill="#eef6f3" />
            <rect x="54" y="50" width="46" height="46" fill="#e8f2ee" />
            <line
              x1="54"
              y1="4"
              x2="54"
              y2="96"
              stroke="#bad0c8"
              strokeWidth="0.6"
              strokeDasharray="2 2"
            />
            <line
              x1="8"
              y1="50"
              x2="100"
              y2="50"
              stroke="#bad0c8"
              strokeWidth="0.6"
              strokeDasharray="2 2"
            />
            <text
              x="54"
              y="106"
              textAnchor="middle"
              fontSize="4.2"
              fill="#557166"
            >
              临床专业性 →
            </text>
            <text
              x="3"
              y="50"
              textAnchor="middle"
              fontSize="4.2"
              fill="#557166"
              transform="rotate(-90 3 50)"
            >
              决策支持 →
            </text>
            {competitors.map((c) => {
              const { x, y } = c.coords;
              const ours = c.name.startsWith("ElderlyGardener");
              const px = xScale(x);
              const py = yScale(y);
              const anchor = px < 22 ? "start" : px > 82 ? "end" : "middle";
              const lx = anchor === "start" ? -3 : anchor === "end" ? 3 : 0;
              const ly = c.shortName === "云端" ? 11 : -5;
              return (
                <g key={c.name} transform={`translate(${px},${py})`}>
                  <circle
                    r="5"
                    fill={ours ? "#176b55" : "#88c4af"}
                    opacity="0.2"
                  />
                  <circle r="3" fill={ours ? "#176b55" : "#5aa98e"} />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={anchor}
                    fontSize="4.2"
                    fill="#153c32"
                    fontWeight={ours ? "700" : "400"}
                  >
                    {c.shortName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div
          className="competitor-matrix__table"
          role="table"
          aria-label="竞品决策支持能力对比"
        >
          <div
            className="competitor-matrix__row competitor-matrix__row--head"
            role="row"
          >
            <span role="columnheader">产品</span>
            <span role="columnheader">目标用户</span>
            <span role="columnheader">核心优势</span>
            <span role="columnheader">关键短板</span>
          </div>
          {competitors.map((c) => {
            const ours = c.name.startsWith("ElderlyGardener");
            return (
              <div
                className={`competitor-matrix__row ${ours ? "competitor-matrix__row--ours" : ""}`}
                role="row"
                key={c.name}
              >
                <span role="cell">
                  <strong>{c.name}</strong>
                  <small>{c.seller}</small>
                </span>
                <span role="cell">{c.audience}</span>
                <span role="cell">{c.strengths}</span>
                <span role="cell">{c.weakness}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="competitor-matrix__note">
        竞品截图来源于各产品 App Store 公开页面，仅用于学术对比分析。
      </p>
    </div>
  );
}

function InterviewGuide() {
  const [active, setActive] = useState<number | null>(0);
  const answers = active === null ? [] : therapistSimResponses[active];
  return (
    <div className="interview-guide">
      <h3 className="project-section__h3">
        <MessageCircle size={20} className="inline-icon" aria-hidden="true" />
        康复师访谈提纲
      </h3>
      <div className="interview-guide__layout">
        <div className="interview-guide__list">
          {interviewGuide.map((q, i) => (
            <button
              type="button"
              className={`interview-guide__item ${active === i ? "is-active" : ""}`}
              key={i}
              onClick={() => setActive(i)}
              aria-expanded={active === i}
            >
              <span className="interview-guide__num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="interview-guide__q">{q}</span>
              <span className="interview-guide__toggle" aria-hidden="true">
                {active === i ? "−" : "+"}
              </span>
            </button>
          ))}
        </div>
        <div className="interview-guide__sim" aria-live="polite">
          <div className="interview-guide__sim-header">
            <span className="interview-guide__sim-avatar" aria-hidden="true">
              <Stethoscope size={18} />
            </span>
            <div>
              <strong>不同康复师的回答</strong>
              <span>基于 4 位康复治疗师访谈整理</span>
            </div>
          </div>
          <div className="interview-guide__bubbles">
            {active === null ? (
              <div className="interview-guide__bubble interview-guide__bubble--prompt">
                <p>点击左侧问题，查看不同康复师的回答。</p>
              </div>
            ) : (
              answers.map((a, idx) => (
                <div
                  className="interview-guide__bubble"
                  key={idx}
                  style={{ animationDelay: `${idx * 90}ms` }}
                >
                  <p>{a}</p>
                </div>
              ))
            )}
          </div>
          <div className="interview-guide__meta">
            关联研究问题：
            {active !== null
              ? `${researchQuestions[active]?.id ?? "RQ"} · ${researchQuestions[active]?.method ?? ""}`
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeuristicTable() {
  const severityClass: Record<string, string> = {
    高: "severity--high",
    中: "severity--medium",
    低: "severity--low",
  };
  return (
    <div className="heuristic-table">
      <h3 className="project-section__h3">
        <ScanLine size={20} className="inline-icon" aria-hidden="true" />
        启发式评估：B 端后台可用性问题
      </h3>
      <div
        className="heuristic-table__grid"
        role="table"
        aria-label="启发式评估结果"
      >
        <div
          className="heuristic-table__row heuristic-table__row--head"
          role="row"
        >
          <span role="columnheader">启发式原则</span>
          <span role="columnheader">问题描述</span>
          <span role="columnheader">严重程度</span>
        </div>
        {heuristicEvaluation.map((h) => (
          <div className="heuristic-table__row" role="row" key={h.id}>
            <span role="cell">
              <strong>{h.principle}</strong>
            </span>
            <span role="cell">{h.issue}</span>
            <span role="cell">
              <span className={`severity-pill ${severityClass[h.severity]}`}>
                {h.severity}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodMixChart() {
  const data = [
    {
      name: "文献调研",
      value: 22,
      desc: "确立「园艺动作可转译为标准化上肢训练」假设",
    },
    { name: "用户访谈", value: 18, desc: "4 位康复师访谈，构建画像与旅程地图" },
    {
      name: "竞品分析",
      value: 14,
      desc: "对比 4 款同类产品，输出判定标准与象限",
    },
    {
      name: "动作分析",
      value: 16,
      desc: "5 个标准上肢动作映射为园艺任务与判定规则",
    },
    { name: "EMG 验证", value: 12, desc: "N=8 预实验，各动作激活均 ≥70% MVIC" },
    {
      name: "可用性测试",
      value: 18,
      desc: "B 端后台混合型测试方案与达成率指标",
    },
  ];
  const colors = [
    "#176b55",
    "#3b8c72",
    "#5aa98e",
    "#88c4af",
    "#b5dece",
    "#e8f2ee",
  ];
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="chart-card method-mix">
      <h4 className="chart-card__title">
        <LineChart size={18} className="inline-icon" aria-hidden="true" />
        研究方法构成
      </h4>
      <div className="method-mix__layout">
        <div className="chart-card__body method-mix__body">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart role="img" aria-label="研究方法构成饼图">
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={62}
                innerRadius={34}
                paddingAngle={2}
                label={false}
                animationBegin={100}
                animationDuration={900}
              >
                {data.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, _n, p) => [
                  `${v}/${total}（${((Number(v) / total) * 100).toFixed(0)}%）`,
                  (p as { payload?: { name?: string } }).payload?.name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <span className="chart-card__center-label" aria-hidden="true">
            {total}
            <small>研究单位</small>
          </span>
        </div>
        <div className="method-mix__cards">
          {data.map((d, i) => (
            <div className="method-mix-card" key={d.name}>
              <span className="method-mix-card__head">
                <span className="chart-card__legend-item">
                  <i
                    style={{ background: colors[i % colors.length] }}
                    aria-hidden="true"
                  />
                  {d.name}
                </span>
                <em>{d.value}</em>
              </span>
              <span className="method-mix-card__bar" aria-hidden="true">
                <i
                  style={{
                    width: `${(d.value / total) * 100}%`,
                    background: colors[i % colors.length],
                  }}
                />
              </span>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <button type="button" className="copy-email-btn" onClick={copy}>
      {copied ? (
        <Check size={14} aria-hidden="true" />
      ) : (
        <Copy size={14} aria-hidden="true" />
      )}
      {copied ? "已复制邮箱" : "复制邮箱"}
    </button>
  );
}

const FEEDBACK_STORAGE_KEY = "elderlygardener-visitor-feedback";

function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = () => {
    if (rating === 0) return;
    const entry = {
      rating,
      comment: comment.trim(),
      page: "project-showcase",
      submittedAt: new Date().toISOString(),
    };
    try {
      const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const list: unknown[] = raw ? JSON.parse(raw) : [];
      list.push(entry);
      window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // localStorage 不可用时静默降级：仍显示已收到
    }
    setSubmitted(true);
  };
  return (
    <div className="feedback-widget">
      {open && (
        <div
          className="feedback-widget__panel"
          role="dialog"
          aria-label="页面反馈"
        >
          <div className="feedback-widget__header">
            <span>这个案例研究对你有帮助吗？</span>
            <button
              type="button"
              className="feedback-widget__close"
              aria-label="关闭反馈面板"
              onClick={() => setOpen(false)}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          {submitted ? (
            <p className="feedback-widget__thanks">
              感谢反馈！你的评分（{rating}/5）与留言已保存在本地浏览器。
            </p>
          ) : (
            <>
              <div
                className="feedback-widget__stars"
                role="radiogroup"
                aria-label="评分"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} 星`}
                    className={`feedback-widget__star ${n <= rating ? "is-active" : ""}`}
                    onClick={() => setRating(n)}
                  >
                    <Star size={22} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <textarea
                className="feedback-widget__textarea"
                placeholder="一句话建议（可选）"
                value={comment}
                maxLength={200}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="feedback-widget__submit"
                disabled={rating === 0}
                onClick={submit}
              >
                提交反馈
              </button>
            </>
          )}
        </div>
      )}
      {!open && (
        <button
          type="button"
          className="feedback-widget__fab"
          onClick={() => setOpen(true)}
        >
          <MessageSquarePlus size={18} aria-hidden="true" />
          反馈
        </button>
      )}
    </div>
  );
}

function ArchitectureCarousel() {
  const slides = [
    {
      src: "assets/case-study/technical-architecture.webp",
      alt: "技术架构：传感器、Arduino、PC 与 VR 的多模态反馈链路",
      caption:
        "课程原始技术架构：多源传感器 → Arduino → PC 处理 → 气动/震动/VR 反馈",
    },
    {
      src: "assets/case-study/system-logic-v2.webp",
      alt: "系统逻辑与反馈闭环示意图",
      caption: "系统逻辑 V2：触发逻辑与反馈闭环",
    },
    {
      src: "assets/case-study/method-action-judgment.webp",
      alt: "动作判定规则示意图",
      caption: "动作判定规则：5 个标准上肢训练动作",
    },
  ];
  const [idx, setIdx] = useState(0);
  const go = (next: number) => setIdx((next + slides.length) % slides.length);
  return (
    <div className="arch-carousel">
      <div className="arch-carousel__viewport">
        <div
          className="arch-carousel__track"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((s) => (
            <figure className="arch-carousel__slide" key={s.src}>
              <img src={asset(s.src)} alt={s.alt} loading="lazy" />
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </div>
        <button
          type="button"
          className="arch-carousel__btn arch-carousel__btn--prev"
          aria-label="上一张"
          onClick={() => go(idx - 1)}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="arch-carousel__btn arch-carousel__btn--next"
          aria-label="下一张"
          onClick={() => go(idx + 1)}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="arch-carousel__dots">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            className={`arch-carousel__dot ${i === idx ? "is-active" : ""}`}
            aria-label={`查看第 ${i + 1} 张：${s.caption}`}
            aria-current={i === idx}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}

function EMGChart() {
  return (
    <div className="chart-card">
      <h4 className="chart-card__title">
        <Activity size={18} className="inline-icon" aria-hidden="true" />
        园艺动作 EMG 激活强度
      </h4>
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={emgValidation}
            role="img"
            aria-label="EMG 动作激活强度柱状图"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e5" />
            <XAxis dataKey="action" tick={{ fontSize: 11 }} interval={0} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              label={{
                value: "% MVIC",
                angle: -90,
                position: "insideLeft",
                fontSize: 10,
              }}
            />
            <Tooltip />
            <Bar
              dataKey="activation"
              name="激活度 %"
              fill="#176b55"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card__footer">
        <small>
          设备：{emgReport.device} · 采样率 {emgReport.samplingRate}
        </small>
      </div>
    </div>
  );
}

function EMGReport() {
  return (
    <div className="emg-report">
      <h4 className="project-section__h4">
        <Microscope size={18} className="inline-icon" aria-hidden="true" />
        肌电测量方法说明
      </h4>
      <ul className="emg-report__list">
        <li>
          <strong>设备</strong>
          {emgReport.device}，{emgReport.channels} 通道无线采集
        </li>
        <li>
          <strong>采样与滤波</strong>
          {emgReport.samplingRate}，{emgReport.filter}
        </li>
        <li>
          <strong>电极</strong>
          {emgReport.electrodes}，粘贴于 {emgReport.placements.join("、")}
        </li>
        <li>
          <strong>协议</strong>
          {emgReport.protocol}
        </li>
        <li>
          <strong>被试</strong>
          {emgReport.participants}
        </li>
        <li>
          <strong>变异控制</strong>
          {emgReport.variability}
        </li>
      </ul>
      <p className="emg-report__note">{emgReport.note}</p>
    </div>
  );
}

function SurveyChart() {
  return (
    <div className="chart-card">
      <h4 className="chart-card__title">
        <ClipboardList size={18} className="inline-icon" aria-hidden="true" />
        问卷摘要
      </h4>
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={survey.map((s) => ({ ...s, pct: (s.value / s.total) * 100 }))}
            layout="vertical"
            margin={{ left: 16, right: 24 }}
            role="img"
            aria-label="问卷结果条形图"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e5" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="item"
              width={200}
              tick={{ fontSize: 10 }}
              interval={0}
            />
            <Tooltip formatter={(v) => `${Number(v ?? 0).toFixed(0)}%`} />
            <Bar
              dataKey="pct"
              name="比例"
              fill="#3b8c72"
              radius={[0, 4, 4, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card__footer">
        <small>样本：N=32 · 5 分李克特 / 百分比题</small>
      </div>
    </div>
  );
}

function SurveyInsights() {
  const highlightNums = (text: string) =>
    text.split(/(\d+(?:\.\d+)?)/).map((part, i) =>
      /^\d/.test(part) ? (
        <mark className="survey-insights__num" key={i}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
  return (
    <div className="survey-insights">
      <h4 className="project-section__h4">
        <HeartHandshake size={18} className="inline-icon" aria-hidden="true" />
        问卷结果解读
      </h4>
      <ul>
        {surveyInsights.map((s, i) => (
          <li key={i}>{highlightNums(s)}</li>
        ))}
      </ul>
      <div className="survey-method">
        <strong>研究设定</strong>
        <span>
          {surveyMethod.sample}；{surveyMethod.profiles}
        </span>
        <span>{surveyMethod.instrument}</span>
        <span>{surveyMethod.baseline}</span>
      </div>
    </div>
  );
}

function JourneyEmotionChart() {
  return (
    <div className="chart-card">
      <h4 className="chart-card__title">
        <HeartPulse size={18} className="inline-icon" aria-hidden="true" />
        康复师旅程情绪曲线
      </h4>
      <div className="chart-card__body" style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={journeyStages.map((s) => ({
              stage: s.stage,
              emotion: s.emotion,
            }))}
            margin={{ left: -16, right: 16 }}
            role="img"
            aria-label="康复师旅程情绪曲线"
          >
            <defs>
              <linearGradient id="emotionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#176b55" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#176b55" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e5" />
            <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="emotion"
              name="情绪得分"
              stroke="#176b55"
              fill="url(#emotionFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card__footer">
        <small>
          情绪得分（1 = 沮挫，5 =
          顺利）基于康复师访谈重构；仅用于定位体验低谷与设计机会。
        </small>
      </div>
    </div>
  );
}

function JourneyStoryboard() {
  const icons = [
    UserRound,
    Stethoscope,
    ClipboardPen,
    PhoneCall,
    LineChart,
    SlidersHorizontal,
    FlagTriangleRight,
  ];
  const scenes = [
    "接诊新对象，翻阅分散的病史与居家记录",
    "量表初评 + 可穿戴初检，基线难以落地",
    "在计划编辑器中组合参数，版本难对比",
    "电话 / 微信回访，反馈主观、难定位原因",
    "在多个页面间跳转，还原一次训练过程",
    "调整参数却缺少记录，交接依赖口头",
    "导出报告，训练与改善证据一目了然",
  ];
  return (
    <div
      className="journey-storyboard"
      role="list"
      aria-label="康复师用户旅程故事板：七个关键场景"
    >
      {journeyStages.map((s, i) => {
        const Icon = icons[i % icons.length];
        const tone = s.emotion <= 2 ? "low" : s.emotion === 3 ? "mid" : "high";
        return (
          <div
            className="journey-storyboard__panel"
            role="listitem"
            key={s.stage}
            style={{ animationDelay: `${i * 0.9}s` }}
          >
            <span className="journey-storyboard__marker" aria-hidden="true">
              SC {String(i + 1).padStart(2, "0")}
            </span>
            <div className="journey-storyboard__frame" aria-hidden="true">
              <Icon size={32} strokeWidth={1.6} />
            </div>
            <h5>{s.stage}</h5>
            <p>{scenes[i]}</p>
            <span
              className={`journey-storyboard__mood journey-storyboard__mood--${tone}`}
            >
              情绪 {s.emotion}/5
            </span>
          </div>
        );
      })}
    </div>
  );
}

function UsabilityChart() {
  // 原始实测值
  const actualRaw: Record<string, number> = {
    任务完成率: 82,
    任务平均时间: 196,
    错误率: 7,
    "SUS 评分": 68,
    "NASA-TLX 认知负荷": 48,
    NPS: 28,
  };
  const isLowerBetter = (name: string) =>
    name.includes("时间") || name.includes("错误") || name.includes("负荷");
  const data = usabilityProtocol.metrics.map((m) => {
    const target = Number(m.target.replace(/[^0-9.]/g, ""));
    const actual = actualRaw[m.name] ?? Math.max(0, target - 5);
    const achievement = isLowerBetter(m.name)
      ? Math.min(120, (target / actual) * 100)
      : Math.min(120, (actual / target) * 100);
    return {
      name: m.name.replace("NASA-TLX ", ""),
      target: 100,
      actual: Math.round(achievement),
      rawTarget: m.target,
      rawActual: actual,
    };
  });
  return (
    <div className="chart-card">
      <h4 className="chart-card__title">
        <Activity size={18} className="inline-icon" aria-hidden="true" />
        可用性指标：目标达成率
      </h4>
      <div className="chart-card__body" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} role="img" aria-label="可用性目标达成率对比">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e5" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
            <YAxis
              domain={[0, 120]}
              tick={{ fontSize: 11 }}
              label={{
                value: "目标达成率 %",
                angle: -90,
                position: "insideLeft",
                fontSize: 10,
              }}
            />
            <Tooltip
              formatter={(v, n, p) => {
                const payload = (
                  p as {
                    payload?: {
                      rawActual?: number | string;
                      rawTarget?: number | string;
                    };
                  }
                ).payload;
                const raw =
                  n === "实测" ? payload?.rawActual : payload?.rawTarget;
                return [`${v ?? 0}%（原始值 ${raw ?? "—"}）`, n ?? ""];
              }}
            />
            <Legend />
            <Bar
              dataKey="target"
              name="目标 = 100%"
              fill="#b5dece"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="actual"
              name="实测"
              fill="#176b55"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProjectShowcasePage() {
  useEffect(() => {
    document.title = "ElderlyGardener | Project Showcase";
  }, []);

  return (
    <div className="project-showcase">
      <FeedbackWidget />
      {/* Hero */}
      <section className="project-hero">
        <div className="project-section__inner project-hero__inner">
          <div className="project-hero__copy">
            <span className="project-section__eyebrow">
              全链路产品设计 · 实习作品集
            </span>
            <h1 className="project-hero__title">
              ElderlyGardener
              <br />
              Upper Limb Rehabilitation Through Gardening
            </h1>
            <p className="project-hero__lead">
              面向认知障碍与高龄老人的上肢康复训练方案：C 端可穿戴园艺套件 + VR
              沉浸式训练场景 + B
              端康复师远程管理后台，从研究洞察到可交互产品原型的完整链路。
            </p>
            <div className="project-hero__tags">
              <span className="project-tag">用户研究</span>
              <span className="project-tag">交互设计</span>
              <span className="project-tag">硬件原型</span>
              <span className="project-tag">VR 场景</span>
              <span className="project-tag">React + TypeScript</span>
            </div>
            <div className="project-hero__actions">
              <Link
                className="project-button project-button--primary"
                to="/dashboard"
              >
                打开 B 端后台工作台
              </Link>
              <Link
                className="project-button project-button--secondary"
                to="/prd"
              >
                查看产品 PRD
              </Link>
            </div>
            <p className="project-hero__note" role="note">
              CHI 在投（第一作者）
            </p>
          </div>
          <div className="project-hero__media">
            <img
              src={asset("assets/case-study/cover-demo.webp")}
              alt="ElderlyGardener 第一代功能原型：可穿戴臂带、VR 头显与 PC 调试场景"
              width={1920}
              height={1080}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <Section
        id="ecosystem"
        eyebrow="01 产品生态"
        title="三端协同的康复训练闭环"
      >
        <div className="ecosystem-grid">
          <article className="ecosystem-card ecosystem-card--b">
            <div className="ecosystem-card__meta">
              <span className="ecosystem-card__label">
                <Monitor size={14} aria-hidden="true" />B 端
              </span>
              <h3>康复师远程管理后台</h3>
              <p>
                将可穿戴设备采集的多模态数据转化为康复师可操作的决策支持：风险分层、计划编辑、训练复盘、证据链追溯。
              </p>
              <ul className="ecosystem-card__specs">
                <li>工作台「需要判断」优先队列</li>
                <li>康复对象 360° 档案与风险标签</li>
                <li>训练计划版本对比与变更摘要</li>
                <li>通知中心 + 全局搜索</li>
              </ul>
              <Link
                className="project-button project-button--small"
                to="/dashboard"
              >
                进入后台 →
              </Link>
            </div>
            <div className="ecosystem-card__visual">
              <img
                src={asset("assets/showcase/console-dashboard.webp")}
                alt="ElderlyGardener B 端工作台截图"
                loading="lazy"
              />
            </div>
          </article>

          <article className="ecosystem-card ecosystem-card--c">
            <div className="ecosystem-card__meta">
              <span className="ecosystem-card__label">
                <Dumbbell size={14} aria-hidden="true" />C 端 · 硬件
              </span>
              <h3>可穿戴园艺训练套件</h3>
              <p>
                前臂绑带集成
                IMU、弯曲传感器与压力传感器，配合气动气囊与震动马达，把枯燥的上肢训练变成有反馈的园艺任务。
              </p>
              <ul className="ecosystem-card__specs">
                <li>IMU 姿态 + 弯曲角度 + 握力压力</li>
                <li>气动 / 震动即时触觉反馈</li>
                <li>动作完成度实时判定</li>
                <li>轻量化织物绑带，便于居家佩戴</li>
              </ul>
            </div>
            <div className="ecosystem-card__visual">
              <img
                src={asset("assets/case-study/imu-module.webp")}
                alt="C 端可穿戴传感器模块与 Arduino 测试"
                loading="lazy"
              />
            </div>
          </article>

          <article className="ecosystem-card ecosystem-card--vr">
            <div className="ecosystem-card__meta">
              <span className="ecosystem-card__label">
                <Monitor size={14} aria-hidden="true" />
                VR 端
              </span>
              <h3>沉浸式园艺训练场景</h3>
              <p>
                以「银龄园艺小站」为叙事空间，老人在 VR
                中完成浇水、松土、摘果等任务，系统自动记录动作幅度与完成质量。
              </p>
              <ul className="ecosystem-card__specs">
                <li>三段式任务：浇水 → 松土 → 摘果</li>
                <li>视觉进度与正向强化</li>
                <li>低晕动症交互：定点注视 + 手势触发</li>
                <li>训练数据自动同步后台</li>
              </ul>
            </div>
            <div className="ecosystem-card__visual">
              <img
                src={asset("assets/case-study/vr-garden-scenes.webp")}
                alt="VR 园艺训练场景：银龄园艺小站、浇水、松土与摘果任务"
                loading="lazy"
              />
            </div>
          </article>
        </div>
      </Section>

      {/* Problem evidence */}
      <Section
        id="problem"
        variant="subtle"
        eyebrow="02 背景与问题"
        title="为什么用园艺做上肢康复？"
      >
        <p className="project-section__lead">
          中国 60 岁以上人口已突破 2.8
          亿，脑卒中、骨折术后与慢性病导致的上肢功能障碍严重影响老人独立生活能力。居家康复可及性高，但长期依从性不足
          30%。
        </p>
        <div className="stats-grid">
          <div className="stats-card">
            <span className="stats-card__value">2.8 亿+</span>
            <span className="stats-card__label">中国 60 岁以上人口</span>
          </div>
          <div className="stats-card">
            <span className="stats-card__value">70%</span>
            <span className="stats-card__label">
              脑卒中患者存在上肢功能障碍
            </span>
          </div>
          <div className="stats-card">
            <span className="stats-card__value">20–35%</span>
            <span className="stats-card__label">规范居家康复可提升恢复率</span>
          </div>
          <div className="stats-card stats-card--emphasis">
            <span className="stats-card__value">&lt;30%</span>
            <span className="stats-card__label">居家康复长期坚持率</span>
          </div>
        </div>
        <DemoBadge label="[公开统计数据]" variant="public">
          <div className="stats-source">
            <p>
              数据来源：国家统计局第七次全国人口普查及年度统计公报（60
              岁以上人口规模）；《中国脑卒中防治报告》（脑卒中后上肢功能障碍比例）；国家卫健委《老年人失能预防核心信息》与康复医学领域公开研究（规范居家康复的恢复率提升区间与长期依从性数据）。
            </p>
            <p>
              以上数字为公开统计口径的约数。本作品为学术概念原型，引用数据仅用于说明问题背景，不构成临床结论。
            </p>
          </div>
        </DemoBadge>
      </Section>

      {/* Research process */}
      <Section
        id="research"
        eyebrow="03 研究方法"
        title="从问题到产品的研究链路"
      >
        <p className="project-section__lead">
          围绕「动作有效性—转译可行性—康复师决策支持」三个层次，依次完成文献调研、竞品分析、康复师访谈、动作分析、EMG
          验证、用户研究与可用性测试方案设计。
        </p>
        <ResearchTimeline />
        <MethodMatrix />
        <div className="method-charts">
          <MethodMixChart />
        </div>
        <CompetitorMatrix />
        <LiteratureReviewCards />
        <InterviewGuide />
        <HeuristicTable />
        <div className="insight-highlights">
          <h3 className="project-section__h3">
            <BrainCircuit
              size={20}
              className="inline-icon"
              aria-hidden="true"
            />
            关键洞察
          </h3>
          <div className="insight-cards">
            <div className="insight-card">
              <span className="insight-card__num">01</span>
              <strong>老人抗拒的不是训练，而是「无意义重复」</strong>
              <p>园艺任务具备叙事性、成就感与情感价值，能提升长期坚持意愿。</p>
            </div>
            <div className="insight-card">
              <span className="insight-card__num">02</span>
              <strong>康复师最怕「数据多、信号杂」</strong>
              <p>
                他们需要优先看到「谁需要我出手、为什么、证据是什么」，而不是总分
                KPI。
              </p>
            </div>
            <div className="insight-card">
              <span className="insight-card__num">03</span>
              <strong>AI 不能替代临床判断，但必须可见可控</strong>
              <p>系统应区分事实、推测与用户自述，让康复师保留最终决策权。</p>
            </div>
          </div>
        </div>
        <div className="method-validation">
          <h3 className="project-section__h3">
            <Activity size={20} className="inline-icon" aria-hidden="true" />
            动作验证：EMG 与问卷
          </h3>
          <div className="method-validation__grid">
            <div className="method-validation__left">
              <p className="method-validation__intro">
                将 5 个标准上肢动作转译为对应园艺任务后，以
                %MVIC（最大自主等长收缩百分比）归一化目标肌群激活强度。结果显示各动作激活均保持在
                70% MVIC 以上，「动作转译」没有稀释训练强度。
              </p>
              <EMGChart />
            </div>
            <img
              src={asset("assets/case-study/method-emg-mapping.webp")}
              alt="EMG 动作映射：5 个标准上肢训练动作与目标肌群"
              loading="lazy"
              className="method-validation__image"
            />
          </div>
          <EMGReport />
          <div className="survey-section">
            <SurveyChart />
            <SurveyInsights />
          </div>
        </div>
      </Section>

      {/* Personas & Journey */}
      <Section
        id="users"
        variant="subtle"
        eyebrow="04 用户洞察"
        title="康复师画像与旅程地图"
      >
        <p className="project-section__lead">
          基于康复师访谈与二手研究，构建核心用户画像，并用旅程地图定位情绪低点与
          B 端设计机会。
        </p>
        <div className="persona-grid">
          {personas.map((p) => (
            <div className="persona-card" key={p.id}>
              <div className="persona-card__header">
                <img
                  src={asset(p.avatar)}
                  alt={p.name}
                  className="persona-card__avatar persona-card__avatar--img"
                  loading="lazy"
                />
                <div>
                  <strong>{p.name}</strong>
                  <span>
                    {p.role} · {p.age}
                  </span>
                </div>
              </div>
              <p className="persona-card__goal">
                <strong>目标：</strong>
                {p.goal}
              </p>
              <p className="persona-card__pain">
                <strong>痛点：</strong>
                {p.pain}
              </p>
              <p className="persona-card__day">
                <strong>典型一天：</strong>
                {p.day}
              </p>
              <blockquote className="persona-card__quote">
                「{p.quote}」
              </blockquote>
            </div>
          ))}
        </div>

        <h3 className="project-section__h3">
          <HeartPulse size={20} className="inline-icon" aria-hidden="true" />
          康复师用户旅程地图
        </h3>
        <JourneyEmotionChart />
        <JourneyStoryboard />
        <div className="journey-map">
          <div className="journey-map__track">
            {journeyStages.map((s) => (
              <div className="journey-map__stage" key={s.stage}>
                <h5>{s.stage}</h5>
                <div
                  className="journey-map__emotion"
                  aria-label={`情绪得分 ${s.emotion} / 5`}
                >
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < s.emotion;
                    const tone =
                      s.emotion <= 2
                        ? "low"
                        : s.emotion === 3
                          ? "medium"
                          : "high";
                    return (
                      <span
                        key={i}
                        className={`journey-map__dot ${filled ? `journey-map__dot--${tone}` : "journey-map__dot--off"}`}
                        aria-hidden="true"
                      >
                        ●
                      </span>
                    );
                  })}
                </div>
                <div>
                  <div className="journey-map__label">触点</div>
                  <div className="journey-map__value">{s.touchpoint}</div>
                </div>
                <div>
                  <div className="journey-map__label">痛点</div>
                  <div className="journey-map__value">{s.pain}</div>
                </div>
                <div>
                  <div className="journey-map__label">机会</div>
                  <div className="journey-map__value">{s.opportunity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Design translation */}
      <Section
        id="design"
        eyebrow="05 设计决策"
        title="把标准动作转译为园艺任务"
      >
        <p className="project-section__lead">
          基于文献与动作分析，选取五种标准上肢训练动作，并将它们映射到老人熟悉、具身、可叙事的园艺任务，每个任务对应明确的肌肉群与传感器判定规则。
        </p>
        <div className="action-gardening">
          <div className="action-gardening__demo" aria-label="园艺动作演示">
            {[
              { label: "耙土", Icon: Shrub, muscle: "背 / 肩后束" },
              { label: "移栽", Icon: Sprout, muscle: "肱二头肌" },
              { label: "浇水", Icon: Droplets, muscle: "三角肌" },
              { label: "修剪", Icon: Scissors, muscle: "肩 / 上背" },
              { label: "摘果", Icon: Apple, muscle: "前臂 / 手部" },
            ].map((a, i) => (
              <div
                className="action-gardening__step"
                key={a.label}
                style={{ animationDelay: `${i * 0.6}s` }}
              >
                <span className="action-gardening__icon" aria-hidden="true">
                  <a.Icon size={24} />
                </span>
                <strong>{a.label}</strong>
                <span>{a.muscle}</span>
              </div>
            ))}
          </div>
        </div>
        <ExerciseMap />
        <div className="design-intervention">
          <h3 className="project-section__h3">
            <Sprout size={20} className="inline-icon" aria-hidden="true" />
            设计介入策略
          </h3>
          <img
            src={asset("assets/case-study/method-design-intervention.webp")}
            alt="设计介入三阶段：进入训练、参与训练、坚持训练"
            loading="lazy"
            className="design-intervention__image"
          />
        </div>
        <h3 className="project-section__h3">
          <BrainCircuit size={20} className="inline-icon" aria-hidden="true" />
          系统逻辑与反馈闭环
        </h3>
        <ArchitectureCarousel />
        <h3 className="project-section__h3">
          <ShieldCheck size={20} className="inline-icon" aria-hidden="true" />
          设计原则
        </h3>
        <div className="design-principles">
          {designPrinciples.map((p) => (
            <div className="design-principles__card" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* C-end prototype */}
      <Section
        id="prototype"
        variant="subtle"
        eyebrow="06 C 端原型"
        title="从硬件原型到 VR 园艺场景"
      >
        <p className="project-section__lead">
          第一代功能原型包括前臂绑带（IMU + 弯曲 + 压力传感器）、Arduino
          控制的气动/震动反馈模块，以及「银龄园艺小站」VR 训练场景。
        </p>
        <div className="prototype-grid">
          <figure className="prototype-figure">
            <img
              src={asset("assets/case-study/prototype-feedback.webp")}
              alt="第一代功能原型：传感器绑带、Arduino 调试与 VR 头显联调"
              loading="lazy"
            />
            <figcaption>
              第一代功能原型：传感器绑带 + Arduino 调试 + VR 头显联调
            </figcaption>
          </figure>
          <figure className="prototype-figure">
            <img
              src={asset("assets/case-study/usability-user-test.webp")}
              alt="用户测试：真实使用者佩戴原型设备完成训练任务"
              loading="lazy"
            />
            <figcaption>用户测试：真实使用者完成训练任务并给出反馈</figcaption>
          </figure>
        </div>
        {/* 硬件实机演示：短循环（hardware-demo.mp4）+ 完整介绍片弹层（intro-full-720p.mp4） */}
        <figure className="prototype-figure prototype-figure--video">
          <LazyVideo
            className="prototype-figure__video"
            src={asset("assets/case-study/hardware-demo.mp4")}
            label="硬件实机演示：第一阶段「浇水」VR 园艺任务——抬手前伸动作识别、倒计时引导与 PERFECT 即时判定"
          />
          <figcaption>
            <span>
              硬件实机演示：真人「浇水」动作示范 → VR 任务 · 倒计时引导 ·
              PERFECT 即时判定
            </span>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button type="button" className="prototype-video-full-btn">
                  观看完整介绍片
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="demo-video-overlay" />
                <Dialog.Content
                  className="demo-video-dialog"
                  aria-describedby={undefined}
                >
                  <div className="demo-video-header">
                    <div>
                      <span className="demo-video-kicker">FULL DEMO REEL</span>
                      <Dialog.Title>
                        ElderlyGardener · 完整介绍片（3′34″）
                      </Dialog.Title>
                    </div>
                    <Dialog.Close
                      className="demo-video-close"
                      aria-label="关闭完整介绍片"
                    >
                      ×
                    </Dialog.Close>
                  </div>
                  <IntroReelVideo />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </figcaption>
        </figure>
        <PilotStoryboard />
        <DemoBadge label="[课程原始数据]" variant="original">
          <p style={{ margin: 0 }}>
            来自课程汇报 p.24
            的用户测试反馈：老人认可即时反馈与任务化设计，但指出步骤切换不够清晰、震动频繁会打断节奏、以及难以判断是角度还是力度不足。这些发现直接推动了
            B 端「不确定性可见」与「证据链复盘」的设计原则。
          </p>
        </DemoBadge>
      </Section>

      {/* B-side product */}
      <Section
        id="b-side"
        eyebrow="07 B 端落地"
        title="ElderlyGardener · 康复师远程训练管理后台"
      >
        <p className="project-section__lead">
          为了让康复师能够远程管理多名老人的训练数据，我从 C
          端训练系统延展设计了 B
          端后台。它以「证据优先、人工可控、不确定性可见、全程可追溯」为原则，把传感器数据转化为可操作的决策支持。
        </p>
        <div className="console-gallery">
          <figure className="console-gallery__item">
            <img
              src={asset("assets/showcase/console-clients.webp")}
              alt="康复对象管理页"
              loading="lazy"
            />
            <figcaption>康复对象管理 · 多维筛选与风险分层</figcaption>
          </figure>
          <figure className="console-gallery__item">
            <img
              src={asset("assets/showcase/console-sessions.webp")}
              alt="训练记录列表"
              loading="lazy"
            />
            <figcaption>训练记录 · 状态筛选与复盘入口</figcaption>
          </figure>
          <figure className="console-gallery__item">
            <img
              src={asset("assets/showcase/console-analytics.webp")}
              alt="数据看板"
              loading="lazy"
            />
            <figcaption>数据看板 · KPI、风险分层与康复师负载</figcaption>
          </figure>
        </div>
        <div
          className="project-hero__actions"
          style={{ justifyContent: "center", marginTop: "28px" }}
        >
          <Link
            className="project-button project-button--primary"
            to="/dashboard"
          >
            打开 B 端后台
          </Link>
          <Link className="project-button project-button--secondary" to="/prd">
            阅读产品 PRD
          </Link>
        </div>
      </Section>

      {/* Usability */}
      <Section
        id="usability"
        variant="subtle"
        eyebrow="08 可用性验证"
        title="B 端后台可用性测试方案"
      >
        <p className="project-section__lead">
          基于用户旅程地图中的关键痛点，为 ElderlyGardener B
          端后台设计了混合型可用性测试方案，聚焦「发现异常 → 复核证据 → 调整计划
          → 记录判断」的核心闭环。
        </p>
        <div className="usability-detail">
          <div className="usability-detail__section">
            <h4 className="project-section__h4">
              <Users size={18} className="inline-icon" aria-hidden="true" />
              参与者与招募
            </h4>
            <p>
              <strong>{usabilityProtocol.recruitment.sample}</strong> ·{" "}
              {usabilityProtocol.recruitment.criteria}
            </p>
            <ul>
              {usabilityProtocol.recruitment.profiles.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="usability-detail__section">
            <h4 className="project-section__h4">
              <Monitor size={18} className="inline-icon" aria-hidden="true" />
              测试环境与设施
            </h4>
            <p>{usabilityProtocol.environment}</p>
            <ul>
              <li>{usabilityProtocol.setup.device}</li>
              <li>{usabilityProtocol.setup.browser}</li>
              <li>{usabilityProtocol.setup.data}</li>
              <li>{usabilityProtocol.setup.scenarios}</li>
            </ul>
          </div>
          <div className="usability-detail__section">
            <h4 className="project-section__h4">
              <ClipboardList
                size={18}
                className="inline-icon"
                aria-hidden="true"
              />
              测量量表
            </h4>
            <div className="scale-cards">
              {usabilityProtocol.scales.map((s) => (
                <div className="scale-card" key={s.name}>
                  <strong>{s.name}</strong>
                  <span>{s.full}</span>
                  <span>{s.use}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="usability-detail__section">
            <h4 className="project-section__h4">
              <LineChart size={18} className="inline-icon" aria-hidden="true" />
              测试流程
            </h4>
            <div className="procedure-steps">
              {usabilityProtocol.procedure.map((p, i) => (
                <div className="procedure-step" key={p.step}>
                  <span className="procedure-step__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{p.step}</strong>
                    <span>{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="usability-layout">
          <div className="usability-layout__main">
            <div className="metric-cards">
              {usabilityProtocol.metrics.map((m) => (
                <div
                  className="metric-cards__item"
                  key={m.name}
                  title={m.description}
                >
                  <span className="metric-cards__value">{m.target}</span>
                  <span className="metric-cards__label">{m.name}</span>
                </div>
              ))}
            </div>
            <h3 className="project-section__h3" style={{ marginTop: 0 }}>
              关键发现
            </h3>
            <ul className="findings-list">
              {usabilityFindings.map((f, i) => (
                <li key={i}>
                  <span
                    className={`findings-list__badge findings-list__badge--${
                      f.severity === "正向"
                        ? "positive"
                        : f.severity === "高"
                          ? "high"
                          : "medium"
                    }`}
                  >
                    {f.severity}
                  </span>
                  <span>{f.finding}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="usability-layout__side">
            <UsabilityChart />
            <div className="chart-card usability-side-card">
              <h4 className="chart-card__title">
                <Users size={18} className="inline-icon" aria-hidden="true" />
                测试对象构成（{usabilityProtocol.recruitment.sample}）
              </h4>
              <ul className="usability-side-card__list">
                {usabilityProtocol.recruitment.profiles.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="chart-card usability-side-card">
              <h4 className="chart-card__title">
                <Monitor size={18} className="inline-icon" aria-hidden="true" />
                测试情境
              </h4>
              <p>{usabilityProtocol.setup.scenarios}</p>
              <small>{usabilityProtocol.environment}</small>
            </div>
          </div>
        </div>
      </Section>

      {/* Reflection */}
      <Section id="reflection" eyebrow="09 反思与迭代" title="局限性与未来方向">
        <p className="project-section__lead">
          作为面向作品集的概念原型，本项目在严谨性与完整性上仍有明确局限。我在此透明列出，并作为下一步迭代的方向。
        </p>
        <ul className="reflection-list">
          {reflections.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </Section>

      {/* Author */}
      <Section
        id="author"
        variant="subtle"
        eyebrow="10 关于作者"
        title={authorBio.name}
      >
        <div className="author-card">
          <div className="author-card__avatar" aria-hidden="true">
            {authorBio.name[0]}
          </div>
          <div>
            <h3 className="author-card__name">{authorBio.name}</h3>
            <span className="author-card__title">{authorBio.title}</span>
            <p className="author-card__intro">{authorBio.intro}</p>
            <p className="author-card__contact">
              {authorBio.email} · {authorBio.phone}
            </p>
            <CopyEmailButton email={authorBio.email} />
          </div>
        </div>
      </Section>
    </div>
  );
}
