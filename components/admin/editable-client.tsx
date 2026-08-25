"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { BlockFormSpec } from "@/lib/content/blocks";
import { InlineEditModal } from "./inline-edit-modal";
import { BlockForm } from "./block-form";
import { useEditMode } from "./edit-mode";

type EditableProps = {
  spec: BlockFormSpec;
  data: Record<string, unknown>;
  /** Short name for this region, shown on the edit button. */
  label: string;
  /** Where the edit button sits relative to the region. */
  align?: "right" | "left";
  children: React.ReactNode;
};

/**
 * Client half of {@link Editable}: draws the outline and edit button once an
 * admin has switched edit mode on, and renders `children` untouched otherwise.
 *
 * Only ever mounted for admins — the server component decides that — so no
 * block data reaches a visitor's page payload.
 */
export function EditableClient({ spec, data, label, align = "right", children }: EditableProps) {
  const { enabled } = useEditMode();
  const [isOpen, setIsOpen] = useState(false);

  if (!enabled) return <>{children}</>;

  return (
    <div className="relative outline-2 outline-dashed outline-offset-[-2px] outline-gold-hairline/70 rounded-radius-sm">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Edit ${label}`}
        className={`absolute top-space-3 z-40 flex items-center gap-2 bg-navy-deep text-ivory px-space-3 py-1.5 rounded-radius-sm shadow-md hover:bg-red-signal transition-colors border border-ivory/20 min-h-[44px] ${
          align === "right" ? "right-space-3" : "left-space-3"
        }`}
      >
        <Pencil className="w-4 h-4 shrink-0" />
        <span className="font-body text-body-sm font-medium whitespace-nowrap">{label}</span>
      </button>

      {children}

      <InlineEditModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={spec.title}>
        <BlockForm spec={spec} initialData={data} onDone={() => setIsOpen(false)} />
      </InlineEditModal>
    </div>
  );
}
