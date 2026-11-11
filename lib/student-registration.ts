export const CLASS_STANDARDS = [6, 7, 8, 9, 10, 11, 12] as const;

export function gradeBandForStandard(value: unknown) {
  const standard = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(standard) || !CLASS_STANDARDS.includes(standard as typeof CLASS_STANDARDS[number])) return null;
  if (standard <= 8) return "6-8";
  if (standard <= 10) return "9-10";
  return "11-12";
}

export function standardsForGradeBand(gradeBand: string) {
  return CLASS_STANDARDS.filter((standard) => gradeBandForStandard(standard) === gradeBand);
}

export function normalizeSection(value: unknown) {
  if (typeof value !== "string") return null;
  const section = value.trim().replace(/\s+/g, " ");
  return section.length >= 1 && section.length <= 30 && /^[\p{L}\p{N}][\p{L}\p{N} -]*$/u.test(section) ? section : null;
}
