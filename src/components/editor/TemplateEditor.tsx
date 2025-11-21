"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

import useCanvasEditor from "@/lib/editor/useCanvasEditor";
import useAutosave from "@/lib/editor/useAutosave";

import CanvasLayer from "@/components/canvas/CanvasLayer";
import LayersPanel from "@/components/editor/LayersPanel";
import PropertyPanel from "@/components/editor/PropertyPanel";
import SaveStatus from "@/components/editor/SaveStatus";
import AICopyHelper from "@/components/editor/AICopyHelper";

import { createDesignFromTemplate } from "@/lib/domain/designs/store";
import type { Template } from "@/lib/domain/templates/types";

export default function TemplateEditor({
  type,
  entity,
}: {
  type: "template" | "design";
  entity: Template | null;
}) {
  const router = useRouter();
  const template = entity;

  const {
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
  } = useCanvasEditor(template || undefined);

  const { autosaveStatus } = useAutosave(template, canvasState);

  if (!template) {
    return (
      <main className="h-screen w-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Template not found.</div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col bg-neutral-100">
      {/* ===== HEADER ===== */}
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
        {/* LEFT: back + meta */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/templates")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            aria-label="Back to templates"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold leading-none">
                {template.name}
              </h1>

              {/* tiny edit icon → goes to /templates/[id]/edit */}
              <button
                onClick={() => router.push(`/templates/${template.id}/edit`)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                aria-label="Edit template details"
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 capitalize">
                {template.channel}
              </span>
              <span>•</span>
              <span>
                {type === "template" ? "Template" : "Design"} editor
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: status + actions */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs capitalize ${
              template.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {template.status}
          </span>

          {type === "template" && (
            <button
              onClick={() => {
                const design = createDesignFromTemplate(template);
                router.push(`/designs/${design.id}`);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Use as Design
            </button>
          )}

          <SaveStatus status={autosaveStatus} />
        </div>
      </header>

      {/* ===== BODY: CANVAS + SIDEBAR ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* CANVAS AREA */}
        <div
          className="flex-1 relative overflow-auto bg-neutral-100"
          onClick={() => selectLayer(null)}
        >
          <div className="flex min-h-full items-center justify-center p-10">
            <div
              id="canvas-box"
              className="relative rounded-xl border border-neutral-300 bg-white shadow-sm"
              style={{
                width: canvasState.width,
                height: canvasState.height,
                overflow: "visible",
              }}
            >
              {canvasState.layers.map((layer, index) => (
                <CanvasLayer
                  key={layer.id}
                  layer={layer}
                  index={index}
                  isSelected={selectedLayerId === layer.id}
                  onSelect={() => selectLayer(layer.id)}
                  onChange={(patch) => updateLayer(layer.id, patch)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="w-[340px] border-l border-neutral-200 bg-neutral-50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ---- Layers Card ---- */}
            <section className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800">
                    Layers
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    {canvasState.layers.length}{" "}
                    {canvasState.layers.length === 1 ? "layer" : "layers"}
                  </p>
                </div>
              </div>

              <div className="px-3 py-2 max-h-[260px] overflow-y-auto">
                <LayersPanel
                  layers={canvasState.layers}
                  selectedLayerId={selectedLayerId}
                  selectLayer={selectLayer}
                  removeLayer={removeLayer}
                  moveLayer={moveLayer}
                  bringToFront={bringToFront}
                  sendToBack={sendToBack}
                  addTextLayer={addTextLayer}
                  addImageLayer={addImageLayer}
                />
              </div>
            </section>

            {/* ---- Properties Card ---- */}
            <section className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-800">
                  Properties
                </h2>
                <span className="text-[11px] text-neutral-500">
                  {selectedLayerId ? "Layer selected" : "No layer selected"}
                </span>
              </div>

              <div className="px-4 py-3">
                {selectedLayerId ? (
                  <PropertyPanel
                    layer={
                      canvasState.layers.find((l) => l.id === selectedLayerId)!
                    }
                    update={(patch) => updateLayer(selectedLayerId, patch)}
                  />
                ) : (
                  <p className="text-xs text-neutral-500">
                    Select a layer on the canvas or in the list to edit its
                    properties.
                  </p>
                )}
              </div>
            </section>

            {/* ---- AI Copy Card ---- */}
            <section className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden mb-2">
              <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-800">
                  AI Copy Helper
                </h2>
                <span className="text-[11px] rounded-full bg-purple-50 px-2 py-0.5 text-purple-700">
                  Stub
                </span>
              </div>

              <div className="px-4 py-3">
                <AICopyHelper
                  selectedLayerId={selectedLayerId}
                  onInsert={(text) =>
                    selectedLayerId &&
                    updateLayer(selectedLayerId, { content: text })
                  }
                />
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
