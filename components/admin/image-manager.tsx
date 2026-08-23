"use client";

import React, { useRef, useEffect } from "react";

export type ImageState = {
  existing: { id: string; url: string; isPrimary: boolean }[];
  newFiles: { id: string; file: File; previewUrl: string; isPrimary: boolean }[];
};

interface ImageManagerProps {
  state: ImageState;
  onChange: (newState: ImageState) => void;
  error?: string;
  disabled?: boolean;
  hidePrimary?: boolean;
  label?: string;
}

export function ImageManager({
  state,
  onChange,
  error,
  disabled = false,
  hidePrimary = false,
  label = "Gambar Produk",
}: ImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs on unmount to avoid memory leaks
  useEffect(() => {
    const urls = state.newFiles.map(f => f.previewUrl);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [state.newFiles]);

  const setPrimary = (type: "existing" | "new", id: string) => {
    if (disabled) return;
    onChange({
      existing: state.existing.map(img => ({ ...img, isPrimary: type === "existing" && img.id === id })),
      newFiles: state.newFiles.map(img => ({ ...img, isPrimary: type === "new" && img.id === id })),
    });
  };

  const removeExisting = (id: string) => {
    if (disabled) return;
    let nextExisting = state.existing.filter(img => img.id !== id);
    let nextNew = [...state.newFiles];
    
    // Auto-promote if we removed the primary
    const removedWasPrimary = state.existing.find(img => img.id === id)?.isPrimary;
    if (removedWasPrimary) {
      if (nextExisting.length > 0) nextExisting[0].isPrimary = true;
      else if (nextNew.length > 0) nextNew[0].isPrimary = true;
    }

    onChange({ existing: nextExisting, newFiles: nextNew });
  };

  const removeNew = (id: string) => {
    if (disabled) return;
    const removedFile = state.newFiles.find(img => img.id === id);
    if (removedFile) URL.revokeObjectURL(removedFile.previewUrl);
    
    let nextNew = state.newFiles.filter(img => img.id !== id);
    let nextExisting = [...state.existing];

    // Auto-promote if we removed the primary
    if (removedFile?.isPrimary) {
      if (nextExisting.length > 0) nextExisting[0].isPrimary = true;
      else if (nextNew.length > 0) nextNew[0].isPrimary = true;
    }

    onChange({ existing: nextExisting, newFiles: nextNew });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const hasAnyPrimary = state.existing.some(i => i.isPrimary) || state.newFiles.some(i => i.isPrimary);
    
    const newAddedFiles = files.map((file, idx) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      // Automatically make the first added file primary if there's no primary yet
      isPrimary: !hasAnyPrimary && idx === 0,
    }));

    onChange({
      existing: state.existing,
      newFiles: [...state.newFiles, ...newAddedFiles],
    });

    // Reset input so the same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-space-3">
      <div className="flex items-center justify-between">
        <label className="block font-body font-medium text-navy-deep text-body-sm">
          {label}
        </label>
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="text-body-sm font-medium text-red-signal hover:text-red-signal/80 transition-colors disabled:opacity-50"
          >
            + Unggah Gambar
          </button>
        </div>
      </div>

      {error && <p className="text-red-signal text-body-sm mb-1">{error}</p>}

      {state.existing.length === 0 && state.newFiles.length === 0 ? (
        <div className="p-space-8 border border-slate/20 border-dashed rounded-radius-sm text-center text-slate text-body-sm bg-ivory/30">
          Belum ada gambar. Klik "Unggah Gambar" untuk menambahkan file.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-space-4">
          {/* Existing Images */}
          {state.existing.map((img) => (
            <div key={img.id} className="relative group rounded-radius-sm border border-slate/20 overflow-hidden aspect-square bg-ivory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="Product image" className="w-full h-full object-cover" />
              
              {/* Badges/Controls overlay */}
              <div className="absolute inset-0 bg-navy-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between items-start">
                  <span className="bg-slate/80 text-white text-[10px] uppercase px-1.5 py-0.5 rounded-sm backdrop-blur-md">
                    Tersimpan
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExisting(img.id)}
                    disabled={disabled}
                    className="bg-red-signal/90 hover:bg-red-signal text-white rounded-full p-1 transition-colors"
                    title="Hapus gambar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                {!hidePrimary && (
                  <div className="flex justify-center">
                    {!img.isPrimary ? (
                      <button
                        type="button"
                        onClick={() => setPrimary("existing", img.id)}
                        disabled={disabled}
                        className="text-[11px] font-medium bg-navy-deep/80 text-white px-2 py-1 rounded backdrop-blur-md hover:bg-navy-deep transition-colors"
                      >
                        Jadikan Utama
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium bg-gold-hairline text-navy-deep px-2 py-1 rounded shadow-sm">
                        Utama
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Persistent Primary Badge for inactive state */}
              {!hidePrimary && img.isPrimary && (
                <div className="absolute bottom-2 right-2 md:bottom-auto md:right-auto md:top-2 md:left-2 group-hover:hidden">
                  <span className="text-[10px] font-bold bg-gold-hairline text-navy-deep px-1.5 py-0.5 rounded shadow-sm">
                    UTAMA
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* New Files Preview */}
          {state.newFiles.map((img) => (
            <div key={img.id} className="relative group rounded-radius-sm border-2 border-red-signal/20 overflow-hidden aspect-square bg-ivory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl} alt="New preview" className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-navy-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between items-start">
                  <span className="bg-red-signal text-white text-[10px] uppercase px-1.5 py-0.5 rounded-sm shadow-sm">
                    Baru
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNew(img.id)}
                    disabled={disabled}
                    className="bg-red-signal/90 hover:bg-red-signal text-white rounded-full p-1 transition-colors"
                    title="Batal unggah"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                {!hidePrimary && (
                  <div className="flex justify-center">
                    {!img.isPrimary ? (
                      <button
                        type="button"
                        onClick={() => setPrimary("new", img.id)}
                        disabled={disabled}
                        className="text-[11px] font-medium bg-navy-deep/80 text-white px-2 py-1 rounded backdrop-blur-md hover:bg-navy-deep transition-colors"
                      >
                        Jadikan Utama
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium bg-gold-hairline text-navy-deep px-2 py-1 rounded shadow-sm">
                        Utama
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!hidePrimary && img.isPrimary && (
                <div className="absolute bottom-2 right-2 md:bottom-auto md:right-auto md:top-2 md:left-2 group-hover:hidden">
                  <span className="text-[10px] font-bold bg-gold-hairline text-navy-deep px-1.5 py-0.5 rounded shadow-sm">
                    UTAMA
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
