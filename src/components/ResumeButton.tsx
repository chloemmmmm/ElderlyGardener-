import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { getPublicAssetUrl } from "../config/public-path";

function asset(path: string) {
  return getPublicAssetUrl(import.meta.env.BASE_URL, path);
}

const skillTags = [
  "Python",
  "SQL",
  "mongoDB",
  "Figma",
  "用户调研",
  "PRD 撰写",
  "需求分析",
  "Arduino",
  "传感器融合",
  "可穿戴硬件",
  "Unity",
  "AI 辅助 UI 开发",
];

const internships = [
  {
    period: "2026.04 — 2026.08",
    company: "北京垣环教育科技有限公司",
    role: "策略产品经理实习",
    highlights:
      "负责艺术设计教育产品从 0 到 1 策略制定，构建 T0–T4 分层服务模型与 6 条产品线；通过用户调研与 Codex 批量处理反馈数据，驱动 4 个版本迭代，谈单成功率 30% → 50%。",
  },
  {
    period: "2025.11 — 2026.01",
    company: "四方股份有限公司",
    role: "工业设计实习",
    highlights:
      "参与服务器机柜外观升级，完成竞品调研、意向图造型转化与 CMF 方案；团队累计输出 8 套方案，中选率 37.5%，3 套进入工程转化，方案输出周期缩短 30%。",
  },
  {
    period: "2025.09 — 2025.11",
    company: "北方工业 × 万宝工程",
    role: "工业设计实习",
    highlights:
      "面向工业自动生产线外观升级，梳理使用场景与人机交互流程，协助完成造型方案、人机工程分析及结构可行性验证；2 套方案通过企业方评审并进入工程转化。",
  },
  {
    period: "2025.09 — 2025.11",
    company: "宇树科技 × 北京理工大学",
    role: "机器人设计 / 工业造型",
    highlights:
      "负责消费级四足机器宠物外观造型与 CMF 设计，完成 2 套方案探索及导览 / 儿童玩伴 / 跟随等交互模式优化；1 套方案被选中参赛并支持产品落地迭代。",
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
            <span>Product Manager · Industrial Designer</span>
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
            <h4>学术成果</h4>
            <ul className="resume-modal__list">
              <li>
                <strong>CHI 会议论文 ×2（第一作者）</strong>
                <span>
                  ① 老年上肢运动：UE + IMU/FSR 可穿戴外骨骼，气囊+震动双反馈；②
                  PneuCalm：Unity + LLM 对话 + ASR/TTS 气动背心闭环控制 · CCF A
                  类 · 在投
                </span>
              </li>
              <li>
                <strong>HCII 2026 Best Paper Award</strong>
                <span>
                  Spativibe：三维空间振动序列，增强视障人士方向感知 · CCF B
                  类会议 · 已录用
                </span>
              </li>
              <li>
                <strong>ICDDE 2025 Conference Paper</strong>
                <span>
                  基于 Python + K-means 的电影海报色彩应用规律研究 · EI 索引 ·
                  已录用
                </span>
              </li>
              <li>
                <strong>
                  Behaviour & Information Technology（第一作者，返修中）
                </strong>
                <span>
                  多模态感知 + 具身机器人狗情绪反馈系统，多模态识别准确率 89.6%
                  · JCR Q1 · SSCI/SCIE
                </span>
              </li>
            </ul>
          </section>

          <section className="resume-modal__section">
            <h4>实习经历</h4>
            <ul className="resume-modal__list">
              {internships.map((item) => (
                <li key={item.company}>
                  <strong>
                    {item.company} · {item.role}
                  </strong>
                  <span className="resume-modal__period">{item.period}</span>
                  <span>{item.highlights}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="resume-modal__section">
            <h4>设计竞赛与荣誉</h4>
            <div className="resume-modal__tags">
              {[
                "IDEA Design Award · Winner",
                "K-Design Award · Winner",
                "Asia Design Prize · Gold",
                "DNA Paris Design Awards ×2",
                "Core77 Student Notable",
                "Muse Design Awards · Silver",
                "European Product Design Award ×2",
                "DIA 设计奖 ×5",
                "华灿奖 · 国家一等奖",
                "研究生校级特等奖学金",
              ].map((t) => (
                <span key={t} className="resume-modal__tag">
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="resume-modal__section">
            <h4>专业技能</h4>
            <div className="resume-modal__tags">
              {skillTags.map((t) => (
                <span
                  key={t}
                  className="resume-modal__tag resume-modal__tag--skill"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        </div>

        <footer className="resume-modal__foot">
          <a
            className="project-button project-button--primary"
            href={asset("assets/徐伊宁_通用简历.pdf")}
            download
          >
            下载完整简历 PDF
          </a>
          <div className="resume-modal__contact">
            <span>📱 15562692993</span>
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
        产品负责人 · 点击查看简历
      </button>
      {createPortal(modal, document.body)}
    </div>
  );
}
