"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Rnd, type DraggableData, type RndDragEvent, type RndResizeCallback } from "react-rnd";
import Image from "next/image";

import type { CanvasLayer } from "@/lib/domain/canvas/types";

type CanvasLayerProps = {
  layer: CanvasLayer;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasLayer>) => void;
};

const MIN_SIZE = 40;
const HANDLE_BASE =
  "absolute bg-blue-500 shadow-[0_0_0_1px_rgba(255,255,255,0.9)]";

function CanvasLayerComponent({
  layer,
  isSelected,
  onSelect,
  onChange,
}: CanvasLayerProps) {
  const frameRef = useRef<number | null>(null);
  const lastPatchRef = useRef<Partial<CanvasLayer> | null>(null);

  const schedulePatch = useCallback(
    (patch: Partial<CanvasLayer>) => {
      lastPatchRef.current = { ...(lastPatchRef.current ?? {}), ...patch };
      if (frameRef.current != null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        if (lastPatchRef.current) onChange(lastPatchRef.current);
        lastPatchRef.current = null;
        frameRef.current = null;
      });
    },
    [onChange]
  );

  useEffect(() => {
    return () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleSelect = useCallback(() => {
    onSelect();
  }, [onSelect]);

  const handleDrag = useCallback(
    (_e: RndDragEvent, data: DraggableData) => {
      schedulePatch({ x: data.x, y: data.y });
    },
    [schedulePatch]
  );

  const handleResize = useCallback<RndResizeCallback>(
    (_e, _direction, ref, _delta, position) => {
      schedulePatch({
        width: Math.max(MIN_SIZE, ref.offsetWidth),
        height: Math.max(MIN_SIZE, ref.offsetHeight),
        x: position.x,
        y: position.y,
      });
    },
    [schedulePatch]
  );

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handleComponents =
    isSelected
      ? {
          topLeft: (
            <div
              className={`${HANDLE_BASE} w-2.5 h-2.5 -top-1 -left-1 rounded-sm cursor-nw-resize resize-handle`}
            />
          ),
          topRight: (
            <div
              className={`${HANDLE_BASE} w-2.5 h-2.5 -top-1 -right-1 rounded-sm cursor-ne-resize resize-handle`}
            />
          ),
          bottomLeft: (
            <div
              className={`${HANDLE_BASE} w-2.5 h-2.5 -bottom-1 -left-1 rounded-sm cursor-sw-resize resize-handle`}
            />
          ),
          bottomRight: (
            <div
              className={`${HANDLE_BASE} w-2.5 h-2.5 -bottom-1 -right-1 rounded-sm cursor-se-resize resize-handle`}
            />
          ),
          top: (
            <div
              className={`${HANDLE_BASE} h-1.5 w-4 -top-1 left-1/2 -translate-x-1/2 rounded-[2px] cursor-n-resize resize-handle`}
            />
          ),
          bottom: (
            <div
              className={`${HANDLE_BASE} h-1.5 w-4 -bottom-1 left-1/2 -translate-x-1/2 rounded-[2px] cursor-s-resize resize-handle`}
            />
          ),
          left: (
            <div
              className={`${HANDLE_BASE} w-1.5 h-4 -left-1 top-1/2 -translate-y-1/2 rounded-[2px] cursor-w-resize resize-handle`}
            />
          ),
          right: (
            <div
              className={`${HANDLE_BASE} w-1.5 h-4 -right-1 top-1/2 -translate-y-1/2 rounded-[2px] cursor-e-resize resize-handle`}
            />
          ),
        }
      : undefined;

  return (
    <Rnd
      size={{
        width: layer.width ?? MIN_SIZE,
        height: layer.height ?? MIN_SIZE,
      }}
      position={{ x: layer.x ?? 0, y: layer.y ?? 0 }}
      onDragStart={handleSelect}
      onDrag={handleDrag}
      onResizeStart={handleSelect}
      onResize={handleResize}
      enableResizing={
        isSelected
          ? {
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              topLeft: true,
              bottomRight: true,
              bottomLeft: true,
            }
          : false
      }
      minWidth={MIN_SIZE}
      minHeight={MIN_SIZE}
      style={{
        position: "absolute",
        zIndex: layer.zIndex ?? 0,
        cursor: "move",
        backgroundColor: "transparent",
      }}
      handleComponent={handleComponents}
      bounds="parent"
      cancel=".resize-handle"
    >
      <div
        className="relative w-full h-full"
        style={{
          transform: `rotate(${layer.rotation ?? 0}deg)`,
          transformOrigin: "center center",
          opacity: layer.opacity ?? 1,
          border: isSelected ? "2px solid #2563eb" : "1px solid transparent",
          boxSizing: "border-box",
          backgroundColor: "transparent",
        }}
        onMouseDown={handleSelect}
        onClick={handleClick}
      >
        {layer.type === "text" ? (
          <div
            className="w-full h-full flex items-center justify-center select-none"
            style={{
              fontSize: layer.fontSize ?? 48,
              color: layer.color ?? "#000000",
              whiteSpace: "pre-wrap",
            }}
          >
            {layer.content}
          </div>
        ) : (
          layer.src && (
            <div className="relative w-full h-full">
              <Image
                src={layer.src}
                alt={"Layer Image"}
                fill
                sizes="100vw"
                className="object-cover pointer-events-none select-none"
                unoptimized
              />
            </div>
          )
        )}
      </div>
    </Rnd>
  );
}

export default React.memo(CanvasLayerComponent);
