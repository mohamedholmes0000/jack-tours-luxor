"use client";

import Image from "next/image";
import Link from "next/link";
import { createElement, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
} from "lucide-react";
import {
  curatedHomepageIcons,
  normalizeHomepageIconName,
  type HomepageEditorValues,
} from "@/lib/homepage-settings";
import { getLucideIcon } from "@/lib/icons";
import { isAllowedAdminImageSrc, safeImageSrc } from "@/lib/images";

type SectionKey =
  | "customizeTrip"
  | "destinations"
  | "experienceTypes"
  | "faqPreview"
  | "featured"
  | "finalCta"
  | "hero"
  | "howItWorks"
  | "ourWorld"
  | "promotionalTours"
  | "stats"
  | "testimonials"
  | "tripFinder"
  | "why";
type ImageField =
  | "finalCtaBackgroundImage"
  | "heroBackgroundImage"
  | "ourWorldImage"
  | "statsBackgroundImage"
  | "whyCollageImage1"
  | "whyCollageImage2"
  | "whyCollageImage3";

const allowedHomepageImageTypes = ["image/jpeg", "image/png", "image/webp"];
const homepageCropAspectRatio = 16 / 10;
const homepageCropMaxWidth = 1800;

function validateHomepageImageFile(file: File) {
  if (!allowedHomepageImageTypes.includes(file.type)) {
    return "Use a JPG, PNG, or WebP image.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "Image must be 5MB or smaller.";
  }

  return null;
}

function loadImageFromFile(file: File) {
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

async function createInteractiveHomepageCrop(
  file: File,
  crop: {
    frameHeight: number;
    frameWidth: number;
    offsetX: number;
    offsetY: number;
    zoom: number;
  },
) {
  const { image, objectUrl } = await loadImageFromFile(file);

  try {
    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;

    if (!sourceWidth || !sourceHeight) {
      throw new Error("Unable to read this image size.");
    }

    const outputWidth = homepageCropMaxWidth;
    const outputHeight = Math.round(outputWidth / homepageCropAspectRatio);
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to prepare the crop canvas.");
    }

    context.fillStyle = "#f8f3e8";
    context.fillRect(0, 0, outputWidth, outputHeight);

    const safeFrameWidth = crop.frameWidth || outputWidth;
    const safeFrameHeight = crop.frameHeight || outputHeight;
    const previewToOutput = outputWidth / safeFrameWidth;
    const outputOffsetX = crop.offsetX * previewToOutput;
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
        "image/jpeg",
        0.9,
      );
    });

    const filename = `${file.name.replace(/\.[^.]+$/, "") || "homepage-image"}-crop.jpg`;
    return new File([blob], filename, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function TextInput({
  disabled,
  label,
  onChange,
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  value?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
      {label}
      <input
        className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-gold)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({
  disabled,
  label,
  onChange,
  rows = 3,
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  rows?: number;
  value?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
      {label}
      <textarea
        className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--color-gold)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        rows={rows}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Toggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--color-gray-100)] bg-white px-4 text-sm font-semibold text-[var(--color-navy)]">
      <input
        checked={checked}
        disabled={disabled}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function IconPreview({ name }: { name: string }) {
  const normalized = normalizeHomepageIconName(name);
  return createElement(getLucideIcon(normalized), {
    "aria-hidden": true,
    className: "h-5 w-5",
  });
}

function IconPicker({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const normalized = normalizeHomepageIconName(value);
  const visibleIcons = useMemo(
    () => curatedHomepageIcons.filter((name) => name.toLowerCase().includes(search.trim().toLowerCase())),
    [search],
  );

  return (
    <div className="relative">
      <button
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-left text-sm font-medium text-[var(--color-navy)] transition hover:border-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex items-center gap-2">
          <IconPreview name={normalized} />
          {normalized}
        </span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute z-40 mt-2 w-[min(22rem,calc(100vw-3rem))] rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 shadow-2xl">
          <input
            className="mb-3 w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
            placeholder="Search icons"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto">
            {visibleIcons.map((name) => (
              <button
                key={name}
                className={`grid gap-1 rounded-xl border p-2 text-center text-[10px] font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:bg-[var(--color-sand)] ${
                  normalized === name ? "border-[var(--color-gold)] bg-[var(--color-sand)]" : "border-[var(--color-gray-100)]"
                }`}
                type="button"
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span className="mx-auto text-[var(--color-gold-dark)]">
                  <IconPreview name={name} />
                </span>
                <span className="truncate">{name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ImageUploadField({
  disabled,
  helperText,
  label,
  onChange,
  showActions = true,
  value,
}: {
  disabled: boolean;
  helperText?: string;
  label: string;
  onChange: (value: string) => void;
  showActions?: boolean;
  value?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cropFrameRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startOffsetX: number;
    startOffsetY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [cropFrameSize, setCropFrameSize] = useState({ height: 400, width: 640 });
  const [cropImageSize, setCropImageSize] = useState<{ height: number; width: number } | null>(null);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedPreviewSrc, setFailedPreviewSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const rawValue = value?.trim() || "";
  const previewSrc = rawValue ? safeImageSrc(rawValue) : "";
  const previewIsUnsupported = Boolean(rawValue && !isAllowedAdminImageSrc(rawValue));
  const previewFailed = Boolean(rawValue && failedPreviewSrc === previewSrc);

  useEffect(() => {
    return () => {
      if (cropPreviewUrl) URL.revokeObjectURL(cropPreviewUrl);
    };
  }, [cropPreviewUrl]);

  function clearCropStep() {
    if (cropPreviewUrl) URL.revokeObjectURL(cropPreviewUrl);
    setCropPreviewUrl(null);
    setPendingCropFile(null);
    setCropImageSize(null);
    setCropOffset({ x: 0, y: 0 });
    setCropZoom(1);
    setCropping(false);
  }

  function measureCropFrame() {
    const rect = cropFrameRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return cropFrameSize;
    const nextSize = { height: rect.height, width: rect.width };
    setCropFrameSize(nextSize);
    return nextSize;
  }

  function clampCropOffset(
    offset: { x: number; y: number },
    zoom = cropZoom,
    frameSize = cropFrameSize,
    imageSize = cropImageSize,
  ) {
    if (!imageSize) return offset;

    const displayScale = Math.max(frameSize.width / imageSize.width, frameSize.height / imageSize.height) * zoom;
    const renderedWidth = imageSize.width * displayScale;
    const renderedHeight = imageSize.height * displayScale;
    const maxX = Math.max(0, (renderedWidth - frameSize.width) / 2);
    const maxY = Math.max(0, (renderedHeight - frameSize.height) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, offset.x)),
      y: Math.min(maxY, Math.max(-maxY, offset.y)),
    };
  }

  function updateCropOffset(offset: { x: number; y: number }, zoom = cropZoom) {
    setCropOffset(clampCropOffset(offset, zoom, measureCropFrame()));
  }

  function openCropStep(file: File) {
    setError(null);
    const validationError = validateHomepageImageFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (cropPreviewUrl) URL.revokeObjectURL(cropPreviewUrl);
    setPendingCropFile(file);
    setCropPreviewUrl(URL.createObjectURL(file));
    setCropImageSize(null);
    setCropOffset({ x: 0, y: 0 });
    setCropZoom(1);
  }

  async function uploadFile(file: File) {
    setError(null);
    const validationError = validateHomepageImageFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    const payload = new FormData();
    payload.append("file", file);

    try {
      const response = await fetch("/api/admin/uploads/homepage", { method: "POST", body: payload });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; url?: string } | null;

      if (!response.ok || !result?.ok || !result.url) {
        setError(result?.message || "Unable to upload image.");
        return;
      }

      if (!isAllowedAdminImageSrc(result.url)) {
        setError("Upload returned an unsupported image source. Use Cloudinary, /api/uploads, /uploads, /photos, /images, or a trusted remote image URL.");
        return;
      }

      setFailedPreviewSrc(null);
      onChange(result.url);
      clearCropStep();
    } finally {
      setUploading(false);
    }
  }

  async function cropAndUpload() {
    if (!pendingCropFile) return;

    setCropping(true);
    setError(null);

    try {
      const frameSize = measureCropFrame();
      const croppedFile = await createInteractiveHomepageCrop(pendingCropFile, {
        frameHeight: frameSize.height,
        frameWidth: frameSize.width,
        offsetX: cropOffset.x,
        offsetY: cropOffset.y,
        zoom: cropZoom,
      });
      await uploadFile(croppedFile);
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : "Unable to crop this image.");
    } finally {
      setCropping(false);
    }
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-[var(--color-navy)]">{label}</p>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (disabled) return;
          const file = event.dataTransfer.files[0];
          if (file) openCropStep(file);
        }}
        onKeyDown={(event) => {
          if (!disabled && (event.key === "Enter" || event.key === " ")) inputRef.current?.click();
        }}
        className={`relative grid min-h-52 place-items-center overflow-hidden rounded-xl border border-dashed border-[rgb(214_173_84_/_45%)] bg-[var(--color-ivory)] text-center transition ${
          disabled ? "cursor-default opacity-80" : "cursor-pointer hover:border-[var(--color-gold)]"
        }`}
      >
        {rawValue && !previewIsUnsupported && !previewFailed ? (
          <Image
            src={previewSrc}
            alt={label}
            fill
            unoptimized
            sizes="480px"
            className="object-cover"
            onError={() => setFailedPreviewSrc(previewSrc)}
            onLoad={() => {
              if (failedPreviewSrc === previewSrc) setFailedPreviewSrc(null);
            }}
          />
        ) : rawValue ? (
          <div className="px-6">
            <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">Image preview unavailable</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-gray-600)]">
              {previewIsUnsupported
                ? "This saved image source is not supported by the public image allowlist."
                : "The saved image could not be loaded. Replace it with a supported image."}
            </p>
            <code className="mt-3 block break-all rounded-lg bg-white/70 px-3 py-2 text-left text-xs text-[var(--color-gray-600)]">
              Saved path: {rawValue}
            </code>
          </div>
        ) : (
          <div className="px-6">
            <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">Upload image</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-gray-600)]">Drag and drop, or click to choose an image.</p>
          </div>
        )}
        {uploading ? (
          <div className="absolute inset-0 grid place-items-center bg-[var(--color-navy)]/70 text-sm font-bold uppercase tracking-[0.12em] text-white">
            Uploading...
          </div>
        ) : null}
      </div>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) openCropStep(file);
          event.target.value = "";
        }}
      />
      {helperText ? <p className="text-xs leading-5 text-[var(--color-gray-600)]">{helperText}</p> : null}
      {showActions ? (
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" disabled={disabled} type="button" onClick={() => inputRef.current?.click()}>
            Replace
          </button>
          <button className="btn-secondary" disabled={disabled || !value} type="button" onClick={() => onChange("")}>
            Remove
          </button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {pendingCropFile && cropPreviewUrl ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-navy)]/70 px-4 py-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">Crop image</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-gray-600)]">
                  Drag the image to choose the visible area, then adjust zoom. The crop frame is 16:10.
                </p>
              </div>
              <button className="btn-secondary" disabled={uploading || cropping} type="button" onClick={clearCropStep}>
                Cancel
              </button>
            </div>
            <div
              ref={cropFrameRef}
              className="relative mt-5 aspect-[16/10] touch-none overflow-hidden rounded-2xl border border-[rgb(214_173_84_/_35%)] bg-[var(--color-ivory)]"
              onPointerDown={(event) => {
                if (uploading || cropping) return;
                measureCropFrame();
                dragStateRef.current = {
                  pointerId: event.pointerId,
                  startOffsetX: cropOffset.x,
                  startOffsetY: cropOffset.y,
                  startX: event.clientX,
                  startY: event.clientY,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const dragState = dragStateRef.current;
                if (!dragState || dragState.pointerId !== event.pointerId) return;
                updateCropOffset({
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
              {/* eslint-disable-next-line @next/next/no-img-element -- Crop preview uses a temporary blob: URL before upload. */}
              <img
                src={cropPreviewUrl}
                alt="Crop preview"
                draggable={false}
                className="absolute left-1/2 top-1/2 max-w-none select-none"
                style={
                  cropImageSize
                    ? {
                        height:
                          cropImageSize.height *
                          Math.max(cropFrameSize.width / cropImageSize.width, cropFrameSize.height / cropImageSize.height) *
                          cropZoom,
                        transform: `translate(-50%, -50%) translate(${cropOffset.x}px, ${cropOffset.y}px)`,
                        width:
                          cropImageSize.width *
                          Math.max(cropFrameSize.width / cropImageSize.width, cropFrameSize.height / cropImageSize.height) *
                          cropZoom,
                      }
                    : { height: "100%", objectFit: "cover", width: "100%" }
                }
                onLoad={(event) => {
                  const image = event.currentTarget;
                  const frameSize = measureCropFrame();
                  const imageSize = { height: image.naturalHeight, width: image.naturalWidth };
                  setCropImageSize(imageSize);
                  setCropOffset(clampCropOffset({ x: 0, y: 0 }, cropZoom, frameSize, imageSize));
                }}
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-white/80" />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_54%,rgba(6,17,31,0.16))]" />
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold text-[var(--color-navy)]">
              Zoom
              <input
                className="accent-[var(--color-gold)]"
                disabled={uploading || cropping}
                max="2.5"
                min="1"
                step="0.01"
                type="range"
                value={cropZoom}
                onChange={(event) => {
                  const nextZoom = Number(event.target.value);
                  setCropZoom(nextZoom);
                  updateCropOffset(cropOffset, nextZoom);
                }}
              />
            </label>
            <p className="mt-3 break-all text-xs leading-5 text-[var(--color-gray-600)]">Selected file: {pendingCropFile.name}</p>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button className="btn-secondary" disabled={uploading || cropping} type="button" onClick={() => inputRef.current?.click()}>
                Choose Different
              </button>
              <button className="btn-primary" disabled={uploading || cropping} type="button" onClick={() => void cropAndUpload()}>
                {uploading || cropping ? "Processing..." : "Crop & Upload"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionCard({
  children,
  description,
  legacy = false,
  open,
  status,
  title,
  onToggle,
}: {
  children: React.ReactNode;
  description: string;
  legacy?: boolean;
  open: boolean;
  status?: "Editable" | "Partially editable" | "Hardcoded" | "Legacy / inactive";
  title: string;
  onToggle: () => void;
}) {
  const statusClassName =
    status === "Hardcoded"
      ? "border-slate-200 bg-slate-50 text-slate-700"
      : status === "Legacy / inactive"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : status === "Editable"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-blue-200 bg-blue-50 text-blue-800";

  return (
    <section className={`overflow-visible rounded-2xl border shadow-sm ${legacy ? "order-last border-amber-200 bg-amber-50/35" : "border-[var(--color-gray-100)] bg-white"}`}>
      <button
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        type="button"
        onClick={onToggle}
      >
        <span>
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-serif text-2xl font-semibold text-[var(--color-navy)]">{title}</span>
            {status ? (
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusClassName}`}>
                {status}
              </span>
            ) : null}
          </span>
          <span className="mt-1 block text-sm text-[var(--color-gray-600)]">{description}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--color-gold-dark)] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="border-t border-[var(--color-gray-100)] p-5">{children}</div> : null}
    </section>
  );
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[rgb(214_173_84_/_28%)] bg-[var(--color-sand)]/45 p-4 text-sm leading-6 text-[var(--color-navy)]/75">
      {children}
    </div>
  );
}

const sectionLabels: Record<SectionKey, string> = {
  customizeTrip: "Customize Trip",
  destinations: "Top Destinations",
  experienceTypes: "Experience Type Cards",
  faqPreview: "FAQ Preview",
  featured: "Old Featured Journeys Header",
  finalCta: "Final CTA",
  hero: "Hero Slider",
  howItWorks: "How It Works",
  ourWorld: "Our World",
  promotionalTours: "Promotional Tours",
  stats: "Stats",
  testimonials: "Reviews Preview",
  tripFinder: "Trip Finder",
  why: "Why Jack",
};

export function HomepageEditor({ canEdit, initialValues }: { canEdit: boolean; initialValues: HomepageEditorValues }) {
  const [values, setValues] = useState(initialValues);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    customizeTrip: false,
    destinations: false,
    experienceTypes: false,
    faqPreview: false,
    featured: false,
    finalCta: false,
    hero: true,
    howItWorks: false,
    ourWorld: false,
    promotionalTours: false,
    stats: false,
    testimonials: false,
    tripFinder: false,
    why: false,
  });
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setField<Key extends keyof HomepageEditorValues>(field: Key, value: HomepageEditorValues[Key]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function save(section: SectionKey) {
    setSavingSection(section);
    setToast(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setError(result?.message || "Unable to save homepage settings.");
        return;
      }

      setToast(`${sectionLabels[section]} section saved.`);
    } finally {
      setSavingSection(null);
    }
  }

  function saveButton(section: SectionKey) {
    if (!canEdit) return null;
    return (
      <div className="mt-6 flex justify-end">
        <button className="btn-primary" disabled={savingSection === section} type="button" onClick={() => void save(section)}>
          {savingSection === section ? "Saving..." : "Save Section"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {toast ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{toast}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <SectionCard
        description="Live hero content with destination-assisted slides and a global WhatsApp action."
        open={openSections.hero}
        status="Partially editable"
        title="Hero Slider"
        onToggle={() => setOpenSections((current) => ({ ...current, hero: !current.hero }))}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
          <ImageUploadField
            disabled={!canEdit}
            label="Background image"
            value={values.heroBackgroundImage}
            onChange={(value) => setField("heroBackgroundImage", value)}
          />
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput disabled={!canEdit} label="Eyebrow text" value={values.heroEyebrow} onChange={(value) => setField("heroEyebrow", value)} />
              <TextInput disabled={!canEdit} label="Headline" value={values.heroHeadline} onChange={(value) => setField("heroHeadline", value)} />
              <TextInput disabled={!canEdit} label="Italic accent words" value={values.heroHeadlineAccent} onChange={(value) => setField("heroHeadlineAccent", value)} />
              <TextInput disabled={!canEdit} label="Primary CTA label" value={values.heroPrimaryCtaLabel} onChange={(value) => setField("heroPrimaryCtaLabel", value)} />
              <TextInput disabled={!canEdit} label="Primary CTA link" value={values.heroPrimaryCtaHref} onChange={(value) => setField("heroPrimaryCtaHref", value)} />
            </div>
            <TextArea disabled={!canEdit} label="Subheadline paragraph" value={values.heroSubheadline} onChange={(value) => setField("heroSubheadline", value)} />
            <InfoBanner>
              The secondary CTA label and the first three trust badges are used by the live hero. Its WhatsApp URL is generated from Global Settings, so the stored secondary URL is preserved but not used directly.
            </InfoBanner>
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput disabled={!canEdit} label="Secondary WhatsApp label" value={values.heroSecondaryLinkLabel} onChange={(value) => setField("heroSecondaryLinkLabel", value)} />
              <TextInput disabled label="Stored secondary URL (not used directly)" value={values.heroSecondaryLinkHref} onChange={(value) => setField("heroSecondaryLinkHref", value)} />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <TextInput
                  key={index}
                  disabled={!canEdit}
                  label={`Trust badge ${index + 1}`}
                  value={values.heroTrustBadges[index]}
                  onChange={(value) => {
                    const next = [...values.heroTrustBadges];
                    next[index] = value;
                    setField("heroTrustBadges", next);
                  }}
                />
              ))}
            </div>
            <Toggle checked={values.heroVisible} disabled={!canEdit} label="Section visible" onChange={(value) => setField("heroVisible", value)} />
          </div>
        </div>
        {saveButton("hero")}
      </SectionCard>

      <SectionCard
        description="Live lead-generation search; its structure and ranges remain intentionally code-managed."
        open={openSections.tripFinder}
        status="Hardcoded"
        title="Trip Finder"
        onToggle={() => setOpenSections((current) => ({ ...current, tripFinder: !current.tripFinder }))}
      >
        <InfoBanner>
          The Trip Finder is live and uses published destination data where available. Tabs, duration ranges, price ranges, and field behavior are structural controls and are not editable in this phase because no safe existing homepage storage supports them.
        </InfoBanner>
      </SectionCard>

      <SectionCard
        description="Live One Day and Multi Day discovery cards with fixed filter routes."
        open={openSections.experienceTypes}
        status="Hardcoded"
        title="Experience Type Cards"
        onToggle={() => setOpenSections((current) => ({ ...current, experienceTypes: !current.experienceTypes }))}
      >
        <InfoBanner>
          Titles, descriptions, CTA labels, and composition are currently code-managed. Card images are selected from real tour data when suitable tours exist. Routes remain fixed to <strong>/tours?journey=one-day</strong> and <strong>/tours?journey=multi-day</strong>. Making this copy editable requires future storage work.
        </InfoBanner>
      </SectionCard>

      <SectionCard
        description="Live section heading with destination cards managed separately."
        open={openSections.destinations}
        status="Partially editable"
        title="Top Destinations"
        onToggle={() => setOpenSections((current) => ({ ...current, destinations: !current.destinations }))}
      >
        <div className="grid gap-5">
          <InfoBanner>
            This heading, visibility, and view-all link are live on the homepage. The visibility switch controls Top Destinations only; Trip Finder and Experience Type Cards remain available. Destination card data is managed separately, with safe public fallbacks. Manage cards at{" "}
            <Link className="font-bold text-[var(--color-gold-dark)]" href="/admin/destinations">
              Manage destinations →
            </Link>
          </InfoBanner>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput disabled={!canEdit} label="Eyebrow text" value={values.destinationsEyebrow} onChange={(value) => setField("destinationsEyebrow", value)} />
            <TextInput disabled={!canEdit} label="Heading text" value={values.destinationsHeading} onChange={(value) => setField("destinationsHeading", value)} />
            <TextInput disabled={!canEdit} label="Italic accent words" value={values.destinationsHeadingAccent} onChange={(value) => setField("destinationsHeadingAccent", value)} />
            <TextInput disabled={!canEdit} label="View all link text" value={values.destinationsViewAllLabel} onChange={(value) => setField("destinationsViewAllLabel", value)} />
            <TextInput disabled={!canEdit} label="View all link URL" value={values.destinationsViewAllHref} onChange={(value) => setField("destinationsViewAllHref", value)} />
          </div>
          <Toggle checked={values.destinationsVisible} disabled={!canEdit} label="Section visible" onChange={(value) => setField("destinationsVisible", value)} />
        </div>
        {saveButton("destinations")}
      </SectionCard>

      <SectionCard
        description="Live ‘Plan now and travel deeper’ carousel powered by published Tour records."
        open={openSections.promotionalTours}
        status="Partially editable"
        title="Promotional Tours"
        onToggle={() => setOpenSections((current) => ({ ...current, promotionalTours: !current.promotionalTours }))}
      >
        <InfoBanner>
          Homepage cards use published Tours marked <strong>Featured</strong>. If no published featured tours exist, the carousel falls back to other published Tours so the section does not become empty. The current heading and description remain code-managed because the old Featured Journeys fields are intentionally not reused. Manage card content at{" "}
          <Link className="font-bold text-[var(--color-gold-dark)]" href="/admin/tours">
            Manage tours →
          </Link>
        </InfoBanner>
      </SectionCard>

      <div className="order-last mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">Legacy / inactive fields</p>
        <p className="mt-2 text-sm leading-6 text-amber-900/75">
          These saved values are kept for compatibility, but they do not control the current homepage design.
        </p>
      </div>

      <SectionCard
        description="Preserved settings for the removed Featured Journeys section."
        legacy
        open={openSections.featured}
        status="Legacy / inactive"
        title="Old Featured Journeys Header"
        onToggle={() => setOpenSections((current) => ({ ...current, featured: !current.featured }))}
      >
        <div className="grid gap-5">
          <InfoBanner>
            These fields do not control the current “Plan now and travel deeper” promotional carousel. Tour content remains managed at{" "}
            <Link className="font-bold text-[var(--color-gold-dark)]" href="/admin/tours">
              Manage tours →
            </Link>
          </InfoBanner>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput disabled label="Eyebrow text" value={values.featuredEyebrow} onChange={(value) => setField("featuredEyebrow", value)} />
            <TextInput disabled label="Heading text" value={values.featuredHeading} onChange={(value) => setField("featuredHeading", value)} />
            <TextInput disabled label="Italic accent words" value={values.featuredHeadingAccent} onChange={(value) => setField("featuredHeadingAccent", value)} />
            <TextInput disabled label="View all tours link text" value={values.featuredViewAllLabel} onChange={(value) => setField("featuredViewAllLabel", value)} />
            <TextInput disabled label="View all tours link URL" value={values.featuredViewAllHref} onChange={(value) => setField("featuredViewAllHref", value)} />
          </div>
          <TextArea disabled label="Description paragraph" value={values.featuredDescription} onChange={(value) => setField("featuredDescription", value)} />
          <Toggle checked={values.featuredVisible} disabled label="Stored visibility" onChange={(value) => setField("featuredVisible", value)} />
        </div>
      </SectionCard>

      <SectionCard
        description="Text status and image used by the public Customize Your Egypt Trip section."
        open={openSections.customizeTrip}
        status="Partially editable"
        title="Customize Trip"
        onToggle={() => setOpenSections((current) => ({ ...current, customizeTrip: !current.customizeTrip }))}
      >
        <div className="grid gap-5">
          <InfoBanner>
            This controls the public Customize Your Egypt Trip section. Text is saved in safe homepage SiteSetting keys, and the current public layout uses one featured image for a cleaner mobile layout.
          </InfoBanner>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput disabled={!canEdit} label="Eyebrow text" value={values.customizeTripEyebrow} onChange={(value) => setField("customizeTripEyebrow", value)} />
            <TextInput disabled={!canEdit} label="Heading text" value={values.customizeTripHeading} onChange={(value) => setField("customizeTripHeading", value)} />
            <TextInput disabled={!canEdit} label="CTA button label" value={values.customizeTripCtaLabel} onChange={(value) => setField("customizeTripCtaLabel", value)} />
            <TextInput disabled={!canEdit} label="CTA button link" value={values.customizeTripCtaHref} onChange={(value) => setField("customizeTripCtaHref", value)} />
          </div>
          <TextArea
            disabled={!canEdit}
            label="Description paragraph"
            value={values.customizeTripDescription}
            onChange={(value) => setField("customizeTripDescription", value)}
          />
          <div className="grid gap-5 md:grid-cols-3">
            <ImageUploadField
              disabled={!canEdit}
              helperText="Shown on the current public homepage. Recommended: landscape image, 16:10 or 4:3. You can crop before saving. The public card crops with object-fit: cover."
              label="Featured image"
              value={values.whyCollageImage1}
              onChange={(value) => setField("whyCollageImage1", value)}
            />
            {(["whyCollageImage2", "whyCollageImage3"] as ImageField[]).map((field, index) => (
              <ImageUploadField
                key={field}
                disabled
                helperText="Preserved for future use. Not shown on the current public homepage."
                label={`Extra collage image ${index + 2} (not active)`}
                showActions={false}
                value={values[field]}
                onChange={(value) => setField(field, value)}
              />
            ))}
          </div>
        </div>
        {saveButton("customizeTrip")}
      </SectionCard>

      <SectionCard
        description="Live four-step planning process; content storage is not available yet."
        open={openSections.howItWorks}
        status="Hardcoded"
        title="How It Works"
        onToggle={() => setOpenSections((current) => ({ ...current, howItWorks: !current.howItWorks }))}
      >
        <InfoBanner>
          Visibility, eyebrow, heading, introduction, and four step titles/descriptions are currently defined in the public component. Icons and layout will remain code-managed. Making only the copy editable requires a future storage decision and was intentionally not added to Prisma in this phase.
        </InfoBanner>
      </SectionCard>

      <SectionCard
        description="Live Why Jack copy and CTA with trust points currently defined in code."
        open={openSections.why}
        status="Partially editable"
        title="Why Jack"
        onToggle={() => setOpenSections((current) => ({ ...current, why: !current.why }))}
      >
        <div className="grid gap-6">
          <InfoBanner>
            The headline, description, CTA, and visibility are live. The redesigned four trust points and their icons are currently defined in the public component; the stored Why Services below are legacy values and do not control them.
          </InfoBanner>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput disabled={!canEdit} label="Eyebrow text" value={values.whyEyebrow} onChange={(value) => setField("whyEyebrow", value)} />
            <TextInput disabled={!canEdit} label="Heading text" value={values.whyHeading} onChange={(value) => setField("whyHeading", value)} />
            <TextInput disabled={!canEdit} label="Italic accent words" value={values.whyHeadingAccent} onChange={(value) => setField("whyHeadingAccent", value)} />
            <TextInput disabled={!canEdit} label="CTA button label" value={values.whyCtaLabel} onChange={(value) => setField("whyCtaLabel", value)} />
            <TextInput disabled={!canEdit} label="CTA button link" value={values.whyCtaHref} onChange={(value) => setField("whyCtaHref", value)} />
            <TextInput disabled label="Stored services heading (not active)" value={values.whyIncludedHeading} onChange={(value) => setField("whyIncludedHeading", value)} />
          </div>
          <TextArea disabled={!canEdit} label="Description paragraph" value={values.whyDescription} onChange={(value) => setField("whyDescription", value)} />
          <details className="rounded-xl border border-amber-200 bg-amber-50/45 p-4">
            <summary className="cursor-pointer text-sm font-bold text-amber-900">Stored Why Services — legacy / inactive</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {values.whyServices.map((service, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] p-4">
                  <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
                    Icon
                    <IconPicker
                      disabled
                      value={service.icon}
                      onChange={(icon) => {
                        const next = [...values.whyServices];
                        next[index] = { ...next[index], icon };
                        setField("whyServices", next);
                      }}
                    />
                  </label>
                  <TextInput
                    disabled
                    label="Label text"
                    value={service.label}
                    onChange={(label) => {
                      const next = [...values.whyServices];
                      next[index] = { ...next[index], label };
                      setField("whyServices", next);
                    }}
                  />
                </div>
              ))}
            </div>
          </details>
          <Toggle checked={values.whyVisible} disabled={!canEdit} label="Section visible" onChange={(value) => setField("whyVisible", value)} />
        </div>
        {saveButton("why")}
      </SectionCard>

      <SectionCard
        description="Not active on the current public homepage layout."
        legacy
        open={openSections.ourWorld}
        status="Legacy / inactive"
        title="Our World"
        onToggle={() => setOpenSections((current) => ({ ...current, ourWorld: !current.ourWorld }))}
      >
        <InfoBanner>
          Not active on the public site yet. The current homepage uses the separate Customize Your Trip block in this position, so these fields are read-only until the Our World section is re-enabled.
        </InfoBanner>
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
          <ImageUploadField
            disabled
            label="Image"
            value={values.ourWorldImage}
            onChange={(value) => setField("ourWorldImage", value)}
          />
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput disabled label="Eyebrow text" value={values.ourWorldEyebrow} onChange={(value) => setField("ourWorldEyebrow", value)} />
              <TextInput disabled label="Heading text" value={values.ourWorldHeading} onChange={(value) => setField("ourWorldHeading", value)} />
              <TextInput disabled label="Italic accent words" value={values.ourWorldHeadingAccent} onChange={(value) => setField("ourWorldHeadingAccent", value)} />
              <TextInput disabled label="Signature text" value={values.ourWorldReadMoreLabel} onChange={(value) => setField("ourWorldReadMoreLabel", value)} />
              <TextInput disabled label="Signature location" value={values.ourWorldReadMoreHref} onChange={(value) => setField("ourWorldReadMoreHref", value)} />
            </div>
            <TextArea disabled label="Body paragraph" rows={5} value={values.ourWorldBody} onChange={(value) => setField("ourWorldBody", value)} />
            <Toggle checked={values.ourWorldVisible} disabled label="Section visible" onChange={(value) => setField("ourWorldVisible", value)} />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        description="Not active on the current public homepage layout."
        legacy
        open={openSections.stats}
        status="Legacy / inactive"
        title="Stats"
        onToggle={() => setOpenSections((current) => ({ ...current, stats: !current.stats }))}
      >
        <InfoBanner>
          Not active on the public site yet. Stats are preserved in the CMS for a future section, but the current homepage layout does not render them.
        </InfoBanner>
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
          <ImageUploadField
            disabled
            label="Background image"
            value={values.statsBackgroundImage}
            onChange={(value) => setField("statsBackgroundImage", value)}
          />
          <div className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              {values.statsItems.map((stat, index) => (
                <div key={index} className="grid gap-4 rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] p-4">
                  <TextInput
                    disabled
                    label={`Stat ${index + 1} value`}
                    value={stat.value}
                    onChange={(value) => {
                      const next = [...values.statsItems];
                      next[index] = { ...next[index], value };
                      setField("statsItems", next);
                    }}
                  />
                  <TextInput
                    disabled
                    label={`Stat ${index + 1} label`}
                    value={stat.label}
                    onChange={(label) => {
                      const next = [...values.statsItems];
                      next[index] = { ...next[index], label };
                      setField("statsItems", next);
                    }}
                  />
                </div>
              ))}
            </div>
            <Toggle checked={values.statsVisible} disabled label="Section visible" onChange={(value) => setField("statsVisible", value)} />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        description="Live review-section heading; individual reviews need a future manager."
        open={openSections.testimonials}
        status="Partially editable"
        title="Reviews Preview"
        onToggle={() => setOpenSections((current) => ({ ...current, testimonials: !current.testimonials }))}
      >
        <div className="grid gap-5">
          <InfoBanner>
            The section header and visibility are live. Individual testimonial records are not managed from this page. A dedicated Reviews manager is coming in Phase 4.
          </InfoBanner>
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput disabled={!canEdit} label="Eyebrow text" value={values.testimonialsEyebrow} onChange={(value) => setField("testimonialsEyebrow", value)} />
            <TextInput disabled={!canEdit} label="Heading text" value={values.testimonialsHeading} onChange={(value) => setField("testimonialsHeading", value)} />
            <TextInput disabled={!canEdit} label="Italic accent words" value={values.testimonialsHeadingAccent} onChange={(value) => setField("testimonialsHeadingAccent", value)} />
          </div>
          <Toggle checked={values.testimonialsVisible} disabled={!canEdit} label="Section visible" onChange={(value) => setField("testimonialsVisible", value)} />
        </div>
        {saveButton("testimonials")}
      </SectionCard>

      <SectionCard
        description="Live FAQ preview; questions and answers remain in the dedicated FAQ manager."
        open={openSections.faqPreview}
        status="Hardcoded"
        title="FAQ Preview"
        onToggle={() => setOpenSections((current) => ({ ...current, faqPreview: !current.faqPreview }))}
      >
        <InfoBanner>
          The homepage currently shows up to six published FAQ items with code-managed eyebrow, heading, description, and View All label. No existing homepage storage supports those presentation fields. Manage questions and answers at{" "}
          <Link className="font-bold text-[var(--color-gold-dark)]" href="/admin/faqs">
            Manage FAQ →
          </Link>
        </InfoBanner>
      </SectionCard>

      <SectionCard
        description="Live final booking CTA copy and primary button."
        open={openSections.finalCta}
        status="Partially editable"
        title="Final CTA"
        onToggle={() => setOpenSections((current) => ({ ...current, finalCta: !current.finalCta }))}
      >
        <InfoBanner>
          Eyebrow, heading, description, visibility, and primary button are live. Background image and secondary link are not used by the current compact CTA layout.
        </InfoBanner>
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
          <ImageUploadField
            disabled
            label="Background image (not active)"
            value={values.finalCtaBackgroundImage}
            onChange={(value) => setField("finalCtaBackgroundImage", value)}
          />
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput disabled={!canEdit} label="Eyebrow text" value={values.finalCtaEyebrow} onChange={(value) => setField("finalCtaEyebrow", value)} />
              <TextInput disabled={!canEdit} label="Heading text" value={values.finalCtaHeading} onChange={(value) => setField("finalCtaHeading", value)} />
              <TextInput disabled={!canEdit} label="Italic accent words" value={values.finalCtaHeadingAccent} onChange={(value) => setField("finalCtaHeadingAccent", value)} />
              <TextInput disabled={!canEdit} label="Primary button label" value={values.finalCtaPrimaryButtonLabel} onChange={(value) => setField("finalCtaPrimaryButtonLabel", value)} />
              <TextInput disabled={!canEdit} label="Primary button link" value={values.finalCtaPrimaryButtonHref} onChange={(value) => setField("finalCtaPrimaryButtonHref", value)} />
              <TextInput disabled label="Secondary link label (not active)" value={values.finalCtaSecondaryLinkLabel} onChange={(value) => setField("finalCtaSecondaryLinkLabel", value)} />
              <TextInput disabled label="Secondary link URL (not active)" value={values.finalCtaSecondaryLinkHref} onChange={(value) => setField("finalCtaSecondaryLinkHref", value)} />
            </div>
            <TextArea disabled={!canEdit} label="Description paragraph" value={values.finalCtaDescription} onChange={(value) => setField("finalCtaDescription", value)} />
            <Toggle checked={values.finalCtaVisible} disabled={!canEdit} label="Section visible" onChange={(value) => setField("finalCtaVisible", value)} />
          </div>
        </div>
        {saveButton("finalCta")}
      </SectionCard>
    </div>
  );
}
