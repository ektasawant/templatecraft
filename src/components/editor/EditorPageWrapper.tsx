"use client";

import TemplateEditor from "./TemplateEditor";

export default function EditorPageWrapper({
  type,
  entity,
}: {
  type: "template" | "design";
  entity: any;
}) {
  return <TemplateEditor type={type} entity={entity} />;
}
