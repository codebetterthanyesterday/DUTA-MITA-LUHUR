import prisma from "@/lib/prisma";
import { BLOCKS, type BlockKey } from "@/lib/content/blocks";
import type { RfqStatus } from "@prisma/client";

/**
 * Every query behind the admin dashboard.
 *
 * Each panel gets its own function so the page can stream them independently
 * under separate <Suspense> boundaries — a slow aggregate never blocks the
 * action queue, which is the part an admin actually came for.
 */

// --- helpers ----------------------------------------------------------------

function startOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function startOfMonthUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

/**
 * Order-insensitive deep equality, used to decide whether a stored content
 * block still matches its shipped default. Object keys are sorted so that a
 * block re-saved with the same values but a different key order still counts
 * as untouched.
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  if (typeof a === "object") {
    const aKeys = Object.keys(a as object).sort();
    const bKeys = Object.keys(b as object).sort();
    if (aKeys.length !== bKeys.length || !aKeys.every((k, i) => k === bKeys[i])) return false;
    return aKeys.every((key) =>
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    );
  }
  return false;
}

// --- action queue -----------------------------------------------------------

export type ActionItem = {
  id: string;
  tone: "critical" | "serious" | "warning" | "good";
  label: string;
  detail: string;
  href: string;
  count: number;
};

/**
 * The prioritised "what needs you now" list. Only genuinely actionable items
 * appear — an empty queue is a real, good state and the UI says so rather than
 * inventing filler rows.
 */
export async function getActionItems(adminSlug: string): Promise<ActionItem[]> {
  const now = new Date();
  const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const [newRfqs, staleRfqs, unreadMessages, expiringCerts, undatedCerts, contentGaps] =
    await Promise.all([
      prisma.rFQ.count({ where: { status: "NEW" } }),
      prisma.rFQ.count({
        where: {
          status: "NEW",
          createdAt: { lt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.certification.count({
        where: { isActive: true, validUntil: { not: null, lte: ninetyDays } },
      }),
      prisma.certification.count({ where: { isActive: true, validUntil: null } }),
      countDefaultContentBlocks(),
    ]);

  const items: ActionItem[] = [];

  if (staleRfqs > 0) {
    items.push({
      id: "rfq-stale",
      tone: "critical",
      label: `${staleRfqs} RFQ belum direspons lebih dari 3 hari`,
      detail: "Calon pembeli masih menunggu jawaban.",
      href: `/${adminSlug}/rfq`,
      count: staleRfqs,
    });
  }

  const freshRfqs = newRfqs - staleRfqs;
  if (freshRfqs > 0) {
    items.push({
      id: "rfq-new",
      tone: "serious",
      label: `${freshRfqs} RFQ baru menunggu respons`,
      detail: "Masuk dalam 3 hari terakhir.",
      href: `/${adminSlug}/rfq`,
      count: freshRfqs,
    });
  }

  if (unreadMessages > 0) {
    items.push({
      id: "messages-unread",
      tone: "serious",
      label: `${unreadMessages} pesan kontak belum dibaca`,
      detail: "Dikirim melalui formulir halaman Kontak.",
      href: `/${adminSlug}/messages`,
      count: unreadMessages,
    });
  }

  if (expiringCerts > 0) {
    items.push({
      id: "cert-expiring",
      tone: "critical",
      label: `${expiringCerts} sertifikasi kedaluwarsa dalam 90 hari`,
      detail: "Perbarui sebelum masa berlaku habis.",
      href: "/sertifikasi",
      count: expiringCerts,
    });
  }

  if (undatedCerts > 0) {
    items.push({
      id: "cert-undated",
      tone: "warning",
      label: `${undatedCerts} sertifikasi tanpa masa berlaku`,
      detail: "Tanggal kedaluwarsa belum diisi, jadi tidak bisa diingatkan.",
      href: "/sertifikasi",
      count: undatedCerts,
    });
  }

  if (contentGaps > 0) {
    items.push({
      id: "content-default",
      tone: "warning",
      label: `${contentGaps} bagian konten masih memakai teks bawaan`,
      detail: "Pengunjung melihat teks contoh, bukan profil perusahaan Anda.",
      href: "/",
      count: contentGaps,
    });
  }

  return items;
}

// --- content completeness ---------------------------------------------------

export type ContentBlockState = {
  key: BlockKey;
  title: string;
  customised: boolean;
};

/**
 * Compare every registered content block against its shipped default. A block
 * that is absent from the table, or stored with values deep-equal to the
 * defaults, still shows placeholder copy to the public.
 */
export async function getContentCompleteness(): Promise<ContentBlockState[]> {
  const rows = await prisma.contentBlock.findMany();
  const stored = new Map(rows.map((row) => [row.key, row.data]));

  return (Object.keys(BLOCKS) as BlockKey[]).map((key) => {
    const value = stored.get(key);
    return {
      key,
      title: BLOCKS[key].title.replace(/^Edit\s+/, ""),
      customised: value !== undefined && !deepEqual(value, BLOCKS[key].defaults),
    };
  });
}

async function countDefaultContentBlocks(): Promise<number> {
  const blocks = await getContentCompleteness();
  return blocks.filter((block) => !block.customised).length;
}

// --- KPIs -------------------------------------------------------------------

export type Kpis = {
  rfqThisMonth: number;
  rfqLastMonth: number;
  /** Median hours from RFQ arrival to leaving NEW; null when nothing has moved yet. */
  medianResponseHours: number | null;
  activeProducts: number;
  totalProducts: number;
  countriesReached: number;
  /** Daily RFQ counts for the last 30 days, oldest first — feeds the sparkline. */
  sparkline: number[];
};

export async function getKpis(): Promise<Kpis> {
  const now = new Date();
  const thisMonthStart = startOfMonthUTC(now);
  const lastMonthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)
  );
  const thirtyDaysAgo = startOfDayUTC(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));

  const [rfqThisMonth, rfqLastMonth, activeProducts, totalProducts, countries, recent, moved] =
    await Promise.all([
      prisma.rFQ.count({ where: { createdAt: { gte: thisMonthStart } } }),
      prisma.rFQ.count({
        where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count(),
      prisma.rFQ.findMany({ select: { country: true }, distinct: ["country"] }),
      prisma.rFQ.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.rFQ.findMany({
        where: { status: { not: "NEW" } },
        select: { createdAt: true, updatedAt: true },
      }),
    ]);

  // Bucket the last 30 days into one column per day.
  const sparkline = new Array(30).fill(0) as number[];
  for (const { createdAt } of recent) {
    const dayIndex = Math.floor(
      (startOfDayUTC(createdAt).getTime() - thirtyDaysAgo.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (dayIndex >= 0 && dayIndex < 30) sparkline[dayIndex] += 1;
  }

  // `updatedAt` is the best available proxy for "when it stopped being NEW".
  const responseHours = moved
    .map((rfq) => (rfq.updatedAt.getTime() - rfq.createdAt.getTime()) / (60 * 60 * 1000))
    .filter((hours) => hours >= 0)
    .sort((a, b) => a - b);

  const medianResponseHours =
    responseHours.length === 0
      ? null
      : responseHours.length % 2 === 1
        ? responseHours[(responseHours.length - 1) / 2]
        : (responseHours[responseHours.length / 2 - 1] +
            responseHours[responseHours.length / 2]) /
          2;

  return {
    rfqThisMonth,
    rfqLastMonth,
    medianResponseHours,
    activeProducts,
    totalProducts,
    countriesReached: countries.length,
    sparkline,
  };
}

// --- RFQ analytics ----------------------------------------------------------

export type TrendPoint = { label: string; weekStart: Date; count: number };

/** Weekly RFQ volume, oldest first. Empty weeks are present as zeroes. */
export async function getRfqTrend(weeks = 12): Promise<TrendPoint[]> {
  const now = new Date();
  const today = startOfDayUTC(now);
  // Anchor buckets to the Monday of the current week.
  const dayOfWeek = (today.getUTCDay() + 6) % 7;
  const currentWeekStart = new Date(today.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
  const firstWeekStart = new Date(
    currentWeekStart.getTime() - (weeks - 1) * 7 * 24 * 60 * 60 * 1000
  );

  const rfqs = await prisma.rFQ.findMany({
    where: { createdAt: { gte: firstWeekStart } },
    select: { createdAt: true },
  });

  const buckets: TrendPoint[] = Array.from({ length: weeks }, (_, index) => {
    const weekStart = new Date(firstWeekStart.getTime() + index * 7 * 24 * 60 * 60 * 1000);
    return {
      weekStart,
      label: `${weekStart.getUTCDate()}/${weekStart.getUTCMonth() + 1}`,
      count: 0,
    };
  });

  for (const { createdAt } of rfqs) {
    const index = Math.floor(
      (createdAt.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    if (index >= 0 && index < weeks) buckets[index].count += 1;
  }

  return buckets;
}

export type PipelineStage = { status: RfqStatus; label: string; count: number };

/** Pipeline stages in workflow order — the order is meaningful, so it is fixed. */
export async function getRfqPipeline(): Promise<PipelineStage[]> {
  const grouped = await prisma.rFQ.groupBy({ by: ["status"], _count: true });
  const counts = new Map(grouped.map((row) => [row.status, row._count]));

  const ORDER: { status: RfqStatus; label: string }[] = [
    { status: "NEW", label: "Baru" },
    { status: "IN_PROGRESS", label: "Diproses" },
    { status: "CLOSED", label: "Selesai" },
  ];

  return ORDER.map(({ status, label }) => ({
    status,
    label,
    count: counts.get(status) ?? 0,
  }));
}

export type RankedItem = { label: string; count: number };

export async function getTopProducts(limit = 5): Promise<RankedItem[]> {
  const products = await prisma.product.findMany({
    select: { name: true, _count: { select: { rfqs: true } } },
  });

  return products
    .map((product) => ({ label: product.name, count: product._count.rfqs }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export async function getTopCountries(limit = 5): Promise<RankedItem[]> {
  const grouped = await prisma.rFQ.groupBy({
    by: ["country"],
    _count: true,
    orderBy: { _count: { country: "desc" } },
    take: limit,
  });

  return grouped.map((row) => ({ label: row.country, count: row._count }));
}

// --- health -----------------------------------------------------------------

export type HealthIssue = { label: string; count: number; ok: boolean };

export async function getCatalogHealth(): Promise<HealthIssue[]> {
  const [noImages, noSpecs, inactive, emptyCategories, undatedCerts] = await Promise.all([
    prisma.product.count({ where: { images: { none: {} } } }),
    prisma.product.count({ where: { specifications: { none: {} } } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.category.count({ where: { products: { none: {} } } }),
    prisma.certification.count({ where: { isActive: true, validUntil: null } }),
  ]);

  return [
    { label: "Produk tanpa gambar", count: noImages, ok: noImages === 0 },
    { label: "Produk tanpa spesifikasi", count: noSpecs, ok: noSpecs === 0 },
    { label: "Produk nonaktif", count: inactive, ok: true },
    { label: "Kategori tanpa produk", count: emptyCategories, ok: emptyCategories === 0 },
    { label: "Sertifikasi tanpa masa berlaku", count: undatedCerts, ok: undatedCerts === 0 },
  ];
}

// --- activity feed ----------------------------------------------------------

export type ActivityEntry = {
  id: string;
  kind: "rfq" | "message";
  title: string;
  subtitle: string;
  at: Date;
  href: string;
};

export async function getRecentActivity(
  adminSlug: string,
  limit = 8
): Promise<ActivityEntry[]> {
  const [rfqs, messages] = await Promise.all([
    prisma.rFQ.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, name: true, company: true, country: true, createdAt: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, name: true, subject: true, createdAt: true },
    }),
  ]);

  const entries: ActivityEntry[] = [
    ...rfqs.map((rfq) => ({
      id: `rfq-${rfq.id}`,
      kind: "rfq" as const,
      title: `RFQ dari ${rfq.company}`,
      subtitle: `${rfq.name} · ${rfq.country}`,
      at: rfq.createdAt,
      href: `/${adminSlug}/rfq`,
    })),
    ...messages.map((message) => ({
      id: `msg-${message.id}`,
      kind: "message" as const,
      title: `Pesan dari ${message.name}`,
      subtitle: message.subject || "Tanpa subjek",
      at: message.createdAt,
      href: `/${adminSlug}/messages`,
    })),
  ];

  return entries.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, limit);
}
