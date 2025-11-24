"use client";

import type { Template, TemplateChannel } from "@/lib/domain/templates/types";
import type { CanvasState } from "@/lib/domain/canvas/types";
import { generateId } from "@/lib/domain/shared/id";

const STORAGE_KEY = "templatecraft.templates";
const isBrowser = typeof window !== "undefined";
const nowISO = () => new Date().toISOString();
const DEFAULT_CANVAS: CanvasState = { width: 1080, height: 1080, layers: [] };

function readTemplates(): Template[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Template[]) : [];
  } catch {
    return [];
  }
}

function writeTemplates(list: Template[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getTemplates(): Template[] {
  return readTemplates();
}

export function getTemplateById(id: string): Template | null {
  return readTemplates().find((t) => t.id === id) ?? null;
}

export function saveTemplate(template: Template) {
  const templates = readTemplates();
  const stamped: Template = { ...template, updatedAt: nowISO() };
  const idx = templates.findIndex((t) => t.id === stamped.id);

  if (idx === -1) templates.push(stamped);
  else templates[idx] = stamped;

  writeTemplates(templates);
}

export function createTemplate(meta: { name: string; channel: TemplateChannel }): Template {
  const templates = readTemplates();

  const template: Template = {
    id: generateId("tpl"),
    name: meta.name.trim().length ? meta.name.trim() : "Untitled Template",
    channel: meta.channel,
    status: "draft",
    updatedAt: nowISO(),
    canvas: { ...DEFAULT_CANVAS },
    thumbnail: null,
  };

  templates.push(template);
  writeTemplates(templates);
  return template;
}

export function updateTemplateMeta(
  id: string,
  meta: { name: string; channel: TemplateChannel }
) {
  const templates = readTemplates();
  const idx = templates.findIndex((t) => t.id === id);
  if (idx === -1) return;

  const normalizedName = meta.name.trim().length ? meta.name.trim() : "Untitled Template";
  const updated: Template = {
    ...templates[idx],
    name: normalizedName,
    channel: meta.channel,
    updatedAt: nowISO(),
  };

  saveTemplate(updated);
}
