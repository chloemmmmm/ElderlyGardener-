import { NavLink, Outlet } from "react-router-dom";

import { ResumeButton } from "../components/ResumeButton";

export function ProjectLayout() {
  return (
    <div className="project-layout">
      <header className="project-header">
        <div className="project-header__inner">
          <NavLink className="project-header__brand" to="/">
            <span className="project-header__mark" aria-hidden="true">
              芽
            </span>
            <span className="project-header__title">ElderlyGardener</span>
          </NavLink>
          <div className="project-header__actions">
            <nav className="project-header__nav" aria-label="项目导航">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "project-header__link project-header__link--active"
                    : "project-header__link"
                }
                end
                to="/"
              >
                项目展示
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "project-header__link project-header__link--active"
                    : "project-header__link"
                }
                to="/prd"
              >
                产品 PRD
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "project-header__link project-header__link--active"
                    : "project-header__link"
                }
                to="/dashboard"
              >
                进入 B 端后台
              </NavLink>
            </nav>
            <ResumeButton />
          </div>
        </div>
      </header>
      <main className="project-main">
        <Outlet />
      </main>
      <footer className="project-footer">
        <div className="project-footer__inner">
          <p>康护园 · 老年园艺上肢康复训练系统 — 实习作品集项目</p>
          <p>文中人物均为化名。</p>
          <nav className="project-footer__links" aria-label="页脚导航">
            <NavLink className="project-footer__link" to="/prd">
              查看产品 PRD →
            </NavLink>
            <NavLink className="project-footer__link" to="/dashboard">
              进入 B 端后台 →
            </NavLink>
            <button
              type="button"
              className="project-footer__link"
              onClick={() => {
                const reduceMotion = window.matchMedia(
                  "(prefers-reduced-motion: reduce)",
                ).matches;
                window.scrollTo({
                  top: 0,
                  behavior: reduceMotion ? "auto" : "smooth",
                });
              }}
            >
              回到顶部 ↑
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
