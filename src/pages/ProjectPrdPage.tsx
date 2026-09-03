import { useEffect } from "react";

import { getPublicAssetUrl } from "../config/public-path";

function asset(path: string) {
  return getPublicAssetUrl(import.meta.env.BASE_URL, path);
}

function ProductArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 760 240"
      className="prd-diagram"
      role="img"
      aria-label="康护园产品架构：C 端硬件、VR 端、B 端后台与云端数据服务"
    >
      <defs>
        <marker
          id="prd-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#176b55" />
        </marker>
      </defs>
      <rect
        x="20"
        y="80"
        width="160"
        height="90"
        rx="10"
        fill="#e8f2ee"
        stroke="#176b55"
        strokeWidth="2"
      />
      <text
        x="100"
        y="115"
        textAnchor="middle"
        fill="#153c32"
        fontSize="13"
        fontWeight="700"
      >
        C 端 · 可穿戴套件
      </text>
      <text x="100" y="135" textAnchor="middle" fill="#557166" fontSize="10">
        IMU · 弯曲 · 压力
      </text>
      <text x="100" y="150" textAnchor="middle" fill="#557166" fontSize="10">
        气动 / 震动反馈
      </text>

      <rect
        x="300"
        y="20"
        width="160"
        height="90"
        rx="10"
        fill="#f7fbf9"
        stroke="#bad0c8"
        strokeWidth="2"
      />
      <text
        x="380"
        y="55"
        textAnchor="middle"
        fill="#153c32"
        fontSize="13"
        fontWeight="700"
      >
        VR 端 · 园艺场景
      </text>
      <text x="380" y="75" textAnchor="middle" fill="#557166" fontSize="10">
        浇水 · 松土 · 摘果
      </text>
      <text x="380" y="90" textAnchor="middle" fill="#557166" fontSize="10">
        低晕动交互
      </text>

      <rect
        x="300"
        y="140"
        width="160"
        height="90"
        rx="10"
        fill="#f7fbf9"
        stroke="#bad0c8"
        strokeWidth="2"
      />
      <text
        x="380"
        y="175"
        textAnchor="middle"
        fill="#153c32"
        fontSize="13"
        fontWeight="700"
      >
        B 端 · 康复师后台
      </text>
      <text x="380" y="195" textAnchor="middle" fill="#557166" fontSize="10">
        工作台 · 计划 · 记录
      </text>
      <text x="380" y="210" textAnchor="middle" fill="#557166" fontSize="10">
        证据链 · AI 建议
      </text>

      <rect
        x="580"
        y="80"
        width="160"
        height="90"
        rx="10"
        fill="#e8f2ee"
        stroke="#176b55"
        strokeWidth="2"
      />
      <text
        x="660"
        y="115"
        textAnchor="middle"
        fill="#153c32"
        fontSize="13"
        fontWeight="700"
      >
        云端数据服务
      </text>
      <text x="660" y="135" textAnchor="middle" fill="#557166" fontSize="10">
        训练数据 · 证据链
      </text>
      <text x="660" y="150" textAnchor="middle" fill="#557166" fontSize="10">
        通知 · 搜索 · 日志
      </text>

      <line
        x1="180"
        y1="125"
        x2="300"
        y2="125"
        stroke="#176b55"
        strokeWidth="2"
        markerEnd="url(#prd-arrow)"
      />
      <line
        x1="460"
        y1="65"
        x2="580"
        y2="110"
        stroke="#176b55"
        strokeWidth="2"
        markerEnd="url(#prd-arrow)"
      />
      <line
        x1="460"
        y1="185"
        x2="580"
        y2="140"
        stroke="#176b55"
        strokeWidth="2"
        markerEnd="url(#prd-arrow)"
      />
      <line
        x1="460"
        y1="110"
        x2="460"
        y2="140"
        stroke="#bad0c8"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#prd-arrow)"
      />
    </svg>
  );
}

function InformationArchitectureDiagram() {
  const modules = [
    {
      label: "康复对象",
      children: ["列表筛选", "360° 档案", "风险标签", "训练历史"],
    },
    {
      label: "训练计划",
      children: ["计划库", "计划编辑", "变更摘要", "阶段模板"],
    },
    {
      label: "训练记录",
      children: ["记录列表", "复盘页", "人工备注", "AI 摘要"],
    },
    {
      label: "数据看板",
      children: ["KPI", "风险分层", "趋势图", "康复师负载"],
    },
  ];
  return (
    <div
      className="ia-diagram"
      role="img"
      aria-label="B 端信息架构：工作台统领四大模块"
    >
      <div className="ia-diagram__root">工作台</div>
      <div className="ia-diagram__branches">
        {modules.map((m) => (
          <div className="ia-diagram__branch" key={m.label}>
            <div className="ia-diagram__node">{m.label}</div>
            <div className="ia-diagram__leaves">
              {m.children.map((c) => (
                <span className="ia-diagram__leaf" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemStatement() {
  const stats = [
    { value: "2.8 亿", label: "中国 60 岁以上人口", tone: "brand" },
    { value: "< 30%", label: "居家康复长期坚持率", tone: "danger" },
    { value: "0", label: "即时多模态反馈的现有方案", tone: "neutral" },
  ];
  return (
    <div className="problem-statement">
      <div className="problem-statement__cards">
        {stats.map((s, i) => (
          <div
            className={`problem-statement__card problem-statement__card--${s.tone}`}
            key={s.label}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="problem-statement__arrow" aria-hidden="true">
        ↓
      </div>
      <div className="problem-statement__solution">
        <strong>康护园的解题思路</strong>
        <p>
          把「重复性上肢训练」转译为「浇水、松土、摘果」等园艺任务，通过 C
          端可穿戴套件 + VR 沉浸式场景提供即时反馈；康复师在 B
          端后台远程查看数据异常、调整计划，形成老人愿意坚持、康复师高效管理的完整闭环。
        </p>
      </div>
    </div>
  );
}

function UserFlowDiagram() {
  const steps = ["发现异常", "复核证据", "调整计划", "记录判断", "同步老人"];
  return (
    <svg
      viewBox="0 0 760 90"
      className="prd-diagram"
      role="img"
      aria-label="康复师核心闭环流程"
    >
      <defs>
        <marker
          id="prd-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#176b55" />
        </marker>
      </defs>
      {steps.map((s, i) => (
        <g key={s} transform={`translate(${20 + i * 150}, 20)`}>
          <rect
            width="120"
            height="50"
            rx="8"
            fill={i === 0 || i === 4 ? "#e8f2ee" : "#f7fbf9"}
            stroke="#176b55"
            strokeWidth={i === 0 || i === 4 ? 2 : 1}
          />
          <text
            x="60"
            y="30"
            textAnchor="middle"
            fill="#153c32"
            fontSize="12"
            fontWeight="700"
          >
            {s}
          </text>
        </g>
      ))}
      {steps.slice(0, -1).map((_, i) => (
        <line
          key={i}
          x1={140 + i * 150}
          y1="45"
          x2={170 + i * 150}
          y2="45"
          stroke="#176b55"
          strokeWidth="2"
          markerEnd="url(#prd-arrow)"
        />
      ))}
    </svg>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="prd-section">
      {eyebrow ? <span className="prd-section__eyebrow">{eyebrow}</span> : null}
      <h2 className="prd-section__title">{title}</h2>
      {children}
    </section>
  );
}

export function ProjectPrdPage() {
  useEffect(() => {
    document.title = "ElderlyGardener · 产品 PRD";
  }, []);

  return (
    <div className="project-prd">
      <header className="project-prd__header">
        <div className="project-prd__header-inner">
          <span className="project-prd__label">
            Product Requirements Document
          </span>
          <h1 className="project-prd__title">ElderlyGardener · 产品需求文档</h1>
          <p className="project-prd__subtitle">
            面向认知障碍与高龄老人的上肢康复训练系统：B 端康复师管理后台 + C
            端可穿戴园艺套件 + VR 沉浸式训练场景。
          </p>
          <div className="project-prd__meta">
            <span>版本：v1.0</span>
            <span>更新：2026.09</span>
            <span>作者：徐伊宁</span>
            <span>状态：概念原型 · 作品集</span>
          </div>
          <a
            className="project-button project-button--primary"
            href={asset("PRD.docx")}
            download
          >
            下载 Word 版 PRD
          </a>
        </div>
      </header>

      <div className="project-prd__body">
        <Section
          id="overview"
          eyebrow="01 产品概述"
          title="我们要解决什么问题？"
        >
          <p className="prd-lead">
            中国 60 岁以上人口已突破 2.8
            亿，脑卒中、骨折术后与慢性病导致的上肢功能障碍严重影响老人独立生活能力。居家康复虽然可及性高，但由于训练枯燥、反馈延迟、缺乏专业监督，长期坚持率不足
            30%。康护园通过「园艺任务化」与「多模态即时反馈」，把枯燥的上肢训练变成老人愿意重复、康复师可远程管理的完整闭环。
          </p>
          <ProblemStatement />
          <ProductArchitectureDiagram />
          <div className="prd-cards">
            <div className="prd-card">
              <h4>对老人</h4>
              <p>
                在 VR
                园艺场景中完成浇水、松土、摘果等任务，获得气动/震动/视觉反馈，提升依从性与动作质量。
              </p>
            </div>
            <div className="prd-card">
              <h4>对康复师</h4>
              <p>
                在 B
                端后台集中查看风险分层、训练记录与证据链，快速判断优先级并调整计划，保留最终决策权。
              </p>
            </div>
            <div className="prd-card">
              <h4>对产品</h4>
              <p>
                以研究驱动设计，将 C 端训练数据与 B
                端决策支持打通，形成可验证、可迭代的产品原型。
              </p>
            </div>
          </div>
        </Section>

        <Section
          id="goals"
          eyebrow="02 目标与成功指标"
          title="衡量产品价值的关键指标"
        >
          <table className="prd-table">
            <thead>
              <tr>
                <th>维度</th>
                <th>指标</th>
                <th>目标值（试点期）</th>
                <th>优先级</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>训练依从性</td>
                <td>周训练完成率</td>
                <td>≥ 75%</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>康复师效率</td>
                <td>每日异常识别时间</td>
                <td>≤ 15 分钟（按试点 26 位对象规模测算）</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>动作质量</td>
                <td>动作达标率</td>
                <td>≥ 70%</td>
                <td>P1</td>
              </tr>
              <tr>
                <td>系统可用性</td>
                <td>B 端 SUS 评分</td>
                <td>≥ 70</td>
                <td>P1</td>
              </tr>
              <tr>
                <td>安全性</td>
                <td>训练相关不良事件</td>
                <td>0 起</td>
                <td>P0</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section id="personas" eyebrow="03 用户与角色" title="核心用户画像">
          <UserFlowDiagram />
          <div className="prd-personas">
            <div className="prd-persona">
              <img
                className="prd-persona__avatar prd-persona__avatar--img"
                src={asset("assets/case-study/prd-avatar-therapist.webp")}
                alt="康复治疗师"
              />
              <div>
                <h4>康复治疗师（B 端核心用户）</h4>
                <p>
                  通常负责 15–30
                  位居家老人的随访与计划调整。核心诉求：在每日有限时间内，优先看到「需要我出手」的对象与证据，而不是被海量数据淹没。
                </p>
              </div>
            </div>
            <div className="prd-persona">
              <img
                className="prd-persona__avatar prd-persona__avatar--img"
                src={asset("assets/case-study/prd-avatar-elderly.webp")}
                alt="居家老人"
              />
              <div>
                <h4>居家老人（C 端/VR 使用者）</h4>
                <p>
                  65
                  岁以上，存在上肢功能障碍或认知衰退早期迹象。需要低认知负荷、即时反馈、有成就感的训练体验，并能获得家属/康复师的远程关注。
                </p>
              </div>
            </div>
            <div className="prd-persona">
              <img
                className="prd-persona__avatar prd-persona__avatar--img"
                src={asset("assets/case-study/prd-avatar-caregiver.webp")}
                alt="家属与照护者"
              />
              <div>
                <h4>家属 / 照护者（协同角色）</h4>
                <p>
                  协助老人佩戴设备、观察训练状态。需要简洁的训练反馈与异常提醒，避免成为主要操作负担。
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="scope"
          eyebrow="04 产品范围"
          title="In Scope / Out of Scope"
        >
          <div className="prd-scope">
            <div>
              <h4 className="prd-scope__title prd-scope__title--in">
                In Scope
              </h4>
              <ul>
                <li>
                  B
                  端康复师管理后台：工作台、对象档案、计划管理、训练记录、数据看板、通知、搜索
                </li>
                <li>
                  C 端可穿戴硬件原型：IMU + 弯曲 + 压力传感器，气动/震动反馈
                </li>
                <li>VR 园艺训练场景：浇水、松土、摘果三段任务与动作判定</li>
                <li>传感器数据到 B 端的证据链呈现与 AI 辅助建议</li>
                <li>可用性测试方案与迭代闭环</li>
              </ul>
            </div>
            <div>
              <h4 className="prd-scope__title prd-scope__title--out">
                Out of Scope
              </h4>
              <ul>
                <li>真实临床级医疗器械认证（如 NMPA/FDA）</li>
                <li>大规模硬件生产、供应链与售后体系</li>
                <li>多机构 SaaS 租户、计费与医保对接</li>
                <li>家属端独立 App（本阶段以康复师协同为主）</li>
                <li>离线训练与本地长期存储</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="requirements"
          eyebrow="05 功能需求"
          title="三端功能需求清单"
        >
          <InformationArchitectureDiagram />
          <h3 className="prd-h3">B 端 · 康复师管理后台</h3>
          <table className="prd-table">
            <thead>
              <tr>
                <th>模块</th>
                <th>需求 ID</th>
                <th>需求描述</th>
                <th>优先级</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={3}>工作台</td>
                <td>B-001</td>
                <td>首页展示「需要判断」优先级列表，按风险与异常程度排序</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>B-002</td>
                <td>今日安排、7 日完成趋势、最新动态卡片</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>B-003</td>
                <td>关键指标（待关注数、计划训练数、完成率、执行中计划）</td>
                <td>P1</td>
              </tr>
              <tr>
                <td rowSpan={3}>康复对象</td>
                <td>B-004</td>
                <td>对象列表：多维筛选、搜索、分页、风险标签</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>B-005</td>
                <td>对象 360° 档案：基本信息、阶段、训练计划、历史记录</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>B-006</td>
                <td>对象画像卡片：目标、痛点、典型一天、原话引用</td>
                <td>P1</td>
              </tr>
              <tr>
                <td rowSpan={3}>训练计划</td>
                <td>B-007</td>
                <td>计划库：按对象/状态筛选，查看计划概览</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>B-008</td>
                <td>计划编辑器：添加/删除/启用动作，配置角度、次数、阻力</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>B-009</td>
                <td>变更摘要：高亮修改字段，展示变更人与变更原因</td>
                <td>P1</td>
              </tr>
              <tr>
                <td rowSpan={2}>训练记录</td>
                <td>B-010</td>
                <td>训练记录列表：状态筛选、搜索、复盘入口</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>B-011</td>
                <td>训练复盘页：系统事实 + 用户自述 + AI 建议 + 人工备注</td>
                <td>P0</td>
              </tr>
              <tr>
                <td rowSpan={2}>数据看板</td>
                <td>B-012</td>
                <td>康复师视角 KPI、风险分层、阶段分布、康复师负载</td>
                <td>P1</td>
              </tr>
              <tr>
                <td>B-013</td>
                <td>7 日趋势、动作幅度分布、关键指标下钻</td>
                <td>P1</td>
              </tr>
              <tr>
                <td rowSpan={2}>系统</td>
                <td>B-014</td>
                <td>
                  通知中心：AI 待确认、计划到期、依从性、数据质量、系统提醒
                </td>
                <td>P1</td>
              </tr>
              <tr>
                <td>B-015</td>
                <td>全局搜索：康复对象 / 训练计划 / 训练记录即时检索</td>
                <td>P1</td>
              </tr>
            </tbody>
          </table>

          <h3 className="prd-h3">C 端 · 可穿戴园艺训练套件</h3>
          <table className="prd-table">
            <thead>
              <tr>
                <th>模块</th>
                <th>需求 ID</th>
                <th>需求描述</th>
                <th>优先级</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={2}>数据采集</td>
                <td>C-001</td>
                <td>前臂 IMU 采集姿态与角速度</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>C-002</td>
                <td>弯曲传感器 + 压力传感器采集关节角度与握力</td>
                <td>P0</td>
              </tr>
              <tr>
                <td rowSpan={2}>动作判定</td>
                <td>C-003</td>
                <td>组合阈值判定：角度 + 力度 + 时序</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>C-004</td>
                <td>区分「未完成 / 部分完成 / 达标 / 超额」</td>
                <td>P1</td>
              </tr>
              <tr>
                <td rowSpan={2}>反馈</td>
                <td>C-005</td>
                <td>气动气囊提供温和阻力/助力反馈</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>C-006</td>
                <td>震动马达提示动作起始与纠偏</td>
                <td>P1</td>
              </tr>
              <tr>
                <td>连接</td>
                <td>C-007</td>
                <td>通过蓝牙/Wi-Fi 将数据同步至后端</td>
                <td>P0</td>
              </tr>
            </tbody>
          </table>

          <h3 className="prd-h3">VR 端 · 沉浸式园艺场景</h3>
          <table className="prd-table">
            <thead>
              <tr>
                <th>模块</th>
                <th>需求 ID</th>
                <th>需求描述</th>
                <th>优先级</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={2}>场景</td>
                <td>V-001</td>
                <td>「银龄园艺小站」主场景：花园、菜地、果树区</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>V-002</td>
                <td>三段式任务：浇水 → 松土 → 摘果，对应不同上肢动作</td>
                <td>P0</td>
              </tr>
              <tr>
                <td rowSpan={2}>交互</td>
                <td>V-003</td>
                <td>低晕动设计：定点注视 + 手势/控制器触发，避免高速移动</td>
                <td>P0</td>
              </tr>
              <tr>
                <td>V-004</td>
                <td>
                  即时视觉反馈：动作达标触发水花、落叶、果实掉落等正向动画
                </td>
                <td>P1</td>
              </tr>
              <tr>
                <td rowSpan={2}>训练管理</td>
                <td>V-005</td>
                <td>训练前简短校准与引导</td>
                <td>P1</td>
              </tr>
              <tr>
                <td>V-006</td>
                <td>训练结束展示完成度、疲劳度自评与下次训练预告</td>
                <td>P1</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section id="non-functional" eyebrow="06 非功能需求" title="质量属性">
          <table className="prd-table">
            <thead>
              <tr>
                <th>维度</th>
                <th>要求</th>
                <th>验收标准</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>无障碍</td>
                <td>B 端与 VR 端均需考虑低视力与低数字素养用户</td>
                <td>键盘可达、对比度 ≥ 4.5:1、关键信息不依赖颜色 alone</td>
              </tr>
              <tr>
                <td>性能</td>
                <td>B 端首屏加载 ≤ 3s，列表页翻页无感知加载</td>
                <td>Lighthouse Performance ≥ 70</td>
              </tr>
              <tr>
                <td>可靠性</td>
                <td>训练数据不丢失，传感器断连可恢复</td>
                <td>断连 30s 内重连，本地缓存关键动作数据</td>
              </tr>
              <tr>
                <td>安全</td>
                <td>对象健康数据加密传输与存储</td>
                <td>HTTPS、敏感字段脱敏、操作日志</td>
              </tr>
              <tr>
                <td>可维护性</td>
                <td>前后端接口清晰，数据模型可扩展</td>
                <td>接口文档覆盖核心 CRUD，版本化 Schema</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section id="data" eyebrow="07 数据模型" title="核心实体与关系">
          <ul className="prd-entities">
            <li>
              <strong>Therapist（康复师）</strong>
              ：id、姓名、机构、角色、联系方式、偏好设置
            </li>
            <li>
              <strong>Client（康复对象/老人）</strong>
              ：id、姓名、年龄、诊断、康复阶段、风险标签、ADL
              基线、照护者信息、关联 Therapist
            </li>
            <li>
              <strong>Plan（训练计划）</strong>
              ：id、clientId、阶段目标、起止时间、版本历史、变更记录、状态
            </li>
            <li>
              <strong>Exercise（训练动作）</strong>
              ：id、planId、动作类型、目标角度/力度/次数、启用状态、园艺映射
            </li>
            <li>
              <strong>Session（训练记录）</strong>
              ：id、clientId、planId、开始/结束时间、完成状态、动作表现、AI
              摘要、人工备注
            </li>
            <li>
              <strong>Notification（通知）</strong>
              ：id、recipientId、类型、标题、内容、目标链接、已读状态、创建时间
            </li>
          </ul>
        </Section>

        <Section id="ux" eyebrow="08 体验原则" title="设计原则与交互约束">
          <figure className="prd-preview">
            <img
              src={asset("assets/case-study/design-principles.jpg")}
              alt="B 端后台工作台界面：需要判断、今日安排、7 日完成趋势与今日证据链"
              loading="lazy"
            />
            <figcaption>
              B 端后台工作台： Evidence First
              理念落地——优先展示需要康复师行动的异常信号
            </figcaption>
          </figure>
          <div className="prd-principles">
            <div className="prd-principle">
              <h4>Evidence First</h4>
              <p>优先展示需要行动的信号，而非总体 KPI。</p>
            </div>
            <div className="prd-principle">
              <h4>Human Control</h4>
              <p>AI 只整理事实与建议，不会自动改写训练计划。</p>
            </div>
            <div className="prd-principle">
              <h4>Visible Uncertainty</h4>
              <p>区分系统事实、用户自述、数据缺失与 AI 推测。</p>
            </div>
            <div className="prd-principle">
              <h4>Traceability</h4>
              <p>每一次计划变更、人工备注与 AI 建议都保留来源与操作人。</p>
            </div>
          </div>
        </Section>

        <Section id="roadmap" eyebrow="09 路线图" title="分阶段迭代计划">
          <div className="prd-roadmap">
            <div className="prd-roadmap__item">
              <span className="prd-roadmap__phase">Phase 1 · 概念验证</span>
              <h4>0 → 1 可运行原型</h4>
              <ul>
                <li>完成 C 端硬件原型一代（传感器 + 反馈）</li>
                <li>完成 VR 园艺场景 MVP（1 个任务流程）</li>
                <li>完成 B 端后台核心闭环：工作台 → 对象 → 计划 → 记录</li>
              </ul>
            </div>
            <div className="prd-roadmap__item">
              <span className="prd-roadmap__phase">Phase 2 · 试点验证</span>
              <h4>小样本可用性与有效性测试</h4>
              <ul>
                <li>8–12 名康复师访谈与 B 端可用性测试</li>
                <li>8–15 名老人参与 C 端/VR 训练试点</li>
                <li>证据链时间线、计划 diff 视图完整落地</li>
              </ul>
            </div>
            <div className="prd-roadmap__item">
              <span className="prd-roadmap__phase">Phase 3 · 临床合作</span>
              <h4>工程化与合规准备</h4>
              <ul>
                <li>与社区康复中心/医院建立合作</li>
                <li>动作判定算法小样本验证</li>
                <li>数据安全合规、多机构权限、计费对接评估</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="risks"
          eyebrow="10 风险与开放问题"
          title="待验证与待决策事项"
        >
          <ul className="prd-risks">
            <li>
              <strong>研究真实性：</strong>
              当前用户画像、可用性测试与部分数据为演示样本，需补充一手访谈与试点数据。
            </li>
            <li>
              <strong>硬件工程：</strong>传感器与 VR
              渲染的同步精度、老年人晕动症风险、长期使用舒适性需工程验证。
            </li>
            <li>
              <strong>临床合规：</strong>
              作为涉及健康数据的系统，需明确医疗器械分类、数据隐私与伦理审批路径。
            </li>
            <li>
              <strong>商业模式：</strong>
              面向机构（B2B）还是面向家庭（B2B2C）尚未验证，需后续市场调研。
            </li>
            <li>
              <strong>技术栈：</strong>VR 引擎（Unity /
              WebXR）、后端服务、硬件通信协议需在原型阶段选型并验证稳定性。
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
