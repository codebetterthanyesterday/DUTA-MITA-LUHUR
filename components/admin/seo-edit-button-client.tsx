"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { BlockFormSpec } from "@/lib/content/blocks";
import { InlineEditModal } from "./inline-edit-modal";
import { BlockForm } from "./block-form";
import { useEditMode } from "./edit-mode";

/**
 * Edit entry point for content that has no on-page representation.
 *
 * Page metadata cannot be outlined in place the way a hero or a stats band can,
 * so it gets its own control docked opposite the admin bar. Each page renders
 * this once with its own `seo.*` block.
 */
export function SeoEditButtonClient({
  spec,
  data,
}: {
  spec: BlockFormSpec;
  data: Record<string, unknown>;
}) {
  const { enabled } = useEditMode();
  const [isOpen, setIsOpen] = useState(false);

  if (!enabled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-space-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex items-center gap-space-2 bg-navy-deep text-ivory px-space-3 py-space-2 rounded-radius-sm shadow-md border border-navy-base hover:bg-red-signal transition-colors min-h-[44px]"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="font-body text-body-sm font-medium whitespace-nowrap">SEO Halaman</span>
      </button>

      <InlineEditModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={spec.title}>
        <BlockForm spec={spec} initialData={data} onDone={() => setIsOpen(false)} />
      </InlineEditModal>
    </>
  );
}
