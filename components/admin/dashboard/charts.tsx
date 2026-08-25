"use client";

import { useId, useState } from "react";
import { ACCENT, DE_EMPHASIS, FUNNEL_RAMP, GRID } from "@/lib/admin/chart-tokens";

/**
 * Hand-built SVG chart primitives for the admin dashboard.
 *
 * Shared conventions, applied to every mark here:
 * - bars/columns cap at 24px and carry a 4px rounded data-end, square at the baseline
 * - touching marks are separated by a 2px gap in the surface color, never a stroke
 * - gridlines are 1px solid and recessive; they are not data
 * - labels wear text tokens, never the mark color
 * - every chart exposes role="img" + an aria-label describing what it plots
 */

// --- Sparkline --------------------------------------------------------------

/**
 * 30-day context trace for a stat tile. History is de-emphasised and only the
 * final point takes the accent, so the eye lands on "now" rather than on the
 * whole series.
 */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const gradientId = useId();
  if (values.length === 0) return null;

  const width = 120;
  const height = 32;
  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((value, index) => ({
    x: index * step,
    // Leave 3px of headroom so the end-dot is never clipped by the viewBox.
    y: height - 3 - (value / max) * (height - 6),
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-8 overflow-visible"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.14" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={DE_EMPHASIS}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Surface ring keeps the end-dot legible where it sits on the trace. */}
      <circle cx={last.x} cy={last.y} r="4" fill={ACCENT} stroke="#ffffff" strokeWidth="2" />
    </svg>
  );
}

// --- Column trend -----------------------------------------------------------

export type Column = { label: string; count: number };

/**
 * Weekly volume as columns. Columns (not a line) because the weeks are discrete
 * counted buckets and several of them are legitimately zero — a line would
 * imply a continuous quantity between them.
 */
export function ColumnChart({
  data,
  ariaLabel,
  valueSuffix = "",
}: {
  data: Column[];
  ariaLabel: string;
  valueSuffix?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(...data.map((d) => d.count), 1);
  // Round the axis top to a clean number so ticks read 0 / 2 / 4 rather than 0 / 1.5 / 3.
  const axisTop = max <= 4 ? Math.max(max, 2) : Math.ceil(max / 4) * 4;
  const ticks = [0, axisTop / 2, axisTop];

  return (
    <div className="relative">
      <div className="flex">
        {/* Y axis ticks — tabular figures so the column of numbers aligns. */}
        <div
          className="flex flex-col justify-between pr-space-2 text-caption text-slate/70 h-40 shrink-0"
          style={{ fontVariantNumeric: "tabular-nums" }}
          aria-hidden="true"
        >
          {[...ticks].reverse().map((tick) => (
            <span key={tick} className="leading-none">
              {tick}
            </span>
          ))}
        </div>

        <div className="relative flex-1 h-40" role="img" aria-label={ariaLabel}>
          {/* Recessive gridlines, drawn behind the data. */}
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute left-0 right-0 border-t"
              style={{ borderColor: GRID, bottom: `${(tick / axisTop) * 100}%` }}
              aria-hidden="true"
            />
          ))}

          <div className="absolute inset-0 flex items-end gap-[2px]">
            {data.map((column, index) => {
              const heightPct = (column.count / axisTop) * 100;
              const isHovered = hover === index;
              return (
                <div
                  key={`${column.label}-${index}`}
                  className="flex-1 h-full flex items-end justify-center relative"
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(null)}
                >
                  {/* Full-height hit target: the bar itself is often too short to hover. */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  <div
                    className="w-full max-w-[24px] transition-opacity"
                    style={{
                      height: column.count === 0 ? "2px" : `${Math.max(heightPct, 2)}%`,
                      background: column.count === 0 ? GRID : ACCENT,
                      borderRadius: "4px 4px 0 0",
                      opacity: hover === null || isHovered ? 1 : 0.45,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Label only the first and last bucket — a label per column is unreadable. */}
      <div className="flex pl-space-4 mt-space-1 text-caption text-slate/70">
        <span>{data[0]?.label}</span>
        <span className="ml-auto">{data[data.length - 1]?.label}</span>
      </div>

      {hover !== null && (
        <div className="absolute top-0 right-0 bg-navy-deep text-ivory text-caption px-space-2 py-1 rounded-radius-sm shadow-card pointer-events-none">
          <span className="font-medium">{data[hover].count}</span>
          {valueSuffix && <span className="text-ivory/70"> {valueSuffix}</span>}
          <span className="text-ivory/70"> · {data[hover].label}</span>
        </div>
      )}
    </div>
  );
}

// --- Pipeline (ordinal) -----------------------------------------------------

export type Stage = { label: string; count: number };

/**
 * The RFQ pipeline as one part-to-whole bar.
 *
 * Stages take an ordinal ramp rather than categorical hues: NEW → IN_PROGRESS →
 * CLOSED is a sequence, so lightness carries the progression and the reader sees
 * the order in the color. Segments are separated by a 2px surface gap.
 */
export function PipelineBar({ stages }: { stages: Stage[] }) {
  const total = stages.reduce((sum, stage) => sum + stage.count, 0);

  if (total === 0) {
    return (
      <p className="text-body-sm text-slate">
        Belum ada RFQ yang masuk, jadi belum ada alur untuk ditampilkan.
      </p>
    );
  }

  return (
    <div className="space-y-space-3">
      <div
        className="flex gap-[2px] h-6 rounded-radius-sm overflow-hidden"
        role="img"
        aria-label={`Alur RFQ: ${stages.map((s) => `${s.label} ${s.count}`).join(", ")}`}
      >
        {stages.map((stage, index) => (
          <div
            key={stage.label}
            style={{
              // Give an empty stage no width, but keep a floor so small ones stay visible.
              flexGrow: stage.count === 0 ? 0 : Math.max(stage.count / total, 0.04),
              background: FUNNEL_RAMP[index] ?? FUNNEL_RAMP[FUNNEL_RAMP.length - 1],
            }}
          />
        ))}
      </div>

      {/* Legend doubles as the value readout, so identity never rests on color. */}
      <ul className="grid grid-cols-3 gap-space-2">
        {stages.map((stage, index) => (
          <li key={stage.label} className="flex items-start gap-space-2">
            <span
              className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
              style={{ background: FUNNEL_RAMP[index] ?? ACCENT }}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block font-display font-medium text-body-lg text-navy-deep leading-none">
                {stage.count}
              </span>
              <span className="block text-caption text-slate mt-1">{stage.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Ranked horizontal bars -------------------------------------------------

/**
 * Ranked magnitude comparison. Every bar takes the same accent hue: these
 * categories are nominal, so coloring them individually would spend the identity
 * channel re-encoding what the bar length already shows.
 */
export function RankedBars({
  items,
  ariaLabel,
  emptyMessage,
}: {
  items: { label: string; count: number }[];
  ariaLabel: string;
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <p className="text-body-sm text-slate">{emptyMessage}</p>;
  }

  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <ul className="space-y-space-3" role="img" aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-space-2 mb-1">
            <span className="text-body-sm text-navy-deep truncate">{item.label}</span>
            <span
              className="text-body-sm font-medium text-navy-deep shrink-0"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {item.count}
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ background: GRID }}>
            <div
              className="h-2 rounded-full"
              style={{ width: `${(item.count / max) * 100}%`, background: ACCENT }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
