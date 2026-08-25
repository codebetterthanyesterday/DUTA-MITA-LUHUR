"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { updateBlock } from "@/lib/actions/content";
import type { BlockFormSpec, Field, LeafField } from "@/lib/content/blocks";
import { DynamicTextList, type TextRow } from "./dynamic-text-list";

type RepeaterRow = { id: string; values: Record<string, string> };

const inputClass =
  "w-full bg-white border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none disabled:opacity-50";

function toRows(value: unknown): TextRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({ id: crypto.randomUUID(), value: String(item) }));
}

function toRepeaterRows(value: unknown, fields: LeafField[]): RepeaterRow[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const source = (item ?? {}) as Record<string, unknown>;
    const values: Record<string, string> = {};
    for (const field of fields) values[field.name] = String(source[field.name] ?? "");
    return { id: crypto.randomUUID(), values };
  });
}

function emptyRepeaterRow(fields: LeafField[]): RepeaterRow {
  const values: Record<string, string> = {};
  for (const field of fields) values[field.name] = "";
  return { id: crypto.randomUUID(), values };
}

/**
 * Renders and submits any content block from its declarative field spec.
 *
 * The client only ever sends a plain object; the block's Zod schema on the
 * server is what actually decides validity, so the checks here are purely to
 * give the admin fast feedback.
 */
export function BlockForm({
  spec,
  initialData,
  onDone,
}: {
  spec: BlockFormSpec;
  initialData: Record<string, unknown>;
  onDone: () => void;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [scalars, setScalars] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of spec.fields) {
      if (field.kind === "text" || field.kind === "textarea") {
        initial[field.name] = String(initialData[field.name] ?? "");
      }
    }
    return initial;
  });

  const [lists, setLists] = useState<Record<string, TextRow[]>>(() => {
    const initial: Record<string, TextRow[]> = {};
    for (const field of spec.fields) {
      if (field.kind === "list") initial[field.name] = toRows(initialData[field.name]);
    }
    return initial;
  });

  const [repeaters, setRepeaters] = useState<Record<string, RepeaterRow[]>>(() => {
    const initial: Record<string, RepeaterRow[]> = {};
    for (const field of spec.fields) {
      if (field.kind === "repeater") {
        initial[field.name] = toRepeaterRows(initialData[field.name], field.fields);
      }
    }
    return initial;
  });

  const payload = useMemo(() => {
    const data: Record<string, unknown> = { ...scalars };
    for (const [name, rows] of Object.entries(lists)) {
      data[name] = rows.map((row) => row.value.trim()).filter(Boolean);
    }
    for (const [name, rows] of Object.entries(repeaters)) {
      data[name] = rows.map((row) => {
        const trimmed: Record<string, string> = {};
        for (const [key, value] of Object.entries(row.values)) trimmed[key] = value.trim();
        return trimmed;
      });
    }
    return data;
  }, [scalars, lists, repeaters]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const result = await updateBlock(spec.key, payload);
      if (result.ok) {
        router.refresh();
        onDone();
        return;
      }
      setError(result.message);
      setFieldErrors(result.fieldErrors ?? {});
    } catch (cause) {
      console.error(`Failed to save content block "${spec.key}":`, cause);
      setError("Gagal menyimpan. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderLeaf = (field: LeafField, value: string, onChange: (next: string) => void) => (
    <div key={field.name} className="space-y-1">
      <label className="block font-body font-medium text-navy-deep text-body-sm">
        {field.label}
      </label>
      {field.kind === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          disabled={isSaving}
          rows={field.rows ?? 3}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          disabled={isSaving}
          className={inputClass}
        />
      )}
      {field.help && <p className="text-caption text-slate">{field.help}</p>}
    </div>
  );

  const renderField = (field: Field) => {
    if (field.kind === "text" || field.kind === "textarea") {
      return (
        <div key={field.name} className="space-y-1">
          <label className="block font-body font-medium text-navy-deep text-body-sm">
            {field.label}
          </label>
          {field.kind === "textarea" ? (
            <textarea
              value={scalars[field.name] ?? ""}
              onChange={(event) =>
                setScalars((current) => ({ ...current, [field.name]: event.target.value }))
              }
              placeholder={field.placeholder}
              disabled={isSaving}
              rows={field.rows ?? 3}
              className={`${inputClass} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={scalars[field.name] ?? ""}
              onChange={(event) =>
                setScalars((current) => ({ ...current, [field.name]: event.target.value }))
              }
              placeholder={field.placeholder}
              disabled={isSaving}
              className={inputClass}
            />
          )}
          {fieldErrors[field.name] && (
            <p className="text-red-signal text-body-sm">{fieldErrors[field.name]}</p>
          )}
          {field.help && !fieldErrors[field.name] && (
            <p className="text-caption text-slate">{field.help}</p>
          )}
        </div>
      );
    }

    if (field.kind === "list") {
      return (
        <div key={field.name} className="space-y-1">
          <DynamicTextList
            label={field.label}
            items={lists[field.name] ?? []}
            onChange={(items) => setLists((current) => ({ ...current, [field.name]: items }))}
            placeholder={field.placeholder}
            addButtonText={field.addLabel ?? "+ Tambah Item"}
            error={fieldErrors[field.name]}
            disabled={isSaving}
          />
          {field.help && !fieldErrors[field.name] && (
            <p className="text-caption text-slate">{field.help}</p>
          )}
        </div>
      );
    }

    const rows = repeaters[field.name] ?? [];
    const atMax = field.max !== undefined && rows.length >= field.max;
    const atMin = field.min !== undefined && rows.length <= field.min;

    const setRows = (next: RepeaterRow[]) =>
      setRepeaters((current) => ({ ...current, [field.name]: next }));

    return (
      <div key={field.name} className="space-y-space-3">
        <div className="flex items-center justify-between">
          <label className="block font-body font-medium text-navy-deep text-body-sm">
            {field.label}
          </label>
          <button
            type="button"
            onClick={() => setRows([...rows, emptyRepeaterRow(field.fields)])}
            disabled={isSaving || atMax}
            className="text-body-sm font-medium text-red-signal hover:text-red-signal/80 transition-colors disabled:opacity-40 min-h-[44px] px-2 -mr-2 flex items-center"
          >
            + Tambah {field.itemLabel}
          </button>
        </div>

        {fieldErrors[field.name] && (
          <p className="text-red-signal text-body-sm">{fieldErrors[field.name]}</p>
        )}
        {field.help && !fieldErrors[field.name] && (
          <p className="text-caption text-slate">{field.help}</p>
        )}

        {rows.length === 0 ? (
          <div className="p-space-4 border border-slate/20 border-dashed rounded-radius-sm text-center text-slate text-body-sm bg-ivory/30">
            Belum ada {field.itemLabel.toLowerCase()}.
          </div>
        ) : (
          <div className="space-y-space-3">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className="rounded-radius-sm border border-slate/20 bg-white p-space-3 space-y-space-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-caption uppercase tracking-wider text-slate">
                    {field.itemLabel} {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRows(rows.filter((candidate) => candidate.id !== row.id))}
                    disabled={isSaving || atMin}
                    className="text-body-sm font-medium text-slate hover:text-red-signal transition-colors disabled:opacity-40 min-h-[44px] px-2 -mr-2 flex items-center"
                    title={atMin ? `Minimal ${field.min} ${field.itemLabel.toLowerCase()}` : "Hapus"}
                  >
                    Hapus
                  </button>
                </div>

                {field.fields.map((leaf) =>
                  renderLeaf(leaf, row.values[leaf.name] ?? "", (next) =>
                    setRows(
                      rows.map((candidate) =>
                        candidate.id === row.id
                          ? { ...candidate, values: { ...candidate.values, [leaf.name]: next } }
                          : candidate
                      )
                    )
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-space-5">
      {error && (
        <div
          role="alert"
          className="p-space-3 bg-red-signal/10 border border-red-signal/30 text-red-signal rounded-radius-sm text-body-sm"
        >
          {error}
        </div>
      )}

      <div className="space-y-space-5">{spec.fields.map(renderField)}</div>

      <div className="flex justify-end gap-space-3 pt-space-3 border-t border-slate/10">
        <button
          type="button"
          onClick={onDone}
          disabled={isSaving}
          className="px-space-4 py-2 font-body font-medium text-body-md text-navy-deep hover:bg-navy-base/5 rounded-radius-sm transition-colors disabled:opacity-50 min-h-[44px]"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-space-4 py-2 font-body font-medium text-body-md text-ivory bg-red-signal hover:bg-red-signal/90 rounded-radius-sm transition-colors disabled:opacity-50 min-h-[44px]"
        >
          {isSaving ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
