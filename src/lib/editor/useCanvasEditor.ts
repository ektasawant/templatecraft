"use client";

import { useCallback, useMemo, useState } from "react";
import { generateId } from "@/lib/domain/shared/id";
import type { Template } from "@/lib/domain/templates/types";
import type { CanvasLayer, CanvasState } from "@/lib/domain/canvas/types";

const DEFAULT_CANVAS: CanvasState = {
  width: 1080,
  height: 1080,
  layers: [],
};

export default function useCanvasEditor(template?: Template | null) {
  const [canvasState, setCanvasState] = useState<CanvasState>(() => {
    if (!template) return { ...DEFAULT_CANVAS, layers: [] };

    return {
      width: template.canvas.width,
      height: template.canvas.height,
      layers: template.canvas.layers.map((l, index) => ({
        ...l,
        fontSize: l.fontSize ?? 48,
        zIndex: l.zIndex ?? index,
      })),
    };
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const reindexLayers = useCallback(
    (layers: CanvasLayer[]) => layers.map((l, i) => ({ ...l, zIndex: i })),
    []
  );

  const selectLayer = useCallback((id: string | null) => {
    setSelectedLayerId(id);
  }, []);

  const updateLayer = useCallback((id: string, patch: Partial<CanvasLayer>) => {
    setCanvasState((prev) => ({
      ...prev,
      layers: prev.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
    setSelectedLayerId(id);
  }, []);

  const addTextLayer = useCallback(() => {
    setCanvasState((prev) => {
      const newLayer: CanvasLayer = {
        id: generateId("layer"),
        type: "text",
        content: "New text",
        x: 100,
        y: 100,
        width: 400,
        height: 80,
        fontSize: 48,
        color: "#000000",
        rotation: 0,
        opacity: 1,
        zIndex: prev.layers.length,
      };

      return { ...prev, layers: [...prev.layers, newLayer] };
    });
  }, []);

  const addImageLayer = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      setCanvasState((prev) => {
        const newLayer: CanvasLayer = {
          id: generateId("layer"),
          type: "image",
          src: base64,
          x: 80,
          y: 80,
          width: 400,
          height: 300,
          rotation: 0,
          opacity: 1,
          zIndex: prev.layers.length,
        };

        return { ...prev, layers: [...prev.layers, newLayer] };
      });
    };

    reader.readAsDataURL(file);
  }, []);

  const removeLayer = useCallback((id: string) => {
    setCanvasState((prev) => {
      const filtered = prev.layers.filter((l) => l.id !== id);
      return { ...prev, layers: reindexLayers(filtered) };
    });
    setSelectedLayerId(null);
  }, [reindexLayers]);

  const bringToFront = useCallback(
    (id: string) => {
      setCanvasState((prev) => {
        const idx = prev.layers.findIndex((l) => l.id === id);
        if (idx === -1) return prev;

        const layers = [...prev.layers];
        const [layer] = layers.splice(idx, 1);
        layers.push(layer);

        return { ...prev, layers: reindexLayers(layers) };
      });
    },
    [reindexLayers]
  );

  const sendToBack = useCallback(
    (id: string) => {
      setCanvasState((prev) => {
        const idx = prev.layers.findIndex((l) => l.id === id);
        if (idx === -1) return prev;

        const layers = [...prev.layers];
        const [layer] = layers.splice(idx, 1);
        layers.unshift(layer);

        return { ...prev, layers: reindexLayers(layers) };
      });
    },
    [reindexLayers]
  );

  return useMemo(
    () => ({
      canvasState,
      selectedLayerId,
      selectLayer,
      updateLayer,
      addTextLayer,
      addImageLayer,
      removeLayer,
      bringToFront,
      sendToBack,
    }),
    [
      canvasState,
      selectedLayerId,
      selectLayer,
      updateLayer,
      addTextLayer,
      addImageLayer,
      removeLayer,
      bringToFront,
      sendToBack,
    ]
  );
}
