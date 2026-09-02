import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPublicAssetUrl } from "../config/public-path";
import {
  authorBio,
  competitors,
  dataDisclaimer,
  designPrinciples,
  interviewGuide,
  journeyStages,
  literatureModules,
  personas,
  reflections,
  researchQuestions,
  usabilityFindings,
  usabilityProtocol,
} from "../mocks/research-data";
import { DemoBadge } from "./case-study/shared/DemoBadge";

const sections = [
  { id: "overview", label: "项目概览" },
  { id: "background", label: "背景与问题" },
  { id: "questions", label: "研究问题" },
  { id: "methods", label: "研究方法" },
  { id: "insights", label: "用户洞察" },
  { id: "design", label: "设计决策" },
  { id: "prototype", label: "C 端验证" },
  { id: "b-side", label: "B 端落地" },
  { id: "usability", label: "可用性验证" },
  { id: "reflection", label: "反思与迭代" },
  { id: "author", label: "关于作者" },
];

function asset(path: string) {
  return getPublicAssetUrl(import.meta.env.BASE_URL, path);
}

function Section({
  id,
  variant,
  eyebrow,
  title,
  children,
}: {
  id: string;
  variant?: "default" | "subtle" | "surface";
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  const variantClass =
    variant === "subtle"
      ? "case-study__section--subtle"
      : variant === "surface"
        ? "case-study__section--surface"
        : "";
  return (
    <section id={id} className={`case-study__section ${variantClass}`}>
      <div className="case-study__container">
        {eyebrow ? <span className="case-study__eyebrow">{eyebrow}</span> : null}
        <h2 className="case-study__h2">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="case-study__figure">
      <img src={src} alt={alt} loading="lazy" />
      <figcaption className="case-study__figcaption">{caption}</figcaption>
    </figure>
  );
}

export function CaseStudyPage() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    document.title = "案例展示｜康护园";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="case-study">
      <aside className="case-study__toc" aria-label="案例展示目录">
        <nav>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={activeSection === s.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* 0. Hero */}
      <section id="overview" className="case-study__section case-study__section--surface">
        <div className="case-study__container">
          <span className="case-study__eyebrow">全链路产品设计 · 实习作品集</span>
          <h1 className="case-study__title">
            老年园艺 · 上肢康复训练系统
            <br />
            <span style={{ color: "var(--color-text-muted)", fontSize: "1.25rem", fontWeight: 400 }}>
              从 C 端 VR 园艺训练到 B 端康护园康复师管理后台
            </span>
          </h1>
          <p className="case-study__subtitle">
            基于可穿戴设备的多模态反馈康复训练系统，结合 VR 园艺场景与 AI 辅助决策，探索适老化设计与 B
            端管理平台的产品化路径。
          </p>
          <div className="case-study__meta">
            <span className="case-study__tag">用户研究</span>
            <span className="case-study__tag">交互设计</span>
            <span className="case-study__tag">前端实现</span>
            <span className="case-study__tag">React + TypeScript</span>
            <span className="case-study__tag">2026.08</span>
          </div>
          <div className="case-study__actions">
            <a
              className="case-study__button case-study__button--primary"
              href="https://chloemmmmm.github.io/ElderlyGardener/"
              target="_blank"
              rel="noreferrer"
            >
              查看在线演示 →
            </a>
            <Link className="case-study__button case-study__button--secondary" to="/dashboard">
              进入康护园后台
            </Link>
          </div>
          <div className="case-study__disclaimer" role="note">
            <strong>数据说明：</strong>
            {dataDisclaimer}
          </div>
        </div>
      </section>

      {/* 1. Background */}
      <Section id="background" variant="subtle" eyebrow="01 背景与问题域" title="为什么用园艺做上肢康复？">
        <p className="case-study__lead">
          中国 60 岁以上人口已突破 2.8 亿，脑卒中、肩周炎、骨折术后等导致的上肢功能障碍严重影响老人独立生活能力。居家康复虽可及性高，但普遍存在依从性差、反馈滞后、难以坚持的问题。
        </p>
        <DemoBadge label="[公开统计数据]" variant="public">
          <p style={{ margin: 0 }}>
            国家卫健委数据显示，脑卒中后约 70% 患者存在上肢运动功能障碍；规范化的居家康复训练可将功能恢复率提升
            20%–35%，但长期坚持率不足 30%。
          </p>
        </DemoBadge>
        <p>
          传统康复训练往往以「计数+重复」为主，对老年人而言枯燥、抽象、缺少情境感。园艺活动则不同：耙土、移栽、浇水、修剪、采摘动作自然覆盖拉、屈、举、握四类上肢运动；同时，植物成长提供正向反馈，任务本身具有叙事性与情感价值，能够降低心理抗拒、提升长期坚持的可能性。
        </p>
        <Figure
          src={asset("assets/case-study/fig-literature-review.png")}
          alt="文献调研总览，将老年运动有效性逐步收束到园艺化上肢运动系统的设计机会"
          caption="图 1：文献调研将问题从「老人需要运动」收束到「园艺化上肢运动系统」的设计机会。来源：课程汇报 p.02"
        />
      </Section>

      {/* 2. Research Questions */}
      <Section id="questions" title="五个核心研究问题">
        <p className="case-study__lead">
          为了把文献洞察转化为可验证的设计方案，我将项目拆分为五个递进的研究问题，分别对应文献、动作映射、硬件反馈、康复师需求与 B 端决策支持。
        </p>
        <div className="case-study__cards">
          {researchQuestions.map((q) => (
            <div className="case-study__card" key={q.id}>
              <h4>
                {q.id} · {q.method}
              </h4>
              <p>{q.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 3. Methods */}
      <Section id="methods" variant="subtle" eyebrow="02 研究方法" title="混合方法：从二手证据到设计假设">
        <p className="case-study__lead">
          本项目采用混合方法：以文献调研建立证据基础，以动作映射与硬件实验验证可行性，再以康复师访谈、竞品分析与可用性测试推导 B 端设计决策。以下研究工具为作品集补充的演示样例，已做明确标注。
        </p>

        <h3 className="case-study__h3">文献调研五个模块</h3>
        <div className="case-study__cards">
          {literatureModules.map((m) => (
            <div className="case-study__card" key={m.title}>
              <h4>{m.title}</h4>
              <p>{m.finding}</p>
              <small>设计启示：{m.implication}</small>
            </div>
          ))}
        </div>

        <DemoBadge label="[演示样例]" variant="demo" hint="基于文献与二手资料构建的康复师半结构化访谈提纲，用于展示研究方法框架。">
          <h3 className="case-study__h3" style={{ marginTop: 0 }}>
            康复师半结构化访谈提纲
          </h3>
          <details className="case-study__details">
            <summary>展开 8 个核心问题</summary>
            <ol>
              {interviewGuide.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </details>
        </DemoBadge>

        <DemoBadge label="[演示样例]" variant="demo" hint="竞品分析维度和结论为示例，用于说明 B 端后台的差异化定位。">
          <h3 className="case-study__h3" style={{ marginTop: 0 }}>
            竞品分析矩阵
          </h3>
          <div className="case-study__table-wrap">
            <table className="case-study__table">
              <thead>
                <tr>
                  <th>产品</th>
                  <th>目标用户</th>
                  <th>主要优势</th>
                  <th>明显短板</th>
                  <th>决策支持</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.name}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>{c.audience}</td>
                    <td>{c.strengths}</td>
                    <td>{c.weakness}</td>
                    <td>{c.decisionSupport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DemoBadge>
      </Section>

      {/* 4. Insights */}
      <Section id="insights" eyebrow="03 用户洞察" title="康复师是谁，他们的一天如何度过？">
        <p className="case-study__lead">
          B 端康护园的目标用户是负责居家上肢训练随访的康复治疗师。通过用户画像与用户旅程地图，我们将分散在微信、电话、表格中的工作流可视化，找到信息密度、证据透明度与可追溯性三个关键设计机会。
        </p>

        <DemoBadge label="[演示样例]" variant="demo" hint="人物模型基于文献、二手资料与课程汇报中的康复师角色构建，用于展示研究推导过程。">
          <h3 className="case-study__h3" style={{ marginTop: 0 }}>
            用户画像
          </h3>
          <div className="case-study__columns">
            {personas.map((p) => (
              <div className="persona" key={p.id}>
                <div className="persona__avatar" aria-hidden="true">
                  {p.name[0]}
                </div>
                <div>
                  <h4 className="persona__name">
                    {p.name} · {p.role}
                  </h4>
                  <p className="persona__meta">
                    {p.age} · {p.caseload}
                  </p>
                  <p style={{ margin: "0.5rem 0", fontSize: "0.9375rem" }}>
                    <strong>目标：</strong>
                    {p.goal}
                  </p>
                  <p style={{ margin: "0.5rem 0", fontSize: "0.9375rem" }}>
                    <strong>痛点：</strong>
                    {p.pain}
                  </p>
                  <blockquote className="persona__quote">「{p.quote}」</blockquote>
                  <p className="persona__day">
                    <strong>典型一天：</strong>
                    {p.day}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DemoBadge>

        <DemoBadge label="[演示样例]" variant="demo" hint="用户旅程地图基于二手研究与角色假设构建，用于定位 B 端设计机会。">
          <h3 className="case-study__h3" style={{ marginTop: 0 }}>
            康复师用户旅程地图
          </h3>
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

      {/* 5. Design Decisions */}
      <Section id="design" variant="subtle" eyebrow="04 设计决策" title="把标准动作转译为园艺任务">
        <p className="case-study__lead">
          基于文献与动作分析，我选取了五种标准上肢训练动作，并将它们转译为老人熟悉、具身、可叙事的园艺任务。每个任务对应明确的肌肉群与传感器判定规则。
        </p>
        <Figure
          src={asset("assets/case-study/fig-emg-mapping.png")}
          alt="EMG 动作映射，展示五种上肢训练动作与对应的肌肉群电极贴放位置"
          caption="图 2：五种标准上肢动作（Seated Row / Arm Curl / Side Arm Raise / Overhead Raise / Hand Grip）与主要肌肉群。来源：课程汇报 p.03"
        />
        <Figure
          src={asset("assets/case-study/fig-gardening-translation.png")}
          alt="园艺活动转译，展示五种园艺动作与上肢训练动作的对应关系"
          caption="图 3：园艺活动转译——把拉、屈、举、握映射到耙土、移栽、浇水、修剪、摘果子。来源：课程汇报 p.04"
        />

        <h3 className="case-study__h3">系统逻辑与反馈闭环</h3>
        <p>
          系统通过 IMU、弯曲传感器与压力传感器采集用户动作，经「动作检测 → 姿态判定 → 压力传感」组合判断动作完成度，再触发气动或震动反馈。仅当当前动作满足条件时，才给出正向反馈；未完成时给出纠偏提示。
        </p>
        <Figure
          src={asset("assets/case-study/fig-system-logic.png")}
          alt="系统逻辑 V2，展示园艺任务阶段、多模态采集、系统组合判定与反馈闭环"
          caption="图 4：系统逻辑 V2 —— 园艺任务阶段、多模态采集、组合判定与差异化反馈。来源：课程汇报 p.07"
        />
        <Figure
          src={asset("assets/case-study/fig-action-judgment.png")}
          alt="动作判定示意图，展示修剪树枝与摘果子等动作的判定标准"
          caption="图 5：动作判定 —— 用关节角度与传感器阈值判断动作是否达标。来源：课程汇报 p.08"
        />
      </Section>

      {/* 6. Prototype Validation */}
      <Section id="prototype" eyebrow="05 C 端原型验证" title="从硬件原型到 VR 园艺场景">
        <p className="case-study__lead">
          为验证动作转译与反馈闭环的可行性，我搭建了第一代功能原型：前臂绑带集成 IMU、弯曲与压力传感器，配合 Arduino 控制气动气囊与震动马达；VR 场景则以「银龄园艺小站」为叙事空间，引导老人完成浇水、松土、摘果三个阶段的任务。
        </p>
        <Figure
          src={asset("assets/case-study/fig-imu-module.png")}
          alt="IMU 模块硬件测试，展示传感器绑带、Arduino 连接与数据采集"
          caption="图 6：IMU 模块硬件测试与数据采集。来源：课程汇报 p.06"
        />
        <Figure
          src={asset("assets/case-study/fig-prototype-demo.png")}
          alt="第一代功能原型，展示佩戴 VR 头显与传感器绑带的测试场景"
          caption="图 7：第一代功能原型与调试过程。来源：课程汇报 p.09"
        />
        <Figure
          src={asset("assets/case-study/fig-vr-scene.png")}
          alt="VR 园艺场景，展示银龄园艺小站与浇水、松土、摘果三个阶段"
          caption="图 8：VR 园艺场景 · 沉浸式上肢康复训练。来源：课程汇报 p.12"
        />

        <DemoBadge label="[课程原始数据]" variant="original">
          <h3 className="case-study__h3" style={{ marginTop: 0 }}>
            一代原型用户测试反馈
          </h3>
          <p style={{ margin: 0 }}>
            来自课程汇报 p.11 的用户测试原话显示：老人喜欢即时反馈与园艺任务化的设计，但也指出步骤切换不够清晰、震动频繁会打断节奏、以及难以判断是角度还是力度不足。
          </p>
        </DemoBadge>
        <DemoBadge label="[演示样例]" variant="demo" hint="为原型的用户测试补充实验设计框架，展示完整可用性研究方法。">
          <p>
            <strong>补充实验设计：</strong>
            采用被试内设计，每位老人依次完成 5 个园艺动作任务；记录任务完成率、动作纠偏次数、主观疲劳度与 NASA-TLX 负荷量表。假设：园艺任务化设计较传统动作指令可提升完成率并降低主观抗拒。
          </p>
        </DemoBadge>
      </Section>

      {/* 7. B-side */}
      <Section id="b-side" variant="subtle" eyebrow="06 B 端落地" title="康护园 · 康复师远程训练管理后台">
        <p className="case-study__lead">
          为了让康复师能够远程管理多名老人的训练数据，我从 C 端训练系统延展设计了 B 端后台「康护园」。它以「证据优先、人工可控、不确定性可见、全程可追溯」为原则，把传感器数据转化为康复师可操作的决策支持。
        </p>

        <h3 className="case-study__h3">B 端设计原则</h3>
        <div className="case-study__cards">
          {designPrinciples.map((p) => (
            <div className="case-study__card" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <Figure
          src={asset("assets/case-study/fig-b-dashboard.png")}
          alt="康护园工作台，展示需要判断的事项、今日安排、训练趋势与最新动态"
          caption="图 9：工作台 Dashboard —— 康复师决策中枢，优先展示需要判断的事项。来源：课程汇报 p.13"
        />
        <Figure
          src={asset("assets/case-study/fig-b-patient360-plan.png")}
          alt="康复对象管理与训练计划编辑，展示多维筛选、风险线索与动作参数配置"
          caption="图 10：康复对象管理（Patient 360）与训练计划编辑（Program Builder）。来源：课程汇报 p.14"
        />
        <Figure
          src={asset("assets/case-study/fig-b-session-detail.png")}
          alt="训练记录复盘与 AI 辅助决策，展示系统事实、动作表现、AI 摘要与用户反馈"
          caption="图 11：训练记录复盘 —— 区分系统事实、用户自述与 AI 待确认建议。来源：课程汇报 p.15"
        />
      </Section>

      {/* 8. Usability */}
      <Section id="usability" eyebrow="07 可用性验证" title="B 端后台的可用性测试方案">
        <p className="case-study__lead">
          基于用户旅程地图中的关键痛点，我为康护园 B 端后台设计了可用性测试方案，聚焦「发现异常 → 复核证据 → 调整计划 → 记录判断」的核心闭环。
        </p>

        <DemoBadge label="[演示样例]" variant="demo" hint="可用性测试协议、任务场景与发现均为演示样例，用于展示验证方法框架。">
          <h3 className="case-study__h3" style={{ marginTop: 0 }}>
            测试协议摘要
          </h3>
          <p>
            <strong>目的：</strong>
            {usabilityProtocol.purpose}
          </p>
          <p>
            <strong>招募：</strong>
            {usabilityProtocol.recruitment}
          </p>
          <p>
            <strong>环境：</strong>
            {usabilityProtocol.environment}
          </p>

          <h4 className="case-study__h4">度量指标</h4>
          <div className="metric-cards">
            {usabilityProtocol.metrics.map((m) => (
              <div className="metric-cards__item" key={m.name}>
                <span className="metric-cards__value">{m.target}</span>
                <span className="metric-cards__label">{m.name}</span>
              </div>
            ))}
          </div>

          <h4 className="case-study__h4">任务场景</h4>
          <ol className="task-list">
            {usabilityProtocol.tasks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>

          <h4 className="case-study__h4">关键发现（预设示例）</h4>
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

      {/* 9. Reflection */}
      <Section id="reflection" variant="subtle" eyebrow="08 反思与迭代" title="局限性与未来方向">
        <p className="case-study__lead">
          作为面向作品集的概念原型，本项目在严谨性与完整性上仍有明确局限。我在此透明列出，并作为下一步迭代的方向。
        </p>
        <ul className="case-study__list">
          {reflections.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <p>
          未来迭代将优先完成三件事：第一，补充 8–12 名康复治疗师的真实访谈，替换演示样例画像；第二，在 B
          端后台中实现「证据轨道」时间线与计划变更 diff 视图，把当前 P1 改版点落地为完整功能；第三，与临床康复团队合作，对 C
          端动作判定算法进行小样本验证。
        </p>
      </Section>

      {/* 10. Author */}
      <Section id="author" eyebrow="09 关于作者" title="徐伊宁">
        <div className="author-card">
          <div className="author-card__avatar" aria-hidden="true">
            徐
          </div>
          <div>
            <h3 className="author-card__name">{authorBio.name}</h3>
            <span className="author-card__title">{authorBio.title}</span>
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.9375rem", color: "var(--color-text-muted)" }}>
              {authorBio.intro}
            </p>
            <div className="author-card__contact">
              <span>📱 {authorBio.phone}</span>
              <span>✉️ {authorBio.email}</span>
              <span>📍 北京</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
