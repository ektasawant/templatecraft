"use client";

import type { Template } from "@/lib/domain/templates/types";
import { generateId } from "@/lib/domain/shared/id";

const STORAGE_KEY = "templatecraft-designs";

function load() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(data: Template[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let designs: Template[] = load();

export function createDesignFromTemplate(template: Template) {
  const newDesign: Template = {
    ...template,
    id: generateId("design"),
    status: "draft",
    updatedAt: new Date().toISOString(),
  };

  designs.push(newDesign);
  save(designs);
  return newDesign;
}

export function getDesignById(id: string) {
  return designs.find((d) => d.id === id) || null;
}

export const getDesigns = () => designs;

export function saveDesign(updated: Template) {
  designs = designs.map((d) =>
    d.id === updated.id
      ? { ...updated, updatedAt: new Date().toISOString() }
      : d
  );
  save(designs);
}

export function updateDesignMeta(
  id: string,
  meta: { name: string; channel: Template["channel"] }
) {
  designs = designs.map((d) =>
    d.id === id
      ? {
          ...d,
          name: meta.name.trim().length ? meta.name.trim() : "Untitled Design",
          channel: meta.channel,
          updatedAt: new Date().toISOString(),
        }
      : d
  );

  save(designs);
}
