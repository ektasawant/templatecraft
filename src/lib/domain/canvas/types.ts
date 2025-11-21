export interface CanvasLayer {
  id: string;
  type: "text" | "image";

  x: number;
  y: number;
  width: number;
  height: number;

  rotation: number;
  opacity: number;
  zIndex: number;

  content?: string;
  fontSize?: number;
  color?: string;

  src?: string;
}

export interface CanvasState {
  width: number;
  height: number;
  layers: CanvasLayer[];
}
