"use client";

import type {
  Template,
  TemplateChannel,
} from "@/lib/domain/templates/types";

import type { CanvasState } from "@/lib/domain/canvas/types";

const STORAGE_KEY = "templatecraft.templates";

// ---- READ ----
function readTemplates(): Template[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ---- WRITE ----
function writeTemplates(list: Template[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ---- GET ALL ----
export function getTemplates() {
  return readTemplates();
}

// ---- GET BY ID ----
export function getTemplateById(id: string): Template | null {
  return readTemplates().find((t) => t.id === id) ?? null;
}

// ---- SAVE (UPSERT) ----
export function saveTemplate(template: Template) {
  const list = readTemplates();
  const idx = list.findIndex((t) => t.id === template.id);

  if (idx === -1) list.push(template);
  else list[idx] = template;

  writeTemplates(list);
}

// ---- CREATE BLANK TEMPLATE ----
export function createTemplate(meta: {
  name: string;
  channel: TemplateChannel;
}): Template {
  const list = readTemplates();
  const id = `tpl-${Date.now()}`;

  const emptyCanvas: CanvasState = {
    width: 1080,
    height: 1080,
    layers: [],
  };

  const template: Template = {
    id,
    name: meta.name.trim() || "Untitled Template",
    channel: meta.channel,
    status: "draft",
    updatedAt: new Date().toISOString(),
    canvas: emptyCanvas,
  };

  list.push(template);
  writeTemplates(list);

  return template;
}

// ---- UPDATE META ONLY ----
export function updateTemplateMeta(
  id: string,
  meta: { name: string; channel: TemplateChannel }
) {
  const templates = readTemplates();
  const idx = templates.findIndex((t) => t.id === id);
  if (idx === -1) return;

  const updated = {
    ...templates[idx],
    name: meta.name.trim().length ? meta.name.trim() : "Untitled Template",
    channel: meta.channel,
    updatedAt: new Date().toISOString(),
  };

  templates[idx] = updated;
  writeTemplates(templates);
}

