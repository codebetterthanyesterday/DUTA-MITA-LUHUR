"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Tag } from "lucide-react";
import { createCategory, updateCategory, ActionState } from "@/app/admin/categories/actions";
import { TextField, TextAreaField } from "@/components/admin/ui/form-fields";
import { Button } from "@/components/admin/ui/button";
import { SectionCard } from "@/components/admin/ui/section-card";
import { slugify } from "@/lib/slugify";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    sortOrder: number;
  };
  backUrl?: string;
}

export function CategoryForm({ initialData, backUrl = "/admin/categories" }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let res: ActionState;
      if (initialData) {
        res = await updateCategory(initialData.id, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res.success) {
        router.push("../categories");
      } else {
        setError(res.error);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  };

  const previewSlug = name.trim() ? slugify(name) : initialData?.slug || "kategori-anda";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl animate-admin-fade-in pb-24 sm:pb-0">
      {error && (
        <div className="flex items-start gap-3 p-4 mb-8 bg-red-signal/10 border border-red-signal/20 text-red-signal text-sm rounded-radius-lg animate-admin-pop">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <SectionCard icon={Tag} title="Detail Kategori" description="Nama dan urutan tampil di katalog publik">
        <div className="space-y-6">
          <div>
            <TextField
              label="Nama Kategori"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isPending}
              error={fieldErrors?.name?.[0]}
            />
            <p className="mt-2 text-xs text-slate font-mono bg-slate/5 inline-block px-2 py-1 rounded-radius-sm">
              /katalog/<span className="text-navy-deep font-semibold">{previewSlug}</span>
            </p>
          </div>

          <TextAreaField
            label="Deskripsi"
            id="description"
            name="description"
            rows={4}
            defaultValue={initialData?.description || ""}
            disabled={isPending}
          />

          <TextField
            label="Urutan Tampil"
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={initialData?.sortOrder ?? ""}
            disabled={isPending}
            required
            hint="Angka lebih kecil tampil lebih dulu di katalog"
            error={fieldErrors?.sortOrder?.[0]}
            className="sm:max-w-[200px]"
          />
        </div>
      </SectionCard>

      <div className="hidden sm:flex flex-row justify-end gap-3 mt-8">
        <Button variant="secondary" onClick={() => router.push(backUrl)} disabled={isPending} className="px-6 py-2.5 text-base">
          Batal
        </Button>
        <Button type="submit" pending={isPending} className="px-6 py-2.5 text-base shadow-md">
          {isPending ? "Menyimpan..." : "Simpan Kategori"}
        </Button>
      </div>

      {/* Mobile action bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/80 backdrop-blur-md border-t border-slate/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex gap-3 shadow-[0_-4px_12px_rgba(11,30,58,0.05)]">
        <Button
          variant="secondary"
          onClick={() => !isPending && router.push(backUrl)}
          disabled={isPending}
          className="flex-1 py-3 text-base"
        >
          Batal
        </Button>
        <Button type="submit" pending={isPending} className="flex-1 py-3 text-base shadow-md">
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
