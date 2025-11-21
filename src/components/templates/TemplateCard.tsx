"use client";

import { Template } from "@/lib/domain/templates/types";

export default function TemplateCard({
  template,
  onClick,
}: {
  template: Template;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition"
    >
      {/* Channel badge */}
      <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded bg-neutral-900 text-white text-[10px] font-medium shadow">
        {template.channel?.toUpperCase() || "UNKNOWN"}
      </div>

      {/* Thumbnail Placeholder */}
      <div className="h-56 w-full rounded-t-xl bg-neutral-200 flex items-center justify-center">
        <span className="text-xs text-neutral-500">No preview yet</span>
      </div>

      <div className="p-4 space-y-2">
        {/* Name */}
        <h3 className="font-medium text-base truncate">{template.name}</h3>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>
            Updated {new Date(template.updatedAt).toLocaleDateString()}
          </span>

          {/* Status badge */}
          {template.status === "active" ? (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">
              active
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px]">
              draft
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
