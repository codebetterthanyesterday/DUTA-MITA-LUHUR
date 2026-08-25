"use client";

import Image from "next/image";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { UploadCloud, X, Star } from "lucide-react";

export type ImageState = {
  existing: { id: string; url: string; isPrimary: boolean }[];
  newFiles: { id: string; file: File; previewUrl: string; isPrimary: boolean }[];
};

type Slot =
  | { kind: "existing"; id: string; src: string; isPrimary: boolean }
  | { kind: "new"; id: string; src: string; isPrimary: boolean };

interface ImageManagerProps {
  state: ImageState;
  onChange: (newState: ImageState) => void;
  error?: string;
  disabled?: boolean;
  hidePrimary?: boolean;
}

/**
 * Product image picker: one large preview of the selected slot (primary by
 * default) with a thumbnail filmstrip underneath — the layout a shopper-facing
 * catalog editor expects, rather than an undifferentiated grid of squares.
 */
export function ImageManager({
  state,
  onChange,
  error,
  disabled = false,
  hidePrimary = false,
}: ImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const urls = state.newFiles.map((f) => f.previewUrl);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [state.newFiles]);

  const slots: Slot[] = useMemo(
    () => [
      ...state.existing.map((img) => ({ kind: "existing" as const, id: img.id, src: img.url, isPrimary: img.isPrimary })),
      ...state.newFiles.map((img) => ({ kind: "new" as const, id: img.id, src: img.previewUrl, isPrimary: img.isPrimary })),
    ],
    [state]
  );

  const active = slots.find((s) => s.id === activeId) ?? slots.find((s) => s.isPrimary) ?? slots[0] ?? null;

  const addFiles = (files: File[]) => {
    if (disabled || files.length === 0) return;
    const hasAnyPrimary = state.existing.some((i) => i.isPrimary) || state.newFiles.some((i) => i.isPrimary);
    const newAddedFiles = files.map((file, idx) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      isPrimary: !hasAnyPrimary && idx === 0,
    }));
    onChange({ existing: state.existing, newFiles: [...state.newFiles, ...newAddedFiles] });
    setActiveId(newAddedFiles[0].id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const setPrimary = (slot: Slot) => {
    if (disabled) return;
    onChange({
      existing: state.existing.map((img) => ({ ...img, isPrimary: slot.kind === "existing" && img.id === slot.id })),
      newFiles: state.newFiles.map((img) => ({ ...img, isPrimary: slot.kind === "new" && img.id === slot.id })),
    });
  };

  const removeSlot = (slot: Slot) => {
    if (disabled) return;
    if (activeId === slot.id) setActiveId(null);

    if (slot.kind === "existing") {
      const nextExisting = state.existing.filter((img) => img.id !== slot.id);
      const nextNew = [...state.newFiles];
      if (slot.isPrimary) {
        if (nextExisting.length > 0) nextExisting[0].isPrimary = true;
        else if (nextNew.length > 0) nextNew[0].isPrimary = true;
      }
      onChange({ existing: nextExisting, newFiles: nextNew });
    } else {
      const removedFile = state.newFiles.find((img) => img.id === slot.id);
      if (removedFile) URL.revokeObjectURL(removedFile.previewUrl);
      const nextNew = state.newFiles.filter((img) => img.id !== slot.id);
      const nextExisting = [...state.existing];
      if (slot.isPrimary) {
        if (nextExisting.length > 0) nextExisting[0].isPrimary = true;
        else if (nextNew.length > 0) nextNew[0].isPrimary = true;
      }
      onChange({ existing: nextExisting, newFiles: nextNew });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    addFiles(files);
  };

  return (
    <div className="space-y-space-4">
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />

      {error && <p className="text-red-signal text-body-sm">{error}</p>}

      {slots.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          disabled={disabled}
          className={`w-full rounded-radius-md border-2 border-dashed p-space-8 text-center transition-colors disabled:opacity-50 ${
            isDragging ? "border-red-signal bg-red-signal/5" : "border-border-hairline hover:border-navy-deep/30 bg-ivory/40"
          }`}
        >
          <UploadCloud
            className={`w-8 h-8 mx-auto mb-space-2 ${isDragging ? "text-red-signal" : "text-slate/50"}`}
            aria-hidden="true"
          />
          <p className="font-body text-body-md text-navy-deep font-medium">
            Tarik & lepas gambar di sini
          </p>
          <p className="font-body text-body-sm text-slate mt-1">atau klik untuk memilih file</p>
        </button>
      ) : (
        <>
          {/* Hero preview */}
          {active && (
            <div
              className="relative rounded-radius-lg overflow-hidden aspect-[4/3] bg-ivory border border-border-hairline"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Image
                src={active.src}
                alt="Pratinjau gambar produk"
                fill
                unoptimized={active.kind === "new"}
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
              />
              {isDragging && (
                <div className="absolute inset-0 bg-red-signal/10 border-2 border-red-signal flex items-center justify-center">
                  <span className="bg-white px-space-3 py-space-1 rounded-radius-sm font-body text-body-sm font-medium text-red-signal">
                    Lepas untuk menambah
                  </span>
                </div>
              )}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                {active.kind === "new" && (
                  <span className="bg-red-signal text-white text-[10px] font-semibold uppercase px-2 py-1 rounded-full shadow-sm">
                    Baru
                  </span>
                )}
                {!hidePrimary && active.isPrimary && (
                  <span className="inline-flex items-center gap-1 bg-gold-hairline text-navy-deep text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow-sm">
                    <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                    Utama
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeSlot(active)}
                disabled={disabled}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-red-signal hover:text-white text-red-signal flex items-center justify-center transition-colors"
                title="Hapus gambar ini"
                aria-label="Hapus gambar ini"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
              {!hidePrimary && !active.isPrimary && (
                <button
                  type="button"
                  onClick={() => setPrimary(active)}
                  disabled={disabled}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-navy-deep text-body-sm font-medium px-space-3 py-1.5 rounded-full shadow-sm transition-colors"
                >
                  <Star className="w-3.5 h-3.5" aria-hidden="true" />
                  Jadikan Gambar Utama
                </button>
              )}
            </div>
          )}

          {/* Thumbnail filmstrip */}
          <div className="flex gap-space-2 overflow-x-auto pb-1 -mx-1 px-1">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setActiveId(slot.id)}
                className={`relative shrink-0 w-16 h-16 rounded-radius-sm overflow-hidden border-2 transition-all ${
                  active?.id === slot.id
                    ? "border-red-signal ring-2 ring-red-signal/20"
                    : "border-border-hairline hover:border-navy-deep/30"
                }`}
                aria-label="Pilih gambar ini"
                aria-current={active?.id === slot.id}
              >
                <Image src={slot.src} alt="" fill unoptimized={slot.kind === "new"} className="object-cover" sizes="64px" />
                {!hidePrimary && slot.isPrimary && (
                  <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-gold-hairline flex items-center justify-center">
                    <Star className="w-2 h-2 text-navy-deep fill-current" aria-hidden="true" />
                  </span>
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="shrink-0 w-16 h-16 rounded-radius-sm border-2 border-dashed border-border-hairline hover:border-navy-deep/30 flex items-center justify-center text-slate hover:text-navy-deep transition-colors disabled:opacity-50"
              aria-label="Tambah gambar"
            >
              <UploadCloud className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
