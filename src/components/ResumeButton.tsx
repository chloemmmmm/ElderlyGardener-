import { useEffect, useRef, useState } from "react";

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

export function ResumeButton() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
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

  return (
    <div className="resume-button-wrap" ref={rootRef}>
      <button
        className="resume-button"
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        产品负责人 · 点击查看简历
      </button>
      {open ? (
        <div className="resume-modal" role="dialog" aria-modal="true" aria-label="徐伊宁简历">
          <div className="resume-modal__overlay" aria-hidden="true" onClick={() => setOpen(false)} />
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
                    <span>① 老年上肢运动：UE + IMU/FSR 可穿戴外骨骼，气囊+震动双反馈；② PneuCalm：Unity + LLM 对话 + ASR/TTS 气动背心闭环控制 · CCF A 类 · 在投</span>
                  </li>
                  <li>
                    <strong>HCII 2026 Best Paper Award</strong>
                    <span>Spativibe：三维空间振动序列，增强视障人士方向感知 · CCF B 类会议 · 已录用</span>
                  </li>
                  <li>
                    <strong>ICDDE 2025 Conference Paper</strong>
                    <span>基于 Python + K-means 的电影海报色彩应用规律研究 · EI 索引 · 已录用</span>
                  </li>
                  <li>
                    <strong>Behaviour & Information Technology（第一作者，返修中）</strong>
                    <span>多模态感知 + 具身机器人狗情绪反馈系统，多模态识别准确率 89.6% · JCR Q1 · SSCI/SCIE</span>
                  </li>
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
                    <span key={t} className="resume-modal__tag resume-modal__tag--skill">
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
      ) : null}
    </div>
  );
}
