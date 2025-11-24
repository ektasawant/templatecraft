"use client";

import React, { useCallback, useMemo } from "react";
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
  selectLayer: (id: string | null) => void;
  removeLayer: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
};

export default function LayersPanel({
  layers,
  selectedLayerId,
  selectLayer,
  removeLayer,
  bringToFront,
  sendToBack,
}: LayersPanelProps) {
  const sortedLayers = useMemo(
    () => [...layers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)),
    [layers]
  );

  const handleSelect = useCallback(
    (id: string) => selectLayer(id),
    [selectLayer]
  );

  if (!sortedLayers.length) {
    return (
      <p className="text-xs text-neutral-500 px-1 py-1.5">
        No layers yet. Use the <span className="font-medium">Text</span> or{" "}
        <span className="font-medium">Image</span> buttons above to add one.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {sortedLayers.map((layer) => (
        <LayerRow
          key={layer.id}
          layer={layer}
          isSelected={selectedLayerId === layer.id}
          onSelect={handleSelect}
          onRemove={removeLayer}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
        />
      ))}
    </div>
  );
}

type LayerRowProps = {
  layer: CanvasLayer;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
};

const truncate = (value: string, max = 22) =>
  value.length > max ? `${value.slice(0, max)}...` : value;

const LayerRow = React.memo(function LayerRow({
  layer,
  isSelected,
  onSelect,
  onRemove,
  onBringToFront,
  onSendToBack,
}: LayerRowProps) {
  const isImage = layer.type === "image";
  const previewText =
    !isImage && layer.content
      ? `"${truncate(String(layer.content))}"`
      : isImage
      ? "Bitmap / photo"
      : "Empty";

  const select = useCallback(() => onSelect(layer.id), [layer.id, onSelect]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      }}
      className={`group w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition border outline-none ${
        isSelected
          ? "bg-blue-50 border-blue-400"
          : "bg-white border-transparent hover:bg-neutral-50 hover:border-neutral-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`h-7 w-7 rounded-md flex items-center justify-center text-xs ${
            isImage ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
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
          <span className="text-[11px] text-neutral-500">{previewText}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition">
        <IconButton
          label="Bring to front"
          onClick={(e) => {
            e.stopPropagation();
            onBringToFront(layer.id);
          }}
        >
          <ArrowUpOnSquareStackIcon className="h-4 w-4 text-neutral-700" />
        </IconButton>

        <IconButton
          label="Send to back"
          onClick={(e) => {
            e.stopPropagation();
            onSendToBack(layer.id);
          }}
        >
          <ArrowDownOnSquareStackIcon className="h-4 w-4 text-neutral-700" />
        </IconButton>

        <IconButton
          label="Delete layer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(layer.id);
          }}
        >
          <TrashIcon className="h-4 w-4 text-red-600" />
        </IconButton>
      </div>
    </div>
  );
});

type IconButtonProps = {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 cursor-pointer"
      aria-label={label}
    >
      {children}
    </button>
  );
}
