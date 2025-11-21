"use client";

import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import { memo, MouseEvent as ReactMouseEvent } from "react";
import type { CanvasLayer } from "@/lib/domain/canvas/types";

interface Props {
  layer: CanvasLayer;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasLayer>) => void;
}

function CanvasLayerComponent({
  layer,
  index,
  isSelected,
  onSelect,
  onChange,
}: Props) {
  const handleDragStop: RndDragCallback = (_e, d) => {
    onChange({ x: d.x, y: d.y });
  };

  const handleResizeStop: RndResizeCallback = (
    _e,
    _dir,
    ref,
    _delta,
    position
  ) => {
    onChange({
      width: parseFloat(ref.style.width),
      height: parseFloat(ref.style.height),
      x: position.x,
      y: position.y,
    });
  };

  const handleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect();
  };

  const z = layer.zIndex ?? index;

  return (
    <Rnd
      size={{ width: layer.width, height: layer.height }}
      position={{ x: layer.x, y: layer.y }}
      bounds="parent"
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      onClick={handleClick}
      className={`absolute ${
        isSelected
          ? "ring-2 ring-primary/70 ring-offset-2 ring-offset-white"
          : ""
      }`}
      style={{
        zIndex: z,
        opacity: layer.opacity,
        rotate: `${layer.rotation}deg`,
        cursor: "move",
      }}
    >
      <div className="w-full h-full">
        {layer.type === "text" && (
          <div
            className="w-full h-full flex items-center justify-center pointer-events-none"
            style={{
              color: layer.color || "#000000",
              fontSize: layer.fontSize ?? 40,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {layer.content}
          </div>
        )}

        {layer.type === "image" && layer.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={layer.src}
            alt=""
            className="w-full h-full object-cover pointer-events-none rounded"
          />
        )}
      </div>
    </Rnd>
  );
}

export default memo(CanvasLayerComponent);
