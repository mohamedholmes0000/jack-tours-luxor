"use client";

import { useEffect, useRef, useState } from "react";

type CropFrame = {
  frameHeight: number;
  frameWidth: number;
  offsetX: number;
  offsetY: number;
  zoom: number;
};

type CropPoint = { x: number; y: number };
type CropSize = { height: number; width: number };

async function loadImageFromFile(file: File) {
  return new Promise<{ image: HTMLImageElement; objectUrl: string }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => resolve({ image, objectUrl });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read this image for cropping."));
    };
    image.src = objectUrl;
  });
}

async function createCroppedImage(
  backgroundColor: string | null | undefined,
  file: File,
  crop: CropFrame,
  aspectRatio: number,
  maxOutputWidth: number,
  fileNamePrefix: string,
  outputType: "image/jpeg" | "image/png" | "image/webp",
) {
  const { image, objectUrl } = await loadImageFromFile(file);

  try {
    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;

    if (!sourceWidth || !sourceHeight) {
      throw new Error("Unable to read this image size.");
    }

    const outputWidth = maxOutputWidth;
    const outputHeight = Math.round(outputWidth / aspectRatio);
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to prepare the crop canvas.");
    }

    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, outputWidth, outputHeight);
    }

    const safeFrameWidth = crop.frameWidth || outputWidth;
    const safeFrameHeight = crop.frameHeight || outputHeight;
    const outputOffsetX = crop.offsetX * (outputWidth / safeFrameWidth);
    const outputOffsetY = crop.offsetY * (outputHeight / safeFrameHeight);
    const coverScale = Math.max(outputWidth / sourceWidth, outputHeight / sourceHeight) * crop.zoom;
    const renderedWidth = sourceWidth * coverScale;
    const renderedHeight = sourceHeight * coverScale;
    const imageX = (outputWidth - renderedWidth) / 2 + outputOffsetX;
    const imageY = (outputHeight - renderedHeight) / 2 + outputOffsetY;

    context.drawImage(image, imageX, imageY, renderedWidth, renderedHeight);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error("Unable to create the cropped image."));
        },
        outputType,
        outputType === "image/png" ? undefined : 0.9,
      );
    });

    const extension = outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg";
    return new File([blob], `${fileNamePrefix}-crop.${extension}`, { type: outputType });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function InteractiveImageCropper({
  aspectRatio,
  aspectRatioLabel,
  backgroundColor = "#f8f3e8",
  file,
  fileNamePrefix = "image",
  maxOutputWidth = 1800,
  onCancel,
  onChooseDifferent,
  onCrop,
  outputType = "image/jpeg",
  processing = false,
}: {
  aspectRatio: number;
  aspectRatioLabel?: string;
  backgroundColor?: string | null;
  file: File;
  fileNamePrefix?: string;
  maxOutputWidth?: number;
  onCancel: () => void;
  onChooseDifferent: () => void;
  onCrop: (file: File) => Promise<void>;
  outputType?: "image/jpeg" | "image/png" | "image/webp";
  processing?: boolean;
}) {
  const cropFrameRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startOffsetX: number;
    startOffsetY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [previewUrl] = useState(() => URL.createObjectURL(file));
  const [frameSize, setFrameSize] = useState<CropSize>({ height: 400, width: 640 });
  const [imageSize, setImageSize] = useState<CropSize | null>(null);
  const [offset, setOffset] = useState<CropPoint>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function measureFrame() {
    const rect = cropFrameRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return frameSize;
    const nextSize = { height: rect.height, width: rect.width };
    setFrameSize(nextSize);
    return nextSize;
  }

  function clampOffset(nextOffset: CropPoint, nextZoom = zoom, nextFrameSize = frameSize, nextImageSize = imageSize) {
    if (!nextImageSize) return nextOffset;

    const displayScale = Math.max(nextFrameSize.width / nextImageSize.width, nextFrameSize.height / nextImageSize.height) * nextZoom;
    const renderedWidth = nextImageSize.width * displayScale;
    const renderedHeight = nextImageSize.height * displayScale;
    const maxX = Math.max(0, (renderedWidth - nextFrameSize.width) / 2);
    const maxY = Math.max(0, (renderedHeight - nextFrameSize.height) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextOffset.x)),
      y: Math.min(maxY, Math.max(-maxY, nextOffset.y)),
    };
  }

  function updateOffset(nextOffset: CropPoint, nextZoom = zoom) {
    setOffset(clampOffset(nextOffset, nextZoom, measureFrame()));
  }

  async function crop() {
    setCropping(true);
    setError(null);

    try {
      const nextFrameSize = measureFrame();
      const croppedFile = await createCroppedImage(
        backgroundColor,
        file,
        {
          frameHeight: nextFrameSize.height,
          frameWidth: nextFrameSize.width,
          offsetX: offset.x,
          offsetY: offset.y,
          zoom,
        },
        aspectRatio,
        maxOutputWidth,
        fileNamePrefix,
        outputType,
      );
      await onCrop(croppedFile);
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : "Unable to crop this image.");
    } finally {
      setCropping(false);
    }
  }

  const busy = processing || cropping;
  const ratioLabel = aspectRatioLabel || `${aspectRatio.toFixed(aspectRatio % 1 === 0 ? 0 : 2)}:1`;
  const displayScale = imageSize
    ? Math.max(frameSize.width / imageSize.width, frameSize.height / imageSize.height) * zoom
    : 1;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-navy)]/70 px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">Crop image</p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">
              Drag the image to choose the visible area, then adjust zoom. The crop frame is {ratioLabel}.
            </p>
          </div>
          <button className="btn-secondary" disabled={busy} type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
        <div
          ref={cropFrameRef}
          className="relative mt-5 touch-none overflow-hidden rounded-2xl border border-[rgb(214_173_84_/_35%)] bg-[var(--color-ivory)]"
          style={{ aspectRatio }}
          onPointerDown={(event) => {
            if (busy) return;
            measureFrame();
            dragStateRef.current = {
              pointerId: event.pointerId,
              startOffsetX: offset.x,
              startOffsetY: offset.y,
              startX: event.clientX,
              startY: event.clientY,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const dragState = dragStateRef.current;
            if (!dragState || dragState.pointerId !== event.pointerId) return;
            updateOffset({
              x: dragState.startOffsetX + event.clientX - dragState.startX,
              y: dragState.startOffsetY + event.clientY - dragState.startY,
            });
          }}
          onPointerUp={(event) => {
            if (dragStateRef.current?.pointerId === event.pointerId) {
              dragStateRef.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={() => {
            dragStateRef.current = null;
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Crop preview uses a temporary blob URL before upload. */}
          <img
            src={previewUrl}
            alt="Crop preview"
            draggable={false}
            className="absolute left-1/2 top-1/2 max-w-none select-none"
            style={
              imageSize
                ? {
                    height: imageSize.height * displayScale,
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
                    width: imageSize.width * displayScale,
                  }
                : { height: "100%", objectFit: "cover", width: "100%" }
            }
            onLoad={(event) => {
              const image = event.currentTarget;
              const nextFrameSize = measureFrame();
              const nextImageSize = { height: image.naturalHeight, width: image.naturalWidth };
              setImageSize(nextImageSize);
              setOffset(clampOffset({ x: 0, y: 0 }, zoom, nextFrameSize, nextImageSize));
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-white/80" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_54%,rgba(6,17,31,0.16))]" />
        </div>
        <label className="mt-4 grid gap-2 text-sm font-semibold text-[var(--color-navy)]">
          Zoom
          <input
            className="accent-[var(--color-gold)]"
            disabled={busy}
            max="2.5"
            min="1"
            step="0.01"
            type="range"
            value={zoom}
            onChange={(event) => {
              const nextZoom = Number(event.target.value);
              setZoom(nextZoom);
              updateOffset(offset, nextZoom);
            }}
          />
        </label>
        <p className="mt-3 break-all text-xs leading-5 text-[var(--color-gray-600)]">Selected file: {file.name}</p>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button className="btn-secondary" disabled={busy} type="button" onClick={onChooseDifferent}>
            Choose Different
          </button>
          <button className="btn-primary" disabled={busy} type="button" onClick={() => void crop()}>
            {busy ? "Processing..." : "Crop & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
