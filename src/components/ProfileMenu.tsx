import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
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
    <div className="profile-menu-wrap" ref={rootRef}>
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
          aria-label={open ? "关闭个人菜单" : "打开个人菜单"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          •••
        </button>
      </div>
      {open ? (
        <section className="profile-menu" aria-label="个人菜单">
          <header className="profile-menu__role">
            <span className="avatar" aria-hidden="true">
              林
            </span>
            <div>
              <strong>林医生</strong>
              <span>康复治疗师 · 演示角色</span>
            </div>
          </header>
          <Link className="profile-menu__link" to="/case-study">
            ✦ 查看案例展示 · 研究过程
          </Link>
          <Link className="profile-menu__link" to="/analytics">
            ◈ 查看数据看板
          </Link>
          <p className="profile-menu__note">
            康护园为作品集概念演示，界面中的对象、记录与数值均为演示样例数据。
          </p>
        </section>
      ) : null}
    </div>
  );
}
