"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CanvasLayer } from "@/lib/domain/canvas/types";

type Props = {
  layer: CanvasLayer;
  update: (patch: Partial<CanvasLayer>) => void;
};

const parseNumber = (value: string, fallback: number) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

export default function PropertyPanel({ layer, update }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [rotationInput, setRotationInput] = useState<string>(String(layer.rotation ?? 0));
  const [fontSizeInput, setFontSizeInput] = useState<string>(String(layer.fontSize ?? 40));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotationInput(String(Math.round(layer.rotation ?? 0)));
    setFontSizeInput(String(Math.round(layer.fontSize ?? 40)));
  }, [layer.rotation, layer.fontSize]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => update({ src: reader.result as string });
      reader.readAsDataURL(file);
    },
    [update]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => update({ content: e.target.value }),
    [update]
  );

  const handleFontSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Math.max(4, parseNumber(e.target.value, layer.fontSize ?? 40));
      update({ fontSize: next });
    },
    [layer.fontSize, update]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => update({ color: e.target.value }),
    [update]
  );

  const handlePositionChange = useCallback(
    (key: "x" | "y") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = parseNumber(e.target.value, key === "x" ? layer.x ?? 0 : layer.y ?? 0);
      update({ [key]: next });
    },
    [layer.x, layer.y, update]
  );

  const handleSizeChange = useCallback(
    (key: "width" | "height") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const fallback = key === "width" ? layer.width ?? 0 : layer.height ?? 0;
      const next = Math.max(1, parseNumber(e.target.value, fallback));
      update({ [key]: next });
    },
    [layer.height, layer.width, update]
  );

  const handleRotationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = parseNumber(e.target.value, layer.rotation ?? 0);
      update({ rotation: next });
    },
    [layer.rotation, update]
  );

  const handleOpacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseNumber(e.target.value, (layer.opacity ?? 1) * 100);
      const clamped = Math.min(100, Math.max(0, raw));
      update({ opacity: clamped / 100 });
    },
    [layer.opacity, update]
  );

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={Math.round(layer.x ?? 0)}
            onChange={handlePositionChange("x")}
            className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Position X"
          />
          <input
            type="number"
            inputMode="numeric"
            value={Math.round(layer.y ?? 0)}
            onChange={handlePositionChange("y")}
            className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Position Y"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700">Size</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={Math.round(layer.width ?? 0)}
            onChange={handleSizeChange("width")}
            className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Width"
          />
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={Math.round(layer.height ?? 0)}
            onChange={handleSizeChange("height")}
            className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Height"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700">Rotation (°)</label>
        <input
          type="number"
          inputMode="numeric"
          value={rotationInput}
          onChange={(e) => {
            const val = e.target.value;
            setRotationInput(val);
            if (val === "") return;
            handleRotationChange(e);
          }}
          onBlur={() => {
            if (rotationInput === "") {
              setRotationInput(String(Math.round(layer.rotation ?? 0)));
            }
          }}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="Rotation"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-neutral-700">Opacity (%)</label>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={Math.round((layer.opacity ?? 1) * 100)}
          onChange={handleOpacityChange}
          className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          aria-label="Opacity"
        />
      </div>

      {layer.type === "text" && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Text</label>
            <input
              type="text"
              value={layer.content}
              onChange={handleTextChange}
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Font size</label>
            <input
            type="number"
            inputMode="numeric"
            min={4}
            value={fontSizeInput}
            onChange={(e) => {
              const val = e.target.value;
              setFontSizeInput(val);
              if (val === "") return;
              handleFontSizeChange(e);
            }}
            onBlur={() => {
              if (fontSizeInput === "") {
                setFontSizeInput(String(Math.round(layer.fontSize ?? 40)));
              }
            }}
            className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">Color</label>
            <input
              type="color"
              value={layer.color}
              onChange={handleColorChange}
              className="h-8 w-full rounded-md border border-neutral-200 cursor-pointer"
            />
          </div>
        </>
      )}

      {layer.type === "image" && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-700">Replace image</label>
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
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
