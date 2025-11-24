"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import TemplateEditor from "@/components/editor/TemplateEditor";
import { getDesignById } from "@/lib/domain/designs/store";
import type { Template } from "@/lib/domain/templates/types";

export default function DesignEditorPage() {
  const params = useParams();
  const router = useRouter();

  const designId = useMemo(() => {
    const raw = params?.id;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw) && raw.length > 0) return raw[0];
    return "";
  }, [params]);

  const design = useMemo<Template | null>(() => {
    if (!designId) return null;
    return getDesignById(designId) ?? null;
  }, [designId]);

  const shouldRedirect = !!designId && !design;

  useEffect(() => {
    if (shouldRedirect) router.replace("/designs");
  }, [shouldRedirect, router]);

  if (!designId) {
    return (
      <main className="h-screen flex flex-col items-center justify-center gap-3 text-sm text-neutral-600">
        <p>Design id is missing.</p>
        <Link
          href="/designs"
          className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
        >
          Back to designs
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

  if (!design) {
    return (
      <main className="h-screen flex flex-col items-center justify-center gap-3 text-sm text-neutral-600">
        <p>Design not found.</p>
        <Link
          href="/designs"
          className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
        >
          Back to designs
        </Link>
      </main>
    );
  }

  return <TemplateEditor type="design" entity={design} />;
}
