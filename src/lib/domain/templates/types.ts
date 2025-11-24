import type { CanvasState } from "@/lib/domain/canvas/types";

export type TemplateStatus = "draft" | "active";

export type TemplateChannel =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "twitter"
  | "generic";

export interface Template {
  id: string;
  name: string;
  channel: TemplateChannel;
  status: TemplateStatus;
  updatedAt: string;
  canvas: CanvasState;
  thumbnail?: string | null;
}
