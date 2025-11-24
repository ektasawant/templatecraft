"use client";

import type { CanvasLayer, CanvasState } from "@/lib/domain/canvas/types";

/**
 * Render a lightweight thumbnail from canvas state.
 * Returns a data URL (PNG) or null if running outside the browser.
 */
export async function renderCanvasThumbnail(
  canvas: CanvasState,
  maxSize = 400
): Promise<string | null> {
  if (typeof document === "undefined") return null;

  const scale =
    Math.max(canvas.width, canvas.height) > 0
      ? Math.min(1, maxSize / Math.max(canvas.width, canvas.height))
      : 1;

  const width = Math.max(1, Math.round(canvas.width * scale));
  const height = Math.max(1, Math.round(canvas.height * scale));

  const el = document.createElement("canvas");
  el.width = width;
  el.height = height;
  const ctx = el.getContext("2d");
  if (!ctx) return null;

  const layers = [...canvas.layers].sort(
    (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)
  );

  for (const layer of layers) {
    const drawX = (layer.x ?? 0) * scale;
    const drawY = (layer.y ?? 0) * scale;
    const drawW = (layer.width ?? 0) * scale;
    const drawH = (layer.height ?? 0) * scale;
    const rotation = ((layer.rotation ?? 0) * Math.PI) / 180;
    const opacity = layer.opacity ?? 1;

    if (opacity <= 0) continue;

    if (layer.type === "text") {
      ctx.save();
      ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = layer.color ?? "#000000";
      ctx.font = `${layer.fontSize ?? 48}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(layer.content ?? "", 0, 0, drawW);
      ctx.restore();
      continue;
    }

    if (layer.type === "image" && layer.src) {
      const img = await loadImage(layer);
      if (!img) continue;

      ctx.save();
      ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }
  }

  try {
    return el.toDataURL("image/png");
  } catch {
    return null;
  }
}

function loadImage(layer: CanvasLayer): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = layer.src ?? "";
  });
}
