"use client";

import { useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";

import useCanvasEditor from "@/lib/editor/useCanvasEditor";
import useAutosave from "@/lib/editor/useAutosave";

import CanvasLayer from "@/components/canvas/CanvasLayer";
import LayersPanel from "@/components/editor/LayersPanel";
import PropertyPanel from "@/components/editor/PropertyPanel";
import SaveStatus from "@/components/editor/SaveStatus";
import AICopyHelper from "@/components/editor/AICopyHelper";

import { createDesignFromTemplate } from "@/lib/domain/designs/store";
import { renderCanvasThumbnail } from "@/lib/editor/renderThumbnail";
import type { CanvasLayer as CanvasLayerModel } from "@/lib/domain/canvas/types";
import type { Template } from "@/lib/domain/templates/types";

type TemplateEditorProps = {
  type: "template" | "design";
  entity: Template | null;
};

export default function TemplateEditor({ type, entity }: TemplateEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const template = entity;
  const {
    canvasState,
    selectedLayerId,
    selectLayer,
    updateLayer,
    addTextLayer,
    addImageLayer,
    removeLayer,
    bringToFront,
    sendToBack,
  } = useCanvasEditor(template || undefined);

  const { autosaveStatus } = useAutosave(template, canvasState);

  const selectedLayer = useMemo(
    () => canvasState.layers.find((l) => l.id === selectedLayerId),
    [canvasState.layers, selectedLayerId]
  );

  const editMetaHref = useMemo(
    () => (template ? (type === "template" ? `/templates/${template.id}/edit` : `/designs/${template.id}/edit`) : "/"),
    [template, type]
  );

  const handleBack = useCallback(() => router.push("/templates"), [router]);
  const handleEditMeta = useCallback(() => router.push(editMetaHref), [router, editMetaHref]);
  const handleUseAsDesign = useCallback(async () => {
    if (!template) return;
    const hasLayers = canvasState.layers.length > 0;
    const thumbnail = await renderCanvasThumbnail(canvasState);

    const design = createDesignFromTemplate({
      ...template,
      canvas: canvasState,
      status: hasLayers ? "active" : "draft",
      updatedAt: new Date().toISOString(),
      thumbnail: thumbnail ?? template.thumbnail ?? null,
    });
    router.push(`/designs/${design.id}`);
  }, [canvasState, router, template]);

  const handleCanvasDeselect = useCallback(() => selectLayer(null), [selectLayer]);
  const handleLayerSelect = useCallback((id: string) => selectLayer(id), [selectLayer]);
  const handleLayerChange = useCallback(
    (id: string, patch: Partial<CanvasLayerModel>) => updateLayer(id, patch),
    [updateLayer]
  );

  const handleAddImageClick = useCallback(() => fileInputRef.current?.click(), []);
  const handleImageInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) addImageLayer(file);
      e.target.value = "";
    },
    [addImageLayer]
  );

  if (!template) {
    return (
      <main className="h-screen w-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Template not found.</div>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen grid grid-rows-[auto,1fr] grid-cols-[minmax(0,1fr)_340px] overflow-hidden bg-neutral-100">
      <header className="col-span-2 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            aria-label="Back to templates"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold leading-none">{template.name}</h1>
              <button
                type="button"
                onClick={handleEditMeta}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                aria-label={type === "template" ? "Edit template details" : "Edit design details"}
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 capitalize">
                {template.channel}
              </span>
              <span aria-hidden>•</span>
              <span>{type === "template" ? "Template" : "Design"} editor</span>
            </div>
          </div>
        </div>

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
              type="button"
              onClick={handleUseAsDesign}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Use as Design
            </button>
          )}

          <SaveStatus status={autosaveStatus} />
        </div>
      </header>

      <div className="relative overflow-auto bg-neutral-100 min-h-0">
        <div className="flex min-h-full items-center justify-center p-10">
          <div
            id="canvas-box"
            className="relative rounded-xl border border-neutral-300 bg-white shadow-sm"
            style={{
              width: canvasState.width,
              height: canvasState.height,
              overflow: "visible",
            }}
            onClick={handleCanvasDeselect}
          >
            {canvasState.layers.map((layer) => (
              <CanvasLayer
                key={layer.id}
                layer={layer}
                isSelected={selectedLayerId === layer.id}
                onSelect={() => handleLayerSelect(layer.id)}
                onChange={(patch) => handleLayerChange(layer.id, patch)}
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="w-[340px] border-l border-neutral-200 bg-neutral-50 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <section className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <div>
                <h2 className="text-sm font-semibold text-neutral-800">Layers</h2>
                <p className="text-[11px] text-neutral-500">
                  {canvasState.layers.length}{" "}
                  {canvasState.layers.length === 1 ? "layer" : "layers"}
                </p>
              </div>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={addTextLayer}
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  <span>Text</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddImageClick}
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
                >
                  <PhotoIcon className="h-3.5 w-3.5" />
                  <span>Image</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageInput}
                />
              </div>
            </div>

            <div className="px-3 py-2 max-h-[260px] overflow-y-auto">
              <LayersPanel
                layers={canvasState.layers}
                selectedLayerId={selectedLayerId}
                selectLayer={selectLayer}
                removeLayer={removeLayer}
                bringToFront={bringToFront}
                sendToBack={sendToBack}
              />
            </div>
          </section>

          <section className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">Properties</h2>
              <span className="text-[11px] text-neutral-500">
                {selectedLayerId ? "Layer selected" : "No layer selected"}
              </span>
            </div>

            <div className="px-4 py-3">
              {selectedLayer ? (
                <PropertyPanel
                  layer={selectedLayer}
                  update={(patch) => updateLayer(selectedLayer.id, patch)}
                />
              ) : (
                <p className="text-xs text-neutral-500">
                  Select a layer on the canvas or in the list to edit its properties.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">AI Copy Helper</h2>
              <span className="text-[11px] rounded-full bg-purple-50 px-2 py-0.5 text-purple-700">
                Stub
              </span>
            </div>

            <div className="px-4 py-3">
              <AICopyHelper
                selectedLayerId={selectedLayerId}
                onInsert={(text) => selectedLayerId && updateLayer(selectedLayerId, { content: text })}
              />
            </div>
          </section>
        </div>
      </aside>
    </main>
  );
}
