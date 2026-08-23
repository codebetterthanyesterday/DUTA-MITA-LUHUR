"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductSpecFields, SpecRow } from "./product-spec-fields";
import { ImageManager, ImageState } from "./image-manager";
import { createProduct, updateProduct, uploadImageAction, ProductFormValues } from "@/app/admin/products/actions";

type CategoryOption = { id: string; name: string };

type InitialProduct = {
  id: string;
  name: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  moqValue: number | string;
  moqUnit: string;
  packaging: string;
  isActive: boolean;
  specifications: { id: string; label: string; value: string; sortOrder: number }[];
  images: { id: string; url: string; isPrimary: boolean; sortOrder: number }[];
};

interface ProductFormProps {
  categories: CategoryOption[];
  initialProduct?: InitialProduct;
  backUrl: string;
}

export function ProductForm({ categories, initialProduct, backUrl }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialProduct;

  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialProduct?.name || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [moqValue, setMoqValue] = useState<string>(initialProduct ? initialProduct.moqValue.toString() : "");
  const [moqUnit, setMoqUnit] = useState(initialProduct?.moqUnit || "");
  const [packaging, setPackaging] = useState(initialProduct?.packaging || "");
  const [isActive, setIsActive] = useState(initialProduct ? initialProduct.isActive : true);

  // Spec State
  const [specifications, setSpecifications] = useState<SpecRow[]>(
    initialProduct?.specifications
      ? initialProduct.specifications.map(s => ({ id: s.id, label: s.label, value: s.value }))
      : [{ id: crypto.randomUUID(), label: "", value: "" }]
  );

  // Image State
  const [imageState, setImageState] = useState<ImageState>({
    existing: initialProduct?.images.map(img => ({ id: img.id, url: img.url, isPrimary: img.isPrimary })) || [],
    newFiles: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    setErrorMsg(null);

    // Basic validation
    if (!name || !categoryId || !shortDescription || !description || !moqValue || !moqUnit || !packaging) {
      setErrorMsg("Harap isi semua field wajib (Nama, Kategori, Deskripsi, MOQ, Packaging).");
      return;
    }

    const numMoq = parseFloat(moqValue);
    if (isNaN(numMoq) || numMoq <= 0) {
      setErrorMsg("MOQ harus berupa angka positif.");
      return;
    }

    // Spec validation (drop completely empty, reject half-empty)
    const validSpecs: { label: string; value: string }[] = [];
    for (const spec of specifications) {
      const hasLabel = !!spec.label.trim();
      const hasValue = !!spec.value.trim();
      
      if (hasLabel && hasValue) {
        validSpecs.push({ label: spec.label.trim(), value: spec.value.trim() });
      } else if (hasLabel || hasValue) {
        setErrorMsg("Baris spesifikasi ada yang tidak lengkap. Isi keduanya atau hapus baris tersebut.");
        return;
      }
    }

    // Image validation (at least one primary if there are any images)
    const totalImages = imageState.existing.length + imageState.newFiles.length;
    let hasPrimary = false;
    if (totalImages > 0) {
      hasPrimary = imageState.existing.some(i => i.isPrimary) || imageState.newFiles.some(i => i.isPrimary);
      if (!hasPrimary) {
        setErrorMsg("Harap pilih satu gambar sebagai gambar Utama.");
        return;
      }
    }

    setIsPending(true);

    try {
      // 1. Upload new images
      const uploadedImageUrls = await Promise.all(
        imageState.newFiles.map(async (newImg) => {
          const fd = new FormData();
          fd.append("file", newImg.file);
          const { url } = await uploadImageAction(fd);
          return { url, isPrimary: newImg.isPrimary };
        })
      );

      // Combine with existing images
      const finalImages = [
        ...imageState.existing.map(img => ({ url: img.url, isPrimary: img.isPrimary })),
        ...uploadedImageUrls
      ];

      // 2. Prepare payload
      const payload: ProductFormValues = {
        name,
        categoryId,
        shortDescription,
        description,
        moqValue: numMoq,
        moqUnit,
        packaging,
        isActive,
        specifications: validSpecs,
        images: finalImages,
      };

      // 3. Call Server Action
      const res = isEdit
        ? await updateProduct(initialProduct.id, payload)
        : await createProduct(payload);

      if (res.success) {
        router.push(backUrl);
        // Using router.refresh() isn't strictly necessary since actions use revalidatePath,
        // but can ensure client components reset if navigating back
      } else {
        // Since we throw errors in actions right now, it will go to catch block
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan produk.");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-space-8 max-w-4xl bg-white p-space-6 md:p-space-8 rounded-radius-md shadow-card border border-slate/10">
      
      {errorMsg && (
        <div className="p-space-4 bg-red-signal/10 border border-red-signal/20 text-red-signal rounded-radius-sm font-body text-body-md">
          {errorMsg}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-space-4">
        <h2 className="font-display font-medium text-display-sm text-navy-deep border-b border-slate/10 pb-space-2">
          Informasi Dasar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          <div>
            <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Nama Produk <span className="text-red-signal">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
          </div>
          <div>
            <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Kategori <span className="text-red-signal">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            >
              <option value="" disabled>Pilih Kategori...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Deskripsi Singkat <span className="text-red-signal">*</span>
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            disabled={isPending}
            className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
          />
        </div>

        <div>
          <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Deskripsi Lengkap <span className="text-red-signal">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            rows={5}
            className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none resize-y"
          />
        </div>
      </div>

      {/* Logistics & Packing */}
      <div className="space-y-space-4">
        <h2 className="font-display font-medium text-display-sm text-navy-deep border-b border-slate/10 pb-space-2">
          Kuantitas & Kemasan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-4">
          <div>
            <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Minimum Order (Nilai) <span className="text-red-signal">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={moqValue}
              onChange={(e) => setMoqValue(e.target.value)}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
          </div>
          <div>
            <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Satuan (Unit) <span className="text-red-signal">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: ton, kg"
              value={moqUnit}
              onChange={(e) => setMoqUnit(e.target.value)}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
          </div>
          <div>
            <label className="block font-body font-medium text-navy-deep text-body-sm mb-1">
              Packaging <span className="text-red-signal">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Bal 111.11 kg"
              value={packaging}
              onChange={(e) => setPackaging(e.target.value)}
              disabled={isPending}
              className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors disabled:opacity-50 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Specifications */}
      <ProductSpecFields
        items={specifications}
        onChange={setSpecifications}
        disabled={isPending}
      />

      {/* Images */}
      <ImageManager
        state={imageState}
        onChange={setImageState}
        disabled={isPending}
      />

      {/* Status */}
      <div className="flex items-center gap-space-3 border-t border-slate/10 pt-space-6">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            disabled={isPending}
          />
          <div className="w-11 h-6 bg-slate/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-signal rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          <span className="ml-3 font-body font-medium text-navy-deep text-body-md">
            Status Aktif (Tampilkan di Katalog Publik)
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-space-4 pt-space-4">
        <button
          type="button"
          onClick={() => !isPending && router.push(backUrl)}
          disabled={isPending}
          className="px-space-4 py-space-2 rounded-radius-sm font-body font-medium text-body-sm text-slate hover:bg-slate/10 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-space-6 py-space-2 rounded-radius-sm font-body font-medium text-body-sm bg-red-signal text-ivory hover:bg-red-signal/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
        >
          {isPending ? (
            <svg className="animate-spin h-5 w-5 text-ivory" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            isEdit ? "Simpan Perubahan" : "Simpan Produk"
          )}
        </button>
      </div>
    </form>
  );
}
