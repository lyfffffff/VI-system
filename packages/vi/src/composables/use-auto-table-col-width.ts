// 表格自动列宽 composable：基于表头与行数据文本宽度计算 min-width。
import { computed, unref } from "vue";
import type { ComputedRef, MaybeRef } from "vue";

const DEFAULT_BODY_FONT =
  '14px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif';
const DEFAULT_HEADER_FONT =
  '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif';

let measureCanvas: HTMLCanvasElement | null = null;

function parseFontSize(font: string): number {
  const match = /(\d+(?:\.\d+)?)px/.exec(font);
  if (!match) return 14;
  return Number(match[1]);
}

function estimateTextWidth(text: string, font: string): number {
  return text.length * parseFontSize(font) * 0.6;
}

function getTextWidth(text: string, font: string): number {
  if (typeof document === "undefined") {
    return estimateTextWidth(text, font);
  }

  if (!measureCanvas) {
    measureCanvas = document.createElement("canvas");
  }

  const ctx = measureCanvas.getContext("2d");
  if (!ctx) {
    return estimateTextWidth(text, font);
  }

  ctx.font = font;
  return ctx.measureText(text).width;
}

function normalizeCellText(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  return String(value);
}

function flattenRows<TRow extends Record<string, unknown>>(
  rows: TRow[],
  childrenKey: string,
): TRow[] {
  const result: TRow[] = [];
  for (const row of rows) {
    result.push(row);
    const children = row[childrenKey];
    if (Array.isArray(children) && children.length > 0) {
      result.push(
        ...flattenRows(children as TRow[], childrenKey),
      );
    }
  }
  return result;
}

export interface IAutoTableColWidthColumn<TRow> {
  key: string;
  headerText: string;
  valueGetter: (row: TRow) => unknown;
  formatter?: (value: unknown, row: TRow) => string;
  padding?: number;
  sortPadding?: number;
  minWidth?: number;
  bodyFont?: string;
  headerFont?: string;
}

export interface IAutoTableColWidthOptions {
  padding?: number;
  sortPadding?: number;
  minWidth?: number;
  bodyFont?: string;
  headerFont?: string;
  childrenKey?: string;
}

/**
 * 自动计算表格每列 min-width（像素）。
 */
export function useAutoTableColWidth<TRow extends Record<string, unknown>>(
  rows: MaybeRef<TRow[]>,
  columns: MaybeRef<IAutoTableColWidthColumn<TRow>[]>,
  options?: MaybeRef<IAutoTableColWidthOptions>,
): ComputedRef<Record<string, number>> {
  return computed(() => {
    const resolvedOptions = unref(options) ?? {};
    const resolvedColumns = unref(columns) ?? [];
    const sourceRows = unref(rows) ?? [];
    const childrenKey = resolvedOptions.childrenKey ?? "children";
    const flatRows = flattenRows(sourceRows, childrenKey);

    const widthMap: Record<string, number> = {};

    for (const column of resolvedColumns) {
      const padding = column.padding ?? resolvedOptions.padding ?? 40;
      const sortPadding = column.sortPadding ?? resolvedOptions.sortPadding ?? 0;
      const minWidth = column.minWidth ?? resolvedOptions.minWidth ?? 50;
      const bodyFont = column.bodyFont ?? resolvedOptions.bodyFont ?? DEFAULT_BODY_FONT;
      const headerFont = column.headerFont ?? resolvedOptions.headerFont ?? DEFAULT_HEADER_FONT;

      let maxWidth = getTextWidth(column.headerText, headerFont) + sortPadding;
      for (const row of flatRows) {
        const rawValue = column.valueGetter(row);
        const cellText = column.formatter
          ? column.formatter(rawValue, row)
          : normalizeCellText(rawValue);
        const textWidth = getTextWidth(cellText, bodyFont);
        if (textWidth > maxWidth) {
          maxWidth = textWidth;
        }
      }

      widthMap[column.key] = Math.max(Math.ceil(maxWidth + padding), minWidth);
    }

    return widthMap;
  });
}
