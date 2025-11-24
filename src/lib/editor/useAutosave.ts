"use client";

import { useEffect, useRef, useState } from "react";
import { saveTemplate } from "@/lib/domain/templates/store";
import { saveDesign } from "@/lib/domain/designs/store";

import type { Template } from "@/lib/domain/templates/types";
import type { CanvasState } from "@/lib/domain/canvas/types";

const nowISO = () => new Date().toISOString();

export default function useAutosave(entity: Template | null, canvasState: CanvasState) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const prevSnapshot = useRef<string>("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!entity) return;

    const isDesign = entity.id.startsWith("design");
    const hasLayers = canvasState.layers.length > 0;

    const updatedEntity: Template = {
      ...entity,
      status: hasLayers ? "active" : "draft",
      canvas: canvasState,
      updatedAt: nowISO(),
    };

    const snapshot = JSON.stringify(updatedEntity);
    if (snapshot === prevSnapshot.current) return;
    prevSnapshot.current = snapshot;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    saveTimerRef.current = setTimeout(() => {
      setStatus("saving");

      if (isDesign) saveDesign(updatedEntity);
      else saveTemplate(updatedEntity);

      setStatus("saved");
      idleTimerRef.current = setTimeout(() => setStatus("idle"), 700);
      saveTimerRef.current = null;
    }, 450);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [entity, canvasState]);

  return { autosaveStatus: status };
}
