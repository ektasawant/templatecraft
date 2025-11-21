"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getTemplateById } from "@/lib/domain/templates/store";
import TemplateEditor from "@/components/editor/TemplateEditor"; // your editor

export default function TemplateEditorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tpl = getTemplateById(id as string);

    if (!tpl) {
      router.push("/templates");
      return;
    }

    setTemplate(tpl);
    setLoading(false);
  }, [id, router]);

  if (loading) {
    return (
      <main className="h-screen flex items-center justify-center">
        <div className="text-neutral-500">Loading template...</div>
      </main>
    );
  }

  return <TemplateEditor type="template" entity={template} />;
}
