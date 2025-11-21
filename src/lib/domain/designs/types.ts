import { CanvasState } from "../canvas/types";

export interface Design {
  id: string;
  name: string;
  channel: string;
  templateId: string | null;
  status: "draft" | "final";
  updatedAt: string;
  thumbnail?: string;
  canvas: CanvasState;
}
