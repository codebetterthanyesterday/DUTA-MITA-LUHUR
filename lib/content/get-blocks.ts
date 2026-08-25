import prisma from "@/lib/prisma";
import { BLOCKS, type BlockData, type BlockKey } from "./blocks";

/**
 * Resolve a stored block against its schema, falling back to the defaults.
 *
 * Any row that no longer matches its schema (because the schema was tightened
 * after the row was written) degrades to the default copy rather than crashing
 * the page — the admin simply sees the default in the editor and can re-save.
 */
function resolve<K extends BlockKey>(key: K, stored: unknown): BlockData<K> {
  const def = BLOCKS[key];
  if (stored === undefined || stored === null) return def.defaults as BlockData<K>;

  const parsed = def.schema.safeParse(stored);
  if (parsed.success) return parsed.data as BlockData<K>;

  console.warn(
    `[content] Stored block "${key}" does not match its schema; falling back to defaults.`,
    parsed.error.flatten()
  );
  return def.defaults as BlockData<K>;
}

/** Read a single content block, falling back to its default copy. */
export async function getBlock<K extends BlockKey>(key: K): Promise<BlockData<K>> {
  const row = await prisma.contentBlock.findUnique({ where: { key } });
  return resolve(key, row?.data);
}

/**
 * Read several content blocks in one query.
 *
 * Returns an object keyed by the requested keys, each entry already narrowed to
 * that block's own data type:
 *
 *   const { "home.hero": hero } = await getBlocks(["home.hero", "home.whyUs"]);
 */
export async function getBlocks<const K extends readonly BlockKey[]>(
  keys: K
): Promise<{ [P in K[number]]: BlockData<P> }> {
  const rows = await prisma.contentBlock.findMany({
    where: { key: { in: keys as unknown as string[] } },
  });
  const stored = new Map(rows.map((row) => [row.key, row.data]));

  const result = {} as Record<string, unknown>;
  for (const key of keys) {
    result[key] = resolve(key, stored.get(key));
  }
  return result as { [P in K[number]]: BlockData<P> };
}
