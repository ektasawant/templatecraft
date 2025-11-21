"use client";

import { Template } from "@/lib/domain/templates/types";

export default function DesignCard({
  design,
  onClick,
}: {
  design: Template;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition"
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
          <span>
            Updated {new Date(design.updatedAt).toLocaleDateString()}
          </span>

          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px]">
            saved
          </span>
        </div>
      </div>
    </div>
  );
}
