import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { rehabilitationApi } from "../services/rehabilitation";

const GROUPS = [
  { key: "clients", label: "康复对象" },
  { key: "plans", label: "训练计划" },
  { key: "sessions", label: "训练记录" },
] as const;

export function TopbarSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 240);
    return () => window.clearTimeout(timer);
  }, [query]);

  const trimmed = debounced.trim();
  const results = useQuery({
    queryKey: ["search", debounced],
    enabled: open && trimmed.length > 0,
    queryFn: ({ signal }) => rehabilitationApi.search(debounced, signal),
  });

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
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

  const data = results.data;
  const total =
    (data?.clients.length ?? 0) +
    (data?.plans.length ?? 0) +
    (data?.sessions.length ?? 0);

  return (
    <div className="topbar-popover-wrap" ref={rootRef}>
      <button
        className="icon-button"
        type="button"
        aria-label={open ? "关闭全局搜索" : "全局搜索"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        ⌕
      </button>
      {open ? (
        <section
          className="topbar-popover search-panel"
          aria-label="全局搜索"
        >
          <label className="search-panel__input">
            <span aria-hidden="true">⌕</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索康复对象、训练计划或训练记录…"
              aria-label="搜索关键词"
              role="searchbox"
            />
            {query ? (
              <button
                className="search-panel__clear"
                type="button"
                aria-label="清空关键词"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                ×
              </button>
            ) : null}
          </label>
          <div className="search-panel__results">
            {trimmed === "" ? (
              <p className="search-hint">
                输入对象姓名、计划名称或动作关键词开始搜索。
              </p>
            ) : results.isLoading ? (
              <p className="search-hint">正在搜索…</p>
            ) : total === 0 ? (
              <p className="search-hint">没有找到与「{trimmed}」相关的内容</p>
            ) : (
              GROUPS.map(
                (group) =>
                  (data?.[group.key].length ?? 0) > 0 && (
                    <section className="search-group" key={group.key}>
                      <h3 className="search-group__title">{group.label}</h3>
                      {data![group.key].map((item) => (
                        <Link
                          className="search-item"
                          key={item.id}
                          to={item.to}
                          onClick={() => setOpen(false)}
                        >
                          <strong>{item.name}</strong>
                          <span>{item.detail}</span>
                        </Link>
                      ))}
                    </section>
                  ),
              )
            )}
          </div>
          <footer className="search-panel__footer">
            演示数据检索 · Esc 关闭
          </footer>
        </section>
      ) : null}
    </div>
  );
}
