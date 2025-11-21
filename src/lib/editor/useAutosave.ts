"use client";

import { useEffect, useRef, useState } from "react";
import { saveTemplate } from "@/lib/domain/templates/store";
import { saveDesign } from "@/lib/domain/designs/store";

import type { Template } from "@/lib/domain/templates/types";
import type { CanvasState } from "@/lib/domain/canvas/types";

export default function useAutosave(
  entity: Template | null,
  canvasState: CanvasState
) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const prevSnapshot = useRef<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!entity) return;

    const isDesign = entity.id.startsWith("design");
    const hasLayers = canvasState.layers.length > 0;

    const updatedEntity: Template = {
      ...entity,
      status: hasLayers ? "active" : "draft",
      canvas: canvasState,
      updatedAt: new Date().toISOString(),
    };

    const snapshot = JSON.stringify(updatedEntity);
    if (prevSnapshot.current === snapshot) return;

    prevSnapshot.current = snapshot;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setStatus("saving");

      if (isDesign) {
        saveDesign(updatedEntity);
      } else {
        saveTemplate(updatedEntity);
      }

      setStatus("saved");
      timeoutRef.current = setTimeout(() => setStatus("idle"), 700);
    }, 450);

    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [entity, canvasState]);

  return { autosaveStatus: status };
}
