import type { BlockFormSpec } from "@/lib/content/blocks";
import { isAdminRequest } from "@/lib/auth-helpers";
import { SeoEditButtonClient } from "./seo-edit-button-client";

/**
 * Server gate for the page-metadata editor, mirroring {@link Editable}: nothing
 * at all is sent to a visitor, and admins get the control once edit mode is on.
 */
export async function SeoEditButton({
  spec,
  data,
}: {
  spec: BlockFormSpec;
  data: Record<string, unknown>;
}) {
  if (!(await isAdminRequest())) return null;

  return <SeoEditButtonClient spec={spec} data={data} />;
}
