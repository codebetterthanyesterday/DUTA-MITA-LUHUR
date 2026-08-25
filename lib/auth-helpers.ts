import { cache } from "react";
import { auth } from "@/auth";

/**
 * Whether the current request belongs to a signed-in admin.
 *
 * Wrapped in React's `cache` so the many inline-edit wrappers on a page each
 * ask the question without re-decoding the session once per section.
 */
export const isAdminRequest = cache(async (): Promise<boolean> => {
  const session = await auth();
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
});
