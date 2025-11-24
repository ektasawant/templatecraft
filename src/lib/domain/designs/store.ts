"use client";

import type { Template, TemplateChannel } from "@/lib/domain/templates/types";
import { generateId } from "@/lib/domain/shared/id";

const STORAGE_KEY = "templatecraft-designs";
const isBrowser = typeof window !== "undefined";

const nowISO = () => new Date().toISOString();

function readDesigns(): Template[] {
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

function writeDesigns(list: Template[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getDesigns(): Template[] {
  return readDesigns();
}

export function getDesignById(id: string): Template | null {
  return readDesigns().find((d) => d.id === id) ?? null;
}

export function createDesignFromTemplate(template: Template): Template {
  const designs = readDesigns();

  const newDesign: Template = {
    ...template,
    id: generateId("design"),
    status: "draft",
    updatedAt: nowISO(),
    thumbnail: template.thumbnail ?? null,
  };

  designs.push(newDesign);
  writeDesigns(designs);
  return newDesign;
}

export function saveDesign(updated: Template) {
  const designs = readDesigns();
  const idx = designs.findIndex((d) => d.id === updated.id);
  const stamped: Template = { ...updated, updatedAt: nowISO() };

  if (idx === -1) {
    designs.push(stamped);
  } else {
    designs[idx] = stamped;
  }

  writeDesigns(designs);
}

export function updateDesignMeta(
  id: string,
  meta: { name: string; channel: TemplateChannel }
) {
  const designs = readDesigns();
  const idx = designs.findIndex((d) => d.id === id);
  if (idx === -1) return;

  const normalizedName =
    meta.name.trim().length > 0 ? meta.name.trim() : "Untitled Design";

  designs[idx] = {
    ...designs[idx],
    name: normalizedName,
    channel: meta.channel,
    updatedAt: nowISO(),
  };

  writeDesigns(designs);
}
