"use client";

import React, { useCallback, useMemo } from "react";
import type { Template } from "@/lib/domain/templates/types";

type TemplateCardProps = {
  template: Template;
  onClick: () => void;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function TemplateCardComponent({ template, onClick }: TemplateCardProps) {
  const channelLabel = template.channel?.toUpperCase() || "UNKNOWN";
  const updatedLabel = useMemo(() => {
    const date = template.updatedAt ? new Date(template.updatedAt) : null;
    return date ? dateFormatter.format(date) : "—";
  }, [template.updatedAt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  const statusBadge =
    template.status === "active" ? (
      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">
        active
      </span>
    ) : (
      <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px]">
        draft
      </span>
    );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open template ${template.name}`}
      className="group relative cursor-pointer rounded-xl border border-border bg-card shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
    >
      <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded bg-neutral-900 text-white text-[10px] font-medium shadow">
        {channelLabel}
      </div>

      <div className="h-56 w-full rounded-t-xl bg-neutral-200 flex items-center justify-center">
        <span className="text-xs text-neutral-500">No preview yet</span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-base truncate">{template.name}</h3>

        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>Updated {updatedLabel}</span>
          {statusBadge}
        </div>
      </div>
    </div>
  );
}

export default React.memo(TemplateCardComponent);
