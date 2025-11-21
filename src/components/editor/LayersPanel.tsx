"use client";

import {
  TrashIcon,
  PhotoIcon,
  PencilIcon,
  ArrowUpOnSquareStackIcon,
  ArrowDownOnSquareStackIcon,
} from "@heroicons/react/24/solid";

import type { CanvasLayer } from "@/lib/domain/canvas/types";

type LayersPanelProps = {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  selectLayer: (id: string) => void;
  removeLayer: (id: string) => void;
  moveLayer: (id: string, dir: "up" | "down") => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  addTextLayer: () => void;
  addImageLayer: (file: File) => void;
};

export default function LayersPanel({
  layers,
  selectedLayerId,
  selectLayer,
  removeLayer,
  bringToFront,
  sendToBack,
  addTextLayer,
  addImageLayer,
}: LayersPanelProps) {
  if (!layers.length) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-neutral-500 px-1 py-1.5">
          No layers yet. Add a <span className="font-medium">Text</span> or{" "}
          <span className="font-medium">Image</span> layer to get started.
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={addTextLayer}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
          >
            <PencilIcon className="h-4 w-4" />
            Text
          </button>
          <label className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800 cursor-pointer">
            <PhotoIcon className="h-4 w-4" />
            Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) addImageLayer(file);
              }}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top add buttons (still visible when layers exist) */}
      <div className="flex gap-2 mb-1">
        <button
          type="button"
          onClick={addTextLayer}
          className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
        >
          <PencilIcon className="h-4 w-4" />
          Text
        </button>
        <label className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800 cursor-pointer">
          <PhotoIcon className="h-4 w-4" />
          Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addImageLayer(file);
            }}
          />
        </label>
      </div>

      {/* Layer list */}
      <div className="space-y-2">
        {layers.map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          const isImage = layer.type === "image";

          const previewText =
            !isImage && layer.content
              ? `"${String(layer.content).slice(0, 22)}${
                  String(layer.content).length > 22 ? "…" : ""
                }"`
              : isImage
              ? "Bitmap / photo"
              : "Empty";

          return (
            <div
              key={layer.id}
              className={`group w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition border ${
                isSelected
                  ? "bg-blue-50 border-blue-400"
                  : "bg-white border-transparent hover:bg-neutral-50 hover:border-neutral-200"
              }`}
            >
              {/* Left side: icon + labels (click to select) */}
              <button
                type="button"
                onClick={() => selectLayer(layer.id)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <div
                  className={`h-7 w-7 rounded-md flex items-center justify-center text-xs ${
                    isImage
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isImage ? (
                    <PhotoIcon className="h-4 w-4" />
                  ) : (
                    <PencilIcon className="h-4 w-4" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-[13px]">
                    {isImage ? "Image layer" : "Text layer"}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {previewText}
                  </span>
                </div>
              </button>

              {/* Right side: z-index controls + delete */}
              <div className="flex items-center gap-1 ml-2">
                {/* Bring to front */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    bringToFront(layer.id);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100"
                  aria-label="Bring layer to front"
                >
                  <ArrowUpOnSquareStackIcon className="h-4 w-4 text-blue-700" />
                </button>

                {/* Send to back */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sendToBack(layer.id);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100"
                  aria-label="Send layer to back"
                >
                  <ArrowDownOnSquareStackIcon className="h-4 w-4 text-blue-700" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(layer.id);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50"
                  aria-label="Delete layer"
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
