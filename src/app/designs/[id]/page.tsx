"use client";

import { useParams } from "next/navigation";
import { getDesignById } from "@/lib/domain/designs/store";
import EditorPageWrapper from "@/components/editor/EditorPageWrapper";

export default function DesignEditorPage() {
  const { id } = useParams();
  const design = getDesignById(id as string);

  return <EditorPageWrapper type="design" entity={design} />;
}
