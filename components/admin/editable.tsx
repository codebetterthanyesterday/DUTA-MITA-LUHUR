import type { BlockFormSpec } from "@/lib/content/blocks";
import { isAdminRequest } from "@/lib/auth-helpers";
import { EditableClient } from "./editable-client";

/**
 * Wraps a public-facing section so an admin can edit it in place.
 *
 * The admin check happens here, on the server, so a visitor's page contains
 * neither the edit UI nor the block data and form spec that drive it — they
 * never enter the payload at all. Admins get {@link EditableClient}, which then
 * shows or hides the affordance according to the global edit-mode switch.
 */
export async function Editable({
  spec,
  data,
  label,
  align = "right",
  children,
}: {
  spec: BlockFormSpec;
  data: Record<string, unknown>;
  label: string;
  align?: "right" | "left";
  children: React.ReactNode;
}) {
  if (!(await isAdminRequest())) return <>{children}</>;

  return (
    <EditableClient spec={spec} data={data} label={label} align={align}>
      {children}
    </EditableClient>
  );
}
