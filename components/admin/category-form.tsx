"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, ActionState } from "@/app/admin/categories/actions";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    sortOrder: number;
  };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<any>({});

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
        router.push("../categories"); // Uses relative navigation from /new or /[id]/edit
      } else {
        setError(res.error);
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-space-6 max-w-2xl bg-white p-space-6 md:p-space-8 rounded-radius-md shadow-card border border-slate/10">
      
      {error && (
        <div className="p-space-4 bg-red-signal/10 border border-red-signal/30 text-red-signal text-body-sm rounded-radius-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-body-sm font-medium text-navy-deep mb-space-2">
          Nama Kategori <span className="text-red-signal">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name || ""}
          required
          disabled={isPending}
          className="w-full bg-white border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none disabled:opacity-50"
        />
        {fieldErrors?.name && <p className="mt-1 text-red-signal text-body-sm">{fieldErrors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-body-sm font-medium text-navy-deep mb-space-2">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialData?.description || ""}
          disabled={isPending}
          className="w-full bg-white border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="sortOrder" className="block text-body-sm font-medium text-navy-deep mb-space-2">
          Urutan Tampil <span className="text-red-signal">*</span>
        </label>
        <input
          type="number"
          id="sortOrder"
          name="sortOrder"
          defaultValue={initialData?.sortOrder ?? ""}
          disabled={isPending}
          className="w-full sm:max-w-[150px] bg-white border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none disabled:opacity-50"
        />
        <p className="mt-1 text-slate text-body-sm">Angka lebih kecil tampil lebih dulu</p>
        {fieldErrors?.sortOrder && <p className="mt-1 text-red-signal text-body-sm">{fieldErrors.sortOrder[0]}</p>}
      </div>

      <div className="pt-space-4 border-t border-slate/10 flex justify-end gap-space-4">
        <button
          type="button"
          onClick={() => router.push("../categories")}
          disabled={isPending}
          className="px-space-5 py-2 rounded-radius-sm text-body-md font-medium text-slate hover:bg-slate/10 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-space-5 py-2 rounded-radius-sm text-body-md font-medium bg-red-signal text-ivory hover:bg-red-signal/90 transition-colors disabled:opacity-50 shadow-md"
        >
          {isPending ? "Menyimpan..." : "Simpan Kategori"}
        </button>
      </div>

    </form>
  );
}
