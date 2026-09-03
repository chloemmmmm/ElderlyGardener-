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
          <p>康护园 · 老年园艺上肢康复训练系统 — 实习作品集概念演示</p>
          <p>所有对象、记录与数值均为演示样例数据。</p>
        </div>
      </footer>
    </div>
  );
}
