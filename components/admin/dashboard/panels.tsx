import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleAlert,
  FileText,
  Inbox,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { STATUS, type StatusTone } from "@/lib/admin/chart-tokens";
import type {
  ActionItem,
  ActivityEntry,
  ContentBlockState,
  HealthIssue,
} from "@/lib/admin/dashboard-data";
import { Sparkline } from "./charts";

/** Card shell shared by every dashboard panel. */
export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white rounded-radius-md shadow-card border border-border-hairline p-space-4 md:p-space-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-space-3 mb-space-4">
        <div className="min-w-0">
          <h2 className="font-display font-medium text-display-md text-navy-deep leading-tight">
            {title}
          </h2>
          {description && (
            <p className="font-body text-body-sm text-slate mt-1">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

// --- Action queue -----------------------------------------------------------

const TONE_ICON: Record<StatusTone, typeof AlertTriangle> = {
  critical: CircleAlert,
  serious: AlertTriangle,
  warning: Info,
  good: Check,
};

/**
 * The prioritised action list the dashboard leads with.
 *
 * Every row pairs its status color with an icon and a text label — `warning` and
 * `serious` sit below 3:1 on white, so color alone must never carry the meaning.
 */
export function ActionQueue({ items }: { items: ActionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex items-start gap-space-3 rounded-radius-sm bg-ivory/60 p-space-4">
        <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: STATUS.good }} aria-hidden="true" />
        <div>
          <p className="font-body font-medium text-body-md text-navy-deep">
            Tidak ada yang perlu ditindaklanjuti
          </p>
          <p className="font-body text-body-sm text-slate mt-1">
            Semua RFQ sudah direspons, pesan sudah dibaca, dan konten situs sudah dilengkapi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border-hairline -my-space-2">
      {items.map((item) => {
        const Icon = TONE_ICON[item.tone];
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group flex items-center gap-space-3 py-space-3 -mx-space-2 px-space-2 rounded-radius-sm hover:bg-ivory/70 transition-colors"
            >
              <Icon
                className="w-5 h-5 shrink-0"
                style={{ color: STATUS[item.tone] }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-body font-medium text-body-md text-navy-deep">
                  {item.label}
                </span>
                <span className="block font-body text-body-sm text-slate mt-0.5">
                  {item.detail}
                </span>
              </span>
              <ArrowRight
                className="w-4 h-4 shrink-0 text-slate group-hover:text-red-signal transition-colors"
                aria-hidden="true"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// --- Stat tile --------------------------------------------------------------

/**
 * Stat tile: label · value · optional delta · optional 30-day sparkline.
 * The value uses proportional figures — `tabular-nums` reads loose at this size
 * and is reserved for columns of numbers that must align.
 */
export function StatTile({
  label,
  value,
  hint,
  delta,
  deltaLabel,
  sparkline,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: number | null;
  deltaLabel?: string;
  sparkline?: number[];
}) {
  const hasDelta = typeof delta === "number" && Number.isFinite(delta) && delta !== 0;
  const isUp = (delta ?? 0) > 0;

  return (
    <div className="bg-white rounded-radius-md shadow-card border border-border-hairline p-space-4 flex flex-col gap-space-2">
      <span className="font-body text-body-sm text-slate">{label}</span>

      <div className="flex items-baseline gap-space-2 flex-wrap">
        <span className="font-display font-medium text-display-lg text-navy-deep leading-none">
          {value}
        </span>
        {hasDelta && (
          <span
            className="inline-flex items-center gap-1 text-body-sm font-medium"
            style={{ color: isUp ? STATUS.good : STATUS.critical }}
          >
            {isUp ? (
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-4 h-4" aria-hidden="true" />
            )}
            {isUp ? "+" : ""}
            {delta}
            {deltaLabel && <span className="sr-only"> {deltaLabel}</span>}
          </span>
        )}
      </div>

      {hint && <span className="font-body text-caption text-slate">{hint}</span>}

      {sparkline && sparkline.length > 0 && (
        <div className="mt-auto pt-space-2">
          <Sparkline values={sparkline} label={`Tren 30 hari untuk ${label}`} />
        </div>
      )}
    </div>
  );
}

// --- Health -----------------------------------------------------------------

export function HealthList({ issues }: { issues: HealthIssue[] }) {
  return (
    <ul className="space-y-space-2">
      {issues.map((issue) => {
        const clean = issue.count === 0;
        return (
          <li key={issue.label} className="flex items-center gap-space-2">
            {clean ? (
              <Check className="w-4 h-4 shrink-0" style={{ color: STATUS.good }} aria-hidden="true" />
            ) : (
              <AlertTriangle
                className="w-4 h-4 shrink-0"
                style={{ color: issue.ok ? STATUS.good : STATUS.warning }}
                aria-hidden="true"
              />
            )}
            <span className="font-body text-body-sm text-navy-deep flex-1">{issue.label}</span>
            <span
              className="font-body text-body-sm font-medium text-navy-deep"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {issue.count}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// --- Content completeness ---------------------------------------------------

export function ContentCompleteness({ blocks }: { blocks: ContentBlockState[] }) {
  const done = blocks.filter((block) => block.customised).length;
  const pending = blocks.filter((block) => !block.customised);
  const pct = blocks.length === 0 ? 0 : Math.round((done / blocks.length) * 100);

  return (
    <div className="space-y-space-4">
      <div>
        <div className="flex items-baseline justify-between mb-space-2">
          <span className="font-body text-body-sm text-slate">
            {done} dari {blocks.length} bagian sudah disesuaikan
          </span>
          <span
            className="font-display font-medium text-display-md text-navy-deep leading-none"
            aria-hidden="true"
          >
            {pct}%
          </span>
        </div>
        {/* Meter: filled portion and track are steps of the same ramp. */}
        <div
          className="h-2 rounded-full bg-border-hairline overflow-hidden"
          role="meter"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Kelengkapan konten situs"
        >
          <div className="h-full rounded-full bg-navy-base" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {pending.length > 0 ? (
        <div>
          <p className="font-body text-body-sm text-slate mb-space-2">
            Masih memakai teks bawaan:
          </p>
          <ul className="flex flex-wrap gap-space-1">
            {pending.slice(0, 10).map((block) => (
              <li
                key={block.key}
                className="font-mono text-caption text-slate border border-border-hairline rounded-radius-sm px-space-2 py-1"
              >
                {block.title}
              </li>
            ))}
            {pending.length > 10 && (
              <li className="font-mono text-caption text-slate px-space-2 py-1">
                +{pending.length - 10} lainnya
              </li>
            )}
          </ul>
        </div>
      ) : (
        <p className="font-body text-body-sm text-slate">
          Semua bagian konten sudah disesuaikan.
        </p>
      )}
    </div>
  );
}

// --- Activity feed ----------------------------------------------------------

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  const months = Math.round(days / 30);
  return `${months} bulan lalu`;
}

export function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="font-body text-body-sm text-slate">
        Belum ada aktivitas. RFQ dan pesan kontak yang masuk akan muncul di sini.
      </p>
    );
  }

  return (
    <ul className="space-y-space-1">
      {entries.map((entry) => {
        const Icon = entry.kind === "rfq" ? FileText : Inbox;
        return (
          <li key={entry.id}>
            <Link
              href={entry.href}
              className="flex items-center gap-space-3 py-space-2 px-space-2 -mx-space-2 rounded-radius-sm hover:bg-ivory/70 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-slate" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-body text-body-sm font-medium text-navy-deep truncate">
                  {entry.title}
                </span>
                <span className="block font-body text-caption text-slate truncate">
                  {entry.subtitle}
                </span>
              </span>
              <time
                dateTime={entry.at.toISOString()}
                className="font-body text-caption text-slate shrink-0"
              >
                {relativeTime(entry.at)}
              </time>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// --- Loading skeleton -------------------------------------------------------

export function PanelSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-space-2 animate-pulse" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 rounded-radius-sm bg-border-hairline"
          style={{ width: `${100 - index * 8}%` }}
        />
      ))}
    </div>
  );
}
