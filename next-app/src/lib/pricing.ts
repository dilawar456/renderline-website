import defaults from "./pricing-defaults.json" with { type: "json" };
export type Pricing = typeof defaults;
export const DEFAULT_PRICING: Pricing = defaults;
export const money = (value: number) =>
  "PKR " + new Intl.NumberFormat("en-PK").format(value);
export function residentialBookletPrice(
  p: Pricing,
  marla: number,
): number | null {
  if (!Number.isFinite(marla) || marla < 3) return null;
  if (marla > 20)
    return (
      p.residentialBooklet.upTo20 +
      (marla - 20) * p.residentialBooklet.extraMarla
    );
  if (marla > 10) return p.residentialBooklet.upTo20;
  return p.residentialBooklet[String(Math.ceil(marla)) as "3"];
}
export function commercialRate(
  table: Record<string, number>,
  marla: number,
): number | null {
  if (!Number.isFinite(marla) || marla <= 0 || marla > 10) return null;
  return table[String(Math.max(2, Math.ceil(marla)))] ?? null;
}
export function interiorPrice(
  p: Pricing,
  squareFeet: number,
  spaces: number,
): number | null {
  if (
    !Number.isFinite(squareFeet) ||
    squareFeet <= 0 ||
    !Number.isInteger(spaces) ||
    spaces < 1
  )
    return null;
  // Each space has its own minimum; use individual space areas for an exact total.
  return (
    Math.max(p.interior.minimumPerSpace, squareFeet * p.interior.perSqFt) *
    spaces
  );
}
export function validatePricing(input: unknown): input is Pricing {
  const visit = (value: unknown, shape: unknown): boolean => {
    if (typeof shape === "number")
      return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value > 0 &&
        value <= 10000000
      );
    if (!value || typeof value !== "object" || Array.isArray(value))
      return false;
    const a = value as Record<string, unknown>,
      b = shape as Record<string, unknown>;
    return (
      Object.keys(a).length === Object.keys(b).length &&
      Object.keys(b).every(
        (key) => Object.hasOwn(a, key) && visit(a[key], b[key]),
      )
    );
  };
  return visit(input, defaults);
}
