/**
 * Get the admin portal route slug from environment.
 * Used to obfuscate the admin panel from generic discovery.
 */
export function getAdminSlug(): string {
  return process.env.ADMIN_ROUTE_SLUG || "admin";
}

/**
 * Generate an admin route URL with the configured slug.
 */
export function getAdminRoute(path: string = ""): string {
  const slug = getAdminSlug();
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return cleanPath ? `/${slug}/${cleanPath}` : `/${slug}`;
}
