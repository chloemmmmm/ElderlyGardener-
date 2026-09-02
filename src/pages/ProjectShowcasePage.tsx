import { useEffect } from "react";
import { Link } from "react-router-dom";

import { getPublicAssetUrl } from "../config/public-path";
import {
  authorBio,
  dataDisclaimer,
  designPrinciples,
  journeyStages,
  personas,
  reflections,
  usabilityFindings,
  usabilityProtocol,
} from "../mocks/research-data";
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
        {eyebrow ? <span className="project-section__eyebrow">{eyebrow}</span> : null}
        <h2 className="project-section__title">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function ResearchTimeline() {
  const steps = [
    { n: "01", label: "问题域", desc: "老龄化 + 上肢功能障碍 + 居家康复依从性低" },
    { n: "02", label: "文献调研", desc: "园艺动作可转译为标准化上肢训练" },
    { n: "03", label: "用户研究", desc: "康复师访谈 · 用户画像 · 旅程地图" },
    { n: "04", label: "设计决策", desc: "动作映射 · 多模态反馈 · 证据优先" },
    { n: "05", label: "原型验证", desc: "C 端硬件 + VR 场景 + B 端后台" },
    { n: "06", label: "可用性测试", desc: "核心闭环任务 · 指标度量 · 迭代" },
  ];
  return (
    <div className="research-timeline">
      <div className="research-timeline__line" aria-hidden="true" />
      <div className="research-timeline__items">
        {steps.map((s) => (
          <div className="research-timeline__item" key={s.n}>
            <span className="research-timeline__num">{s.n}</span>
            <strong>{s.label}</strong>
            <span>{s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExerciseMap() {
  const rows = [
    { exercise: "坐姿划船 Seated Row", muscle: "背 / 肩后束", garden: "耙土整地", icon: "𑁍" },
    { exercise: "臂弯举 Arm Curl", muscle: "肱二头肌", garden: "移栽幼苗", icon: "🌱" },
    { exercise: "侧平举 Side Arm Raise", muscle: "三角肌", garden: "浇水施肥", icon: "💧" },
    { exercise: "过头举 Overhead Raise", muscle: "肩 / 上背", garden: "修剪枝条", icon: "✂" },
    { exercise: "握力训练 Hand Grip", muscle: "前臂 / 手部", garden: "采摘果实", icon: "🍎" },
  ];
  return (
    <div className="exercise-map">
      {rows.map((r) => (
        <div className="exercise-map__row" key={r.exercise}>
          <div className="exercise-map__cell exercise-map__cell--exercise">
            <span className="exercise-map__icon" aria-hidden="true">
              {r.icon}
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

function SystemLogicFlow() {
  return (
    <div className="system-flow">
      <svg viewBox="0 0 720 180" className="system-flow__svg" role="img" aria-label="系统反馈闭环">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#176b55" />
          </marker>
        </defs>
        <g className="system-flow__node" transform="translate(20,60)">
          <rect width="120" height="60" rx="8" fill="#e8f2ee" stroke="#176b55" />
          <text x="60" y="28" textAnchor="middle" fill="#153c32" fontSize="12" fontWeight="700">
            用户动作
          </text>
          <text x="60" y="45" textAnchor="middle" fill="#557166" fontSize="10">
            拉 / 屈 / 举 / 握
          </text>
        </g>
        <line x1="140" y1="90" x2="180" y2="90" stroke="#176b55" strokeWidth="2" markerEnd="url(#arrow)" />
        <g className="system-flow__node" transform="translate(180,50)">
          <rect width="140" height="80" rx="8" fill="#f7fbf9" stroke="#bad0c8" />
          <text x="70" y="28" textAnchor="middle" fill="#153c32" fontSize="12" fontWeight="700">
            多模态采集
          </text>
          <text x="70" y="48" textAnchor="middle" fill="#557166" fontSize="10">
            IMU · 弯曲传感器
          </text>
          <text x="70" y="64" textAnchor="middle" fill="#557166" fontSize="10">
            压力传感器
          </text>
        </g>
        <line x1="320" y1="90" x2="360" y2="90" stroke="#176b55" strokeWidth="2" markerEnd="url(#arrow)" />
        <g className="system-flow__node" transform="translate(360,55)">
          <rect width="130" height="70" rx="8" fill="#e8f2ee" stroke="#176b55" />
          <text x="65" y="30" textAnchor="middle" fill="#153c32" fontSize="12" fontWeight="700">
            组合判定
          </text>
          <text x="65" y="48" textAnchor="middle" fill="#557166" fontSize="10">
            角度 + 力度 + 时序
          </text>
        </g>
        <line x1="490" y1="90" x2="530" y2="90" stroke="#176b55" strokeWidth="2" markerEnd="url(#arrow)" />
        <g className="system-flow__node" transform="translate(530,50)">
          <rect width="160" height="80" rx="8" fill="#f7fbf9" stroke="#bad0c8" />
          <text x="80" y="28" textAnchor="middle" fill="#153c32" fontSize="12" fontWeight="700">
            差异化反馈
          </text>
          <text x="80" y="48" textAnchor="middle" fill="#557166" fontSize="10">
            气动 · 震动 · VR 视觉
          </text>
          <text x="80" y="64" textAnchor="middle" fill="#557166" fontSize="10">
            纠偏 / 正向强化
          </text>
        </g>
      </svg>
    </div>
  );
}

export function ProjectShowcasePage() {
  useEffect(() => {
    document.title = "项目展示｜康护园";
  }, []);

  return (
    <div className="project-showcase">
      {/* Hero */}
      <section className="project-hero">
        <div className="project-section__inner project-hero__inner">
          <div className="project-hero__copy">
            <span className="project-section__eyebrow">全链路产品设计 · 实习作品集</span>
            <h1 className="project-hero__title">
              康护园
              <br />
              老年园艺上肢康复训练系统
            </h1>
            <p className="project-hero__lead">
              面向认知障碍与高龄老人的上肢康复训练方案：C 端可穿戴园艺套件 + VR
              沉浸式训练场景 + B 端康复师远程管理后台，从研究洞察到可交互产品原型的完整链路。
            </p>
            <div className="project-hero__tags">
              <span className="project-tag">用户研究</span>
              <span className="project-tag">交互设计</span>
              <span className="project-tag">硬件原型</span>
              <span className="project-tag">VR 场景</span>
              <span className="project-tag">React + TypeScript</span>
            </div>
            <div className="project-hero__actions">
              <Link className="project-button project-button--primary" to="/dashboard">
                进入 B 端后台演示
              </Link>
              <Link className="project-button project-button--secondary" to="/prd">
                查看产品 PRD
              </Link>
            </div>
            <p className="project-hero__note" role="note">
              <strong>数据说明：</strong>
              {dataDisclaimer}
            </p>
          </div>
          <div className="project-hero__media">
            <img
              src={asset("assets/case-study/fig-cover.png")}
              alt="康护园系统概念图：可穿戴设备、VR 园艺场景与康复师后台"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <Section id="ecosystem" eyebrow="01 产品生态" title="三端协同的康复训练闭环">
        <div className="ecosystem-grid">
          <article className="ecosystem-card ecosystem-card--b">
            <div className="ecosystem-card__meta">
              <span className="ecosystem-card__label">B 端</span>
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
              <Link className="project-button project-button--small" to="/dashboard">
                进入后台 →
              </Link>
            </div>
            <div className="ecosystem-card__visual">
              <img
                src={asset("assets/showcase/console-dashboard.png")}
                alt="康护园 B 端工作台截图"
                loading="lazy"
              />
            </div>
          </article>

          <article className="ecosystem-card ecosystem-card--c">
            <div className="ecosystem-card__meta">
              <span className="ecosystem-card__label">C 端 · 硬件</span>
              <h3>可穿戴园艺训练套件</h3>
              <p>
                前臂绑带集成 IMU、弯曲传感器与压力传感器，配合气动气囊与震动马达，把枯燥的上肢训练变成有反馈的园艺任务。
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
                src={asset("assets/case-study/fig-imu-module.png")}
                alt="C 端可穿戴传感器模块与 Arduino 测试"
                loading="lazy"
              />
            </div>
          </article>

          <article className="ecosystem-card ecosystem-card--vr">
            <div className="ecosystem-card__meta">
              <span className="ecosystem-card__label">VR 端</span>
              <h3>沉浸式园艺训练场景</h3>
              <p>
                以「银龄园艺小站」为叙事空间，老人在 VR 中完成浇水、松土、摘果等任务，系统自动记录动作幅度与完成质量。
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
                src={asset("assets/case-study/fig-vr-scene.png")}
                alt="VR 园艺训练场景截图"
                loading="lazy"
              />
            </div>
          </article>
        </div>
      </Section>

      {/* Problem evidence */}
      <Section id="problem" variant="subtle" eyebrow="02 背景与问题" title="为什么用园艺做上肢康复？">
        <p className="project-section__lead">
          中国 60 岁以上人口已突破 2.8 亿，脑卒中、骨折术后与慢性病导致的上肢功能障碍严重影响老人独立生活能力。居家康复可及性高，但长期依从性不足 30%。
        </p>
        <div className="stats-grid">
          <div className="stats-card">
            <span className="stats-card__value">2.8 亿+</span>
            <span className="stats-card__label">中国 60 岁以上人口</span>
          </div>
          <div className="stats-card">
            <span className="stats-card__value">70%</span>
            <span className="stats-card__label">脑卒中患者存在上肢功能障碍</span>
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
          <p style={{ margin: 0 }}>
            数据来源：国家卫健委、老年康复领域公开统计。本作品引用数据仅用于说明问题背景。
          </p>
        </DemoBadge>
      </Section>

      {/* Research process */}
      <Section id="research" eyebrow="03 研究方法" title="从问题到产品的研究链路">
        <p className="project-section__lead">
          围绕「动作有效性—转译可行性—康复师决策支持」三个层次，依次完成文献调研、动作分析、用户研究与可用性测试方案设计。
        </p>
        <ResearchTimeline />
        <div className="insight-highlights">
          <h3 className="project-section__h3">关键洞察</h3>
          <div className="insight-cards">
            <div className="insight-card">
              <span className="insight-card__num">01</span>
              <strong>老人抗拒的不是训练，而是「无意义重复」</strong>
              <p>园艺任务具备叙事性、成就感与情感价值，能提升长期坚持意愿。</p>
            </div>
            <div className="insight-card">
              <span className="insight-card__num">02</span>
              <strong>康复师最怕「数据多、信号杂」</strong>
              <p>他们需要优先看到「谁需要我出手、为什么、证据是什么」，而不是总分 KPI。</p>
            </div>
            <div className="insight-card">
              <span className="insight-card__num">03</span>
              <strong>AI 不能替代临床判断，但必须可见可控</strong>
              <p>系统应区分事实、推测与用户自述，让康复师保留最终决策权。</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Personas & Journey */}
      <Section id="users" variant="subtle" eyebrow="04 用户洞察" title="康复师画像与旅程地图">
        <DemoBadge label="[演示样例]" variant="demo" hint="画像与旅程地图基于二手研究与角色假设构建，用于定位 B 端设计机会。">
          <div className="persona-grid">
            {personas.map((p) => (
              <div className="persona-card" key={p.id}>
                <div className="persona-card__header">
                  <span className="persona-card__avatar" aria-hidden="true">
                    {p.name[0]}
                  </span>
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
                <blockquote className="persona-card__quote">「{p.quote}」</blockquote>
              </div>
            ))}
          </div>
        </DemoBadge>

        <DemoBadge label="[演示样例]" variant="demo" hint="旅程地图用于识别康复师在工作各阶段的情绪低点与设计机会。">
          <h3 className="project-section__h3">康复师用户旅程地图</h3>
          <div className="journey-map">
            <div className="journey-map__track">
              {journeyStages.map((s) => (
                <div className="journey-map__stage" key={s.stage}>
                  <h5>{s.stage}</h5>
                  <div className="journey-map__emotion" aria-label={`情绪得分 ${s.emotion} / 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ opacity: i < s.emotion ? 1 : 0.25 }}>
                        ●
                      </span>
                    ))}
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
        </DemoBadge>
      </Section>

      {/* Design translation */}
      <Section id="design" eyebrow="05 设计决策" title="把标准动作转译为园艺任务">
        <p className="project-section__lead">
          基于文献与动作分析，选取五种标准上肢训练动作，并将它们映射到老人熟悉、具身、可叙事的园艺任务，每个任务对应明确的肌肉群与传感器判定规则。
        </p>
        <ExerciseMap />
        <h3 className="project-section__h3">系统逻辑与反馈闭环</h3>
        <SystemLogicFlow />
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
      <Section id="prototype" variant="subtle" eyebrow="06 C 端原型" title="从硬件原型到 VR 园艺场景">
        <p className="project-section__lead">
          第一代功能原型包括前臂绑带（IMU + 弯曲 + 压力传感器）、Arduino 控制的气动/震动反馈模块，以及「银龄园艺小站」VR 训练场景。
        </p>
        <div className="prototype-grid">
          <figure className="prototype-figure">
            <img src={asset("assets/case-study/fig-prototype-demo.png")} alt="第一代功能原型测试场景" loading="lazy" />
            <figcaption>第一代功能原型：传感器绑带 + VR 头显联调</figcaption>
          </figure>
          <figure className="prototype-figure">
            <img src={asset("assets/case-study/fig-vr-scene.png")} alt="VR 园艺训练场景" loading="lazy" />
            <figcaption>VR 场景：银龄园艺小站中的浇水与摘果任务</figcaption>
          </figure>
        </div>
        <DemoBadge label="[课程原始数据]" variant="original">
          <p style={{ margin: 0 }}>
            来自课程汇报 p.11 的用户测试反馈：老人认可即时反馈与任务化设计，但指出步骤切换不够清晰、震动频繁会打断节奏、以及难以判断是角度还是力度不足。这些发现直接推动了 B 端「不确定性可见」与「证据链复盘」的设计原则。
          </p>
        </DemoBadge>
      </Section>

      {/* B-side product */}
      <Section id="b-side" eyebrow="07 B 端落地" title="康护园 · 康复师远程训练管理后台">
        <p className="project-section__lead">
          为了让康复师能够远程管理多名老人的训练数据，我从 C 端训练系统延展设计了 B 端后台。它以「证据优先、人工可控、不确定性可见、全程可追溯」为原则，把传感器数据转化为可操作的决策支持。
        </p>
        <div className="console-gallery">
          <figure className="console-gallery__item">
            <img src={asset("assets/showcase/console-clients.png")} alt="康复对象管理页" loading="lazy" />
            <figcaption>康复对象管理 · 多维筛选与风险分层</figcaption>
          </figure>
          <figure className="console-gallery__item">
            <img src={asset("assets/showcase/console-sessions.png")} alt="训练记录列表" loading="lazy" />
            <figcaption>训练记录 · 状态筛选与复盘入口</figcaption>
          </figure>
          <figure className="console-gallery__item">
            <img src={asset("assets/showcase/console-analytics.png")} alt="数据看板" loading="lazy" />
            <figcaption>数据看板 · KPI、风险分层与治疗师负载</figcaption>
          </figure>
        </div>
        <div className="project-hero__actions" style={{ justifyContent: "center", marginTop: "28px" }}>
          <Link className="project-button project-button--primary" to="/dashboard">
            打开 B 端后台
          </Link>
          <Link className="project-button project-button--secondary" to="/prd">
            阅读产品 PRD
          </Link>
        </div>
      </Section>

      {/* Usability */}
      <Section id="usability" variant="subtle" eyebrow="08 可用性验证" title="B 端后台可用性测试方案">
        <p className="project-section__lead">
          基于用户旅程地图中的关键痛点，为康护园 B 端后台设计了可用性测试方案，聚焦「发现异常 → 复核证据 → 调整计划 → 记录判断」的核心闭环。
        </p>
        <div className="metric-cards">
          {usabilityProtocol.metrics.map((m) => (
            <div className="metric-cards__item" key={m.name}>
              <span className="metric-cards__value">{m.target}</span>
              <span className="metric-cards__label">{m.name}</span>
            </div>
          ))}
        </div>
        <DemoBadge label="[演示样例]" variant="demo" hint="可用性测试协议、任务场景与发现均为演示样例，用于展示验证方法框架。">
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
        </DemoBadge>
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
      <Section id="author" variant="subtle" eyebrow="10 关于作者" title={authorBio.name}>
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
          </div>
        </div>
      </Section>
    </div>
  );
}
