import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import type { NotificationKind } from "../domain/models";
import { rehabilitationApi } from "../services/rehabilitation";

const kindMeta: Record<NotificationKind, { label: string; tone: string }> = {
  decision: { label: "待确认", tone: "amber" },
  plan: { label: "计划", tone: "blue" },
  adherence: { label: "依从性", tone: "red" },
  sensor: { label: "数据质量", tone: "violet" },
  system: { label: "系统", tone: "green" },
};

export function TopbarNotifications() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: ({ signal }) => rehabilitationApi.getNotifications(signal),
  });
  const list = notifications.data ?? [];
  const unreadCount = list.filter((item) => !item.read).length;

  const refresh = () =>
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markOne = useMutation({
    mutationFn: (notificationId: string) =>
      rehabilitationApi.markNotificationRead(notificationId),
    onSuccess: refresh,
  });
  const markAll = useMutation({
    mutationFn: () => rehabilitationApi.markAllNotificationsRead(),
    onSuccess: refresh,
  });

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
    <div className="topbar-popover-wrap" ref={rootRef}>
      <button
        className="icon-button notification-button"
        type="button"
        aria-label={
          open ? "关闭通知中心" : `通知中心，${unreadCount} 条未读`
        }
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        ♢
        {unreadCount > 0 ? <span>{unreadCount}</span> : null}
      </button>
      {open ? (
        <section
          className="topbar-popover notification-panel"
          aria-label="通知中心"
        >
          <header className="topbar-popover__head">
            <div>
              <strong>通知</strong>
              <span>
                {unreadCount > 0 ? `${unreadCount} 条未读` : "全部已读"}
              </span>
            </div>
            <button
              className="text-button"
              type="button"
              disabled={unreadCount === 0 || markAll.isPending}
              onClick={() => markAll.mutate()}
            >
              全部标为已读
            </button>
          </header>
          <div className="notification-list">
            {list.length === 0 ? (
              <p className="topbar-popover__empty">暂无通知</p>
            ) : (
              list.map((item) => {
                const tone = kindMeta[item.kind];
                const content = (
                  <>
                    <span
                      className={`notification-item__dot notification-item__dot--${tone.tone}`}
                      aria-hidden="true"
                    />
                    <span className="notification-item__body">
                      <span className="notification-item__title">
                        {item.title}
                        <em>{tone.label}</em>
                      </span>
                      <span className="notification-item__detail">
                        {item.detail}
                      </span>
                      <span className="notification-item__meta">
                        <time>{item.occurredAt}</time>
                        {item.target ? (
                          <span className="notification-item__go">
                            {item.target.label} →
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </>
                );
                const className = `notification-item${
                  item.read ? " is-read" : ""
                }`;
                return item.target ? (
                  <Link
                    key={item.id}
                    className={className}
                    to={item.target.to}
                    onClick={() => {
                      if (!item.read) markOne.mutate(item.id);
                      setOpen(false);
                    }}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    className={className}
                    type="button"
                    onClick={() => {
                      if (!item.read) markOne.mutate(item.id);
                    }}
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
