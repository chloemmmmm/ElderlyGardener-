import type { ReactNode } from "react";

export type DemoBadgeVariant = "original" | "public";

interface DemoBadgeProps {
  label: "[课程原始数据]" | "[公开统计数据]";
  variant: DemoBadgeVariant;
  hint?: string;
  children: ReactNode;
}

const variantClass: Record<DemoBadgeVariant, string> = {
  original: "demo-badge--original",
  public: "demo-badge--public",
};

export function DemoBadge({ label, variant, hint, children }: DemoBadgeProps) {
  return (
    <div className={`demo-badge ${variantClass[variant]}`}>
      <span className="demo-badge__tag" aria-hidden="false">
        {label}
      </span>
      <div className="demo-badge__content">{children}</div>
      {hint ? <p className="demo-badge__hint">{hint}</p> : null}
    </div>
  );
}
