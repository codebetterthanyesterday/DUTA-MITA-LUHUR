/**
 * Chart color tokens for the admin dashboard.
 *
 * These are measured, not eyeballed. Every value below was validated against the
 * white card surface (#FFFFFF) that the dashboard panels sit on:
 *
 *   ACCENT          #16294d  14.40:1  (brand navy-base)
 *   FUNNEL ramp     #acb2bc → #6d7889 → #16294d
 *                   ordinal check: monotone L, all adjacent ΔL ≥ 0.06,
 *                   light end 2.13:1 (≥ 2.0 required), hue spread 3° — ALL PASS
 *   DE_EMPHASIS     #acb2bc   2.13:1  mark-only, never text
 *   GRID            #e6e8ec   1.23:1  recessive hairline, not data
 *
 * Rules this file encodes, so they survive future edits:
 *
 * - Single-series bars (top products, top countries) all take ACCENT. Bars are
 *   nominal — coloring them by their own value would re-encode what bar length
 *   already shows and waste the identity channel.
 * - The RFQ pipeline is ORDINAL, not categorical: NEW → IN_PROGRESS → CLOSED is
 *   a sequence, so it takes one hue in monotone lightness steps and the reader
 *   sees the order in the color itself.
 * - STATUS is a fixed, reserved scale. `warning` (1.83:1) and `serious` (2.64:1)
 *   sit below 3:1 on a light surface by design, so anything wearing them MUST
 *   also carry an icon and a text label — status never means anything by color
 *   alone.
 * - Brand gold #C9A15A measures 2.41:1 and is therefore barred from text here.
 */

/** Accent for every single-series mark: bars, area fills, sparkline current period. */
export const ACCENT = "#16294d";

/** De-emphasised mark color — context marks, sparkline history. Never used as text. */
export const DE_EMPHASIS = "#acb2bc";

/** Hairline gridlines and axis rules. Recessive; carries no data. */
export const GRID = "#e6e8ec";

/** Chart surface — the white card the panels are drawn on. */
export const SURFACE = "#ffffff";

/**
 * Ordinal ramp for the RFQ pipeline, light → dark in the order the stages occur.
 * Index matches pipeline order, so a stage's position is legible from its shade.
 */
export const FUNNEL_RAMP = ["#acb2bc", "#6d7889", "#16294d"] as const;

/**
 * Reserved status scale. Always render alongside an icon and a text label —
 * `warning` and `serious` do not clear 3:1 on white on their own.
 */
export const STATUS = {
  good: "#0ca30c",
  warning: "#fab219",
  serious: "#ec835a",
  critical: "#d03b3b",
} as const;

export type StatusTone = keyof typeof STATUS;
