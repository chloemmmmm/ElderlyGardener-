import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { getPublicAssetUrl } from "../config/public-path";

function asset(path: string) {
  return getPublicAssetUrl(import.meta.env.BASE_URL, path);
}

const profileIntro =
  "北京理工大学工业设计硕士在读，兼具产品经理、用户体验设计与工业设计经验，研一担任本科生《智能硬件》课程助教。擅长用户研究、需求分析与数据驱动决策，熟练运用 Codex / Claude Code / Midjourney 等 AI 工具提效。参与教育产品从 0 到 1 落地，谈单成功率 30% → 50%；多篇 CHI / HCII 顶会论文在投或录用，获 HCII Best Paper 及多项国际设计奖，并有海外双学位经历。";

const education = [
  {
    period: "2025.09 — 至今",
    school: "北京理工大学",
    detail: "设计与艺术学院 · 工业设计 · 硕士",
  },
  {
    period: "2020.09 — 2024.06",
    school: "北京化工大学",
    detail: "国际教育学院 · 工业设计 · 本科 · GPA 3.48/4.0",
  },
  {
    period: "2020.09 — 2024.06",
    school: "热那亚大学（意大利）",
    detail: "设计学院 · 产品与交互设计 · 本科双学位",
  },
];

const experiences = [
  {
    period: "2026.04 — 2026.08",
    company: "北京垣环教育科技有限公司",
    role: "产品经理",
    track: "教育产品方向 · 北京",
    highlights: [
      "针对艺术设计教育产品服务标准化缺失，负责从 0 到 1 策略制定，构建 T0–T4 分层服务模型与 6 条产品线定价策略，Codex 辅助生成 13 份标准化产品文档。",
      "用户调研结合 Codex 批量数据分析驱动 4 个版本迭代；标准化服务清单使沟通效率提升 50%，谈单成功率 30% → 50%，营收增长 17.9%。",
    ],
  },
  {
    period: "2025.11 — 2026.01",
    company: "四方股份有限公司",
    role: "工业设计师",
    track: "服务器机柜外观设计 · 北京",
    highlights: [
      "参与服务器机柜外观升级，Midjourney 意向图转化 + Stable Diffusion 方案迭代 + Magnific AI 效果图增强，输出概念设计与 CMF 方案。",
      "团队累计输出 8 套方案，中选率 37.5%，3 套通过客户评审；AI 工具辅助下方案输出周期缩短 30%。",
    ],
  },
  {
    period: "2025.09 — 2025.11",
    company: "北方工业 × 万宝工程",
    role: "工业设计师",
    track: "自动生产线工业设计 · 北京",
    highlights: [
      "深入复杂产线现场梳理使用场景与人机交互流程，输出造型方案、人机工程分析报告及结构可行性验证。",
      "团队累计输出 8 套设计方案，2 套通过企业方评审进入工程转化阶段。",
    ],
  },
  {
    period: "2025.09 — 2025.11",
    company: "宇树科技 × 北京理工大学",
    role: "产品设计师",
    track: "景区导览四足机器人产品设计 · 北京",
    highlights: [
      "Codex 辅助市场调研与竞品分析，负责外观造型与 CMF 设计，完成 2 套方案探索及景区导览 / 跟随 / 避障等交互模式优化。",
      "Codex 调用 hyperframes、video use Skill 制作产品展示视频，周期缩短 50%；2 套方案中 1 套被选中参赛。",
    ],
  },
];

const publications = [
  {
    title: "Virtual Reality 期刊论文（第一作者）",
    detail:
      "针对 VR 暴露疗法的听众反馈设计空白，构建 Unity 公众演讲系统，141 人 3×3 混合实验，揭示纯文本「情感缓冲」机制。",
    meta: "JCR Q1 · SCIE · IF 5.0 · Springer · 送审中",
  },
  {
    title: "Behaviour & Information Technology 期刊论文（第一作者）",
    detail:
      "面向具身机器人情绪识别需求，搭建 GitHub + MediaCrawler + mongoDB 数据链路，BERT 清洗 + Arduino + vibe coding，识别准确率 89.6%。",
    meta: "JCR Q1 · SSCI/SCIE · IF 4.2 · 修改稿已提交",
  },
  {
    title: "CHI 会议论文 ×2（第一作者）",
    detail:
      "① 老年上肢康复：UE 开发 IMU/FSR 可穿戴外骨骼，气囊 + 震动双反馈；② PneuCalm：Unity + DeepSeek API + LLM + ASR/TTS，Arduino 气动背心闭环。",
    meta: "CCF A 类会议 · 在投",
  },
  {
    title: "HCII 2026 Best Paper Award",
    detail:
      "视障人士方向感知增强，Arduino 搭建三维空间振动序列，获 Best Paper Award。",
    meta: "CCF B 类会议 · 已录用",
  },
  {
    title: "ICDDE 2025 Conference Paper",
    detail: "电影海报色彩规律研究，Python + K-means 聚类分析。",
    meta: "EI Indexed · 已录用",
  },
];

const honors = [
  "2022 美国 IDEA 国际杰出设计奖 · Winner",
  "2022 韩国 K-设计奖 · Winner",
  "2022 亚洲设计奖（Asia Design Prize）· Gold",
  "2022 法国 DNA 巴黎设计奖 ×2",
  "2022 美国 Core77 设计奖 · Notable",
  "2025 美国缪斯设计奖 · Silver",
  "2022 / 2024 欧洲产品设计奖 ×2",
  "2022 / 2025 中国设计智造大奖（DIA）×5",
  "2025 华灿奖 · 国家一等奖",
  "2025 研究生校级特等奖学金",
];

const skillGroups = [
  {
    label: "用户体验研究",
    items: [
      "问卷调查",
      "用户访谈",
      "可用性测试",
      "启发式评估",
      "眼动测试",
      "A/B 测试",
      "生理测量（皮电 / 肌电）",
    ],
  },
  {
    label: "UI/UX 设计",
    items: ["Figma", "PRD 撰写", "需求分析", "CMF 设计", "Unity", "UE"],
  },
  {
    label: "产品与数据",
    items: [
      "Python",
      "SQL",
      "mongoDB",
      "SPSS",
      "Prism",
      "MATLAB",
      "数据透视分析",
      "K-means 聚类",
    ],
  },
  {
    label: "AI 工具与提效",
    items: [
      "Codex",
      "Claude Code",
      "Midjourney",
      "Stable Diffusion",
      "AI 辅助 UI 开发",
      "自定义 AI Skill",
    ],
  },
  {
    label: "硬件开发",
    items: ["Arduino", "传感器融合", "可穿戴硬件"],
  },
  {
    label: "语言能力",
    items: ["IELTS 6.0", "CET-6", "英语沟通"],
  },
];

export function ResumeButton() {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const modal = open ? (
    <div
      ref={modalRef}
      className="resume-modal"
      role="dialog"
      aria-modal="true"
      aria-label="徐伊宁简历"
    >
      <div
        className="resume-modal__overlay"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div className="resume-modal__card">
        <header className="resume-modal__head">
          <div>
            <strong>徐伊宁</strong>
            <span>Product Manager · UX/UI Designer</span>
          </div>
          <button
            className="resume-modal__close"
            type="button"
            aria-label="关闭简历"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </header>

        <div className="resume-modal__body">
          <section className="resume-modal__section">
            <h4>个人简介</h4>
            <p className="resume-modal__intro">{profileIntro}</p>
          </section>

          <section className="resume-modal__section">
            <h4>教育背景</h4>
            <ul className="resume-modal__list">
              {education.map((item) => (
                <li key={item.school}>
                  <strong>{item.school}</strong>
                  <span className="resume-modal__period">{item.period}</span>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="resume-modal__section">
            <h4>实习与项目经历</h4>
            <ul className="resume-modal__list">
              {experiences.map((item) => (
                <li key={item.company}>
                  <strong>
                    {item.company} · {item.role}
                  </strong>
                  <span className="resume-modal__period">
                    {item.period} · {item.track}
                  </span>
                  {item.highlights.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </li>
              ))}
            </ul>
          </section>

          <section className="resume-modal__section">
            <h4>学术成果</h4>
            <ul className="resume-modal__list">
              {publications.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                  <span className="resume-modal__period">{item.meta}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="resume-modal__section">
            <h4>设计竞赛与荣誉</h4>
            <div className="resume-modal__tags">
              {honors.map((t) => (
                <span key={t} className="resume-modal__tag">
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="resume-modal__section">
            <h4>专业技能</h4>
            <div className="resume-modal__skills">
              {skillGroups.map((group) => (
                <div key={group.label} className="resume-modal__skill-group">
                  <span className="resume-modal__skill-label">
                    {group.label}
                  </span>
                  <div className="resume-modal__tags">
                    {group.items.map((t) => (
                      <span
                        key={t}
                        className="resume-modal__tag resume-modal__tag--skill"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="resume-modal__foot">
          <a
            className="project-button project-button--primary"
            href={asset("assets/徐伊宁_通用简历.pdf")}
            download="徐伊宁_设计实习生简历.pdf"
          >
            下载完整简历 PDF
          </a>
          <div className="resume-modal__contact">
            <span>📱 15562692993（微信同号）</span>
            <span>✉️ 1710756188@qq.com</span>
            <span>📍 北京</span>
          </div>
        </footer>
      </div>
    </div>
  ) : null;

  return (
    <div className="resume-button-wrap">
      <button
        className="resume-button"
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        点击查看简历
      </button>
      {createPortal(modal, document.body)}
    </div>
  );
}
