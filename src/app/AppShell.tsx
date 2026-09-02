import * as Dialog from "@radix-ui/react-dialog";
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/dashboard", label: "工作台", icon: "⌂" },
  { to: "/clients", label: "康复对象", icon: "◎" },
  { to: "/plans/plan-001/edit", label: "训练计划", icon: "▤" },
  { to: "/sessions/session-004", label: "训练记录", icon: "↗" },
  { to: "/case-study", label: "案例展示", icon: "📋" },
];

export function AppShell() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <aside className="sidebar" aria-label="应用侧栏">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            芽
          </span>
          <div>
            <strong>康护园</strong>
            <span>远程训练管理</span>
          </div>
        </div>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="demo-stamp" type="button">
              <span aria-hidden="true">●</span> 概念演示
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
                  <span className="demo-video-kicker">CONCEPT DEMO</span>
                  <Dialog.Title>康护园 · 概念演示</Dialog.Title>
                </div>
                <Dialog.Close className="demo-video-close" aria-label="关闭概念演示">
                  ×
                </Dialog.Close>
              </div>
              <div className="demo-video-frame">
                <iframe
                  src="https://www.youtube.com/embed/RYUbFY3-7dA?rel=0"
                  title="康护园概念演示视频"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <nav aria-label="主要导航" className="primary-nav">
          <p className="nav-eyebrow">工作区</p>
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to}>
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="sidebar-note-kicker">今日提醒</span>
          <strong>3 项需要关注</strong>
          <span>优先复核数据异常与连续未完成训练。</span>
        </div>

        <div className="profile-chip">
          <span className="avatar" aria-hidden="true">
            林
          </span>
          <div>
            <strong>林医生</strong>
            <span>康复治疗师</span>
          </div>
          <button
            type="button"
            aria-label="个人菜单（演示中暂未开放）"
            title="演示中暂未开放"
            disabled
          >
            •••
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="system-status">
            <span aria-hidden="true" /> 设备数据同步正常
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="搜索（演示中暂未开放）"
              title="演示中暂未开放"
              disabled
            >
              ⌕
            </button>
            <button
              className="icon-button notification-button"
              type="button"
              aria-label="通知（演示中暂未开放）"
              title="演示中暂未开放"
              disabled
            >
              ♢<span>3</span>
            </button>
            <span className="current-date">2026年8月31日 · 周一</span>
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
