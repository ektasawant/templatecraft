"use client";

import React, { useCallback, useMemo } from "react";
import type { Template } from "@/lib/domain/templates/types";

type DesignCardProps = {
  design: Template;
  onClick: () => void;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function DesignCardComponent({ design, onClick }: DesignCardProps) {
  const updatedLabel = useMemo(() => {
    const date = design.updatedAt ? new Date(design.updatedAt) : null;
    return date ? dateFormatter.format(date) : "—";
  }, [design.updatedAt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open design ${design.name}`}
      className="group relative cursor-pointer rounded-xl border border-border bg-card shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
    >
      <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded bg-blue-700 text-white text-[10px] font-medium shadow">
        DESIGN
      </div>

      <div className="h-56 w-full rounded-t-xl bg-neutral-200 flex items-center justify-center">
        <span className="text-xs text-neutral-500">No preview yet</span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-base truncate">{design.name}</h3>

        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>Updated {updatedLabel}</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px]">
            saved
          </span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DesignCardComponent);
