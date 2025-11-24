"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import TemplateEditor from "@/components/editor/TemplateEditor";
import { getTemplateById } from "@/lib/domain/templates/store";
import type { Template } from "@/lib/domain/templates/types";

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();

  const templateId = useMemo(() => {
    const raw = params?.id;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw) && raw.length > 0) return raw[0];
    return "";
  }, [params]);

  const template = useMemo<Template | null>(() => {
    if (!templateId) return null;
    return getTemplateById(templateId) ?? null;
  }, [templateId]);

  const shouldRedirect = !!templateId && !template;

  useEffect(() => {
    if (shouldRedirect) router.replace("/templates");
  }, [shouldRedirect, router]);

  if (!templateId) {
    return (
      <main className="h-screen flex flex-col items-center justify-center gap-3 text-sm text-neutral-600">
        <p>Template id is missing.</p>
        <Link
          href="/templates"
          className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
        >
          Back to templates
        </Link>
      </main>
    );
  }

  if (shouldRedirect) {
    return (
      <main className="h-screen flex items-center justify-center">
        <p className="text-neutral-500 text-sm">Redirecting…</p>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="h-screen flex flex-col items-center justify-center gap-3 text-sm text-neutral-600">
        <p>Template not found.</p>
        <Link
          href="/templates"
          className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
        >
          Back to templates
        </Link>
      </main>
    );
  }

  return <TemplateEditor type="template" entity={template} />;
}
