"use client";

import { useEffect, useRef, useState } from "react";
import type { Template } from "@/lib/domain/templates/types";
import type { CanvasLayer, CanvasState } from "@/lib/domain/canvas/types";

export default function useCanvasEditor(template?: Template | null) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    width: 1080,
    height: 1080,
    layers: [],
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Prevent re-initializing on every render
  const initialized = useRef(false);

  // ---------- INIT FROM TEMPLATE ----------
  useEffect(() => {
    if (!template || initialized.current) return;

    initialized.current = true;

    setCanvasState({
      width: template.canvas.width,
      height: template.canvas.height,
      layers: template.canvas.layers.map((l, index) => ({
        ...l,
        fontSize: l.fontSize ?? 48,
        zIndex: l.zIndex ?? index,
      })),
    });
  }, [template]);

  // ---------- SELECT ----------
  const selectLayer = (id: string | null) => {
    setSelectedLayerId(id);
  };

  // ---------- UPDATE ----------
  const updateLayer = (id: string, patch: Partial<CanvasLayer>) => {
    setCanvasState((prev) => ({
      ...prev,
      layers: prev.layers.map((l) =>
        l.id === id ? { ...l, ...patch } : l
      ),
    }));
    setSelectedLayerId(id);
  };

  // ---------- ADD TEXT ----------
  const addTextLayer = () => {
    setCanvasState((prev) => {
      const newLayer: CanvasLayer = {
        id: `layer-${Date.now()}`,
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

      return {
        ...prev,
        layers: [...prev.layers, newLayer],
      };
    });
  };

  // ---------- ADD IMAGE ----------
  const addImageLayer = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      setCanvasState((prev) => {
        const newLayer: CanvasLayer = {
          id: `layer-${Date.now()}`,
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

        return {
          ...prev,
          layers: [...prev.layers, newLayer],
        };
      });
    };

    reader.readAsDataURL(file);
  };

  // ---------- REMOVE ----------
  const removeLayer = (id: string) => {
    setCanvasState((prev) => {
      const filtered = prev.layers.filter((l) => l.id !== id);
      filtered.forEach((l, i) => (l.zIndex = i));
      return { ...prev, layers: filtered };
    });
    setSelectedLayerId(null);
  };

  // ---------- MOVE (UP / DOWN) ----------
  const moveLayer = (id: string, dir: "up" | "down") => {
    setCanvasState((prev) => {
      const idx = prev.layers.findIndex((l) => l.id === id);
      if (idx === -1) return prev;

      const layers = [...prev.layers];

      if (dir === "up" && idx < layers.length - 1) {
        [layers[idx], layers[idx + 1]] = [layers[idx + 1], layers[idx]];
      }

      if (dir === "down" && idx > 0) {
        [layers[idx], layers[idx - 1]] = [layers[idx - 1], layers[idx]];
      }

      layers.forEach((l, i) => (l.zIndex = i));

      return { ...prev, layers };
    });
  };

  // ---------- BRING TO FRONT ----------
  const bringToFront = (id: string) => {
    setCanvasState((prev) => {
      const idx = prev.layers.findIndex((l) => l.id === id);
      if (idx === -1) return prev;

      const layers = [...prev.layers];
      const [layer] = layers.splice(idx, 1);
      layers.push(layer);
      layers.forEach((l, i) => (l.zIndex = i));

      return { ...prev, layers };
    });
  };

  // ---------- SEND TO BACK ----------
  const sendToBack = (id: string) => {
    setCanvasState((prev) => {
      const idx = prev.layers.findIndex((l) => l.id === id);
      if (idx === -1) return prev;

      const layers = [...prev.layers];
      const [layer] = layers.splice(idx, 1);
      layers.unshift(layer);
      layers.forEach((l, i) => (l.zIndex = i));

      return { ...prev, layers };
    });
  };

  return {
    canvasState,
    selectedLayerId,
    selectLayer,
    updateLayer,
    addTextLayer,
    addImageLayer,
    removeLayer,
    moveLayer,
    bringToFront,
    sendToBack,
  };
}
