"use client";

import { memo, useRef } from "react";
import type { CanvasLayer } from "@/lib/domain/canvas/types";

type Props = {
  layer: CanvasLayer;
  update: (patch: Partial<CanvasLayer>) => void;
};

function PropertyPanelComponent({ layer, update }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-4 text-sm">
      {layer.type === "text" && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Text</label>
            <input
              type="text"
              value={layer.content}
              onChange={(e) => update({ content: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">
              Font size
            </label>
            <input
              type="range"
              min={10}
              max={200}
              value={layer.fontSize ?? 40}
              onChange={(e) => update({ fontSize: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-[11px] text-neutral-500">
              {layer.fontSize ?? 40}px
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">
              Color
            </label>
            <input
              type="color"
              value={layer.color}
              onChange={(e) => update({ color: e.target.value })}
              className="h-8 w-full rounded-md border border-neutral-200 cursor-pointer"
            />
          </div>
        </>
      )}

      {layer.type === "image" && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">
              Replace image
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
            >
              Upload new image
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                  update({ src: reader.result as string });
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">
              Width
            </label>
            <input
              type="range"
              min={50}
              max={2000}
              value={layer.width}
              onChange={(e) => update({ width: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-[11px] text-neutral-500">{layer.width}px</div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">
              Height
            </label>
            <input
              type="range"
              min={50}
              max={2000}
              value={layer.height}
              onChange={(e) => update({ height: Number(e.target.value) })}
              className="w-full"
            />
            <div className="text-[11px] text-neutral-500">{layer.height}px</div>
          </div>
        </>
      )}

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700">Opacity</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={layer.opacity}
          onChange={(e) => update({ opacity: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-[11px] text-neutral-500">
          {Math.round((layer.opacity ?? 1) * 100)}%
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700">Rotation</label>
        <input
          type="range"
          min={-180}
          max={180}
          value={layer.rotation}
          onChange={(e) => update({ rotation: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-[11px] text-neutral-500">
          {Math.round(layer.rotation)}°
        </div>
      </div>
    </div>
  );
}

export default memo(PropertyPanelComponent);
