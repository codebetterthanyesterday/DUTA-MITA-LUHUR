"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, FileText, Image as ImageIcon, ListChecks, Package, Rocket } from "lucide-react";
import { ProductSpecFields, SpecRow } from "./product-spec-fields";
import { ImageManager, ImageState } from "./image-manager";
import { createProduct, updateProduct, uploadImageAction, ProductFormValues } from "@/app/admin/products/actions";
import { TextField, TextAreaField, SelectField, ToggleField } from "./ui/form-fields";
import { Button } from "./ui/button";
import { SectionCard } from "./ui/section-card";

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

/**
 * Product create/edit form.
 *
 * Two-column CMS layout: the left column is the content itself (info,
 * images, specs, logistics) and the right column is a sticky "Publish" panel
 * (category, status, save/cancel) that stays in view while the left column
 * scrolls — the pattern from Shopify/WordPress/Contentful, so committing the
 * product never requires scrolling back up past a long form. Below lg, the
 * publish panel's save/cancel duplicate into a bottom action bar instead,
 * since there's no room for a sticky sidebar on a narrow viewport.
 */
export function ProductForm({ categories, initialProduct, backUrl }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialProduct;

  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState(initialProduct?.name || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [moqValue, setMoqValue] = useState<string>(initialProduct ? initialProduct.moqValue.toString() : "");
  const [moqUnit, setMoqUnit] = useState(initialProduct?.moqUnit || "");
  const [packaging, setPackaging] = useState(initialProduct?.packaging || "");
  const [isActive, setIsActive] = useState(initialProduct ? initialProduct.isActive : true);

  const [specifications, setSpecifications] = useState<SpecRow[]>(
    initialProduct?.specifications
      ? initialProduct.specifications.map((s) => ({ id: s.id, label: s.label, value: s.value }))
      : [{ id: crypto.randomUUID(), label: "", value: "" }]
  );

  const [imageState, setImageState] = useState<ImageState>({
    existing: initialProduct?.images.map((img) => ({ id: img.id, url: img.url, isPrimary: img.isPrimary })) || [],
    newFiles: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    setErrorMsg(null);

    if (!name || !categoryId || !shortDescription || !description || !moqValue || !moqUnit || !packaging) {
      setErrorMsg("Harap isi semua field wajib (Nama, Kategori, Deskripsi, MOQ, Packaging).");
      return;
    }

    const numMoq = parseFloat(moqValue);
    if (isNaN(numMoq) || numMoq <= 0) {
      setErrorMsg("MOQ harus berupa angka positif.");
      return;
    }

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

    const totalImages = imageState.existing.length + imageState.newFiles.length;
    if (totalImages > 0) {
      const hasPrimary = imageState.existing.some((i) => i.isPrimary) || imageState.newFiles.some((i) => i.isPrimary);
      if (!hasPrimary) {
        setErrorMsg("Harap pilih satu gambar sebagai gambar Utama.");
        return;
      }
    }

    setIsPending(true);

    try {
      const uploadedImageUrls = await Promise.all(
        imageState.newFiles.map(async (newImg) => {
          const fd = new FormData();
          fd.append("file", newImg.file);
          const { url } = await uploadImageAction(fd);
          return { url, isPrimary: newImg.isPrimary };
        })
      );

      const finalImages = [
        ...imageState.existing.map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
        ...uploadedImageUrls,
      ];

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

      const res = isEdit ? await updateProduct(initialProduct.id, payload) : await createProduct(payload);

      if (res.success) {
        router.push(backUrl);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan produk.");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pb-28 lg:pb-0 animate-admin-fade-in">
      {errorMsg && (
        <div className="flex items-start gap-3 p-4 mb-8 bg-red-signal/10 border border-red-signal/20 text-red-signal rounded-radius-lg font-body text-sm animate-admin-pop">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main content */}
        <div className="lg:col-span-8 space-y-8">
          <SectionCard icon={FileText} title="Informasi Produk" description="Nama dan deskripsi yang tampil di katalog">
            <div className="space-y-6">
              <TextField
                label="Nama Produk"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
              />
              <TextField
                label="Deskripsi Singkat"
                required
                hint="Ringkasan satu baris untuk kartu produk di katalog"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                disabled={isPending}
              />
              <TextAreaField
                label="Deskripsi Lengkap"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                rows={5}
              />
            </div>
          </SectionCard>

          <SectionCard icon={ImageIcon} title="Gambar Produk" description="Gambar pertama yang ditandai jadi sampul katalog">
            <ImageManager state={imageState} onChange={setImageState} disabled={isPending} />
          </SectionCard>

          <SectionCard icon={ListChecks} title="Spesifikasi Teknis" description="Atribut teknis, contoh: Grade, Kadar Air">
            <ProductSpecFields items={specifications} onChange={setSpecifications} disabled={isPending} />
          </SectionCard>

          <SectionCard icon={Package} title="Kuantitas & Kemasan">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <TextField
                label="Minimum Order"
                required
                type="number"
                step="any"
                min="0"
                value={moqValue}
                onChange={(e) => setMoqValue(e.target.value)}
                disabled={isPending}
              />
              <TextField
                label="Satuan"
                required
                placeholder="ton, kg"
                value={moqUnit}
                onChange={(e) => setMoqUnit(e.target.value)}
                disabled={isPending}
              />
              <TextField
                label="Packaging"
                required
                placeholder="Bal 111.11 kg"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                disabled={isPending}
              />
            </div>
          </SectionCard>
        </div>

        {/* Publish sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-8">
          <SectionCard icon={Rocket} title="Publikasikan">
            <div className="space-y-6">
              <SelectField
                label="Kategori"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={isPending}
              >
                <option value="" disabled>Pilih Kategori...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </SelectField>

              <div className="pt-6 border-t border-slate/10">
                <ToggleField
                  label="Tampilkan di Katalog"
                  checked={isActive}
                  onChange={setIsActive}
                  disabled={isPending}
                />
              </div>

              {/* Desktop actions live in the sticky sidebar */}
              <div className="hidden lg:flex flex-col gap-3 pt-4">
                <Button type="submit" pending={isPending} className="w-full text-base py-3 shadow-md">
                  {isEdit ? "Simpan Perubahan" : "Simpan Produk"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => !isPending && router.push(backUrl)}
                  disabled={isPending}
                  className="w-full text-base py-3"
                >
                  Batal
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Mobile action bar — the sidebar buttons are hidden below lg, so the
          save/cancel affordance lives here instead, pinned to the viewport. */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/80 backdrop-blur-md border-t border-slate/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex gap-3 shadow-[0_-4px_12px_rgba(11,30,58,0.05)]">
        <Button
          variant="secondary"
          onClick={() => !isPending && router.push(backUrl)}
          disabled={isPending}
          className="flex-1 py-3 text-base"
        >
          Batal
        </Button>
        <Button type="submit" pending={isPending} className="flex-1 py-3 text-base shadow-md">
          {isEdit ? "Simpan" : "Simpan Produk"}
        </Button>
      </div>
    </form>
  );
}
